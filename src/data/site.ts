import type { ExploreChapter, HighlightCard, JourneyStop, Landscape, Principle } from "@/types";

const img = (slug: string) => `/images/bwi/${slug}.jpg`;

export const BRAND = {
  name: "DolanBwi",
  tagline: "Banyuwangi Escape",
};

export const HERO_CARDS: HighlightCard[] = [
  {
    title: "Kawah Ijen",
    description: "Api biru dan danau toska di atas awan.",
    image: "/images/cards/card-ijen.jpg",
  },
  {
    title: "De Djawatan",
    description: "Hutan trembesi tua bak negeri dongeng.",
    image: "/images/cards/card-djawatan.jpg",
  },
  {
    title: "Baluran & Pulau Merah",
    description: "Savana liar hingga senja di pantai merah.",
    image: "/images/cards/card-baluran.jpg",
  },
];

export const CHAPTERS: ExploreChapter[] = [
  {
    slug: "ijen",
    name: "Kawah Ijen",
    category: "Gunung & Kawah",
    tagline: "Api biru di ujung timur Jawa",
    description:
      "Kawah aktif di kompleks Gunung Ijen yang menyimpan danau kawah asam berwarna toska terbesar di dunia. Menjelang subuh, gas belerang yang terbakar memunculkan fenomena blue fire — api biru alami yang hanya bisa dilihat di segelintir tempat di bumi. Di sini pula para penambang belerang tradisional memikul puluhan kilo batu kuning setiap hari.",
    facts: [
      { label: "Lokasi", value: "Tamansari, Licin" },
      { label: "Dari kota", value: "± 35 km · 1 jam" },
      { label: "Ketinggian", value: "± 2.386 mdpl" },
      { label: "Waktu terbaik", value: "Apr – Okt, 01.00–05.00" },
    ],
    activities: ["Pendakian malam 3 km", "Blue fire", "Sunrise kawah", "Penambang belerang"],
    image: img("ijen-lake"),
    gallery: [img("ijen-bluefire-2"), img("ijen-miner"), img("ijen-sunrise")],
    trivia: "Bawa masker gas — asap belerang bisa berubah arah setiap saat.",
  },
  {
    slug: "pulau-merah",
    name: "Pulau Merah",
    category: "Pantai & Pulau",
    tagline: "Bukit hijau, tanah merah, senja jingga",
    description:
      "Pantai berpasir lembut di pesisir selatan dengan sebuah bukit kecil berselimut hutan tepat di depan bibir pantai. Namanya berasal dari tanah kemerahan di bukit itu. Saat air surut kamu bisa berjalan hingga kaki bukit, dan ombaknya yang konsisten menjadikannya tempat favorit belajar surfing.",
    facts: [
      { label: "Lokasi", value: "Sumberagung, Pesanggaran" },
      { label: "Dari kota", value: "± 80 km · 2,5 jam" },
      { label: "Ombak", value: "Ramah pemula" },
      { label: "Waktu terbaik", value: "Sore, 16.30–18.00" },
    ],
    activities: ["Surfing", "Berburu sunset", "Jalan ke bukit saat surut", "Berkemah"],
    image: img("pulau-merah"),
    gallery: [img("pulau-merah-sunset"), img("pulau-merah-3"), img("pulau-merah-2")],
    trivia: "Pura kecil di kaki bukit masih dipakai umat Hindu setempat — jaga sikap.",
  },
  {
    slug: "baluran",
    name: "Taman Nasional Baluran",
    category: "Hutan & Savana",
    tagline: "Africa van Java",
    description:
      "Savana luas di perbatasan Banyuwangi–Situbondo dengan latar Gunung Baluran. Di Savana Bekol, kawanan banteng Jawa, rusa timor, kerbau liar, dan merak hijau berkeliaran bebas. Jalur hutan musimnya berakhir di Pantai Bama yang tenang, cocok untuk snorkeling dan mengamati monyet ekor panjang.",
    facts: [
      { label: "Lokasi", value: "Perbatasan Bwi–Situbondo" },
      { label: "Dari kota", value: "± 40 km · 1 jam" },
      { label: "Luas", value: "± 25.000 ha" },
      { label: "Waktu terbaik", value: "Jul – Okt (savana kuning)" },
    ],
    activities: ["Safari savana", "Pengamatan satwa", "Snorkeling Bama", "Fotografi golden hour"],
    image: img("baluran-savana"),
    gallery: [img("baluran-peafowl"), img("baluran-deer"), img("baluran-golden")],
    trivia: "Datang pagi buta: satwa paling aktif sebelum pukul 08.00.",
  },
  {
    slug: "djawatan",
    name: "De Djawatan",
    category: "Hutan",
    tagline: "Hutan trembesi seperti negeri dongeng",
    description:
      "Kawasan hutan trembesi berusia lebih dari satu abad yang dulunya lokasi penimbunan kayu jati. Dahan-dahan raksasanya dipenuhi lumut dan paku-pakuan, membentuk kanopi yang sering dibandingkan dengan hutan di film fantasi. Kini menjadi taman hutan yang teduh untuk berjalan santai atau naik delman.",
    facts: [
      { label: "Lokasi", value: "Benculuk, Cluring" },
      { label: "Dari kota", value: "± 40 km · 1 jam" },
      { label: "Pohon", value: "Trembesi > 100 tahun" },
      { label: "Waktu terbaik", value: "Pagi, saat kabut tipis" },
    ],
    activities: ["Jalan santai", "Naik delman", "Foto prewedding", "Piknik keluarga"],
    image: img("djawatan-reflection"),
    gallery: [img("djawatan"), img("djawatan-carriage"), img("djawatan-2")],
    trivia: "Sinar matahari pagi yang menembus kanopi adalah momen terbaik untuk foto.",
  },
  {
    slug: "teluk-hijau",
    name: "Teluk Hijau",
    category: "Pantai Tersembunyi",
    tagline: "Air zamrud di jantung Meru Betiri",
    description:
      "Teluk tersembunyi di Taman Nasional Meru Betiri dengan air laut hijau zamrud karena pantulan alga dan hutan di sekelilingnya. Kamu bisa mencapainya lewat trekking hutan atau perahu nelayan dari Pantai Rajegwesi, lalu disambut air terjun kecil yang jatuh langsung ke pantai.",
    facts: [
      { label: "Lokasi", value: "Sarongan, Pesanggaran" },
      { label: "Dari kota", value: "± 90 km · 3 jam" },
      { label: "Akses", value: "Trekking / perahu" },
      { label: "Waktu terbaik", value: "Mei – Sep" },
    ],
    activities: ["Trekking hutan", "Perahu nelayan", "Berenang", "Air terjun pantai"],
    image: img("teluk-hijau-2"),
    gallery: [img("teluk-hijau"), img("teluk-hijau-boat"), img("sukamade")],
    trivia: "Tidak ada warung di dalam teluk — bawa bekal dan bawa pulang sampahmu.",
  },
  {
    slug: "alas-purwo",
    name: "Alas Purwo & G-Land",
    category: "Hutan & Ombak",
    tagline: "Hutan tertua, ombak kelas dunia",
    description:
      "Taman nasional di ujung tenggara Jawa yang dipercaya sebagai hutan tertua di pulau ini. Savana Sadengan menjadi tempat banteng merumput, gua-gua menyimpan kisah spiritual, dan di Pantai Plengkung — yang dikenal peselancar dunia sebagai G-Land — ombak kiri panjang menggulung sempurna.",
    facts: [
      { label: "Lokasi", value: "Tegaldlimo" },
      { label: "Dari kota", value: "± 65 km · 2 jam" },
      { label: "Ombak G-Land", value: "Hingga 4–6 m" },
      { label: "Waktu terbaik", value: "Apr – Okt" },
    ],
    activities: ["Surfing G-Land", "Savana Sadengan", "Susur gua", "Pengamatan banteng"],
    image: img("alas-purwo"),
    gallery: [img("alas-purwo-banteng"), img("ngagelan"), img("teluk-hijau-boat")],
    trivia: "G-Land hanya untuk peselancar berpengalaman — pemula cukup menikmati dari pantai.",
  },
  {
    slug: "sukamade",
    name: "Pantai Sukamade",
    category: "Konservasi",
    tagline: "Tempat penyu pulang bertelur",
    description:
      "Pantai terpencil di Meru Betiri yang menjadi lokasi pendaratan empat jenis penyu: hijau, sisik, lekang, dan belimbing. Malam hari kamu bisa ikut petugas mengamati induk penyu bertelur, dan sore harinya ikut melepas tukik ke laut. Perjalanannya sendiri adalah petualangan offroad menyeberangi sungai.",
    facts: [
      { label: "Lokasi", value: "TN Meru Betiri" },
      { label: "Dari kota", value: "± 97 km · 4 jam" },
      { label: "Akses", value: "Mobil 4×4" },
      { label: "Waktu terbaik", value: "Malam, Des – Jun" },
    ],
    activities: ["Melihat penyu bertelur", "Pelepasan tukik", "Offroad", "Menginap di pondok"],
    image: img("sukamade"),
    gallery: [img("sukamade-turtle"), img("teluk-hijau-boat"), img("ngagelan")],
    trivia: "Lampu senter dan kamera flash dilarang saat penyu sedang naik ke pantai.",
  },
  {
    slug: "bangsring",
    name: "Bangsring & Pulau Tabuhan",
    category: "Bawah Laut",
    tagline: "Rumah apung dan pulau pasir putih",
    description:
      "Kawasan konservasi terumbu karang yang dikelola nelayan setempat. Dari rumah apung Bangsring kamu bisa snorkeling di antara ikan karang, lalu menyeberang ke Pulau Tabuhan — pulau kecil tak berpenghuni dengan pasir putih dan air jernih berlatar Gunung Ijen dan Selat Bali.",
    facts: [
      { label: "Lokasi", value: "Bangsring, Wongsorejo" },
      { label: "Dari kota", value: "± 25 km · 40 menit" },
      { label: "Penyeberangan", value: "± 20 menit perahu" },
      { label: "Waktu terbaik", value: "Pagi, laut tenang" },
    ],
    activities: ["Snorkeling", "Rumah apung", "Island hopping", "Kitesurfing"],
    image: img("watu-dodol"),
    gallery: [img("tabuhan"), img("bangsring"), img("pulau-merah-3")],
    trivia: "Terumbu di sini hasil transplantasi warga — jangan injak karang.",
  },
  {
    slug: "osing",
    name: "Budaya Osing & Gandrung",
    category: "Budaya & Festival",
    tagline: "Jiwa Bumi Blambangan",
    description:
      "Suku Osing adalah penduduk asli Banyuwangi dengan bahasa dan adat sendiri. Di Desa Adat Kemiren kamu bisa mencicipi kopi dan pecel pitik, melihat rumah tradisional, dan barong khas Kemiren. Setiap tahun ribuan penari memenuhi pantai dalam Festival Gandrung Sewu, sementara ritual Kebo-keboan menjaga tradisi agraris.",
    facts: [
      { label: "Lokasi", value: "Kemiren, Glagah" },
      { label: "Dari kota", value: "± 6 km · 15 menit" },
      { label: "Festival", value: "Gandrung Sewu (tahunan)" },
      { label: "Waktu terbaik", value: "Cek kalender B-Fest" },
    ],
    activities: ["Desa adat", "Ngopi Osing", "Tari Gandrung", "Ritual Kebo-keboan"],
    image: img("gandrung-sewu"),
    gallery: [img("gandrung-2"), img("barong-kemiren"), img("kebo-keboan")],
    trivia: "Coba pecel pitik — ayam kampung bakar suwir dengan parutan kelapa pedas.",
  },
];

