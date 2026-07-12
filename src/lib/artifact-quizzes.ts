import type { Tables } from "@/integrations/supabase/types";

export type ArtifactQuizArtifact = Pick<
  Tables<"artifacts">,
  | "id"
  | "category"
  | "name_bm"
  | "name_en"
  | "origin_bm"
  | "origin_en"
  | "material_bm"
  | "material_en"
  | "era_bm"
  | "era_en"
  | "description_bm"
  | "description_en"
>;

type Localized = {
  bm: string;
  en: string;
};

export interface ArtifactQuizQuestion {
  id: string;
  prompt: Localized;
  options: Localized[];
  correctIndex: number;
  /** Difficulty tier for display: 1 = easiest, 5 = hardest */
  difficulty: 1 | 2 | 3 | 4 | 5;
}

/* ── Question-type pools ── */

const CATEGORY_OPTIONS: Array<{ key: string; label: Localized }> = [
  { key: "weapons", label: { bm: "Senjata Tradisional", en: "Traditional Weapons" } },
  { key: "regalia", label: { bm: "Pakaian & Perhiasan Diraja", en: "Royal Regalia" } },
  { key: "music", label: { bm: "Alat Muzik Tradisional", en: "Traditional Music" } },
  { key: "crafts", label: { bm: "Kraftangan Warisan", en: "Heritage Crafts" } },
  { key: "toys", label: { bm: "Mainan Tradisional", en: "Traditional Toys" } },
];

const ORIGIN_OPTIONS: Localized[] = [
  { bm: "Kesultanan Melayu", en: "Malay Sultanates" },
  { bm: "Melaka", en: "Malacca" },
  { bm: "Sarawak", en: "Sarawak" },
  { bm: "Semenanjung Tanah Melayu", en: "Malay Peninsula" },
  { bm: "Istana Melayu", en: "Malay palaces" },
  { bm: "Kelantan dan Terengganu", en: "Kelantan and Terengganu" },
  { bm: "Pahang dan Terengganu", en: "Pahang and Terengganu" },
  { bm: "Kelantan", en: "Kelantan" },
  { bm: "Terengganu dan Kelantan", en: "Terengganu and Kelantan" },
  { bm: "China; komuniti Cina Malaysia", en: "China; Malaysian Chinese community" },
];

const MATERIAL_OPTIONS: Localized[] = [
  { bm: "Besi tempaan dan kayu", en: "Forged iron and wood" },
  { bm: "Tembaga", en: "Bronze" },
  { bm: "Kayu keras dan cat asli", en: "Hardwood and natural pigments" },
  { bm: "Kain songket", en: "Songket cloth" },
  { bm: "Sutera, songket, benang emas", en: "Silk, songket, gold thread" },
  { bm: "Perak tulen", en: "Pure silver" },
  { bm: "Perunggu", en: "Bronze" },
  { bm: "Kayu keras dan kulit lembu", en: "Hardwood and cow hide" },
  { bm: "Buluh", en: "Bamboo" },
  { bm: "Kayu, benang sutera dan benang emas", en: "Wood, silk thread and gold thread" },
  { bm: "Buluh dan kertas berwarna", en: "Bamboo and coloured paper" },
  { bm: "Tembaga dan kayu", en: "Copper and wood" },
  { bm: "Kayu keras, guli atau biji getah", en: "Hardwood, marbles or rubber seeds" },
  { bm: "Buluh, kayu dan tali", en: "Bamboo, wood and string" },
  { bm: "Kayu dan dakwat", en: "Wood and ink" },
];

/* ── Era pool (all unique eras across artifacts) ── */
const ERA_OPTIONS: Localized[] = [
  { bm: "Abad ke-15", en: "15th century" },
  { bm: "Abad ke-15 hingga ke-16", en: "15th to 16th century" },
  { bm: "Abad ke-18 hingga ke-19", en: "18th to 19th century" },
  { bm: "Abad ke-15 hingga kini", en: "15th century to present" },
  { bm: "Abad ke-17 hingga kini", en: "17th century to present" },
  { bm: "Abad ke-18", en: "18th century" },
  { bm: "Turun-temurun", en: "Passed down through generations" },
  { bm: "Abad ke-16 hingga kini", en: "16th century to present" },
  { bm: "Abad ke-19 hingga kini", en: "19th century to present" },
  { bm: "Lebih 1,500 tahun", en: "Over 1,500 years old" },
  { bm: "Lebih 1,000 tahun", en: "Over 1,000 years old" },
];

