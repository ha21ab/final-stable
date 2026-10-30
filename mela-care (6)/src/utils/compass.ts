import { AppLanguage, MultilingualText } from '../types';

/**
 * Resolves localized text with automatic Harari fallback when placeholder is unset.
 */
export function resolveText(text: MultilingualText, lang: AppLanguage): string {
  if (lang === 'har') {
    if (text.har && text.har.trim() !== '') {
      return text.har.replace(/\s*\[(?:HARARI_SLOT|Slot|Harari Slot)\]/gi, '').trim();
    }
    return text.am || text.en;
  }
  return text[lang] || text.en || text.am;
}

/**
 * Evaluates the kick-counting session for fetal wellbeing.
 * Standard WHO / Ethiopian MoH guideline:
 * - 10 kicks within 2 hours (120 minutes) = healthy activity.
 * - Under 10 kicks after 120 mins = seek immediate clinic evaluation.
 */
export function evaluateKickSession(
  kicks: number,
  elapsedMinutes: number
): {
  status: 'healthy' | 'in_progress' | 'alert';
  message: MultilingualText;
} {
  if (kicks >= 10) {
    return {
      status: 'healthy',
      message: {
        en: 'Baby is active and responsive! You reached 10 kicks. Great job resting today.',
        am: 'ህፃኑ ጤናማና ንቁ ነው! 10 እንቅስቃሴዎች ተመዝግበዋል። ጥሩ እረፍት አድርገዋል።',
        om: 'Daa’imni keessan nagaafi jabaadha! Sochii 10 galmeessitaniittu.',
        har: 'ህፃኑ ጤናማና ንቁ ነው [HARARI_SLOT]',
      },
    };
  }

  if (elapsedMinutes >= 120 && kicks < 10) {
    return {
      status: 'alert',
      message: {
        en: 'Warning: Fewer than 10 kicks in 2 hours. Please visit your health centre or midwife now.',
        am: 'ማስጠንቀቂያ፦ በ2 ሰዓት ውስጥ ከ10 እንቅስቃሴ በታች ነው። እባክዎ አሁኑኑ ወደ ጤና ጣቢያ ይሂዱ።',
        om: 'Akeekkachiisa: Sa’aatii 2 keessatti sochii 10 gadi. Amma gara buufata fayyaa deemaa.',
        har: 'ማስጠንቀቂያ፦ አሁኑኑ ወደ ጤና ጣቢያ ይሂዱ [HARARI_SLOT]',
      },
    };
  }

  return {
    status: 'in_progress',
    message: {
      en: `Counting: ${kicks} of 10 kicks recorded. Keep lying gently on your left side.`,
      am: `በመቁጠር ላይ፦ ${kicks} ከ 10 እንቅስቃሴዎች ተመዝግበዋል። በግራ ጎንዎ ተኝተው ያዳምጡ።`,
      om: `Lakkaa’aa jira: 10 keessaa ${kicks} galmaa’eera. Cinaacha bitaan boqodhaa.`,
      har: `በመቁጠር ላይ፦ ${kicks} ከ 10 ተመዝግቧል [HARARI_SLOT]`,
    },
  };
}

/**
 * Gestational timeline calculator based on the moon cycles.
 */
export function calculateGestationalMoon(month: number): {
  trimester: 1 | 2 | 3;
  milestone: MultilingualText;
} {
  const clamped = Math.max(1, Math.min(9, Math.round(month)));
  let trimester: 1 | 2 | 3 = 1;
  if (clamped >= 7) trimester = 3;
  else if (clamped >= 4) trimester = 2;

  const milestones: Record<1 | 2 | 3, MultilingualText> = {
    1: {
      en: 'First Moon Phase (Months 1-3): Take folic acid daily, rest, and avoid khat or alcohol.',
      am: 'የመጀመሪያው የእርግዝና ወቅት (ወር 1-3)፦ የፎሊክ አሲድ እንክብል ይውሰዱ፣ በቂ እረፍት ያድርጉ፣ ከጫትና አልኮል ይራቁ።',
      om: 'Yeroo 1ffaa (Ji’a 1-3): Qoricha fooleetiik asiidii fudhadhaa, boqodhaa, caatii fi alkoolii irraa fagaadhaa.',
      har: 'የመጀመሪያ ወቅት (ወር 1-3)፦ ፎሊክ አሲድ ይውሰዱ፣ ከጫት ይራቁ [HARARI_SLOT]',
    },
    2: {
      en: 'Second Moon Phase (Months 4-6): Baby kicks begin, take iron supplements, attend ANC visit.',
      am: 'ሁለተኛው የእርግዝና ወቅት (ወር 4-6)፦ የህፃኑ እንቅስቃሴ ይጀምራል፣ የአይረን መድሃኒት ይውሰዱ፣ የክሊኒክ ቀጠሮዎን ያክብሩ።',
      om: 'Yeroo 2ffaa (Ji’a 4-6): Sochiin daa’imaa ni jalqaba, qoricha ayiranii fudhadhaa, buufata fayyaa deemaa.',
      har: 'ሁለተኛ ወቅት (ወር 4-6)፦ የልጁ እንቅስቃሴ ይጀምራል፣ የአይረን መድሃኒት ይውሰዱ [HARARI_SLOT]',
    },
    3: {
      en: 'Final Moon Phase (Months 7-9): Pack birth bundle, save transport money, identify a companion.',
      am: 'የመጨረሻው የእርግዝና ወቅት (ወር 7-9)፦ የወሊድ እቃዎችን ያዘጋጁ፣ የትራንስፖርት ገንዘብ ያስቀምጡ፣ አብሮ የሚሄድ ሰው ይምረጡ።',
      om: 'Yeroo 3ffaa (Ji’a 7-9): Meeshaalee da’umsaa qopheessaa, qarshii geejibaa kaa’aa, nama waliin deemu filadhaa.',
      har: 'የመጨረሻ ወቅት (ወር 7-9)፦ የወሊድ እቃዎችን ያዘጋጁ [HARARI_SLOT]',
    },
  };

  return {
    trimester,
    milestone: milestones[trimester],
  };
}

/**
 * Session footprint wiper for shared phone privacy.
 */
export function wipeAllFootprints(): {
  activeMonth: null;
  kickCount: number;
  selectedSeedling: null;
  safeAdult: null;
  safePlace: null;
} {
  return {
    activeMonth: null,
    kickCount: 0,
    selectedSeedling: null,
    safeAdult: null,
    safePlace: null,
  };
}
