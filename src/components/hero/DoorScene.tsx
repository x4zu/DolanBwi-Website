"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Geometry derived from the user's door asset (see scripts/process-door-assets.mjs)
 * Source crop 960x1160 px; leaf x 240..720, arch apex y 150, bottom y 1088.            */
const SRC_W = 960;
const SRC_H = 1160;
export const FRAME_H = 6.2;
export const FRAME_W = (FRAME_H * SRC_W) / SRC_H;
const S = FRAME_H / SRC_H;
const LEAF_X0 = (240 - SRC_W / 2) * S;
const LEAF_X1 = (720 - SRC_W / 2) * S;
const LEAF_TOP = (SRC_H / 2 - 150) * S;
const LEAF_BOTTOM = (SRC_H / 2 - 1088) * S;
const LEAF_R = (LEAF_X1 - LEAF_X0) / 2;
const ARCH_CY = LEAF_TOP - LEAF_R;
const DOOR_CENTER_Y = (LEAF_TOP + LEAF_BOTTOM) / 2;
const LANTERN_L = new THREE.Vector2((175 - SRC_W / 2) * S, (SRC_H / 2 - 525) * S);
const LANTERN_R = new THREE.Vector2((785 - SRC_W / 2) * S, (SRC_H / 2 - 525) * S);
const LEAF_DEPTH = 0.11;
const MAX_ANGLE = 1.92; // ~110deg

export interface HeroProgress {
  value: number;
}
export interface PointerState {
  x: number;
  y: number;
}