/* ── Key facts pool (one per artifact, for hard Q5) ── */
const KEY_FACTS: Record<string, Localized> = {
  "keris-panjang": {
    bm: "Senjata upacara diraja dengan bilah bergelombang",
    en: "A royal ceremonial weapon with a wavy blade",
  },
  "meriam-melaka": {
    bm: "Digunakan untuk mempertahankan Kota Melaka",
    en: "Used to defend the fortress of Malacca",
  },
  terabai: {
    bm: "Perisai tradisional kaum Iban dan Bidayuh",
    en: "Traditional shield of the Iban and Bidayuh peoples",
  },
  tengkolok: {
    bm: "Ikat kepala rasmi yang dilipat mengikut gaya negeri",
    en: "Royal headdress folded in state-distinctive styles",
  },
  "baju-kurung-diraja": {
    bm: "Pakaian diraja daripada sutera dan songket bersulam emas",
    en: "Royal attire of silk and songket with gold embroidery",
  },
  "set-perak-diraja": {
    bm: "Set perkakas perak termasuk tepak sirih dan cerana",
    en: "Silverware set including betel-nut caskets and trays",
  },
  "gong-gamelan": {
    bm: "Gong perunggu yang menjadi tulang belakang ensembel gamelan",
    en: "Bronze gong that anchors the gamelan ensemble",
  },
  "rebana-ubi": {
    bm: "Gendang besar berbentuk ubi dipalu semasa perayaan",
    en: "Large tuber-shaped drum struck during festivals",
  },
  "seruling-tradisional": {
    bm: "Seruling buluh dimainkan dalam Mak Yong dan Wayang Kulit",
    en: "Bamboo flute played in Mak Yong and Wayang Kulit",
  },
  "alat-tenun-songket": {
    bm: "Alat tenun kayu untuk menghasilkan kain songket",
    en: "A wooden loom used to weave songket cloth",
  },
  "wau-bulan": {
    bm: "Layang-layang tradisional berbentuk bulan sabit",
    en: "A traditional crescent-moon shaped kite",
  },
  "canting-batik": {
    bm: "Alat bermata tembaga untuk melukis lilin pada batik",
    en: "A copper-spouted tool for applying wax onto batik",
  },
  congkak: {
    bm: "Permainan papan tradisional yang melatih kiraan pantas",
    en: "Traditional board game that sharpens counting skills",
  },
  "diabolo-cina": {
    bm: "Alat permainan berbentuk jam pasir yang berdengung bila berputar",
    en: "Hourglass-shaped toy that hums when spun fast",
  },
  "catur-cina": {
    bm: "Permainan strategi di papan bergrid dengan 'sungai' di tengah",
    en: "Strategy game on a gridded board with a central 'river'",
  },
};

/* ── Helpers ── */

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function buildLocalizedOptions(correct: Localized, pool: Localized[], seed: string): Localized[] {
  const distractors = pool.filter((option) => option.en !== correct.en);
  const unique: Localized[] = [];
  for (let i = 0; i < distractors.length; i += 1) {
    const candidate = distractors[(hashSeed(`${seed}-${i}`) + i) % distractors.length];
    if (!unique.some((option) => option.en === candidate.en)) unique.push(candidate);
    if (unique.length === 3) break;
  }

  const combined = [correct, ...unique];
  const rotate = hashSeed(`${seed}-rotate`) % combined.length;
  return combined.map((_, index) => combined[(index + rotate) % combined.length]);
}

/* ── Per-type builders ── */

function buildCategoryOptions(category: string, seed: string): Localized[] {
  const correct = CATEGORY_OPTIONS.find((option) => option.key === category)?.label ?? CATEGORY_OPTIONS[0].label;
  return buildLocalizedOptions(correct, CATEGORY_OPTIONS.map((o) => o.label), seed);
}

