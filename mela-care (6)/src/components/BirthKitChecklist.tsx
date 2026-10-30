import React, { useState, useEffect } from 'react';
import { AppLanguage } from '../types';
import { audioEngine } from '../utils/audio';
import {
  CheckCircle2,
  Circle,
  Volume2,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  PackageCheck,
  RotateCcw,
  Heart,
  AlertTriangle,
  Send,
  Share2,
  MapPin,
  Copy,
  Check,
} from 'lucide-react';
import birthKitImg from '../assets/images/ethiopian_birth_delivery_kit_1793105802113.jpg';
import { triggerHaptic } from '../utils/telegram';

interface BirthKitChecklistProps {
  lang: AppLanguage;
  onOpenDirectory?: () => void;
}

interface KitItem {
  id: string;
  icon: string;
  title: { en: string; am: string; om: string; har: string };
  reason: { en: string; am: string; om: string; har: string };
  spokenText: { en: string; am: string; om: string; har: string };
  isCritical: boolean;
}

export const BIRTH_KIT_ITEMS: KitItem[] = [
  {
    id: 'cord_blade_tie',
    icon: '✂️',
    title: {
      en: 'Clean Razor Blade & Sterile Cord Tie',
      am: 'አዲስ ንጹህ ምላጭ እና የጸዳ እትብት ማሰሪያ ክር',
      om: 'Haadduu Qulqulluu fi Fooya Ittisaa',
      har: 'አዲስ ምላጭ እና ንጹህ ክር',
    },
    reason: {
      en: 'Prevents neonatal tetanus and fatal newborn infections during umbilical cord cutting.',
      am: 'ጨቅላ ህፃኑ በቆሻሻ መሳሪያዎች አማካኝነት በሚመጣ የቴታነስ እና ደም ኢንፌክሽን እንዳይጠቃ ይከላከላል።',
      om: 'Daa’ima akka dhibee teetaanasiin hin qabamneef gargaara.',
      har: 'የልጁን ጤና ከኢንፌክሽን ለመጠበቅ',
    },
    spokenText: {
      en: 'Pack an unopened razor blade and sterile cotton thread. This protects your newborn baby from tetanus and infections when the cord is cut.',
      am: 'አዲስ ያልተከፈተ ምላጭ እና ንጹህ ጥጥ ክር ያዘጋጁ። ይህ የልጅዎን እትብት ሲቆረጥ ከቴታነስ በሽታ ይጠብቃል።',
      om: 'Haadduu haaraa fi fooya qulqulluu qopheessaa. Kun daa’ima keessan dhibee teetaanasiirraa eega.',
      har: 'አዲስ ምላጭ እና ክር ለህፃኑ ደህንነት ያዘጋጁ',
    },
    isCritical: true,
  },
  {
    id: 'swaddle_clothes',
    icon: '🧣',
    title: {
      en: 'Warm Baby Blanket & 2 Clean Clothes Sets',
      am: 'ሞቅ ያለ የአራስ አንሶላ (ብርድ ልብስ) እና 2 ንጹህ ልብሶች',
      om: 'Uffata Daa’imaa Ho’aa fi Uffata Qulqulluu 2',
      har: 'ሞቅ ያለ አንሶላ እና ንጹህ ልብስ',
    },
    reason: {
      en: 'Prevents hypothermia. Newborns lose body heat rapidly within the first 60 minutes after birth.',
      am: 'አራስ ልጅ ከተወለደ በደቂቃዎች ውስጥ ሰውነቱ ሊቀዘቅዝ ስለሚችል ሞቅ አድርጎ ለመሸፈን ይረዳል።',
      om: 'Daa’imni dhalatee battalumatti qorraan akka hin miidhamneef.',
      har: 'ህፃኑ እንዳይበርደው ሞቅ ያለ ጨርቅ',
    },
    spokenText: {
      en: 'Wrap your baby immediately in a clean, warm dry blanket. Newborns get cold very quickly in their first hour of life.',
      am: 'ህፃኑ እንደተወለደ ወዲያውኑ በደረቅና ሞቅ ባለ ጨርቅ ጠቅልሉት። ህፃናት በቶሎ ብርድ ያጠቃቸዋል።',
      om: 'Daa’imni akkuma dhalateen uffata ho’aa fi gogaadhaan haguugaa.',
      har: 'ህፃኑ እንደተወለደ በሞቀ ጨርቅ ይጠቅለል',
    },
    isCritical: true,
  },
  {
    id: 'soap_water_towel',
    icon: '🧼',
    title: {
      en: 'Personal Soap & Clean Towels',
      am: 'የገላ ሳሙና እና ንጹህ ፎጣዎች',
      om: 'Saamunaa fi Tuwweela Qulqulluu',
      har: 'ሳሙና እና ንጹህ ፎጣ',
    },
    reason: {
      en: 'Ensures provider and birth attendant hygiene, avoiding puerperal sepsis.',
      am: 'የወሊድ አጋዥ ባለሙያው እጁን ንጹህ አድርጎ እንዲታጠብ እና ኢንፌክሽን እንዳይከሰት ያደርጋል።',
      om: 'Ogeessi fayyaa harka dhiqatee qulqullinaan akka deggaruuf.',
      har: 'ለእጅ መታጠቢያ ሳሙና እና ፎጣ',
    },
    spokenText: {
      en: 'Keep clean soap and dry towels ready so the birth attendant can wash thoroughly before assisting delivery.',
      am: 'የሚያዋልድዎት ባለሙያ እጁን በደንብ ታጥቦ በንጽህና እንዲያዋልድዎ ሳሙና እና ደረቅ ፎጣ ያዘጋጁ።',
      om: 'Saamunaa fi tuwweela qulqulluu qopheessaa.',
      har: 'ንጹህ ሳሙና እና ፎጣ ያስፈልጋል',
    },
    isCritical: false,
  },
  {
    id: 'emergency_cash_transport',
    icon: '💵',
    title: {
      en: 'Emergency Transport Fund (Cash Reserved)',
      am: 'የአደጋ ጊዜ የትራንስፖርት ገንዘብ (የተቀመጠ ጥሬ ብር)',
      om: 'Maallaqa Geejjibaa Hatattamaa',
      har: 'የትራንስፖርት ገንዘብ',
    },
    reason: {
      en: 'Covers bajaj, ambulance fuel, or car hire without any delay when labor starts at night.',
      am: 'ምጥ በድንገት በሌሊት ሲመጣ ወይም አምቡላንስ ባልደረሰ ጊዜ ባጃጅ ወይም መኪና ለመከራየት እንዳይቸገሩ።',
      om: 'Yeroo ciniinsuun tasa dhufu geejjiba hatattamaaf akka hin rakkannne.',
      har: 'ለድንገተኛ ትራንስፖርት ገንዘብ',
    },
    spokenText: {
      en: 'Keep emergency transport cash inside your bag at all times. Do not spend it. You need it ready the moment labor begins.',
      am: 'የትራንስፖርት ገንዘብ ሁልጊዜ በቦርሳዎ ውስጥ ያስቀምጡ። ለሌላ ነገር አይጠቀሙበት፤ ምጥ ሲጀምር አፋጣኝ መጓጓዣ ያገኛሉ።',
      om: 'Maallaqa geejjibaa yeroo maraa boorsaa keessa kaa’aa. Ciniinsuun yeroo dhufu baay’ee isin barbaachisa.',
      har: 'የትራንስፖርት ገንዘብ አስቀድመው ያዘጋጁ',
    },
    isCritical: true,
  },
  {
    id: 'blood_donors_companion',
    icon: '🤝',
    title: {
      en: '2 Designated Blood Donors & Birth Escort',
      am: 'አብሮ የሚሄድ ሰው እና 2 አስቀድመው የተመረጡ የደም ለጋሾች',
      om: 'Namoota Dhiiga Arjooman 2 fi Nama Deggaru',
      har: 'አብሮ የሚሄድ ሰው እና የደም ለጋሾች',
    },
    reason: {
      en: 'Severe postpartum bleeding is unpredictable. Having identified donors in advance saves the mother’s life.',
      am: 'ከወሊድ በኋላ ድንገተኛ ከፍተኛ የደም መፍሰስ ቢያጋጥም ወዲያውኑ ደም የሚሰጡ ጤናማ ዘመዶችን አስቀድሞ መለየት ህይወትን ያድናል።',
      om: 'Dhiigni baay’ee yoo dhangala’e namoonni battalumatti dhiiga kennan qophaa’uu qabu.',
      har: 'የደም ለጋሾችን አስቀድመው ይወቁ',
    },
    spokenText: {
      en: 'Choose two healthy adult relatives who agree to donate blood if an emergency transfusion is needed during birth.',
      am: 'በወሊድ ጊዜ ያልተጠበቀ ደም መፍሰስ ቢያጋጥም ወዲያውኑ ደም ለመለገስ ፈቃደኛ የሆኑ ሁለት ጤናማ ሰዎችን አስቀድመው ይምረጡ።',
      om: 'Namoota fayyaaleeyyii lama kan yoo dhiigni dhangala’e arjooman dursitanii filadhaa.',
      har: 'ደም የሚለግሱ 2 ሰዎችን አስቀድመው ይምረጡ',
    },
    isCritical: true,
  },
  {
    id: 'phone_ambulance_hew',
    icon: '📞',
    title: {
      en: 'Phone with 907 & Health Extension Worker Number',
      am: 'የተሞላ ሞባይል፣ 907 እና የጤና ኤክስቴንሽን ባለሙያ ስልክ ቁጥር',
      om: 'Bilbila Guutame, 907 fi Bilbila Ogeessa Fayyaa',
      har: 'ስልክ እና የአምቡላንስ ቁጥር',
    },
    reason: {
      en: 'Ensures charged phone battery and emergency numbers are written down in case of dispatch.',
      am: 'የስልክ ቻርጅ እንዳያልቅ እና የጤና ባለሙያዋ ስልክ በወረቀት ላይ ተጽፎ ቦርሳው ውስጥ እንዲቀመጥ።',
      om: 'Bilbila chaarjii qabuu fi lakkoofsa ogeessa fayyaa dursitanii qabadhaa.',
      har: 'የአምቡላንስ ስልክ በወረቀት ይጻፍ',
    },
    spokenText: {
      en: 'Keep your mobile phone charged with airtime balance, and write down 907 and your local health post number on paper.',
      am: 'ስልክዎን ቻርጅ አድርገው ካርድ ይኑርዎት፤ 907 እና የጤና ኤክስቴንሽን ሰራተኛዋን ስልክ በወረቀት ጽፈው ቦርሳው ውስጥ ያስቀምጡ።',
      om: 'Bilbila keessan chaarjii guutaa; lakkoofsa 907 fi ogeessa fayyaa waraqaa irratti barreessaa.',
      har: 'ስልክዎን ቻርጅ አድርገው ያስቀምጡ',
    },
    isCritical: true,
  },
  {
    id: 'anc_yellow_card',
    icon: '📋',
    title: {
      en: 'Antenatal Mother Card (ANC Yellow Card)',
      am: 'የእርግዝና ክትትል ካርድ (የእናቶች ቢጫ ካርድ)',
      om: 'Kaardii Hordoffii Ulfaa (Kaardii Boora)',
      har: 'የክትትል ካርድ',
    },
    reason: {
      en: 'Allows hospital midwives to instantly know blood type, HIV status, blood pressure, and ultrasound history.',
      am: 'ሆስፒታል ሲደርሱ ሀኪሞቹ የእርስዎን የደም አይነት፣ የደም ግፊት እና የፅንስ ሁኔታ በቀላሉ ለማወቅ ይረዳቸዋል።',
      om: 'Ogeeyyiin gosa dhiigaa fi haala ulfaa keessanii battalumatti akka beekaniif.',
      har: 'የሆስፒታል ክትትል ካርድ',
    },
    spokenText: {
      en: 'Never leave home without your antenatal clinic card. It tells the doctors your blood group and medical history instantly.',
      am: 'የእርግዝና ክትትል ካርድዎን ሳይዙ በፍጹም ከቤት አይውጡ። ሀኪሞች የደም አይነትዎን እና የጤና ታሪክዎን በቀላሉ ያውቁበታል።',
      om: 'Kaardii hordoffii ulfaa keessan yeroo hundumaa boorsaa keessa kaa’aa.',
      har: 'የክትትል ካርድዎን ሁልጊዜ ይያዙ',
    },
    isCritical: true,
  },
];

