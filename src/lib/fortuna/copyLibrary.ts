// Fortuna Credit's internal marketing copy library. Every generated
// advertisement is built FROM these vetted phrases (or the brand context's
// own value-prop/vision copy) — never invented on the fly. Keeps the
// generator's output faithful to how Fortuna Credit actually talks:
// professional, human, confident, never pushy or fear-based.
//
// bg[i] and en[i] are paired translations at the same index — this lets
// an admin's explicit Bulgarian selection be translated to its English
// counterpart automatically for bilingual ("Both") posts. Keep new entries
// added to bg/en in the same order on both sides.
import type { ContextLocale } from "./businessContext";

export type CopyCategory = "hooks" | "trust" | "lifestyle" | "cta" | "shortHeadline";

// Sentinel meaning "let the generator pick" — anything else is an exact,
// admin-chosen phrase that must be used verbatim (see §38).
export const AI_CHOOSE = "ai" as const;

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
      "Време е за следващата крачка.",
      "Възможностите започват тук.",
      "Когато имаш нужда от решение.",
      "Твоята следваща възможност е тук.",
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
      "It's time for the next step.",
      "Opportunities start here.",
      "When you need a solution.",
      "Your next opportunity starts here.",
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
      "С теб на всяка следваща крачка.",
      "Разбираме твоите нужди.",
      "Близо до теб, когато имаш нужда.",
      "Решения, създадени с мисъл за теб.",
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
      "With you every step of the way.",
      "We understand your needs.",
      "Close to you when you need us.",
      "Solutions designed with you in mind.",
    ],
  },
  lifestyle: {
    bg: [
      "За нещата, които не могат да чакат.",
      "За дома, който искаш.",
      "За плановете, които имаш.",
      "За следващото ти начинание.",
      "За важните моменти.",
      "Когато имаш нужда от малко повече възможности.",
      "Превърни плановете си в реалност.",
      "Направи място за нови възможности.",
      "Понякога една възможност променя всичко.",
      "Следващата крачка е твоя.",
      "Мечтай. Планирай. Действай.",
      "Направи следващата крачка.",
      "Дай шанс на своите планове.",
      "Време е да реализираш идеите си.",
    ],
    en: [
      "For the things that can't wait.",
      "For the home you want.",
      "For the plans you have.",
      "For your next opportunity.",
      "For the moments that matter.",
      "When you need a little more opportunity.",
      "Turn your plans into reality.",
      "Make room for new possibilities.",
      "Sometimes one opportunity changes everything.",
      "The next step is yours.",
      "Dream. Plan. Act.",
      "Take the next step.",
      "Give your plans a chance.",
      "It's time to bring your ideas to life.",
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
      "Посети ни.",
      "Направи първата крачка.",
      "Свържи се с Fortuna Credit.",
      "Открий своето финансово решение.",
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
      "Visit us.",
      "Take the first step.",
      "Contact Fortuna Credit.",
      "Find your financial solution.",
    ],
  },
  shortHeadline: {
    bg: [
      "ТВОЯТА СЛЕДВАЩА КРАЧКА.",
      "ВЪЗМОЖНОСТИТЕ ЗАПОЧВАТ ТУК.",
      "ДО ТЕБ, КОГАТО ИМАШ НУЖДА.",
      "ТВОИТЕ ПЛАНОВЕ. НАШЕТО РЕШЕНИЕ.",
      "ВРЕМЕ Е ЗА СЛЕДВАЩАТА КРАЧКА.",
      "ПОВЕЧЕ ВЪЗМОЖНОСТИ.",
      "ФИНАНСОВО РЕШЕНИЕ ЗА ТЕБ.",
      "ТВОЯТА ВЪЗМОЖНОСТ.",
      "ГОТОВ ЛИ СИ ЗА СЛЕДВАЩАТА КРАЧКА?",
      "FORTUNA CREDIT — ДО ТЕБ.",
    ],
    en: [
      "YOUR NEXT STEP.",
      "OPPORTUNITIES START HERE.",
      "HERE WHEN YOU NEED US.",
      "YOUR PLANS. OUR SOLUTION.",
      "TIME FOR THE NEXT STEP.",
      "MORE POSSIBILITIES.",
      "A FINANCIAL SOLUTION FOR YOU.",
      "YOUR OPPORTUNITY.",
      "READY FOR THE NEXT STEP?",
      "FORTUNA CREDIT — HERE FOR YOU.",
    ],
  },
};

export function libraryPhrases(category: CopyCategory, locale: ContextLocale): string[] {
  return COPY_LIBRARY[category][locale];
}

export function pickFromLibrary(category: CopyCategory, locale: ContextLocale, seed: number): string {
  const phrases = libraryPhrases(category, locale);
  return phrases[((seed % phrases.length) + phrases.length) % phrases.length];
}

/**
 * Translates an admin-selected phrase to its paired counterpart in another
 * locale using its index in the source array (bg[i] <-> en[i] are written
 * as matched translations). Falls back to the original phrase if it isn't
 * a recognized library entry (e.g. free text), rather than guessing.
 */
export function translatePhrase(category: CopyCategory, phrase: string, fromLocale: ContextLocale, toLocale: ContextLocale): string {
  if (fromLocale === toLocale) return phrase;
  const fromList = libraryPhrases(category, fromLocale);
  const idx = fromList.indexOf(phrase);
  if (idx === -1) return phrase;
  return libraryPhrases(category, toLocale)[idx] ?? phrase;
}