function buildEraOptions(correct: Localized, seed: string): Localized[] {
  return buildLocalizedOptions(correct, ERA_OPTIONS, seed);
}

function buildFactOptions(correct: Localized, artifactId: string, seed: string): Localized[] {
  // Build distractors from OTHER artifacts' key facts
  const distractors = Object.entries(KEY_FACTS)
    .filter(([id]) => id !== artifactId)
    .map(([, fact]) => fact);

  const unique: Localized[] = [];
  for (let i = 0; i < distractors.length; i += 1) {
    const candidate = distractors[(hashSeed(`${seed}-${i}`) + i) % distractors.length];
    if (!unique.some((opt) => opt.en === candidate.en)) unique.push(candidate);
    if (unique.length === 3) break;
  }

  const combined = [correct, ...unique];
  const rotate = hashSeed(`${seed}-rotate`) % combined.length;
  return combined.map((_, index) => combined[(index + rotate) % combined.length]);
}

/* ── Main export ── */

export function buildArtifactQuiz(artifact: ArtifactQuizArtifact): ArtifactQuizQuestion[] {
  const categoryOptions = buildCategoryOptions(artifact.category, `${artifact.id}-category`);
  const eraCorrect = { bm: artifact.era_bm, en: artifact.era_en };
  const eraOptions = buildEraOptions(eraCorrect, `${artifact.id}-era`);
  const originCorrect = { bm: artifact.origin_bm, en: artifact.origin_en };
  const originOptions = buildLocalizedOptions(originCorrect, ORIGIN_OPTIONS, `${artifact.id}-origin`);
  const materialCorrect = { bm: artifact.material_bm, en: artifact.material_en };
  const materialOptions = buildLocalizedOptions(materialCorrect, MATERIAL_OPTIONS, `${artifact.id}-material`);
  const factCorrect = KEY_FACTS[artifact.id];
  const factOptions = factCorrect
    ? buildFactOptions(factCorrect, artifact.id, `${artifact.id}-fact`)
    : null;

  const questions: ArtifactQuizQuestion[] = [
    // Q1 — Easy: category
    {
      id: `${artifact.id}-category`,
      difficulty: 1,
      prompt: {
        bm: `${artifact.name_bm} tergolong dalam kategori yang mana?`,
        en: `Which category does ${artifact.name_en} belong to?`,
      },
      options: categoryOptions,
      correctIndex: categoryOptions.findIndex(
        (opt) => opt.en === CATEGORY_OPTIONS.find((item) => item.key === artifact.category)?.label.en,
      ),
    },
    // Q2 — Easy-Medium: era
    {
      id: `${artifact.id}-era`,
      difficulty: 2,
      prompt: {
        bm: `Dari zaman manakah ${artifact.name_bm}?`,
        en: `What era does ${artifact.name_en} date from?`,
      },
      options: eraOptions,
      correctIndex: eraOptions.findIndex((opt) => opt.en === artifact.era_en),
    },
    // Q3 — Medium: origin
    {
      id: `${artifact.id}-origin`,
      difficulty: 3,
      prompt: {
        bm: `Apakah asal yang disenaraikan untuk ${artifact.name_bm}?`,
        en: `Which origin is listed for ${artifact.name_en}?`,
      },
      options: originOptions,
      correctIndex: originOptions.findIndex((opt) => opt.en === artifact.origin_en),
    },
    // Q4 — Medium: material
    {
      id: `${artifact.id}-material`,
      difficulty: 4,
      prompt: {
        bm: `Apakah bahan ${artifact.name_bm}?`,
        en: `What material is ${artifact.name_en} made from?`,
      },
      options: materialOptions,
      correctIndex: materialOptions.findIndex((opt) => opt.en === artifact.material_en),
    },
  ];

  // Q5 — Hard: description-based key fact
  if (factCorrect && factOptions) {
    questions.push({
      id: `${artifact.id}-fact`,
      difficulty: 5,
      prompt: {
        bm: `Fakta yang manakah BENAR tentang ${artifact.name_bm}?`,
        en: `Which fact is TRUE about ${artifact.name_en}?`,
      },
      options: factOptions,
      correctIndex: factOptions.findIndex((opt) => opt.en === factCorrect.en),
    });
  }

  return questions;
}