export const BirthKitChecklist: React.FC<BirthKitChecklistProps> = ({
  lang,
  onOpenDirectory,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('mela_care_birth_kit');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeItem, setActiveItem] = useState<KitItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('mela_care_birth_kit', JSON.stringify(checkedItems));
    } catch {
      // storage unavailable
    }
  }, [checkedItems]);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleReset = () => {
    setCheckedItems({});
  };

  const totalCount = BIRTH_KIT_ITEMS.length;
  const completedCount = BIRTH_KIT_ITEMS.filter((item) => checkedItems[item.id]).length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const [bagLocation, setBagLocation] = useState<string>(() => {
    try {
      return localStorage.getItem('mela_care_bag_location') || '';
    } catch {
      return '';
    }
  });
  const [isEditingLocation, setIsEditingLocation] = useState<boolean>(false);
  const [customLocationInput, setCustomLocationInput] = useState<string>('');
  const [copiedSMS, setCopiedSMS] = useState<boolean>(false);

  const saveLocation = (loc: string) => {
    triggerHaptic('light');
    setBagLocation(loc);
    setIsEditingLocation(false);
    try {
      localStorage.setItem('mela_care_bag_location', loc);
    } catch {
      // storage unavailable
    }
  };

  const resolveItemText = (
    textObj: { en: string; am: string; om: string; har: string }
  ) => {
    return textObj[lang] || textObj.en;
  };

  const handleListenItem = (item: KitItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveItem(item);
    audioEngine.play(resolveItemText(item.spokenText), 'CALM_GUIDE', lang);
  };

  const missingItems = BIRTH_KIT_ITEMS.filter((item) => !checkedItems[item.id]);

  const generateShoppingMessage = () => {
    if (missingItems.length === 0) {
      return lang === 'am' || lang === 'har'
        ? 'ሰላም፣ የወሊድ ቦርሳ እቃዎች በሙሉ 100% ተሟልተው ተዘጋጅተዋል! (መላ ኬር - Mela Care)'
        : lang === 'om'
        ? 'Nagaa, meeshaaleen boorsaa da’umsaa hundi 100% guutuu ta’aniiru! (Mela Care)'
        : 'Hello, all birth delivery bag supplies are 100% packed and ready! (Mela Care)';
    }

    const header =
      lang === 'am' || lang === 'har'
        ? 'ሰላም፣ እባክህ ለወሊድ ቦርሳዬ የሚከተሉትን እቃዎች ከፋርማሲ/ሱቅ አምጣልኝ፦\n'
        : lang === 'om'
        ? 'Nagaa, maaloo wantoota boorsaa da’umsaa kana naaf fidi:\n'
        : 'Hello, please bring these remaining birth delivery items from the pharmacy:\n';

    const itemsText = missingItems
      .map((item, i) => `${i + 1}. ${resolveItemText(item.title)}`)
      .join('\n');

    const footer =
      lang === 'am' || lang === 'har'
        ? '\n\nአመሰግናለሁ! (መላ ኬር - Mela Care)'
        : lang === 'om'
        ? '\n\nGalatoomi! (Mela Care)'
        : '\n\nThank you! (Mela Care)';

    return header + itemsText + footer;
  };

  const handleCopyShoppingList = () => {
    triggerHaptic('success');
    const msg = generateShoppingMessage();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(msg);
      setCopiedSMS(true);
      setTimeout(() => setCopiedSMS(false), 2500);
    }
  };

  const smsUrl = `sms:?body=${encodeURIComponent(generateShoppingMessage())}`;

  const locationPresets = [
    { key: 'bed', en: 'Under bedroom bed', am: 'ከመኝታ አልጋ ስር', om: 'Siren jala' },
    { key: 'door', en: 'Next to front door', am: 'ዋናው በር አጠገብ', om: 'Balbala dura' },
    { key: 'closet', en: 'In clothes closet', am: 'ቁም ሳጥን ውስጥ', om: 'Saanduqa keessa' },
    { key: 'bag', en: 'In travel suitcase', am: 'በጉዞ ሻንጣ ውስጥ', om: 'Boorsaa keessa' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in pb-8">
      {/* Visual Hero Card with Generated Delivery Kit Artwork */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-[#881337] to-[#4A0420] text-white shadow-xl shadow-[#881337]/15 border border-[#FBCFE8]/30">
        <div className="relative h-48 sm:h-56 w-full overflow-hidden">
          <img
            src={birthKitImg}
            alt="Ethiopian Maternal Delivery Preparedness Kit"
            className="w-full h-full object-cover object-center brightness-95 hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4A0420] via-[#4A0420]/40 to-transparent" />
          <div className="absolute top-3 right-3 bg-[#881337]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] font-bold text-rose-200 flex items-center gap-1.5">
            <PackageCheck className="w-3.5 h-3.5 text-[#E11D48]" />
            <span>FMOH Safe Motherhood Kit</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-3.5 -mt-6 relative z-10">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
              {lang === 'am'
                ? 'የወሊድ ዝግጅት ቦርሳ እና እቅድ'
                : lang === 'om'
                ? 'Qophii Boorsaa Deessummaa fi Karoora'
                : 'Maternal Birth Preparedness Kit'}
            </h2>
            <p className="text-xs sm:text-sm text-rose-100 font-medium leading-relaxed">
              {lang === 'am'
                ? 'ምጥ ከመጀመሩ በፊት የሚዘጋጁ 7 የህይወት አድን ቁሳቁሶች። እያንዳንዱን ቁሳቁስ በድምፅ ያዳምጡና በቦርሳዎ ሲያስቀምጡ ምልክት ያድርጉበት።'
                : lang === 'om'
                ? 'Meeshaalee 7 lubbuu baraaran kanneen ciniinsuun dura qophaa’uu qaban. Sagaleen dhaggeeffadhaa.'
                : 'The 7 vital items recommended by health extension workers to prevent fatal childbirth delays and infections.'}
            </p>
          </div>

          {/* Progress Bar Meter */}
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-rose-100">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#F43F5E]" />
                <span>
                  {lang === 'am'
                    ? `የቦርሳው ዝግጅት፦ ${completedCount} ከ ${totalCount} ተሟልቷል`
                    : lang === 'om'
                    ? `Qophii Boorsaa: ${completedCount} keessaa ${totalCount}`
                    : `Kit Readiness: ${completedCount} of ${totalCount} packed`}
                </span>
              </span>
              <span className="font-black text-sm text-white">{progressPercent}%</span>
            </div>
            <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#E11D48] to-[#FB7185] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {progressPercent === 100 && (
              <div className="text-[11px] font-bold text-emerald-300 flex items-center gap-1 pt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {lang === 'am'
                    ? 'እንኳን ደስ አለዎት! የወሊድ ቦርሳዎ ሙሉ በሙሉ ተዘጋጅቷል!'
                    : lang === 'om'
                    ? 'Baga gammaddan! Boorsaan keessan guutuu ta’eera!'
                    : 'All set! Your birth preparedness bag is fully packed and ready!'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-Life Problem Solver 1: Home Location of the Bag */}
      <div className="bg-white border border-[#FBCFE8] rounded-[2rem] p-4 shadow-xs space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-[#881337] shrink-0">
              <MapPin className="w-4 h-4 text-[#E11D48]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-[#4A0420]">
                {lang === 'am' || lang === 'har'
                  ? 'የቦርሳው መገኛ በቤት ውስጥ'
                  : lang === 'om'
                  ? 'Bakka Boorsaan Manatti Jiru'
                  : 'Bag Location at Home'}
              </h4>
              <p className="text-[11px] text-[#783A4E]">
                {lang === 'am' || lang === 'har'
                  ? 'ምጥ ሲጀምር ቤተሰብ በ5 ሰከንድ ውስጥ እንዲያገኘው'
                  : lang === 'om'
                  ? 'Ciniinsuun yoo dhufe sekondii 5 keessatti akka argamu'
                  : 'So family or neighbors can grab it in 5 seconds in labor'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingLocation(!isEditingLocation)}
            className="text-[11px] font-bold text-[#881337] hover:underline shrink-0"
          >
            {bagLocation ? (lang === 'am' ? 'ቀይር' : lang === 'om' ? 'Jijjiiri' : 'Change') : (lang === 'am' ? 'መዝግብ' : lang === 'om' ? 'Galmeessi' : 'Set')}
          </button>
        </div>

        {bagLocation && !isEditingLocation ? (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2">
            <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
              <span>📍</span>
              <span>{bagLocation}</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
              {lang === 'am' ? 'ተመዝግቧል' : lang === 'om' ? 'Galmaa’eera' : 'Saved'}
            </span>
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-1.5">
              {locationPresets.map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => saveLocation(preset[lang as 'am' | 'om'] || preset.en)}
                  className="p-2 rounded-xl bg-[#FFF5F7] hover:bg-[#FFE4E6] border border-[#FBCFE8] text-xs font-bold text-[#4A0420] text-left transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <MapPin className="w-3 h-3 text-[#E11D48] shrink-0" />
                  <span className="truncate">{preset[lang as 'am' | 'om'] || preset.en}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder={lang === 'am' ? 'ወይም እዚህ ጽፈው ይዝጉ (ምሳሌ፦ ሳሎን ቁም ሳጥን)...' : 'Or type custom location...'}
                value={customLocationInput}
                onChange={(e) => setCustomLocationInput(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#FBCFE8] focus:outline-none focus:ring-1 focus:ring-[#881337]"
              />
              <button
                type="button"
                onClick={() => {
                  if (customLocationInput.trim()) {
                    saveLocation(customLocationInput.trim());
                    setCustomLocationInput('');
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-[#881337] text-white text-xs font-bold active:scale-95"
              >
                {lang === 'am' ? 'አስቀምጥ' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Real-Life Problem Solver 2: Husband / Family Shopping List Dispatcher */}
      <div className="bg-gradient-to-r from-[#FFF5F7] to-[#FFE4E6] border border-[#FBCFE8] rounded-[2rem] p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#881337] shadow-xs shrink-0">
              <Share2 className="w-4 h-4 text-[#E11D48]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-[#4A0420]">
                {lang === 'am' || lang === 'har'
                  ? 'የቀሩ እቃዎችን ለባል/ቤተሰብ ላክ (SMS)'
                  : lang === 'om'
                  ? 'Meeshaalee Hafan Abbaa Manaaf Ergaa'
                  : 'Send Shopping List to Husband / Family'}
              </h4>
              <p className="text-[11px] text-[#783A4E]">
                {missingItems.length > 0
                  ? lang === 'am'
                    ? `${missingItems.length} ያልተገዙ እቃዎች በ1 ንክኪ ወደ ስልክ መልዕክት ይዘጋጃሉ`
                    : lang === 'om'
                    ? `Meeshaalee ${missingItems.length} hafan battalumatti SMS ta’anii qophaa’u`
                    : `${missingItems.length} pending items formatted into ready SMS message`
                  : lang === 'am'
                  ? 'ሁሉም እቃዎች ተሟልተዋል! ደስ የሚል የምስራች ላኩ'
                  : 'All items packed! Ready to send celebration update'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <a
            href={smsUrl}
            onClick={() => triggerHaptic('medium')}
            className="flex-1 min-w-[140px] py-2.5 px-3 rounded-xl bg-[#881337] hover:bg-[#701A75] text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {lang === 'am' || lang === 'har'
                ? 'በSMS ወዲያውኑ ላክ'
                : lang === 'om'
                ? 'SMS Ergaa'
                : 'Send via SMS'}
            </span>
          </a>

          <button
            type="button"
            onClick={handleCopyShoppingList}
            className="py-2.5 px-3 rounded-xl bg-white hover:bg-rose-50 text-[#881337] border border-[#FBCFE8] font-black text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            {copiedSMS ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">{lang === 'am' ? 'ተቀድቷል!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>{lang === 'am' ? 'ዝርዝሩን ቅዳ' : lang === 'om' ? 'Waraabbadhaa' : 'Copy Text'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Item Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-wider text-[#881337]">
            {lang === 'am' ? 'የቦርሳው ዝርዝር ቁሳቁሶች' : lang === 'om' ? 'Meeshaalee Boorsichaa' : 'Checklist Items'}
          </span>
          {completedCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] font-bold text-[#E11D48] hover:text-[#BE123C] flex items-center gap-1.5 transition-all active:scale-95"
            >
              <RotateCcw className="w-3 h-3" />
              <span>
                {lang === 'am' ? 'እንደገና ጀምር' : lang === 'om' ? 'Irra Deebi’aa' : 'Reset'}
              </span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {BIRTH_KIT_ITEMS.map((item, idx) => {
            const isDone = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-4 rounded-3xl border transition-all duration-200 cursor-pointer select-none flex items-start gap-3.5 ${
                  isDone
                    ? 'bg-rose-50/80 border-rose-200 text-[#4A0420]'
                    : 'bg-white border-[#FBCFE8] hover:border-[#F43F5E]/60 shadow-xs'
                }`}
              >
                {/* Checkbox Icon */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCheck(item.id);
                  }}
                  className="mt-0.5 text-[#E11D48] hover:scale-110 transition-transform focus:outline-none shrink-0"
                  aria-label={isDone ? 'Mark as unpacked' : 'Mark as packed'}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 fill-[#E11D48] text-white" />
                  ) : (
                    <Circle className="w-6 h-6 text-[#F43F5E]" />
                  )}
                </button>

                {/* Text & Icon Content */}
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg shrink-0">{item.icon}</span>
                      <h3
                        className={`text-sm sm:text-base font-bold leading-tight truncate ${
                          isDone ? 'line-through text-[#783A4E]' : 'text-[#4A0420]'
                        }`}
                      >
                        {resolveItemText(item.title)}
                      </h3>
                    </div>

                    {item.isCritical && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-[#991B1B] border border-red-200 shrink-0">
                        {lang === 'am' ? 'አስገዳጅ' : lang === 'om' ? 'Murteessaa' : 'Critical'}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#783A4E] leading-relaxed line-clamp-2">
                    {resolveItemText(item.reason)}
                  </p>

                  {/* Spoken Audio Readout Trigger */}
                  <div className="pt-1.5 flex items-center justify-between gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => handleListenItem(item, e)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFF5F7] hover:bg-[#FFE4E6] border border-[#FBCFE8] text-[11px] font-bold text-[#881337] transition-all active:scale-95 shrink-0 max-w-[70%] overflow-hidden"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#E11D48] shrink-0" />
                      <span className="truncate">
                        {lang === 'am' || lang === 'har'
                          ? 'በድምፅ አዳምጥ'
                          : lang === 'om'
                          ? 'Dhaggeeffadhaa'
                          : 'Listen'}
                      </span>
                    </button>

                    <span className="text-[10px] font-semibold text-[#9D174D]/70 shrink-0">
                      {idx + 1} / {totalCount}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Assurance Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-red-600 to-[#DC2626] text-white shadow-md flex items-center justify-between gap-3">
        <div className="space-y-0.5 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-red-200 block">
            {lang === 'am'
              ? 'የአምቡላንስ ድንገተኛ ጥሪ'
              : lang === 'om'
              ? 'Waamicha Hatattamaa Ambulaansii'
              : 'National Ambulance Dispatch'}
          </span>
          <p className="text-sm font-black truncate">
            {lang === 'am'
              ? 'ምጥ በድንገት ሲጀምር በ907 ይደውሉ'
              : lang === 'om'
              ? 'Ciniinsuun yoo dhufe 907 bilbilaa'
              : 'Call 907 Free Toll Hotline'}
          </p>
        </div>
        <a
          href="tel:907"
          className="px-4 py-2.5 rounded-2xl bg-white text-[#DC2626] font-black text-xs flex items-center gap-1.5 shadow-sm hover:bg-red-50 active:scale-95 transition-all shrink-0"
        >
          <PhoneCall className="w-4 h-4 fill-[#DC2626]" />
          <span>{lang === 'am' ? '907 ደውል' : lang === 'om' ? '907 Bilbilaa' : '907 Call'}</span>
        </a>
      </div>
    </div>
  );
};
