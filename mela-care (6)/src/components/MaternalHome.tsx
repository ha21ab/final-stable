import React, { useState } from 'react';
import {
  AppLanguage,
  ActiveServiceCategory,
} from '../types';
import {
  Baby,
  ChevronRight,
  Heart,
  PackageCheck,
  PhoneCall,
  Timer,
  Building2,
  Droplets,
  Eye,
  Thermometer,
  Activity,
  HeartPulse,
} from 'lucide-react';

interface MaternalHomeProps {
  lang: AppLanguage;
  onSelectLanguage: (lang: AppLanguage) => void;
  onSelectCategory: (
    category: ActiveServiceCategory,
    initialMode?: 'body_map' | 'birth_kit' | 'kick_counter' | 'edema_test' | 'labor_timer'
  ) => void;
  onOpenDirectory: () => void;
}

const copy = {
  am: {
    language: 'ቋንቋ', emergency: 'አስቸኳይ ነገር አለዎት?', call: '907 ይደውሉ',
    symptoms: 'የሚያሳዝንዎትን ምልክት ይምረጡ', bleeding: 'ከማህፀን ደም መውጣት',
    headache: 'ከባድ ራስ ምታት / የዓይን ችግር', fever: 'ከፍተኛ ትኩሳት',
    pain: 'ከባድ የሆድ ህመም', movement: 'የልጅ እንቅስቃሴ መቀነስ',
    family: 'የቤተሰብ ምጣኔ', pregnancy: 'የእርግዝና መሣሪያዎች',
    pregnancyDesc: 'ምጥ፣ የፅንስ እንቅስቃሴ እና የወሊድ ዝግጅት',
    familyDesc: 'ዘዴዎች፣ የተዘረጋውን ክትትል እና የመከልከል መረጃ',
    help: 'የጤና ጣቢያ ያግኙ', labor: 'የምጥ ቆጣሪ', kit: 'የወሊድ ዝግጅት',
    notPregnant: 'እርጉዝ አይደለሁም', pregnant: 'እርግዝና', postpartum: 'ድህረ ወለድ',
  },
  om: {
    language: 'Afaan', emergency: 'Hatattamaan jirtaa?', call: '907 bilbila',
    symptoms: 'Mallattoo isin qubatu filadhaa', bleeding: 'Dhiiga gadameessaa',
    headache: 'Bowwoo / mul’ataa dadhabuu', fever: 'Ho’a qaamaa ol’aanaa',
    pain: 'Dhukkuba garaa cimaa', movement: 'Sochiin daa’imaa hir’achuu',
    family: 'Karoora Maatii', pregnancy: 'Meeshaalee Ulfaa',
    pregnancyDesc: 'Lakkaa’insa ciniinsaa, sochiin daa’imaa, qophii da’umsaa',
    familyDesc: 'Mala, yaadachiisa fi odeeffannoo ittisa ulfaa',
    help: 'Buufata fayyaa barbaadi', labor: 'Lakkoofsa Ciniinsaa', kit: 'Qophii Deessummaa',
    notPregnant: 'Ulfa hin qabu', pregnant: 'Ulfaa', postpartum: 'Dhaleessa booda',
  },
  en: {
    language: 'Language', emergency: 'Do you need emergency help?', call: 'Call 907',
    symptoms: 'Choose what you are feeling', bleeding: 'Vaginal bleeding',
    headache: 'Severe headache / vision problem', fever: 'High fever',
    pain: 'Severe abdominal pain', movement: 'Baby movement has slowed',
    family: 'Family Planning', pregnancy: 'Pregnancy Tools',
    pregnancyDesc: 'Contractions, baby kicks and birth preparation',
    familyDesc: 'Methods, missed doses and private advice',
    help: 'Find a health facility', labor: 'Contraction Timer', kit: 'Birth Preparedness',
    notPregnant: 'Not pregnant', pregnant: 'Pregnant', postpartum: 'Postpartum',
  },
  har: {
    language: 'Language', emergency: 'አደጋ አለዎት?', call: '907 ይደውሉ',
    symptoms: 'የሚያሳዝንዎትን ምልክት ይምረጡ', bleeding: 'ከማህፀን ደም መውጣት',
    headache: 'ከባድ ራስ ምታት / የዓይን ችግር', fever: 'ከፍተኛ ትኩሳት',
    pain: 'ከባድ የሆድ ህመም', movement: 'የልጅ እንቅስቃሴ መቀነስ',
    family: 'የቤተሰብ ምጣኔ', pregnancy: 'የእርግዝና መሣሪያዎች',
    pregnancyDesc: 'ምጥ፣ የፅንስ እንቅስቃሴ እና የወሊድ ዝግጅት',
    familyDesc: 'ዘዴዎች፣ የተዘረጋውን ክትትል እና የመከልከል መረጃ',
    help: 'የጤና ጣቢያ ያግኙ', labor: 'የምጥ ቆጣሪ', kit: 'የወሊድ ዝግጅት',
    notPregnant: 'እርጉዝ አይደለሁም', pregnant: 'እርግዝና', postpartum: 'ድህረ ወለድ',
  },
};

