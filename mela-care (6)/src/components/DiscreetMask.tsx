import React, { useState } from 'react';
import { Eye, Shield, Calendar, Sun, CloudSun, ArrowLeft, Lock } from 'lucide-react';
import { AppLanguage } from '../types';

interface DiscreetMaskProps {
  isOpen: boolean;
  onExit: () => void;
  lang: AppLanguage;
}

export const DiscreetMask: React.FC<DiscreetMaskProps> = ({
  isOpen,
  onExit,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#FDFBF7] text-[#2D3748] flex flex-col font-sans animate-in fade-in">
      {/* Fake neutral top bar */}
      <div className="bg-[#E2E8F0] px-4 py-3 flex items-center justify-between border-b border-[#CBD5E1]">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#475569]" />
          <span className="font-bold text-sm text-[#334155]">
            {lang === 'am' ? 'የቀን መቁጠሪያ እና አየር ሁኔታ' : 'Daily Calendar & Weather'}
          </span>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="px-3 py-1.5 rounded-xl bg-white border border-[#CBD5E1] text-xs font-bold text-[#475569] hover:bg-[#F1F5F9] active:scale-95 flex items-center gap-1.5 shadow-2xs"
          title="Return to Mela Care"
        >
          <Lock className="w-3.5 h-3.5 text-[#E11D48]" />
          <span>{lang === 'am' ? 'ይመለሱ' : 'Unlock Mela'}</span>
        </button>
      </div>

      {/* Disguise Content: Neutral Ethiopian Daily Notes */}
      <div className="flex-1 max-w-md w-full mx-auto p-5 space-y-5">
        {/* Weather Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-[#64748B] font-medium block">Addis Ababa / Regional</span>
              <span className="text-2xl font-black text-[#1E293B]">23°C · ፀሐያማ</span>
            </div>
            <Sun className="w-10 h-10 text-amber-500" />
          </div>
          <p className="text-xs text-[#64748B]">
            {lang === 'am'
              ? 'ዛሬ ደስ የሚል የአየር ሁኔታ አለ።'
              : 'Pleasant daylight temperatures across central highlands.'}
          </p>
        </div>

        {/* Daily Market / Household Notes */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
            {lang === 'am' ? 'የገበያ እና የቤት ማስታወሻ' : 'Household & Daily Notes'}
          </span>
          <ul className="text-xs space-y-2 text-[#475569]">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#94A3B8]" />
              <span>ጤፍ እና የጓሮ አትክልት መግዛት</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#94A3B8]" />
              <span>የውሃ ማጠራቀሚያ እቃዎችን ማጠብ</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#94A3B8]" />
              <span>የቤተሰብ ስልክ ሂሳብ መሙላት</span>
            </li>
          </ul>
        </div>

        {/* Subtle touch-to-unlock area at bottom */}
        <div className="pt-6 text-center">
          <button
            type="button"
            onClick={onExit}
            className="text-xs font-bold text-[#64748B] hover:text-[#0F172A] underline py-2 px-4"
          >
            {lang === 'am' ? 'ወደ መላ ኬር ለመመለስ እዚህ ይጫኑ' : 'Tap here to return to health companion'}
          </button>
        </div>
      </div>
    </div>
  );
};
