import React, { useState, useEffect } from 'react';
import {
  Building2,
  PhoneCall,
  MapPin,
  ShieldCheck,
  Search,
  Filter,
  X,
  Ambulance,
  Clock,
  Sparkles,
  Car,
  Volume2,
} from 'lucide-react';
import { AppLanguage } from '../types';
import { resolveText } from '../utils/compass';
import { audioEngine } from '../utils/audio';
import { triggerHaptic } from '../utils/telegram';
import { ETHIOPIAN_CLINICS } from '../data/clinics';

interface HealthFacility {
  id: string;
  name: {
    en: string;
    am: string;
    om: string;
    har: string;
  };
  region: string;
  city: string;
  zone: string;
  type: string;
  phone: string;
  emergencyHotline: string;
  has24hMaternity: boolean;
  hasAmbulanceStation: boolean;
}

interface FacilityDirectoryProps {
  lang: AppLanguage;
  isOpen: boolean;
  onClose: () => void;
}

export const FacilityDirectory: React.FC<FacilityDirectoryProps> = ({
  lang,
  isOpen,
  onClose,
}) => {
  const [facilities, setFacilities] = useState<HealthFacility[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedFlashcardFacility, setSelectedFlashcardFacility] = useState<HealthFacility | null>(null);
  const [isSpeakingDriverNote, setIsSpeakingDriverNote] = useState<boolean>(false);

  const fallbackOffline = () => {
    const offlineList: HealthFacility[] = ETHIOPIAN_CLINICS.map((c) => ({
      id: c.id,
      name: c.name,
      region: c.region,
      city: c.city,
      zone: c.region,
      type: typeof c.type === 'string' ? c.type : resolveText(c.type, lang) || 'Referral Hospital',
      phone: c.phone,
      emergencyHotline: '907',
      has24hMaternity: false,
      hasAmbulanceStation: c.id === 'ambulance_907',
    }));
    const filtered =
      selectedRegion === 'all'
        ? offlineList
        : offlineList.filter((f) =>
            f.region.toLowerCase().includes(selectedRegion.toLowerCase())
          );
    setFacilities(filtered);
  };

  const regions = [
    { id: 'all', label: { en: 'All Regions', am: 'ሁሉም ክልሎች', om: 'Naannoo Hunda', har: 'ሁሉም' } },
    { id: 'Addis Ababa', label: { en: 'Addis Ababa', am: 'አዲስ አበባ', om: 'Finfinnee', har: 'አዲስ አበባ' } },
    { id: 'Oromia', label: { en: 'Oromia', am: 'ኦሮሚያ', om: 'Oromiyaa', har: 'ኦሮሚያ' } },
    { id: 'Harari', label: { en: 'Harari', am: 'ሐረሪ', om: 'Hararii', har: 'ሐረሪ' } },
    { id: 'Amhara', label: { en: 'Amhara', am: 'አማራ', om: 'Amaara', har: 'አማራ' } },
    { id: 'Sidama', label: { en: 'Sidama', am: 'ሲዳማ', om: 'Sidaamaa', har: 'ሲዳማ' } },
    { id: 'Dire Dawa', label: { en: 'Dire Dawa', am: 'ድሬዳዋ', om: 'Dirre Dawaa', har: 'ድሬዳዋ' } },
  ];

  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    fetch(`/api/facilities?region=${selectedRegion}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.facilities && data.facilities.length > 0) {
          setFacilities(data.facilities);
        } else {
          fallbackOffline();
        }
      })
      .catch((err) => {
        console.warn('Network offline, using cached maternal centers database:', err);
        fallbackOffline();
      })
      .finally(() => setIsLoading(false));
  }, [isOpen, selectedRegion]);

  if (!isOpen) return null;

  const filteredFacilities = facilities.filter((f) => {
    const nameMatch = resolveText(f.name, lang).toLowerCase().includes(searchQuery.toLowerCase());
    const cityMatch = f.city.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || cityMatch;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-[#FFF5F7] rounded-[2.5rem] max-w-2xl w-full border-2 border-[#FBCFE8] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#881337] to-[#4A0420] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-rose-200">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg leading-tight">
                {lang === 'am'
                  ? 'የኢትዮጵያ የእናቶች እና ሪፈራል ሆስፒታሎች'
                  : lang === 'om'
                  ? 'Hospitaalota Haadholii fi Riifaralaa'
                  : 'Maternal Centers & Referral Hospitals'}
              </h3>
              <span className="text-[11px] text-rose-200 block">
                {lang === 'am'
                  ? 'የሆስፒታል ማውጫ — በግንኙነት ያለምንም እንዲሆን ያረጋግጡ'
                  : lang === 'om'
                  ? 'Galmee hospitaalaa — yeroo dhiyeessa mirkaneessaa'
                  : 'Facility directory — call to verify current availability'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-white border-b border-[#FBCFE8] space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#783A4E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'am'
                  ? 'የሆስፒታል ስም ወይም ከተማ ይፈልጉ...'
                  : lang === 'om'
                  ? 'Maqaa hospitaalaa ykn magaalaa barbaadaa...'
                  : 'Search hospital or city name...'
              }
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FBCFE8] text-xs font-bold text-[#4A0420] focus:outline-none focus:ring-2 focus:ring-[#881337]"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {regions.map((r) => {
              const isSelected = selectedRegion === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRegion(r.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-black shrink-0 transition-all active:scale-95 border ${
                    isSelected
                      ? 'bg-[#881337] text-white border-[#881337] shadow-xs'
                      : 'bg-[#FFF5F7] text-[#4A0420] border-[#FBCFE8] hover:bg-[#FFE4E6]'
                  }`}
                >
                  {resolveText(r.label, lang)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Facility Cards List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-[#783A4E] font-bold">
              {lang === 'am' ? 'ሆስፒታሎችን በማዘጋጀት ላይ...' : lang === 'om' ? 'Hospitaalota fe’aa jira...' : 'Loading verified maternal centers...'}
            </div>
          ) : filteredFacilities.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#783A4E] font-bold">
              {lang === 'am'
                ? 'ምንም የተገኘ ሆስፒታል የለም። ክልሉን ይቀይሩ።'
                : lang === 'om'
                ? 'Hospitaalli hin argamne. Naannoo jijjiiraa.'
                : 'No facilities found for this search.'}
            </div>
          ) : (
            filteredFacilities.map((facility) => (
              <div
                key={facility.id}
                className="bg-white rounded-[2rem] p-4 border border-[#FBCFE8] shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-black tracking-wider text-[#9D174D] block">
                      {facility.region} · {facility.city}
                    </span>
                    <h4 className="text-base font-black text-[#4A0420] leading-snug">
                      {resolveText(facility.name, lang)}
                    </h4>
                    <span className="text-xs text-[#783A4E] font-medium block">
                      {facility.type}
                    </span>
                  </div>

                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 shrink-0">
                    {lang === 'am' ? 'አቅርቦትን ይሞክሩ' : lang === 'om' ? 'Tajaajila mirkaneessaa' : 'Verify availability'}
                  </span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 text-[10px] font-bold text-[#783A4E]">
                  <span className="flex items-center gap-1 bg-[#FFF5F7] px-2.5 py-1 rounded-md border border-[#FBCFE8]">
                    <Clock className="w-3 h-3 text-[#E11D48]" />
                    <span>
                      {lang === 'am' ? 'አሁን ሰዓትን ያረጋግጡ' : lang === 'om' ? 'Sa’aatii amma mirkaneessaa' : 'Call to confirm hours'}
                    </span>
                  </span>
                  {facility.hasAmbulanceStation && (
                    <span className="flex items-center gap-1 bg-red-50 text-[#991B1B] px-2.5 py-1 rounded-md border border-red-200">
                      <Ambulance className="w-3 h-3 text-[#DC2626]" />
                      <span>
                        {lang === 'am' ? '907 አምቡላንስ — ያረጋግጡ' : lang === 'om' ? 'Ambulaansii 907 — mirkaneessi' : '907 Ambulance — verify locally'}
                      </span>
                    </span>
                  )}
                </div>

                {/* Actions: Call Direct & 907 & Show Driver */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#FBCFE8]/60">
                  <a
                    href={`tel:${facility.phone}`}
                    className="py-2.5 px-3 rounded-xl bg-[#881337] hover:bg-[#701A75] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{lang === 'am' ? 'ደውል' : lang === 'om' ? 'Bilbilaa' : 'Call Center'}</span>
                  </a>

                  <a
                    href="tel:907"
                    className="py-2.5 px-3 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{lang === 'am' ? '907 አምቡላንስ' : lang === 'om' ? '907 Ambulaansii' : 'Ambulance 907'}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('medium');
                      setSelectedFlashcardFacility(facility);
                    }}
                    className="col-span-2 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Car className="w-3.5 h-3.5 text-amber-600" />
                    <span>
                      {lang === 'am' || lang === 'har'
                        ? '🚕 ለአሽከርካሪው አሳይ (ባጃጅ / ታክሲ)'
                        : lang === 'om'
                        ? '🚕 Konkolaachisaatti Agarsiisaa (Bajaajii)'
                        : '🚕 Show to Driver (Bajaj / Taxi)'}
                    </span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#FFF0F3] p-4 border-t border-[#FBCFE8] flex items-center justify-between">
          <span className="text-xs text-[#783A4E] font-medium">
            {lang === 'am' ? 'የኢትዮጵያ ጤና ጥበቃ ሚኒስቴር ኔትወርክ' : lang === 'om' ? 'Netwoorkii Ministeera Fayyaa Itoophiyaa' : 'Ethiopian Ministry of Health Network'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-[#881337] text-white text-xs font-bold active:scale-95 shadow-xs"
          >
            {lang === 'am' ? 'ዝጋ' : lang === 'om' ? 'Cufi' : lang === 'har' ? 'ዝጋ' : 'Done'}
          </button>
        </div>
      </div>

      {/* BAJAJ / TAXI DRIVER EMERGENCY FLASHCARD MODAL */}
      {selectedFlashcardFacility && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md animate-in fade-in"
        >
          <div className="bg-[#18181B] text-white rounded-[2.5rem] max-w-lg w-full border-4 border-amber-400 p-6 shadow-2xl space-y-5 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-black px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest animate-pulse">
              <span>🚨</span>
              <span>
                {lang === 'am' ? 'ድንገተኛ የወሊድ ጉዞ' : lang === 'om' ? 'Imala Hatattamaa' : 'Emergency Obstetric Transit'}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-black tracking-wider text-amber-400 block">
                {lang === 'am' ? 'የመዳረሻ ሆስፒታል' : lang === 'om' ? 'Hospitaala Deeman' : 'Destination Hospital'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {resolveText(selectedFlashcardFacility.name, 'am')}
              </h2>
              {resolveText(selectedFlashcardFacility.name, 'om') !== resolveText(selectedFlashcardFacility.name, 'am') && (
                <h3 className="text-lg sm:text-xl font-bold text-amber-200">
                  {resolveText(selectedFlashcardFacility.name, 'om')}
                </h3>
              )}
              <p className="text-xs text-zinc-300">
                {selectedFlashcardFacility.region} · {selectedFlashcardFacility.city}
              </p>
            </div>

            {/* Instruction to driver in bold clear text */}
            <div className="bg-zinc-900 border-2 border-zinc-700 rounded-2xl p-4 text-amber-100 text-sm sm:text-base font-bold leading-relaxed space-y-2 text-left">
              <p>
                «እባክዎን ሴትየዋ በምጥ ላይ ስለምትገኝ ወደዚህ ሆስፒታል ድንገተኛ የወሊድ መግቢያ በር በአፋጣኝ ይውሰዱን!»
              </p>
              <p className="text-xs text-zinc-400 border-t border-zinc-700/80 pt-1.5">
                «Maaloo haati ciniinsuu irra waan jirtuuf gara balbala hatattamaa hospitaala kanaatti ariitiin nu geessaa!»
              </p>
            </div>

            {/* Voice Readout for Driver & Close */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('medium');
                  const spoken = `እባክዎን ወደ ${resolveText(selectedFlashcardFacility.name, 'am')} ድንገተኛ የወሊድ ክፍል በፍጥነት ይውሰዱን። ሴትየዋ በምጥ ላይ ናት።`;
                  audioEngine.play(spoken, 'URGENT_CALM', 'am');
                  setIsSpeakingDriverNote(true);
                  setTimeout(() => setIsSpeakingDriverNote(false), 5000);
                }}
                className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 border transition-all active:scale-95 ${
                  isSpeakingDriverNote
                    ? 'bg-amber-400 text-black border-amber-400 animate-pulse'
                    : 'bg-zinc-800 text-amber-300 border-zinc-600 hover:bg-zinc-700'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isSpeakingDriverNote ? 'እያነበበ ነው...' : 'ለሾፌሩ በድምፅ አንብብ (Voice)'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  audioEngine.stop();
                  setSelectedFlashcardFacility(null);
                }}
                className="py-3 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs active:scale-95 transition-all"
              >
                {lang === 'am' ? 'ተረድቷል / ዝጋ' : lang === 'om' ? 'Galeera / Cufi' : 'Understood / Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