/** One day across Banyuwangi, told hour by hour (horizontal scroll story). */
export const JOURNEY: JourneyStop[] = [
  {
    time: "00.30",
    place: "Paltuding, kaki Ijen",
    title: "Berangkat dalam gelap",
    text: "Pendakian ke bibir kawah dimulai tengah malam. Jalurnya sekitar 3 km dengan tanjakan yang terus menanjak; udara bisa turun di bawah 10 °C. Senter kepala dan jaket tebal bukan pilihan, tapi kebutuhan.",
    image: img("ijen-interior"),
  },
  {
    time: "03.00",
    place: "Dasar Kawah Ijen",
    title: "Api biru menyala",
    text: "Gas belerang yang keluar dari celah batuan terbakar saat bertemu udara dan memancarkan nyala biru elektrik. Fenomena ini hanya terlihat jelas sebelum fajar — begitu langit terang, apinya seolah lenyap.",
    image: img("ijen-bluefire-2"),
  },
  {
    time: "05.30",
    place: "Bibir Kawah",
    title: "Matahari pertama Jawa",
    text: "Dari ketinggian sekitar 2.386 mdpl, matahari terbit di atas lautan awan sementara danau asam di bawahnya perlahan berubah warna menjadi toska. Inilah alasan Banyuwangi disebut Sunrise of Java.",
    image: img("ijen-sunrise-2"),
  },
  {
    time: "09.00",
    place: "Savana Bekol, Baluran",
    title: "Afrika di ujung Jawa",
    text: "Satu jam ke utara, padang savana terbuka dengan latar Gunung Baluran. Pagi hari adalah jam aktif satwa: banteng, rusa timor, dan merak hijau keluar mencari makan sebelum terik.",
    image: img("baluran-landscape"),
  },
  {
    time: "13.00",
    place: "De Djawatan, Cluring",
    title: "Berteduh di hutan dongeng",
    text: "Saat matahari paling tinggi, kanopi trembesi berusia seabad menjadi atap alami. Lumut dan paku-pakuan yang menjuntai dari dahan membuat hutan ini terasa seperti dunia lain.",
    image: img("djawatan-carriage"),
  },
  {
    time: "17.00",
    place: "Pulau Merah, Pesanggaran",
    title: "Senja berwarna tembaga",
    text: "Di pesisir selatan, ombak panjang menggulung di depan bukit kecil bertanah merah. Saat surut kamu bisa berjalan hingga kaki bukit — lalu menunggu matahari tenggelam tepat di belakangnya.",
    image: img("pulau-merah-2"),
  },
  {
    time: "21.00",
    place: "Pantai Sukamade",
    title: "Penyu pulang ke pantai",
    text: "Malam hari, dalam gelap total, induk penyu merayap naik untuk bertelur di pasir tempat ia dulu menetas. Petugas konservasi memandu pengamatan tanpa lampu — hari ditutup dengan keheningan.",
    image: img("sukamade-turtle"),
  },
];

