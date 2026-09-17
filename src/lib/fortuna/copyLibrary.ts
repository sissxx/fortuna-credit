// Fortuna Credit's internal marketing copy library. Every generated
// advertisement is built FROM these vetted phrases (or the brand context's
// own value-prop/vision copy) — never invented on the fly. Keeps the
// generator's output faithful to how Fortuna Credit actually talks:
// professional, human, confident, never pushy or fear-based.
import type { ContextLocale } from "./businessContext";

export type CopyCategory = "hooks" | "trust" | "cta" | "lifestyle";

type LibraryEntry = Record<CopyCategory, { bg: string[]; en: string[] }>;

export const COPY_LIBRARY: LibraryEntry = {
  hooks: {
    bg: [
      "Пари, когато имаш нужда от тях.",
      "Финансово решение, съобразено с теб.",
      "Твоята нужда. Нашето решение.",
      "Когато плановете не могат да чакат.",
      "Имаш план? Нека го реализираме.",
      "Нуждаеш се от допълнителни средства?",
      "Финансова подкрепа, когато ти е нужна.",
      "Направи следващата крачка с Fortuna Credit.",
      "Твоите планове заслужават възможност.",
      "Повече възможности започват с правилното решение.",
      "Не отлагай плановете си.",
    ],
    en: [
      "Money when you need it.",
      "A financial solution made for you.",
      "Your needs. Our solution.",
      "When your plans can't wait.",
      "Have a plan? Let's make it happen.",
      "Need extra funds?",
      "Financial support when you need it.",
      "Take the next step with Fortuna Credit.",
      "Your plans deserve an opportunity.",
      "More possibilities start with the right solution.",
      "Don't put your plans on hold.",
    ],
  },
  trust: {
    bg: [
      "До теб, когато имаш нужда.",
      "Решения с разбиране към твоите нужди.",
      "Тук сме, за да помогнем.",
      "Персонално отношение. Реални решения.",
      "Твоите нужди са наш приоритет.",
      "Близо до теб. Готови да помогнем.",
      "Финансови решения с човешко отношение.",
      "За твоите планове. За твоето бъдеще.",
      "Доверие, подкрепа и решение.",
    ],
    en: [
      "Here when you need us.",
      "Solutions built around your needs.",
      "We're here to help.",
      "Personal approach. Real solutions.",
      "Your needs come first.",
      "Close to you. Ready to help.",
      "Financial solutions with a human touch.",
      "For your plans. For your future.",
      "Trust, support and solutions.",
    ],
  },
  cta: {
    bg: [
      "Кандидатствай сега.",
      "Свържи се с нас.",
      "Посети наш офис.",
      "Разбери повече.",
      "Направи запитване.",
      "Говори с наш консултант.",
      "Твоята следваща стъпка започва тук.",
      "Научи повече за Fortuna Credit.",
    ],
    en: [
      "Apply now.",
      "Get in touch.",
      "Visit our office.",
      "Learn more.",
      "Make an inquiry.",
      "Talk to our consultant.",
      "Your next step starts here.",
      "Learn more about Fortuna Credit.",
    ],
  },
  lifestyle: {
    bg: [
      "За нещата, които не могат да чакат.",
      "За дома, който искаш.",
      "За плановете, които имаш.",
      "За следващото ти начинание.",
      "За важните моменти.",
      "Превърни плановете си в реалност.",
      "Направи място за нови възможности.",
      "Понякога една възможност променя всичко.",
      "Следващата крачка е твоя.",
    ],
    en: [
      "For the things that can't wait.",
      "For the home you want.",
      "For the plans you have.",
      "For your next opportunity.",
      "For the moments that matter.",
      "Turn your plans into reality.",
      "Make room for new possibilities.",
      "Sometimes one opportunity changes everything.",
      "The next step is yours.",
    ],
  },
};

export function libraryPhrases(category: CopyCategory, locale: ContextLocale): string[] {
  return COPY_LIBRARY[category][locale];
}

export function pickFromLibrary(category: CopyCategory, locale: ContextLocale, seed: number): string {
  const phrases = libraryPhrases(category, locale);
  return phrases[seed % phrases.length];
}
