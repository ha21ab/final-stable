export type AppLanguage = 'am' | 'om' | 'en' | 'har';

export type ActiveServiceCategory = 'danger_signs' | 'family_planning' | null;

export type ToneProfileType =
  | 'URGENT_CALM'
  | 'CALM_GUIDE'
  | 'HUSHED_PRIVATE'
  | 'GENTLE_SUPPORT'
  | 'WARM_CELEBRATE';

export interface MultilingualText {
  en: string;
  am: string;
  om: string;
  har: string; // Placeholder slot for Harari (ጌይ ሲናን)
}

export type TriageSeverity = 'EMERGENCY' | 'URGENT' | 'MONITOR';

export type BodyZone =
  | 'head_eyes'
  | 'face_hands'
  | 'chest_breath'
  | 'womb_belly'
  | 'pelvis_waters'
  | 'whole_body';

export interface DangerSign {
  id: string;
  title: MultilingualText;
  description: MultilingualText;
  spokenAudio: MultilingualText;
  severity: TriageSeverity;
  category: 'trimester1' | 'trimester2_3' | 'labor_postpartum' | 'newborn';
  bodyZone?: BodyZone;
  actionInstruction: MultilingualText;
  badgeLabel: MultilingualText;
  iconName: string;
}

export interface ContraceptiveMethod {
  id: string;
  name: MultilingualText;
  categoryName: MultilingualText;
  shortDesc: MultilingualText;
  spokenAudio: MultilingualText;
  duration: MultilingualText;
  effectiveness: string;
  breastfeedingSafe: boolean;
  privacyLevel: 'high' | 'medium' | 'standard';
  type: 'implant' | 'injection' | 'iud' | 'pills' | 'emergency' | 'barrier' | 'natural' | 'permanent';
  howItWorks: MultilingualText;
  sideEffects: MultilingualText;
  returnToFertility: MultilingualText;
  clinicGuidance: MultilingualText;
}

export interface MythFact {
  id: string;
  topic: MultilingualText;
  myth: MultilingualText;
  fact: MultilingualText;
  spokenAudio: MultilingualText;
}

export interface MethodQuizOption {
  id: string;
  label: MultilingualText;
  sublabel: MultilingualText;
  icon?: string;
  recommendedMethods: string[];
}

export interface MethodQuizQuestion {
  id: string;
  question: MultilingualText;
  spokenPrompt: MultilingualText;
  options: MethodQuizOption[];
}

export interface ClinicRecord {
  id: string;
  name: MultilingualText;
  type: MultilingualText;
  region: string;
  city: string;
  phone: string;
  hours: MultilingualText;
  isEmergencyHotline?: boolean;
  verifiedPartner?: string;
  address?: string;
}