/** The four landscape families, explained over the user's illustrated panels. */
export const LANDSCAPES: Landscape[] = [
  {
    name: "Lembah Rimba",
    subtitle: "Jungle Valley",
    image: "/images/zones/zone-rimba.webp",
    text: "Hutan hujan dataran rendah dan hutan musim menutupi sisi selatan dan timur. Alas Purwo dipercaya sebagai hutan tertua di Jawa, sementara air terjun seperti Jagir lahir dari lereng yang selalu basah.",
    spots: ["Alas Purwo", "De Djawatan", "Air Terjun Jagir"],
  },
  {
    name: "Puncak Kabut",
    subtitle: "Highland Peaks",
    image: "/images/zones/zone-puncak.webp",
    text: "Dataran tinggi Ijen–Raung adalah atap Banyuwangi. Tanah vulkaniknya subur untuk kopi dan cengkeh, kabut turun hampir setiap sore, dan kawahnya masih aktif hingga hari ini.",
    spots: ["Kawah Ijen", "Paltuding", "Gunung Raung"],
  },
  {
    name: "Gua Tersembunyi",
    subtitle: "Lost Caverns",
    image: "/images/zones/zone-gua.webp",
    text: "Batuan kapur di semenanjung Blambangan menyimpan puluhan gua. Sebagian dipakai untuk bertapa dan ritual, sebagian lagi hanya bisa dimasuki bersama penjaga hutan.",
    spots: ["Gua Istana", "Gua Padepokan", "Gua Mangleng"],
  },
  {
    name: "Laguna Pesisir",
    subtitle: "Coastal Lagoon",
    image: "/images/zones/zone-pesisir.webp",
    text: "Sekitar 175 km garis pantai menghadap dua perairan: Selat Bali yang tenang di timur dan Samudra Hindia yang berombak di selatan. Hasilnya: terumbu karang, teluk zamrud, dan ombak kelas dunia.",
    spots: ["Teluk Hijau", "Pulau Merah", "Pulau Tabuhan"],
  },
];

/** Closing: how to visit respectfully. */
export const PRINCIPLES: Principle[] = [
  { title: "Jaga alam", text: "Bawa pulang sampahmu, jangan injak karang, dan tetap di jalur yang ditandai." },
  { title: "Hormati adat", text: "Desa Osing dan pura di pesisir masih hidup — berpakaian sopan dan minta izin sebelum memotret." },
  { title: "Dukung warga", text: "Pakai pemandu, homestay, dan warung lokal agar wisata ikut menghidupi Banyuwangi." },
  { title: "Datang di musimnya", text: "April–Oktober untuk kawah dan savana; malam Desember–Juni untuk penyu Sukamade." },
];
