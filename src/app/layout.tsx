import type { Metadata, Viewport } from "next";
import { Inter, Oswald, Instrument_Serif } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["300", "400", "500", "600"] });
const oswald = Oswald({ variable: "--font-oswald", subsets: ["latin"], weight: ["300", "400", "500"] });
const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: "DolanBwi — Di Balik Pintu Ini, Banyuwangi Menanti",
  description:
    "DolanBwi: jelajahi Banyuwangi dari api biru Kawah Ijen, senja Pulau Merah, savana Baluran, hingga budaya Osing. Paket wisata dan panduan destinasi Sunrise of Java.",
};

export const viewport: Viewport = {
  themeColor: "#0e1430",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${inter.variable} ${oswald.variable} ${instrument.variable} antialiased`}>
      <body className="bg-sand font-sans text-ink">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