export const MaternalHome: React.FC<MaternalHomeProps> = ({
  lang,
  onSelectLanguage,
  onSelectCategory,
  onOpenDirectory,
}) => {
  const t = copy[lang] || copy.en;
  const [lifeStage, setLifeStage] = useState<'not_pregnant' | 'pregnant' | 'postpartum'>('pregnant');
  const symptomItems = [
    { label: t.bleeding, icon: Droplets, body: 'pelvis_waters' as const },
    { label: t.headache, icon: Eye, body: 'head_eyes' as const },
    { label: t.fever, icon: Thermometer, body: 'whole_body' as const },
    { label: t.pain, icon: Activity, body: 'womb_belly' as const },
    { label: t.movement, icon: Baby, body: 'womb_belly' as const },
  ];

  return (
    <div className="mc-home space-y-4 pb-24">
      <div className="mc-language-wrap flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
        <span className="hidden sm:block text-xs font-bold text-slate-600">{t.language}</span>
        <div className="mc-language-track grid grid-cols-4 gap-1 w-full min-w-0" role="group" aria-label={t.language}>
          {([
            ['am', 'አማርኛ'],
            ['om', 'Oromoo'],
            ['en', 'English'],
            ['har', 'ሃረሪ'],
          ] as [AppLanguage, string][]).map(([code, label]) => (
            <button
              key={code}
              type="button"
              onClick={() => onSelectLanguage(code)}
              aria-pressed={lang === code}
              className={`min-h-11 min-w-0 px-1 sm:px-2.5 rounded-lg text-xs font-bold border whitespace-normal leading-tight ${
                lang === code
                  ? 'bg-[#6E1E3A] text-white border-[#6E1E3A] shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mc-life-stage-wrap" role="group" aria-label={
        lang === 'am' || lang === 'har'
          ? 'እርግዝና ሁኔታ'
          : lang === 'om'
          ? 'Sadarkaa ulfaa'
          : 'Pregnancy stage'
      }>
        {([
          ['not_pregnant', t.notPregnant],
          ['pregnant', t.pregnant],
          ['postpartum', t.postpartum],
        ] as const).map(([stage, label]) => (
          <button
            key={stage}
            type="button"
            aria-pressed={lifeStage === stage}
            onClick={() => setLifeStage(stage)}
          >
            {label}
          </button>
        ))}
      </div>

      <section className="mc-emergency-card rounded-2xl border border-red-200 bg-[#FFF8F8] p-4 shadow-sm" aria-labelledby="emergency-title">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p id="emergency-title" className="text-lg font-black text-red-900">{t.emergency}</p>
            <p className="mt-1 text-sm text-red-800">{t.symptoms}</p>
          </div>
          <a
            href="tel:907"
            className="shrink-0 inline-flex min-h-11 items-center gap-2 rounded-xl bg-red-700 px-3 text-sm font-black text-white"
          >
            <PhoneCall className="h-4 w-4" />
            {t.call}
          </a>
        </div>

        <div className="mc-symptom-grid mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {symptomItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelectCategory('danger_signs', 'body_map')}
              className="min-h-14 flex items-center gap-3 rounded-xl border border-red-200 bg-white px-3 text-left text-sm font-bold text-slate-900 hover:border-red-700"
            >
              <item.icon className="h-5 w-5 shrink-0 text-red-700" />
              <span className="flex-1">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          ))}
        </div>
      </section>

      <section className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${lifeStage === 'not_pregnant' ? 'mc-service-stage-single' : ''}`}>
        {lifeStage !== 'not_pregnant' && lifeStage !== 'postpartum' && <button
          type="button"
          onClick={() => onSelectCategory('danger_signs')}
          className="group min-h-36 rounded-2xl border border-[#E6D8DE] bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#9D4765] hover:shadow-md active:scale-[0.99] focus-visible:outline-offset-2"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F8EAF0] text-[#881337]">
                <Baby className="h-5 w-5" />
              </span>
              <span className="text-xs font-black uppercase tracking-wide text-[#881337]">{t.pregnancy}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-[#881337] transition-transform group-hover:translate-x-0.5" />
          </div>
          <h2 className="mt-4 text-lg font-black leading-snug text-slate-900">
            {lang === 'am' ? 'የእርግዝና አደጋ ምልክቶችን ይፈትሹ' : lang === 'om' ? 'Mallattoolee balaa ulfaa qoradhaa' : 'Check pregnancy warning signs'}
          </h2>
          <span className="mt-2 block text-xs font-bold text-[#9D4765]">{lang === 'am' ? 'መሣሪያዎችን ይክፈቱ' : lang === 'om' ? 'Meeshaalee banii' : 'Open pregnancy tools'} →</span>
        </button>}
        {lifeStage === 'postpartum' && <button
          type="button"
          onClick={() => onSelectCategory('postpartum_care')}
          className="group min-h-36 rounded-2xl border border-[#E6D8DE] bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#9D4765] hover:shadow-md active:scale-[0.99] focus-visible:outline-offset-2"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F8EAF0] text-[#881337]">
                <HeartPulse className="h-5 w-5" />
              </span>
              <span className="text-xs font-black uppercase tracking-wide text-[#881337]">
                {lang === 'am' || lang === 'har' ? 'ድህረ ወለድ እንክብካቤ' : lang === 'om' ? 'Kununsa dhalachuu booda' : 'Postpartum Care'}
              </span>
            </div>
            <ChevronRight className="h-5 w-5 text-[#881337] transition-transform group-hover:translate-x-0.5" />
          </div>
          <h2 className="mt-4 text-lg font-black leading-snug text-slate-900">
            {lang === 'am' || lang === 'har' ? 'የእርስዎ እና የህጻንዎ የቀን እንክብካቤ' : lang === 'om' ? 'Kununsa guyyaa kee fi daa’imaa keetii' : 'Daily care for you and your baby'}
          </h2>
          <span className="mt-2 block text-xs font-bold text-[#9D4765]">
            {lang === 'am' || lang === 'har' ? 'መሣሪያዎች እና ጠቃሚ ምክሮችን ይክፈቱ' : lang === 'om' ? 'Meeshaalee fi gorsa banaa' : 'Open postpartum tools'} →
          </span>
        </button>}
        <button
          type="button"
          onClick={() => onSelectCategory('family_planning')}
          className="group min-h-36 rounded-2xl border border-[#E6D8DE] bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#9D4765] hover:shadow-md active:scale-[0.99] focus-visible:outline-offset-2"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F8EAF0] text-[#881337]">
                <Heart className="h-5 w-5" />
              </span>
              <span className="text-xs font-black uppercase tracking-wide text-[#881337]">{t.family}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-[#881337] transition-transform group-hover:translate-x-0.5" />
          </div>
          <h2 className="mt-4 text-lg font-black leading-snug text-slate-900">
            {lang === 'am' ? 'ዘዴዎች፣ የክትትል ጊዜ እና የተመሳሳይ ጥያቄዎች' : lang === 'om' ? 'Malawwan, yaadachiisa fi gorsa dhuunfaa' : 'Methods, reminders and private guidance'}
          </h2>
          <span className="mt-2 block text-xs font-bold text-[#9D4765]">{lang === 'am' ? 'አማራጮችን ይመልከቱ' : lang === 'om' ? 'Filannoowwan ilaali' : 'Explore family planning'} →</span>
        </button>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label={lang === 'am' ? 'ፈጣን መሣሪያዎች' : lang === 'om' ? 'Meeshaalee saffisaa' : 'Quick tools'}>
        {lifeStage === 'postpartum' && <button type="button" onClick={() => onSelectCategory('postpartum_care')} className="quick-tool border-[#E9C7D2] bg-[#FFF8FA] text-[#6E1E3A]">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3DEE7]"><HeartPulse className="h-5 w-5 text-[#881337]" /></span>
          <span className="flex items-center gap-1">
            {lang === 'am' || lang === 'har' ? 'ድህረ ወለድ እንክብካቤ' : lang === 'om' ? 'Kununsa dhalachuu booda' : 'Postpartum Care'}
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </button>}
        {lifeStage !== 'not_pregnant' && lifeStage !== 'postpartum' && <button type="button" onClick={() => onSelectCategory('danger_signs', 'labor_timer')} className="quick-tool border-[#E9C7D2] bg-[#FFF8FA] text-[#6E1E3A]">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3DEE7]"><Timer className="h-5 w-5 text-[#881337]" /></span>
          <span className="flex items-center gap-1">{t.labor}<ChevronRight className="h-3.5 w-3.5" /></span>
        </button>}
        {lifeStage !== 'not_pregnant' && lifeStage !== 'postpartum' && <button type="button" onClick={() => onSelectCategory('danger_signs', 'kick_counter')} className="quick-tool border-[#E7D6DF] bg-white text-[#6E1E3A]">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3EAF0]"><Baby className="h-5 w-5 text-[#9D4765]" /></span>
          <span className="flex items-center gap-1">{lang === 'am' ? 'የፅንስ እንቅስቃሴ' : lang === 'om' ? 'Sochiin daa’imaa' : lang === 'har' ? 'የፅንስ እንቅስቃሴ' : 'Fetal Movement'}<ChevronRight className="h-3.5 w-3.5" /></span>
        </button>}
        {lifeStage !== 'not_pregnant' && <button type="button" onClick={() => onSelectCategory('danger_signs', 'birth_kit')} className="quick-tool border-[#F0DFD2] bg-[#FFF9F4] text-[#6E1E3A]">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3E2D6]"><PackageCheck className="h-5 w-5 text-[#881337]" /></span>
          <span className="flex items-center gap-1">{t.kit}<ChevronRight className="h-3.5 w-3.5" /></span>
        </button>}
        <button type="button" onClick={onOpenDirectory} className="quick-tool border-[#DDE3EC] bg-[#F7F9FC] text-[#334B68]">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E7EDF6]"><Building2 className="h-5 w-5 text-[#334B68]" /></span>
          <span className="flex items-center gap-1">{t.help}<ChevronRight className="h-3.5 w-3.5" /></span>
        </button>
      </section>

    </div>
  );
};