const smooth = (a: number, b: number, x: number) => {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ------------------------------------------------------------------ */
const NOISE_GLSL = /* glsl */ `
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p){ float v = 0.0; float a = 0.5; for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.02; a *= 0.5; } return v; }
`;

const PASS_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vP;
  void main(){
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vP = wp.xy;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

/** Night forest backdrop around the door (real De Djawatan photo, moon-graded) with a doorway-shaped hole. */
const BACKDROP_FRAG = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uTime;
  uniform float uOpen;
  uniform vec2 uL1;
  uniform vec2 uL2;
  varying vec2 vP;
  ${NOISE_GLSL}
  void main(){
    vec2 p = vP;
    float m = 0.06;
    bool inRect = p.x > ${LEAF_X0.toFixed(4)} - m && p.x < ${LEAF_X1.toFixed(4)} + m && p.y < ${ARCH_CY.toFixed(4)} && p.y > ${LEAF_BOTTOM.toFixed(4)} - m;
    bool inArc = p.y >= ${ARCH_CY.toFixed(4)} && length(p - vec2(0.0, ${ARCH_CY.toFixed(4)})) < ${LEAF_R.toFixed(4)} + m;
    if (inRect || inArc) discard;

    vec2 uv = p / vec2(30.0, 20.0) + vec2(0.5, 0.42);
    vec3 photo = texture2D(uTex, clamp(uv, 0.0, 1.0)).rgb;
    float l = dot(photo, vec3(0.299, 0.587, 0.114));
    vec3 night = vec3(0.012, 0.018, 0.06);
    vec3 col = mix(night, vec3(0.09, 0.15, 0.32), pow(l, 1.5));
    col = mix(col, photo * vec3(0.14, 0.22, 0.4), 0.35);
    float edge = smoothstep(0.0, 0.14, uv.x) * smoothstep(1.0, 0.86, uv.x) * smoothstep(0.0, 0.1, uv.y) * smoothstep(1.0, 0.9, uv.y);
    col = mix(night, col, edge);

    vec2 sg = floor(p * 7.0);
    float star = step(0.987, hash(sg)) * (0.5 + 0.5 * sin(uTime * 2.0 + hash(sg + 3.0) * 40.0));
    col += vec3(0.8, 0.85, 1.0) * star * smoothstep(0.45, 0.8, l) * smoothstep(0.5, 3.0, p.y) * 0.7;

    float f = fbm(p * 0.32 + vec2(uTime * 0.025, uTime * 0.008));
    float fogMask = smoothstep(1.0, -3.6, p.y);
    col = mix(col, vec3(0.13, 0.19, 0.36), fogMask * f * 0.85);
    col += vec3(0.08, 0.1, 0.2) * fbm(p * 0.15 - uTime * 0.01) * 0.6;

    vec3 warm = vec3(1.0, 0.55, 0.26);
    float fl = 0.88 + 0.12 * sin(uTime * 7.3) * sin(uTime * 3.1);
    col += warm * 0.32 * fl * (exp(-length(p - uL1) * 1.5) + exp(-length(p - uL2) * 1.5));
    col += warm * uOpen * 0.4 * exp(-length((p - vec2(0.0, -3.0)) * vec2(0.32, 1.1)));
    col += vec3(1.0, 0.7, 0.4) * uOpen * 0.08 * exp(-length(p * vec2(0.22, 0.18)));

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

/** The world beyond the door: user panorama, crossfading to a real Pulau Merah photo. */
const WORLD_FRAG = /* glsl */ `
  uniform sampler2D uPano;
  uniform sampler2D uReal;
  uniform float uMix;
  uniform float uZoom;
  uniform float uTime;
  uniform float uPlaneAspect;
  uniform float uRealAspect;
  varying vec2 vUv;
  void main(){
    vec2 uv = (vUv - 0.5) / uZoom + 0.5;
    uv.x += sin(uTime * 0.05) * 0.004;
    vec3 a = texture2D(uPano, uv).rgb;
    vec2 ruv = vec2(uv.x, (uv.y - 0.5) * (uRealAspect / uPlaneAspect) + 0.5);
    vec3 b = texture2D(uReal, clamp(ruv, 0.0, 1.0)).rgb;
    vec3 col = mix(a, b, uMix);
    float haze = smoothstep(0.9, 0.0, length((vUv - vec2(0.5, 0.45)) * vec2(1.0, 1.6)));
    col += vec3(1.0, 0.75, 0.45) * haze * 0.06;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

const GLOW_FRAG = /* glsl */ `
  uniform float uOpen;
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec2 vUv;
  void main(){
    vec2 q = vUv - 0.5;
    float g = exp(-dot(q, q) * 9.0);
    float fl = 0.92 + 0.08 * sin(uTime * 6.1) * sin(uTime * 2.3);
    gl_FragColor = vec4(uColor * g * uOpen * uStrength * fl, 1.0);
  }
`;

const RAYS_FRAG = /* glsl */ `
  uniform float uOpen;
  uniform float uTime;
  varying vec2 vUv;
  void main(){
    vec2 q = (vUv - 0.5) * vec2(16.0, 12.0);
    float ang = atan(q.y, q.x);
    float r = length(q);
    float rays = pow(0.5 + 0.5 * sin(ang * 13.0 + uTime * 0.25) * sin(ang * 5.0 - uTime * 0.17), 3.0);
    float fall = exp(-r * 0.32) * smoothstep(0.6, 2.2, r);
    vec3 col = vec3(1.0, 0.72, 0.42) * rays * fall * uOpen * 0.1;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const LEAF_VERT = /* glsl */ `
  varying vec2 vUv;
  varying float vBack;
  void main(){
    vUv = uv;
    vBack = step(normal.z, -0.5);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const LEAF_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uAngle;
  uniform float uGlow;
  varying vec2 vUv;
  varying float vBack;
  void main(){
    vec4 tex = texture2D(uMap, vUv);
    vec3 col = tex.rgb;
    float shade = mix(1.0, 0.45, clamp(uAngle / 1.9, 0.0, 1.0));
    col *= mix(shade, shade * 0.75, vBack);
    col = mix(col, vec3(dot(col, vec3(0.3, 0.59, 0.11))) * vec3(0.9, 0.75, 0.6), vBack * 0.35);
    col += vec3(1.0, 0.62, 0.32) * uGlow * smoothstep(0.7, 1.0, vUv.x) * 0.45 * (1.0 - vBack);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

const FIREFLY_VERT = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixel;
  varying float vAlpha;
  varying float vSeed;
  void main(){
    vec3 p = position;
    p.x += sin(uTime * 0.27 + aSeed * 12.0) * 0.45;
    p.y += sin(uTime * 0.36 + aSeed * 7.0) * 0.32 + cos(uTime * 0.2 + aSeed * 3.0) * 0.15;
    p.z += cos(uTime * 0.22 + aSeed * 5.0) * 0.3;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(uPixel * (14.0 + aSeed * 26.0) / max(-mv.z, 0.1), 0.0, 24.0);
    vAlpha = 0.35 + 0.65 * pow(0.5 + 0.5 * sin(uTime * (1.2 + aSeed * 2.0) + aSeed * 40.0), 2.0);
    vSeed = aSeed;
  }
`;
const FIREFLY_FRAG = /* glsl */ `
  uniform float uIntensity;
  varying float vAlpha;
  varying float vSeed;
  void main(){
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    vec3 col = mix(vec3(1.0, 0.78, 0.36), vec3(0.45, 0.95, 0.85), step(0.82, vSeed));
    gl_FragColor = vec4(col * a * vAlpha * uIntensity, 1.0);
  }
`;

/* ------------------------------------------------------------------ */
function buildLeafGeometry() {
  const w = LEAF_X1 - LEAF_X0;
  const h = LEAF_TOP - LEAF_BOTTOM;
  const shape = new THREE.Shape();
  shape.moveTo(0, LEAF_BOTTOM);
  shape.lineTo(w, LEAF_BOTTOM);
  shape.lineTo(w, ARCH_CY);
  shape.absarc(LEAF_R, ARCH_CY, LEAF_R, 0, Math.PI, false);
  shape.lineTo(0, LEAF_BOTTOM);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: LEAF_DEPTH, bevelEnabled: false, curveSegments: 48 });
  geo.translate(0, 0, -LEAF_DEPTH);
  const pos = geo.getAttribute("position");
  const uv = geo.getAttribute("uv");
  const caps = geo.groups[0];
  for (let i = caps.start; i < caps.start + caps.count; i++) {
    uv.setXY(i, pos.getX(i) / w, (pos.getY(i) - LEAF_BOTTOM) / h);
  }
  uv.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

function makeFireflies(count: number) {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 13;
    positions[i * 3 + 1] = -3.4 + Math.random() * 6.6;
    positions[i * 3 + 2] = -0.4 + Math.random() * 3.6;
    seeds[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  return geo;
}

/* ------------------------------------------------------------------ */
function Scene({ progress, pointer }: { progress: React.RefObject<HeroProgress>; pointer: React.RefObject<PointerState> }) {
  const [frameTex, leafTex, worldTex, forestTex, realTex] = useTexture([
    "/images/door/door-frame.webp",
    "/images/door/door-leaf.webp",
    "/images/door/world.jpg",
    "/images/bwi/djawatan.jpg",
    "/images/bwi/pulau-merah.jpg",
  ]);
  const gl = useThree((s) => s.gl);
  useMemo(() => {
    for (const t of [frameTex, leafTex, worldTex, forestTex, realTex]) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    }
  }, [frameTex, leafTex, worldTex, forestTex, realTex, gl]);

  const leafGeo = useMemo(() => buildLeafGeometry(), []);
  const fireflyGeo = useMemo(() => makeFireflies(150), []);

  const u = useMemo(
    () => ({
      backdrop: { uTex: { value: forestTex }, uTime: { value: 0 }, uOpen: { value: 0 }, uL1: { value: LANTERN_L }, uL2: { value: LANTERN_R } },
      world: {
        uPano: { value: worldTex },
        uReal: { value: realTex },
        uMix: { value: 0 },
        uZoom: { value: 1 },
        uTime: { value: 0 },
        uPlaneAspect: { value: 40 / 17 },
        uRealAspect: { value: 1920 / 1280 },
      },
      leaf: { uMap: { value: leafTex }, uAngle: { value: 0 }, uGlow: { value: 0 } },
      glow: { uOpen: { value: 0 }, uTime: { value: 0 }, uColor: { value: new THREE.Color(1.0, 0.68, 0.38) }, uStrength: { value: 0.5 } },
      lantern: { uOpen: { value: 1 }, uTime: { value: 0 }, uColor: { value: new THREE.Color(1.0, 0.6, 0.25) }, uStrength: { value: 0.55 } },
      rays: { uOpen: { value: 0 }, uTime: { value: 0 } },
      fireflies: { uTime: { value: 0 }, uPixel: { value: 1 }, uIntensity: { value: 1 } },
    }),
    [forestTex, worldTex, realTex, leafTex],
  );

  // materials are driven every frame through refs
  const mWorld = useRef<THREE.ShaderMaterial>(null);
  const mGlow = useRef<THREE.ShaderMaterial>(null);
  const mBackdrop = useRef<THREE.ShaderMaterial>(null);
  const mLeaf = useRef<THREE.ShaderMaterial>(null);
  const mLanternL = useRef<THREE.ShaderMaterial>(null);
  const mLanternR = useRef<THREE.ShaderMaterial>(null);
  const mRays = useRef<THREE.ShaderMaterial>(null);
  const mFire = useRef<THREE.ShaderMaterial>(null);

  const hinge = useRef<THREE.Group>(null);
  const smoothP = useRef(0);
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const target = progress.current?.value ?? 0;
    smoothP.current = THREE.MathUtils.damp(smoothP.current, target, 5, Math.min(dt, 0.05));
    const p = smoothP.current;

    const open = easeInOutCubic(smooth(0.06, 0.42, p));
    const fly = smooth(0.32, 0.88, p);
    const flyE = Math.pow(fly, 2.1);

    if (hinge.current) {
      const knock = p < 0.02 ? Math.sin(t * 1.6) * 0.012 : 0; // idle "breathing" crack of light
      hinge.current.rotation.y = -(open * MAX_ANGLE + Math.abs(knock));
    }

    // camera framing
    const cam = state.camera as THREE.PerspectiveCamera;
    const aspect = state.size.width / state.size.height;
    const tan = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const desktop = aspect > 1.15;
    const zH = FRAME_H / (desktop ? 0.8 : 0.5) / (2 * tan);
    const zW = FRAME_W / (desktop ? 0.7 : 0.86) / (2 * tan * aspect);
    const baseZ = Math.max(zH, zW);
    const offX = desktop ? -FRAME_W * 0.2 : 0;
    const offY = desktop ? -0.25 : 0.35;
    const px = (pointer.current?.x ?? 0) * (1 - fly);
    const py = (pointer.current?.y ?? 0) * (1 - fly);

    const camZ = THREE.MathUtils.lerp(baseZ - smooth(0, 0.3, p) * 0.9, -6, flyE);
    cam.position.set(
      THREE.MathUtils.lerp(offX, 0, fly) + px * 0.35,
      THREE.MathUtils.lerp(offY, DOOR_CENTER_Y + 0.1, fly) + py * 0.22,
      camZ,
    );
    look.set(cam.position.x - px * 0.25, cam.position.y - py * 0.15, cam.position.z - 10);
    cam.lookAt(look);

    // uniforms
    const set = (m: React.RefObject<THREE.ShaderMaterial | null>, values: Record<string, number>) => {
      const mat = m.current;
      if (!mat) return;
      for (const k in values) mat.uniforms[k].value = values[k];
    };
    set(mBackdrop, { uTime: t, uOpen: open });
    set(mLeaf, { uAngle: open * MAX_ANGLE, uGlow: Math.min(1, open * 3) });
    set(mGlow, { uOpen: open * (1 - smooth(0.4, 0.62, p)), uTime: t });
    set(mLanternL, { uTime: t });
    set(mLanternR, { uTime: t + 1.7 });
    set(mRays, { uOpen: open * (1 - smooth(0.55, 0.75, p)), uTime: t });
    set(mFire, {
      uTime: t,
      uPixel: state.gl.getPixelRatio() * (state.size.height / 900) * 2.6,
      uIntensity: 0.85 * (1 - smooth(0.45, 0.65, p)),
    });
    set(mWorld, { uTime: t, uZoom: 1 + smooth(0.5, 1, p) * 0.18, uMix: smooth(0.66, 0.86, p) });
  });

  return (
    <>
      {/* world beyond the door */}
      <mesh position={[0, 0.2, -24]}>
        <planeGeometry args={[50, 21.25]} />
        <shaderMaterial vertexShader={PASS_VERT} fragmentShader={WORLD_FRAG} uniforms={u.world} ref={mWorld} />
      </mesh>

      {/* light pouring through the doorway */}
      <mesh position={[0, DOOR_CENTER_Y, -0.35]}>
        <planeGeometry args={[5, 7]} />
        <shaderMaterial vertexShader={PASS_VERT} fragmentShader={GLOW_FRAG} uniforms={u.glow} ref={mGlow} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* night forest wall with doorway hole */}
      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[90, 60]} />
        <shaderMaterial vertexShader={PASS_VERT} fragmentShader={BACKDROP_FRAG} uniforms={u.backdrop} ref={mBackdrop} />
      </mesh>

      {/* hinged 3D door leaf */}
      <group ref={hinge} position={[LEAF_X0, 0, 0]}>
        <mesh geometry={leafGeo}>
          <shaderMaterial attach="material-0" vertexShader={LEAF_VERT} fragmentShader={LEAF_FRAG} uniforms={u.leaf} ref={mLeaf} />
          <meshBasicMaterial attach="material-1" color="#2e1b0e" />
        </mesh>
      </group>

      {/* stone arch frame */}
      <mesh position={[0, 0, 0.012]} renderOrder={2}>
        <planeGeometry args={[FRAME_W, FRAME_H]} />
        <meshBasicMaterial map={frameTex} transparent alphaTest={0.02} depthWrite={false} toneMapped={false} color="#e6e2dc" />
      </mesh>

      {/* lantern halos */}
      {[LANTERN_L, LANTERN_R].map((l, i) => (
        <mesh key={i} position={[l.x, l.y, 0.05]} renderOrder={3}>
          <planeGeometry args={[1.8, 1.8]} />
          <shaderMaterial vertexShader={PASS_VERT} fragmentShader={GLOW_FRAG} uniforms={THREE.UniformsUtils.clone(u.lantern)} ref={i === 0 ? mLanternL : mLanternR} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}

      {/* god rays toward the viewer */}
      <mesh position={[0, DOOR_CENTER_Y, 0.5]} renderOrder={4}>
        <planeGeometry args={[16, 12]} />
        <shaderMaterial vertexShader={PASS_VERT} fragmentShader={RAYS_FRAG} uniforms={u.rays} ref={mRays} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* fireflies */}
      <points geometry={fireflyGeo} renderOrder={5}>
        <shaderMaterial vertexShader={FIREFLY_VERT} fragmentShader={FIREFLY_FRAG} uniforms={u.fireflies} ref={mFire} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </>
  );
}

export default function DoorScene({
  progress,
  pointer,
  active,
  onReady,
}: {
  progress: React.RefObject<HeroProgress>;
  pointer: React.RefObject<PointerState>;
  active: boolean;
  onReady?: () => void;
}) {
  return (
    <Canvas
      flat
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.6]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
      camera={{ fov: 35, near: 0.05, far: 80, position: [0, 0, 14] }}
      onCreated={({ gl }) => {
        gl.setClearColor("#05081a");
        onReady?.();
      }}
    >
      <Scene progress={progress} pointer={pointer} />
    </Canvas>
  );
}
