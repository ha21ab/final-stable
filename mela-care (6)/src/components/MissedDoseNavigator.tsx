import React, { useState } from 'react';
import { AppLanguage } from '../types';
import { audioEngine } from '../utils/audio';
import { triggerHaptic } from '../utils/telegram';
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Volume2,
  HelpCircle,
  Calendar,
  Sparkles,
  PhoneCall,
  ArrowRight,
} from 'lucide-react';

interface MissedDoseNavigatorProps {
  lang: AppLanguage;
  onOpenDirectory?: () => void;
}

type ScenarioType = 'missed_1_pill' | 'missed_2_pills' | 'late_depo' | 'emergency_window';

export const MissedDoseNavigator: React.FC<MissedDoseNavigatorProps> = ({
  lang,
  onOpenDirectory,
}) => {
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('missed_1_pill');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const scenarioContent: Record<
    ScenarioType,
    {
      title: { en: string; am: string; om: string; har: string };
      tagline: { en: string; am: string; om: string; har: string };
      urgency: 'safe_action' | 'caution_backup' | 'time_critical';
      verdictTitle: { en: string; am: string; om: string; har: string };
      steps: { en: string; am: string; om: string; har: string }[];
      audioSpeech: { en: string; am: string; om: string; har: string };
      goldenRule: { en: string; am: string; om: string; har: string };
    }
  > = {
    missed_1_pill: {
      title: {
        en: 'Missed 1 Daily Oral Pill (<24-48 Hours)',
        am: '1 የቀን የእርግዝና መከላከያ እንክብል አምልጦኛል',
        om: 'Qoricha Guyyaa 1 Irraanfadhe (<Sa’aatii 48)',
        har: '1 የእርግዝና እንክብል አምልጦኛል',
      },
      tagline: {
        en: 'Forgotten yesterday’s pill or taken late today',
        am: 'የትናንቱን እንክብል ረስተውት ወይም የዛሬው ሰዓት አልፎበታል',
        om: 'Qoricha kaleessaa irraanfattanii ykn har’a sa’aatiin darbe',
        har: 'እንክብል የረሱበት ሁኔታ',
      },
      urgency: 'safe_action',
      verdictTitle: {
        en: 'Low Pregnancy Risk — Take Action Immediately',
        am: 'የማርገዝ እድሉ ዝቅተኛ ነው — አትደንግጡ! ወዲያውኑ ይውሰዱ',
        om: 'Carraan Ulfaa Gadi Aanaadha — Hin Na’inaa! Battalumatti Fudhadhaa',
        har: 'አትደንግጡ — ወዲያውኑ ውሰዱ',
      },
      steps: [
        {
          en: '1. Take the missed pill right NOW as soon as you remember.',
          am: '1. እንዳስታወሱ ወዲያውኑ አሁንኑ ያመለጠዎትን 1 እንክብል ይውሰዱ።',
          om: '1. Akkuma yaadattaniin qoricha isinirra darbe AMMUMA fudhadhaa.',
          har: '1. እንዳስታወሱ አሁንኑ 1 እንክብል ይውሰዱ።',
        },
        {
          en: '2. Take your regular scheduled pill at the normal time (even if it means 2 pills in one day).',
          am: '2. የዛሬውን መደበኛ እንክብል በተለመደው ሰዓት ይውሰዱ (በአንድ ቀን ሁለት እንክብል መውሰድ ቢሆንም እንኳን ምንም ችግር የለውም)።',
          om: '2. Qoricha har’aa sa’aatii barametti fudhadhaa (guyyaa tokkotti qoricha 2 ta’us rakkoo hin qabu).',
          har: '2. የዛሬውን በመደበኛው ሰዓት ይውሰዱ።',
        },
        {
          en: '3. Continue the rest of the blister pack daily as usual.',
          am: '3. ቀሪውን ፓኬት በየቀኑ በተለመደው ሰዓትዎ መውሰድዎን ይቀጥሉ።',
          om: '3. Qorichoota hafan guyyaa guyyaan sa’aatii isaatti fudhachuu itti fufaa.',
          har: '3. የቀረውን ፓኬት በቀን በቀን ይቀጥሉ።',
        },
        {
          en: '4. Backup contraception (condom) is generally NOT required unless over 48 hours late.',
          am: '4. ከ48 ሰዓት ካላለፈ ተጨማሪ ኮንዶም አያስፈልግዎትም፤ እርግዝናን በበቂ ሁኔታ ይከላከላል።',
          om: '4. Sa’aatii 48 ol yoo hin taane kondomiin dabalataa hin barbaachisu.',
          har: '4. ተጨማሪ ጥንቃቄ አያስፈልግም።',
        },
      ],
      goldenRule: {
        en: 'Taking two pills on the same day is completely medically safe and recommended by WHO & Ministry of Health.',
        am: 'በአንድ ቀን ሁለት እንክብል መውሰድ ሙሉ በሙሉ በህክምና ደህንነቱ የተጠበቀ እና በጤና ጥበቃ ሚኒስቴር የሚመከር ነው።',
        om: 'Guyyaa tokkotti qoricha lama fudhachuun fayyaaf balaa hin qabu, Ministeera Fayyaanis ni hayyamama.',
        har: 'በአንድ ቀን ሁለት መውሰድ ደህንነቱ የተጠበቀ ነው።',
      },
      audioSpeech: {
        en: 'If you missed one birth control pill, do not panic. Take the forgotten pill right now, and take your next pill at your normal time today, even if that means two pills today. Continue your pack normally.',
        am: 'አንድ የእርግዝና መከላከያ እንክብል ካመለጠዎት አትደንግጡ። እንዳስታወሱ አሁንኑ ያመለጠዎትን እንክብል ይውሰዱ፤ የዛሬውንም በመደበኛው ሰዓት ይውሰዱ። በአንድ ቀን ሁለት ቢሆንም ምንም ችግር የለውም።',
        om: 'Qoricha guyyaa tokkoo yoo irraanfattan hin sodaatinaa. Qoricha irraanfattan ammuma fudhadhaa, kan har’aas sa’aatii isaatti fudhadhaa. Guyyaa tokkotti lama ta’us balaa hin qabu.',
        har: 'አንድ እንክብል ካመለጠዎት አሁንኑ ይውሰዱ። የዛሬውንም በሰዓቱ ይውሰዱ። ምንም አያስፈራም።',
      },
    },

    missed_2_pills: {
      title: {
        en: 'Missed 2 or More Daily Pills (≥48 Hours)',
        am: '2 እና ከዚያ በላይ እንክብሎች አምልጠውኛል (ከ48 ሰዓት በላይ)',
        om: 'Qoricha Guyyaa 2 fi Isaa Ol Irraanfadhe (≥Sa’aatii 48)',
        har: '2 እና በላይ እንክብል አምልጦኛል',
      },
      tagline: {
        en: '2 or more pills missed in a row — protective hormone dropped',
        am: 'ሁለት ተከታታይ ቀናት መውሰድ ተረስተዋል — ጥንቃቄ ያስፈልጋል',
        om: 'Guyyoota lamaa fi isaa oliif qoricha fudhachuu dhiistanii',
        har: 'ሁለት ቀን እንክብል መውሰድ ተረስተዋል',
      },
      urgency: 'caution_backup',
      verdictTitle: {
        en: 'Backup Protection Required for 7 Days',
        am: 'ለቀጣዮቹ 7 ቀናት ተጨማሪ ኮንዶም ወይም ጥንቃቄ ያስፈልጋል!',
        om: 'Guyyoota 7 Itti Aanuuf Eegumsa Dabalataa (Kondomii) Fayyadamaa!',
        har: 'ለ7 ቀናት ኮንዶም ወይም ጥንቃቄ ይጠቀሙ!',
      },
      steps: [
        {
          en: '1. Take the most recent missed pill NOW. Discard any previously missed pills.',
          am: '1. በጣም የቅርቡን ያለፈውን 1 እንክብል አሁንኑ ይውሰዱ። የቀደሙትን ሌሎች ያለፉትን እንክብሎች ያስወግዱ።',
          om: '1. Qoricha dhiyeenya irraanfattan AMMA fudhadhaa. Kanneen biroo darbanii gatadhaa.',
          har: '1. የቅርቡን እንክብል አሁንኑ ይውሰዱ።',
        },
        {
          en: '2. Continue taking your pills 1 per day at your regular time until the pack is finished.',
          am: '2. ቀሪዎቹን እንክብሎች በቀን አንድ አንድ እያደረጉ በመደበኛው ሰዓት እስከ መጨረሻው ይውሰዱ።',
          om: '2. Qorichoota hafan guyyaatti tokko tokkoon sa’aatii barametti itti fufaa.',
          har: '2. ቀሪውን በቀን አንድ አንድ ይቀጥሉ።',
        },
        {
          en: '3. MUST use condoms or abstain from intercourse for the next 7 consecutive days.',
          am: '3. ግዴታ፦ ለቀጣዮቹ 7 ተከታታይ ቀናት ግንኙነት ሲያደርጉ ኮንዶም ይጠቀሙ ወይም ግንኙነት አይፈጽሙ።',
          om: '3. DIRQAMA: Guyyoota 7 itti aananiif walqunnamtii saalaa yeroo gootan kondomii fayyadamaa.',
          har: '3. ለ7 ቀናት ኮንዶም ይጠቀሙ።',
        },
        {
          en: '4. If unprotected sex happened in the last 5 days: Consider taking emergency contraceptive (Postinor-2).',
          am: '4. ባለፉት 5 ቀናት ውስጥ ጥንቃቄ የጎደለው ግንኙነት ተፈጽሞ ከነበረ፦ የድንገተኛ 72 ሰዓት እንክብል (ፖስቲኖር) ይውሰዱ።',
          om: '4. Guyyoota 5 darban keessa walqunnamtiin of eeggannoo hin qabne yoo jiraate: Qoricha hatattamaa fudhadhaa.',
          har: '4. በቅርብ ግንኙነት ከነበረ ድንገተኛ እንክብል ይውሰዱ።',
        },
      ],
      goldenRule: {
        en: 'The 7-Day Rule: It takes 7 consecutive days of daily pills for the ovaries to be fully blocked again.',
        am: 'የ7 ቀን መርህ፦ እንቁላል ማመንጨት ሙሉ በሙሉ እንደገና እስኪቆም ድረስ 7 ተከታታይ ቀናት መውሰድ ያስፈልጋል።',
        om: 'Seera Guyyaa 7: Hanqaaxilli akka hin gadhiifamneef guyyoota 7 walitti aansuun qoricha fudhachuun barbaachisaadha.',
        har: 'የ7 ቀን ህግ፦ ለ7 ቀናት ተጨማሪ ጥንቃቄ ያድርጉ።',
      },
      audioSpeech: {
        en: 'Because two or more pills were missed, take the latest missed pill right now and discard earlier missed pills. Continue one pill a day, but you must use a condom or abstain for the next 7 days.',
        am: 'ሁለት እና ከዚያ በላይ እንክብል ካመለጠዎት፣ የቅርቡን አሁንኑ ይውሰዱ። ቀሪውን በቀን አንድ አንድ ይቀጥሉ። ነገር ግን ለሚቀጥሉት 7 ቀናት የግድ ተጨማሪ ኮንዶም መጠቀም አለብዎት።',
        om: 'Qorichi lamaa fi isaa ol yoo irraanfatame, isa dhiyeenyaa amma fudhadhaa. Kanneen biroo gatadhaa. Garuu guyyoota torba dhufaniif dirqama kondomii fayyadamuu qabdu.',
        har: 'ሁለት እንክብል ካመለጠዎት አንዱን አሁን ይውሰዱ። ለ7 ቀናት ግን የግድ ኮንዶም ይጠቀሙ።',
      },
    },

    late_depo: {
      title: {
        en: 'Late for 3-Month Depo Injection (Grace Period)',
        am: 'የ3 ወር መርፌዬ ቀን አልፎበታል (የምህረት ጊዜ)',
        om: 'Lilmoo Ji’a 3 Guyyaan Darbe (Yeroo Dhiifamaa)',
        har: 'የ3 ወር መርፌ ቀን አልፎበታል',
      },
      tagline: {
        en: 'Missed your 12-week Depo-Provera appointment',
        am: 'መርፌ የሚወጉበት የ12 ሳምንት ቀጠሮ አልፎብዎታል',
        om: 'Beellamni lilmoo dippoo torbee 12 isin jalaa darbe',
        har: 'የመርፌ ቀጠሮ ማለፍ',
      },
      urgency: 'caution_backup',
      verdictTitle: {
        en: '4-Week Safe Grace Period Recognized by WHO/MoH',
        am: 'የ4 ሳምንት የምህረት ጊዜ አለዎት (በጤና ጥበቃ ሚኒስቴር የተፈቀደ)',
        om: 'Yeroo Dhiifamaa Torbee 4 Qabdu (Heeyyama Ministeera Fayyaa)',
        har: 'የ4 ሳምንት የምህረት ጊዜ አለዎት',
      },
      steps: [
        {
          en: '1. Up to 4 weeks late (up to 15-16 weeks since last shot): You can still receive your injection right away!',
          am: '1. ቀጠሮው ካለፈበት እስከ 4 ሳምንታት ድረስ (ከመጨረሻው መርፌ 16 ሳምንት)፦ ያለ ምንም ምርመራ ዛሬውኑ መርፌውን መወጋት ይችላሉ!',
          om: '1. Beellama irraa hanga torbee 4tti: Qorannoo dabalataa malee har’uma lilmoo keessan fudhachuu dandeessu!',
          har: '1. እስከ 4 ሳምንት ድረስ ዛሬውኑ መወጋት ይችላሉ።',
        },
        {
          en: '2. No pregnancy test is needed if you are reasonably certain you are not pregnant.',
          am: '2. እርጉዝ እንዳልሆኑ እርግጠኛ ከሆኑ ተጨማሪ የእርግዝና ምርመራ አያስፈልግዎትም።',
          om: '2. Ulfa akka hin taane yoo beektan qorannoon ulfaa hin barbaachisu.',
          har: '2. የእርግዝና ምርመራ አያስፈልግም።',
        },
        {
          en: '3. More than 4 weeks late: Use condoms immediately until you visit your health post/clinic.',
          am: '3. ከቀጠሮው ከ4 ሳምንት በላይ ካለፈ፦ ወዲያውኑ ኮንዶም ይጠቀሙ እና ክሊኒክ ሄደው ቀላል የእርግዝና ምርመራ ያድርጉ።',
          om: '3. Torbee 4 ol yoo darbe: Battalumatti kondomii fayyadamaa, buufata fayyaa deemtanii qoradhaa.',
          har: '3. ከ4 ሳምንት በላይ ከሆነ ኮንዶም ይጠቀሙ እና ክሊኒክ ይሂዱ።',
        },
        {
          en: '4. After reinjection when late, use backup condoms for the next 7 days.',
          am: '4. መርፌውን ከተወጉ በኋላ ለመጀመሪያዎቹ 7 ቀናት ተጨማሪ ኮንዶም መጠቀም ይመረጣል።',
          om: '4. Lilmoo erga fudhattanii booda guyyoota 7 duraaf kondomii fayyadamaa.',
          har: '4. ከተወጉ በኋላ ለ7 ቀናት ኮንዶም ይጠቀሙ።',
        },
      ],
      goldenRule: {
        en: 'Depo-Provera does not instantly stop working at exactly 12 weeks. The WHO grace window protects you for up to 4 additional weeks.',
        am: 'የ3 ወሩ መርፌ በ12ኛው ሳምንት ድንገት አይቆምም። የዓለም ጤና ድርጅት የ4 ሳምንታት ተጨማሪ የምህረት ጊዜ ይሰጣል።',
        om: 'Lilmoon ji’a 3 torbee 12ffaa irratti battalumatti hin dhaabbatu. Yeroo dhiifamaa torbee 4 dabalataa qaba.',
        har: 'መርፌው የ4 ሳምንት ተጨማሪ ጊዜ አለው።',
      },
      audioSpeech: {
        en: 'If your three month injection date passed, do not worry. You have a four week grace period where you can still receive your injection immediately without penalty. Go to your local health post today.',
        am: 'የሶስት ወሩ መርፌ ቀጠሮ ካለፈብዎ አትጨነቁ። እስከ አራት ሳምንት ድረስ ተጨማሪ የምህረት ጊዜ ስላለዎት ዛሬውኑ ወደ ጤና ኬላ ወይም ክሊኒክ ሄደው መወጋት ይችላሉ።',
        om: 'Beellamni lilmoo ji’a sadii yoo isin jalaa darbe hin yaadda’inaa. Torbee afuriif yeroo dhiifamaa waan qabdaniif har’uma buufata fayyaa deemtanii fudhadhaa.',
        har: 'የመርፌው ቀን ቢያልፍም እስከ 4 ሳምንት ጊዜ አለዎት። ዛሬውኑ ክሊኒክ ሄደው ይወጉ።',
      },
    },

    emergency_window: {
      title: {
        en: 'Emergency Post-Pill Window (Within 72 Hours)',
        am: 'የድንገተኛ 72 ሰዓት እንክብል (ፖስቲኖር / ፕላን ቢ)',
        om: 'Qoricha Hatattamaa Sa’aatii 72 (Postinor-2)',
        har: 'የድንገተኛ እንክብል',
      },
      tagline: {
        en: 'Unprotected intercourse or broken condom emergency',
        am: 'ያልታሰበ ጥንቃቄ የጎደለው ግንኙነት ወይም ኮንዶም ሲቀደድ',
        om: 'Walqunnamtii of eeggannoo hin qabne ykn kondomiin dhohe',
        har: 'ጥንቃቄ ያልተደረገበት ግንኙነት',
      },
      urgency: 'time_critical',
      verdictTitle: {
        en: 'Time-Critical: The Sooner You Take It, The Better',
        am: 'ጊዜ ወሳኝ ነው፦ በቶሎ በወሰዱ ቁጥር ውጤታማነቱ ይጨምራል!',
        om: 'Yeroon Murteessaadha: Ariitiin Yoo Fudhattan Caalaatti Hojjeta!',
        har: 'ቶሎ በወሰዱ ቁጥር ውጤታማነቱ ከፍ ይላል!',
      },
      steps: [
        {
          en: '1. Take within 24 hours: 95% effective at preventing pregnancy.',
          am: '1. በመጀመሪያዎቹ 24 ሰዓታት ውስጥ ከወሰዱ፦ የመከላከል አቅሙ 95% ፍጹም ነው።',
          om: '1. Sa’aatii 24 keessatti: Dhibbeentaa 95 ulfa ittisa.',
          har: '1. በ24 ሰዓት ውስጥ 95% ውጤታማ ነው።',
        },
        {
          en: '2. Take between 24-72 hours: 85% effective. Still take it immediately!',
          am: '2. ከ24 እስከ 72 ሰዓታት ውስጥ ከወሰዱ፦ ውጤታማነቱ 85% ነው። አሁኑኑ ይውሰዱት!',
          om: '2. Sa’aatii 24-72 gidduutti: Dhibbeentaa 85 ulfa ittisa. Ammuma fudhadhaa!',
          har: '2. እስከ 72 ሰዓት ድረስ 85% ይሰራል፤ አሁንኑ ይውሰዱ።',
        },
        {
          en: '3. Available without prescription at any pharmacy or health post in Ethiopia.',
          am: '3. በየትኛውም የኢትዮጵያ ፋርማሲ ወይም ጤና ጣቢያ ያለ ሀኪም ማዘዣ በቀላሉ ይገኛል።',
          om: '3. Faarmasii fi buufataalee fayyaa Itoophiyaa hunda keessatti ajaja doktoraa malee ni argama.',
          har: '3. በየትኛውም ፋርማሲ ያለ ማዘዣ ይገኛል።',
        },
        {
          en: '4. Note: This is an emergency measure, NOT for regular monthly family planning.',
          am: '4. ማሳሰቢያ፦ ይህ ለድንገተኛ ጊዜ ብቻ እንጂ ለወርሃዊ ቋሚ መከላከያነት አይውልም።',
          om: '4. Hubachiisa: Kun kan yeroo hatattamaa qofa malee itti fayyadama yeroo maraa miti.',
          har: '4. ለድንገተኛ ብቻ ነው፤ ለቋሚነት አይሆንም።',
        },
      ],
      goldenRule: {
        en: 'Emergency pills do NOT cause abortion. They prevent or delay ovulation before pregnancy occurs.',
        am: 'የድንገተኛ እንክብሎች ፅንስ አያስወርዱም። እርግዝና ሳይፈጠር በፊት እንቁላል እንዳይወጣ በማዘግየት ነው የሚከላከሉት።',
        om: 'Qorichi hatattamaa ulfa hin baasu. Osoo ulfi hin uumamin dura hanqaaxilli akka hin gadhiifamne taasisa.',
        har: 'ይህ እንክብል ፅንስ አያስወርድም፤ እርግዝና ሳይፈጠር ይከላከላል።',
      },
      audioSpeech: {
        en: 'The emergency pill must be taken as soon as possible, ideally within 24 hours and up to 72 hours after unprotected sex. It does not cause abortion; it simply stops the egg from being released. Visit any pharmacy today.',
        am: 'የድንገተኛ እርግዝና መከላከያ እንክብል በተቻለ ፍጥነት መወሰድ አለበት፤ በተለይ በ24 ሰዓት ውስጥ እስከ 72 ሰዓት። ይህ ፅንስ አያስወርድም፤ እርግዝና እንዳይፈጠር እንቁላል እንዳይወጣ ያዘገያል። ዛሬውኑ በአቅራቢያዎ ካለ ፋርማሲ ያግኙት።',
        om: 'Qoricha hatattamaa sa’aatii 24 hanga 72 keessatti ariitiin fudhachuun barbaachisaadha. Ulfa hin baasu, hanqaaxila qofa ittisa. Faarmasii dhiyeenya keessanii har’uma argadhaa.',
        har: 'የድንገተኛ እንክብሉን እስከ 72 ሰዓት ድረስ ይውሰዱ። ፅንስ አያስወርድም፤ እርግዝና እንዳይፈጠር ይረዳል።',
      },
    },
  };

  const current = scenarioContent[activeScenario];

  const handleSelectScenario = (key: ScenarioType) => {
    triggerHaptic('light');
    setActiveScenario(key);
    audioEngine.stop();
    setIsPlayingAudio(false);
  };

  const handlePlayVoice = () => {
    triggerHaptic('medium');
    if (isPlayingAudio) {
      audioEngine.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToSpeak = current.audioSpeech[lang] || current.audioSpeech.en;
      audioEngine.play(textToSpeak, 'CALM_GUIDE', lang);
      // Auto toggle off after estimated reading
      const durationMs = Math.max(4000, (textToSpeak.length / 14) * 1000);
      setTimeout(() => {
        setIsPlayingAudio(false);
      }, durationMs);
    }
  };

  return (
    <div className="bg-white border border-[#FBCFE8] rounded-[2.5rem] p-5 shadow-xs space-y-5 animate-in fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#E11D48]">
            <Sparkles className="w-3 h-3" />
            <span>
              {lang === 'am'
                ? 'ድንገተኛ ውሳኔ ሰጪ · ክሊኒካዊ መፍትሄ'
                : lang === 'om'
                ? 'Murteessituu Hatattamaa · Falla Fayyaa'
                : 'Clinical Protocol · Decision Navigator'}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-[#4A0420] leading-tight">
            {lang === 'am'
              ? 'ቀን ሲያልፍብዎ ምን ማድረግ አለብዎ?'
              : lang === 'om'
              ? 'Yoo Guyyaan Darbe Maal Gochuu Qabdu?'
              : 'Missed Pill or Late Shot Navigator'}
          </h3>
          <p className="text-xs text-[#783A4E] mt-0.5">
            {lang === 'am'
              ? 'ሳይደነግጡ ወዲያውኑ መውሰድ ያለብዎትን ትክክለኛ የህክምና እርምጃ ይወቁ'
              : lang === 'om'
              ? 'Osoo hin na’in tarkaanfii fayyaa sirrii fudhachuu qabdan beekaa'
              : 'Evidence-based Ethiopian MoH & WHO clinical recovery protocol'}
          </p>
        </div>

        <button
          type="button"
          onClick={handlePlayVoice}
          className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 border transition-all active:scale-95 shrink-0 ${
            isPlayingAudio
              ? 'bg-[#E11D48] text-white border-[#E11D48] animate-pulse'
              : 'bg-[#FFF5F7] text-[#881337] border-[#FBCFE8] hover:bg-[#FFE4E6]'
          }`}
          title="Listen in your language"
        >
          <Volume2 className="w-4 h-4" />
          <span>{isPlayingAudio ? (lang === 'am' ? 'እያዳመጡ ነው' : 'Playing') : (lang === 'am' ? 'በድምፅ' : lang === 'om' ? 'Sagaleen' : 'Listen')}</span>
        </button>
      </div>

      {/* Scenario Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => handleSelectScenario('missed_1_pill')}
          className={`p-3 rounded-2xl text-left border transition-all active:scale-95 flex flex-col justify-between ${
            activeScenario === 'missed_1_pill'
              ? 'bg-[#881337] text-white border-[#881337] shadow-xs'
              : 'bg-[#FFF5F7] text-[#4A0420] border-[#FBCFE8] hover:bg-[#FFE4E6]'
          }`}
        >
          <span className="text-base">💊 1</span>
          <span className="text-xs font-black mt-1 leading-tight">
            {lang === 'am' || lang === 'har' ? '1 እንክብል ሲያመልጥ' : lang === 'om' ? 'Qoricha 1' : 'Missed 1 Pill'}
          </span>
          <span className={`text-[10px] mt-0.5 ${activeScenario === 'missed_1_pill' ? 'text-rose-200' : 'text-[#783A4E]'}`}>
            &lt; 24-48 hrs
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectScenario('missed_2_pills')}
          className={`p-3 rounded-2xl text-left border transition-all active:scale-95 flex flex-col justify-between ${
            activeScenario === 'missed_2_pills'
              ? 'bg-[#881337] text-white border-[#881337] shadow-xs'
              : 'bg-[#FFF5F7] text-[#4A0420] border-[#FBCFE8] hover:bg-[#FFE4E6]'
          }`}
        >
          <span className="text-base">💊💊 2+</span>
          <span className="text-xs font-black mt-1 leading-tight">
            {lang === 'am' || lang === 'har' ? '2+ እንክብል ሲያመልጥ' : lang === 'om' ? 'Qoricha 2+' : 'Missed 2+ Pills'}
          </span>
          <span className={`text-[10px] mt-0.5 ${activeScenario === 'missed_2_pills' ? 'text-rose-200' : 'text-[#783A4E]'}`}>
            ≥ 48 hrs
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectScenario('late_depo')}
          className={`p-3 rounded-2xl text-left border transition-all active:scale-95 flex flex-col justify-between ${
            activeScenario === 'late_depo'
              ? 'bg-[#881337] text-white border-[#881337] shadow-xs'
              : 'bg-[#FFF5F7] text-[#4A0420] border-[#FBCFE8] hover:bg-[#FFE4E6]'
          }`}
        >
          <span className="text-base">💉</span>
          <span className="text-xs font-black mt-1 leading-tight">
            {lang === 'am' || lang === 'har' ? 'የመርፌ ቀን ሲያልፍ' : lang === 'om' ? 'Lilmoo Ji’a 3' : 'Late Depo Shot'}
          </span>
          <span className={`text-[10px] mt-0.5 ${activeScenario === 'late_depo' ? 'text-rose-200' : 'text-[#783A4E]'}`}>
            Grace period
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectScenario('emergency_window')}
          className={`p-3 rounded-2xl text-left border transition-all active:scale-95 flex flex-col justify-between ${
            activeScenario === 'emergency_window'
              ? 'bg-[#881337] text-white border-[#881337] shadow-xs'
              : 'bg-[#FFF5F7] text-[#4A0420] border-[#FBCFE8] hover:bg-[#FFE4E6]'
          }`}
        >
          <span className="text-base">⚡ 72h</span>
          <span className="text-xs font-black mt-1 leading-tight">
            {lang === 'am' || lang === 'har' ? 'የድንገተኛ 72 ሰዓት' : lang === 'om' ? 'Hatattama 72h' : 'Post-Pill 72h'}
          </span>
          <span className={`text-[10px] mt-0.5 ${activeScenario === 'emergency_window' ? 'text-rose-200' : 'text-[#783A4E]'}`}>
            Postinor / Plan B
          </span>
        </button>
      </div>

      {/* Active Verdict Banner */}
      <div
        className={`rounded-2xl p-4 border flex items-start gap-3 ${
          current.urgency === 'safe_action'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : current.urgency === 'caution_backup'
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-rose-50 border-rose-300 text-rose-950'
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {current.urgency === 'safe_action' ? (
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          ) : current.urgency === 'caution_backup' ? (
            <ShieldAlert className="w-5 h-5 text-amber-600" />
          ) : (
            <Clock className="w-5 h-5 text-rose-600 animate-pulse" />
          )}
        </div>
        <div>
          <h4 className="font-black text-sm sm:text-base leading-tight">
            {current.verdictTitle[lang] || current.verdictTitle.en}
          </h4>
          <p className="text-xs font-medium mt-0.5 opacity-90">
            {current.tagline[lang] || current.tagline.en}
          </p>
        </div>
      </div>

      {/* Step by Step Action Checklist */}
      <div className="space-y-2.5">
        <h5 className="text-xs font-black uppercase tracking-wider text-[#881337]">
          {lang === 'am'
            ? 'አሁንኑ መደረግ ያለባቸው እርምጃዎች'
            : lang === 'om'
            ? 'Tarkaanfiiwwan Ammuma Fudhatamuu Qaban'
            : 'Immediate Action Steps'}
        </h5>
        <div className="space-y-2">
          {current.steps.map((step, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-[#FFF5F7] border border-[#FBCFE8] flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[#4A0420] font-bold leading-relaxed">
                {step[lang] || step.en}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Golden Rule */}
      <div className="p-3.5 bg-gradient-to-r from-[#FFF5F7] to-[#FFE4E6] rounded-2xl border border-[#FBCFE8] text-xs text-[#4A0420] space-y-1">
        <div className="flex items-center gap-1.5 font-black text-[#881337]">
          <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" />
          <span>
            {lang === 'am'
              ? 'የጤና ባለሙያ ወርቃማ ህግ'
              : lang === 'om'
              ? 'Seera Ogeessa Fayyaa'
              : 'Midwife Golden Rule'}
          </span>
        </div>
        <p className="leading-relaxed font-medium">
          {current.goldenRule[lang] || current.goldenRule.en}
        </p>
      </div>

      {/* Direct Contact Links */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#FBCFE8]">
        {onOpenDirectory && (
          <button
            type="button"
            onClick={onOpenDirectory}
            className="text-xs font-bold text-[#881337] hover:underline flex items-center gap-1"
          >
            <span>{lang === 'am' ? 'የአቅራቢያ ጤና ጣቢያዎችን ይመልከቱ' : lang === 'om' ? 'Buufataalee fayyaa dhihoo ilaalaa' : 'View nearby health posts'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        <a
          href="tel:907"
          className="px-3.5 py-1.5 rounded-xl bg-[#DC2626] text-white text-xs font-black flex items-center gap-1.5 shadow-xs ml-auto"
        >
          <PhoneCall className="w-3 h-3" />
          <span>907 Free Call</span>
        </a>
      </div>
    </div>
  );
};
