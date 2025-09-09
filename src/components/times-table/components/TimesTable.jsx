import React from 'react';
import TableCell from './TableCell';
import { TABLE_SIZE } from '../utils/constants';
const TimesTable = ({
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
  const renderCell = (row, col) => {
    const holeId = `r${row}c${col}`;
    const isHole = holes.has(holeId);
    return <TableCell key={`${row}-${col}`} row={row} col={col} isHole={isHole} holes={holes} answers={answers} checked={checked} showAnswers={showAnswers} inputRefs={inputRefs} onInputChange={onInputChange} onKeyDown={onKeyDown} onFocus={onFocus} onBlur={onBlur} />;
  };
  return <div className="bg-card rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-20 w-16 h-12 border border-gray-300 shadow-md bg-pink-500">
                <span className="text-xl font-bold text-foreground">×</span>
              </th>
              {Array.from({
              length: TABLE_SIZE
            }, (_, i) => i + 1).map(col => <th key={col} className="sticky top-0 z-10 w-16 h-12 border border-gray-300 shadow-md bg-table-header bg-cyan-300">
                  <span className="text-xl font-bold text-foreground">{col}</span>
                </th>)}
            </tr>
          </thead>
          <tbody>
            {Array.from({
            length: TABLE_SIZE
          }, (_, i) => i + 1).map(row => <tr key={row}>
                <th className="sticky left-0 z-10 w-16 h-12 bg-table-header-alt border border-gray-300 shadow-md bg-indigo-300">
                  <span className="text-xl font-bold text-foreground">{row}</span>
                </th>
                {Array.from({
              length: TABLE_SIZE
            }, (_, i) => i + 1).map(col => renderCell(row, col))}
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
};
export default TimesTable;