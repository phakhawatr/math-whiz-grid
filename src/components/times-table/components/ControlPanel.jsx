import React from 'react';
import TimerDisplay from './TimerDisplay';
import { HOLE_OPTIONS } from '../utils/constants';

const ControlPanel = ({
  holeCount,
  onHoleCountChange,
  elapsedMs,
  onNewSet,
  onCheck,
  onShowAnswers,
  startedAt,
  checked,
  showAnswers,
  dedupeSymmetric,
  onDedupeSymmetricChange
}) => {
  return (
    <div className="bg-card rounded-2xl shadow-lg p-6 mb-6 my-[10px] py-[24px]">
      <div className="flex flex-wrap items-center justify-between gap-6 my-[20px]">
        {/* จำนวนช่อง */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <span className="text-lg font-medium text-gray-800 whitespace-nowrap px-[25px]">
            จำนวนช่อง ?:
          </span>
          <div className="flex flex-wrap gap-2">
            {HOLE_OPTIONS.map(count => (
              <button
                key={count}
                onClick={() => onHoleCountChange(count)}
                className={`
                  relative px-4 py-2 min-w-[60px] rounded-full font-medium text-sm
                  transition-all duration-300 ease-out
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2
                  ${holeCount === count 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/40' 
                    : 'bg-white text-gray-700 border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 hover:border-gray-300 hover:scale-102'
                  }
                  active:scale-95 transform
                `}
              >
                <span className="relative z-10">{count}</span>
                <div className="absolute inset-0 rounded-full bg-current opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Timer */}
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-card-foreground">เวลา:</span>
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-5 py-2.5 rounded-xl shadow-inner border border-primary/20">
            <TimerDisplay elapsedMs={elapsedMs} />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-6 mt-6">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onNewSet}
            className="flex items-center gap-2 py-3 bg-gradient-to-r from-orange-500 to-orange-600 font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 text-sky-600 bg-sky-200 hover:bg-sky-100 px-[55px]"
          >
            🎲 <span>สุ่มชุดใหม่</span>
          </button>
          
          <button
            onClick={onCheck}
            disabled={!startedAt || checked || showAnswers}
            className="flex items-center gap-2 py-3 bg-gradient-to-r from-green-500 to-green-600 font-semibold rounded-xl hover:from-green-600 hover:to-green-700 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none active:scale-95 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 text-orange-700 bg-orange-300 hover:bg-orange-200 px-[55px]"
          >
            ✅ <span>ตรวจคำตอบ</span>
          </button>
          
          <button
            onClick={onShowAnswers}
            disabled={showAnswers}
            className="flex items-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-purple-600 font-semibold rounded-xl hover:from-purple-600 hover:to-purple-700 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none active:scale-95 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 mx-0 text-lime-300 bg-lime-200 hover:bg-lime-100 px-[55px]"
          >
            👁️ <span className="text-emerald-600">เฉลยทั้งหมด</span>
          </button>
        </div>
        
        {/* Symmetric Option */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={dedupeSymmetric}
              onChange={e => onDedupeSymmetricChange(e.target.checked)}
              className="w-5 h-5 text-blue-600 bg-white border-2 border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 hover:border-blue-400 transition-colors duration-200"
            />
            <span className="text-sm font-medium select-none mx-[10px] text-slate-900">
              ซ่อนค่าซ้ำแบบกลับด้าน (a×b = b×a)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;