import React, { useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { AppLanguage } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface WaitingCompanionProps {
  lang: AppLanguage;
  onMoveMade?: () => void;
}

type Player = '🌸' | '🤍' | null;

export const WaitingCompanion: React.FC<WaitingCompanionProps> = ({
  lang,
  onMoveMade,
}) => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [winner, setWinner] = useState<Player | 'TIE' | null>(null);

  const checkWinner = (squares: Player[]): Player | 'TIE' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6],           // diags
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.every((sq) => sq !== null)) {
      return 'TIE';
    }
    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner || !isPlayerTurn) return;

    triggerHaptic('light');
    if (onMoveMade) onMoveMade();

    const newBoard = [...board];
    newBoard[index] = '🌸';
    const result = checkWinner(newBoard);

    if (result) {
      setBoard(newBoard);
      setWinner(result);
      if (result === '🌸') triggerHaptic('success');
      return;
    }

    setBoard(newBoard);
    setIsPlayerTurn(false);

    // Quiet companion turn after a short delay
    setTimeout(() => {
      const emptyIndices = newBoard
        .map((val, idx) => (val === null ? idx : null))
        .filter((val): val is number => val !== null);

      if (emptyIndices.length > 0) {
        // Prefer the center, otherwise make a simple random move
        const chosen = emptyIndices.includes(4) && Math.random() > 0.4
          ? 4
          : emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

        newBoard[chosen] = '🤍';
        const aiResult = checkWinner(newBoard);
        setBoard([...newBoard]);
        if (aiResult) {
          setWinner(aiResult);
        } else {
          setIsPlayerTurn(true);
        }
      }
    }, 450);
  };

  const resetGame = () => {
    triggerHaptic('selection');
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
  };

  return (
    <div className="bg-[#FFF5F7] border border-[#FBCFE8] rounded-2xl p-3.5 space-y-2.5 max-w-sm mx-auto shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" />
          <span className="text-xs font-black text-[#881337]">
            {lang === 'am' || lang === 'har'
              ? 'ጊዜውን ለማሳለፍ XO ጨዋታ'
              : lang === 'om'
              ? 'Yeroo darbuu Taphicha XO'
              : 'Calm waiting activity (Tic-Tac-Toe)'}
          </span>
        </div>
        <button
          type="button"
          onClick={resetGame}
          className="p-1 px-2 rounded-lg bg-white border border-[#FBCFE8] text-[10px] font-bold text-[#881337] flex items-center gap-1 hover:bg-[#FFE4E6] active:scale-95"
          title="Reset Game"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{lang === 'am' || lang === 'har' ? 'እንደገና' : lang === 'om' ? 'Haaraa' : 'New'}</span>
        </button>
      </div>

      <p className="text-[11px] text-[#783A4E] leading-tight">
        {lang === 'am' || lang === 'har'
          ? 'እርስዎ 🌸 ነዎት፤ በዚህ ጨዋታ ሳረፉ ህፃኑ እንቅስቃሴ ሲሰማዎት ከላይ ያለውን አዝራር ይጫኑ።'
          : lang === 'om'
          ? 'Isin 🌸 dha; taphachaa yeroo daa’imni socho’u tuqa gara olitti jiru tuqaa!'
          : 'You are 🌸. Play calmly while you wait, and tap the kick button whenever you feel movement.'}
      </p>

      {/* 3x3 Board */}
      <div className="grid grid-cols-3 gap-2 bg-white p-2 rounded-xl border border-[#FBCFE8]">
        {board.map((cell, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleCellClick(idx)}
            disabled={!!cell || !!winner || !isPlayerTurn}
            aria-label={`Cell ${idx + 1}`}
            className={`h-14 sm:h-16 rounded-xl flex items-center justify-center text-2xl font-bold transition-all active:scale-90 select-none ${
              cell
                ? 'bg-[#FFF0F3] border border-[#FBCFE8] shadow-2xs'
                : 'bg-white hover:bg-rose-50/60 border border-dashed border-[#FBCFE8] cursor-pointer'
            }`}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* Status banner */}
      <div className="text-center text-xs font-bold py-1">
        {winner === '🌸' ? (
          <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            🎉 {lang === 'am' || lang === 'har' ? 'እንኳን ደስ አለዎት! አሸነፉ!' : lang === 'om' ? 'Baga gammaddan! Mo’attaniittu!' : 'You won! Keep feeling kicks.'}
          </span>
        ) : winner === '🤍' ? (
          <span className="text-[#881337] bg-[#FFE4E6] px-3 py-1 rounded-full border border-[#FBCFE8]">
            🤍 {lang === 'am' || lang === 'har' ? 'ጥሩ ጨዋታ! እንደገና ይሞክሩ' : lang === 'om' ? 'Tapha gaarii! Ammas yaalaa' : 'Nice game! Try again.'}
          </span>
        ) : winner === 'TIE' ? (
          <span className="text-[#783A4E] bg-white px-3 py-1 rounded-full border border-[#FBCFE8]">
            🤝 {lang === 'am' || lang === 'har' ? 'አቻ ወጣችሁ!' : lang === 'om' ? 'Qixa baatan!' : 'Tie game!'}
          </span>
        ) : (
          <span className="text-[11px] text-[#783A4E]">
            {isPlayerTurn
              ? lang === 'am' || lang === 'har' ? 'ተራዎ ነው (🌸)' : lang === 'om' ? 'Dabaree keessan (🌸)' : 'Your turn (🌸)'
              : lang === 'am' || lang === 'har' ? 'ጓደኛ እያሰበች ነው... (🤍)' : lang === 'om' ? 'Hiriyyaan yaadaa jira... (🤍)' : 'Companion thinking... (🤍)'}
          </span>
        )}
      </div>
    </div>
  );
};
