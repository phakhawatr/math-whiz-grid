import React from 'react';
import { isPerfectSquare } from '../utils/gameUtils';

const TableCell = ({ 
  row, 
  col, 
  isHole, 
  holes, 
  answers, 
  checked, 
  showAnswers, 
  inputRefs, 
  onInputChange, 
  onKeyDown, 
  onFocus, 
  onBlur 
}) => {
  const holeId = `r${row}c${col}`;
  const value = row * col;
  const isPerfectSquareCell = isPerfectSquare(row, col);

  // สีพื้นหลังตามแถว (แม่สูตรคูณ)
  const getRowColorClass = (row) => {
    return `bg-table-row-${row}`;
  };

  if (isHole) {
    // ช่องที่ให้กรอกคำตอบ
    const userAnswer = answers[holeId] || '';
    const correctAnswer = value;
    const isCorrect = !isNaN(parseInt(userAnswer)) && parseInt(userAnswer) === correctAnswer;
    
    let inputClass = 'w-full h-12 text-center text-xl font-bold bg-table-hole border-2 border-red-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none shadow-inner';

    // Add blinking placeholder when empty, blue text when filled
    if (!userAnswer) {
      inputClass += ' placeholder-blink text-gray-400';
    } else {
      inputClass += ' input-number-blue';
    }

    // Handle different states
    if (checked && !showAnswers) {
      inputClass += isCorrect ? ' answer-correct' : ' answer-incorrect';
    } else if (showAnswers) {
      inputClass += ' answer-revealed';
    }

    return (
      <td 
        key={`${row}-${col}`} 
        className={`p-1 border border-gray-300 ${getRowColorClass(row)} w-16 h-12`}
      >
        <input
          ref={el => inputRefs.current[holeId] = el}
          type="text"
          inputMode="numeric"
          maxLength={3}
          value={userAnswer}
          placeholder="?"
          disabled={showAnswers}
          className={inputClass}
          onChange={e => onInputChange(holeId, e.target.value)}
          onKeyDown={e => onKeyDown(e, holeId)}
          onFocus={() => onFocus(holeId)}
          onBlur={() => onBlur(null)}
          aria-label={`ช่อง ${row} คูณ ${col}`}
        />
      </td>
    );
  }

  // ช่องที่แสดงคำตอบ
  const cellClass = isPerfectSquareCell 
    ? 'text-perfect-square font-bold text-xl' 
    : 'text-foreground text-lg font-semibold';

  return (
    <td 
      key={`${row}-${col}`} 
      className={`p-2 w-16 h-12 border border-gray-300 text-center ${getRowColorClass(row)}`}
    >
      <span className={cellClass}>{value}</span>
    </td>
  );
};

export default TableCell;