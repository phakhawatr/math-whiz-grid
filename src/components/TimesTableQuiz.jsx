import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * TimesTableQuiz - แบบฝึกหัดท่องสูตรคูณ 1-13
 * 
 * เว็บสอนคณิตเด็กที่ให้เด็กฝึกสูตรคูณผ่านการกรอกตัวเลขในช่องที่สุ่ม
 * รองรับการใช้งานบนมือถือ และผ่านมาตรฐาน WCAG 2.1 AA
 */

const TimesTableQuiz = () => {
  // ค่าคงที่
  const TABLE_SIZE = 13;
  const HOLE_OPTIONS = [20, 30, 40];
  
  // State หลัก
  const [size] = useState(TABLE_SIZE);
  const [holeCount, setHoleCount] = useState(20);
  const [holes, setHoles] = useState(new Set());
  const [answers, setAnswers] = useState({});
  const [startedAt, setStartedAt] = useState(null);
  const [finishedAt, setFinishedAt] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [checked, setChecked] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [dedupeSymmetric, setDedupeSymmetric] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  
  // Refs
  const inputRefs = useRef({});
  
  /**
   * สร้างตารางสูตรคูณ size x size
   */
  const buildTimesTable = useCallback((size) => {
    const table = [];
    for (let r = 1; r <= size; r++) {
      const row = [];
      for (let c = 1; c <= size; c++) {
        row.push(r * c);
      }
      table.push(row);
    }
    return table;
  }, []);
  
  /**
   * สุ่มตำแหน่งช่องว่าง (?) โดยไม่ซ้ำกัน
   */
  const pickRandomHoles = useCallback((count, options = {}) => {
    const { dedupeSymmetric = false } = options;
    const availablePositions = [];
    
    // สร้างรายการตำแหน่งที่เป็นไปได้
    for (let r = 1; r <= size; r++) {
      for (let c = 1; c <= size; c++) {
        if (dedupeSymmetric && r > c) continue; // ข้ามครึ่งล่างถ้าเปิดโหมด symmetric
        availablePositions.push(`r${r}c${c}`);
      }
    }
    
    // สุ่มเลือกตำแหน่งตามจำนวนที่ต้องการ
    const shuffled = [...availablePositions].sort(() => Math.random() - 0.5);
    return new Set(shuffled.slice(0, Math.min(count, shuffled.length)));
  }, [size]);
  
  /**
   * เริ่มจับเวลาเมื่อพิมพ์คำตอบครั้งแรก
   */
  const startTimer = useCallback(() => {
    if (!startedAt && !checked) {
      setStartedAt(Date.now());
    }
  }, [startedAt, checked]);
  
  /**
   * อัพเดตเวลาที่ผ่านไป
   */
  useEffect(() => {
    let interval;
    if (startedAt && !finishedAt && !checked) {
      interval = setInterval(() => {
        setElapsedMs(Date.now() - startedAt);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [startedAt, finishedAt, checked]);
  
  /**
   * แปลงเวลาเป็นรูปแบบ mm:ss
   */
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  /**
   * ตรวจสอบว่าเป็นกำลังสอง (แนวทแยง)
   */
  const isPerfectSquare = (row, col) => row === col;
  
  /**
   * สุ่มชุดใหม่
   */
  const handleNewSet = () => {
    const newHoles = pickRandomHoles(holeCount, { dedupeSymmetric });
    setHoles(newHoles);
    setAnswers({});
    setStartedAt(null);
    setFinishedAt(null);
    setElapsedMs(0);
    setChecked(false);
    setShowAnswers(false);
    setShowModal(false);
    setFocusedInput(null);
  };
  
  /**
   * ตรวจคำตอบ
   */
  const handleCheck = () => {
    if (!startedAt) return;
    
    setFinishedAt(Date.now());
    setChecked(true);
    
    // คำนวณคะแนน
    const table = buildTimesTable(size);
    let correct = 0;
    let total = 0;
    
    holes.forEach(holeId => {
      const [, r, , c] = holeId.match(/r(\d+)c(\d+)/);
      const row = parseInt(r) - 1;
      const col = parseInt(c) - 1;
      const userAnswer = parseInt(answers[holeId] || '');
      const correctAnswer = table[row][col];
      
      total++;
      if (userAnswer === correctAnswer) {
        correct++;
      }
    });
    
    setTimeout(() => setShowModal(true), 500);
  };
  
  /**
   * แสดงเฉลยทั้งหมด
   */
  const handleShowAnswers = () => {
    const table = buildTimesTable(size);
    const newAnswers = { ...answers };
    
    holes.forEach(holeId => {
      const [, r, , c] = holeId.match(/r(\d+)c(\d+)/);
      const row = parseInt(r) - 1;
      const col = parseInt(c) - 1;
      newAnswers[holeId] = table[row][col].toString();
    });
    
    setAnswers(newAnswers);
    setShowAnswers(true);
    
    if (startedAt && !finishedAt) {
      setFinishedAt(Date.now());
    }
  };
  
  /**
   * จัดการการพิมพ์ในช่อง input
   */
  const handleInputChange = (holeId, value) => {
    // รับเฉพาะตัวเลข
    const numericValue = value.replace(/\D/g, '').slice(0, 3);
    
    setAnswers(prev => ({
      ...prev,
      [holeId]: numericValue
    }));
    
    startTimer();
    
    // Auto-move เมื่อพิมพ์เต็มหรือกด →
    if (numericValue.length >= 3) {
      moveToNextInput(holeId);
    }
  };
  
  /**
   * จัดการ key events
   */
  const handleKeyDown = (e, holeId) => {
    const holeArray = Array.from(holes);
    const currentIndex = holeArray.indexOf(holeId);
    
    switch (e.key) {
      case 'ArrowRight':
      case 'Tab':
        if (!e.shiftKey) {
          e.preventDefault();
          moveToNextInput(holeId);
        }
        break;
      case 'ArrowLeft':
        if (e.shiftKey || currentIndex > 0) {
          e.preventDefault();
          moveToPrevInput(holeId);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveToInputAbove(holeId);
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveToInputBelow(holeId);
        break;
      case 'Backspace':
        if (!answers[holeId] && currentIndex > 0) {
          e.preventDefault();
          moveToPrevInput(holeId);
        }
        break;
      case 'Enter':
        if (currentIndex === holeArray.length - 1) {
          handleCheck();
        } else {
          moveToNextInput(holeId);
        }
        break;
    }
  };
  
  /**
   * เลื่อนไปช่องถัดไป
   */
  const moveToNextInput = (currentHoleId) => {
    const holeArray = Array.from(holes);
    const currentIndex = holeArray.indexOf(currentHoleId);
    if (currentIndex < holeArray.length - 1) {
      const nextHoleId = holeArray[currentIndex + 1];
      inputRefs.current[nextHoleId]?.focus();
    }
  };
  
  /**
   * เลื่อนไปช่องก่อนหน้า
   */
  const moveToPrevInput = (currentHoleId) => {
    const holeArray = Array.from(holes);
    const currentIndex = holeArray.indexOf(currentHoleId);
    if (currentIndex > 0) {
      const prevHoleId = holeArray[currentIndex - 1];
      inputRefs.current[prevHoleId]?.focus();
    }
  };
  
  /**
   * เลื่อนไปช่องด้านบน
   */
  const moveToInputAbove = (currentHoleId) => {
    const [, r, , c] = currentHoleId.match(/r(\d+)c(\d+)/);
    const row = parseInt(r);
    const col = parseInt(c);
    
    if (row > 1) {
      const aboveHoleId = `r${row - 1}c${col}`;
      if (holes.has(aboveHoleId)) {
        inputRefs.current[aboveHoleId]?.focus();
      }
    }
  };
  
  /**
   * เลื่อนไปช่องด้านล่าง
   */
  const moveToInputBelow = (currentHoleId) => {
    const [, r, , c] = currentHoleId.match(/r(\d+)c(\d+)/);
    const row = parseInt(r);
    const col = parseInt(c);
    
    if (row < size) {
      const belowHoleId = `r${row + 1}c${col}`;
      if (holes.has(belowHoleId)) {
        inputRefs.current[belowHoleId]?.focus();
      }
    }
  };
  
  /**
   * คำนวณคะแนนและข้อความชมเชย
   */
  const getScoreData = () => {
    const table = buildTimesTable(size);
    let correct = 0;
    let total = 0;
    
    holes.forEach(holeId => {
      const [, r, , c] = holeId.match(/r(\d+)c(\d+)/);
      const row = parseInt(r) - 1;
      const col = parseInt(c) - 1;
      const userAnswer = parseInt(answers[holeId] || '');
      const correctAnswer = table[row][col];
      
      total++;
      if (userAnswer === correctAnswer) {
        correct++;
      }
    });
    
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    let message = '';
    
    if (percentage >= 95) message = '🎉 เยี่ยมมาก! คุณเก่งมากเลยนะ!';
    else if (percentage >= 85) message = '👍 เก่งมาก! อีกนิดเดียวก็เพอร์เฟค!';
    else if (percentage >= 70) message = '😊 ดีมาก! ค่อยๆ ฝึกต่อไปนะ!';
    else if (percentage >= 50) message = '🤔 พอใช้แล้ว ลองทบทวนสูตรคูณอีกครั้งนะ!';
    else message = '💪 ไม่เป็นไร! ลองใหม่และฝึกเพิ่มเติมนะ!';
    
    return { correct, total, percentage, message };
  };
  
  /**
   * ฟังก์ชันรับสีคอลัมน์ตามหมายเลข
   */
  const getColumnColor = (col) => {
    return `bg-col-${col}`;
  };
  
  /**
   * สร้าง cell ในตาราง
   */
  const renderCell = (row, col) => {
    const holeId = `r${row}c${col}`;
    const isHole = holes.has(holeId);
    const value = row * col;
    const isPerfectSquareCell = isPerfectSquare(row, col);
    const columnBg = getColumnColor(col);
    
    // Base cell class with consistent sizing
    const baseCellClass = "p-1 border border-border w-16 h-16 min-w-[64px] min-h-[64px]";
    
    if (isHole) {
      // ช่องที่ให้กรอกคำตอบ
      const userAnswer = answers[holeId] || '';
      const correctAnswer = value;
      const isCorrect = parseInt(userAnswer) === correctAnswer;
      
      let inputClass = 'w-full h-full text-center text-lg font-bold bg-white/80 border-2 border-border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none';
      
      if (checked) {
        inputClass += isCorrect 
          ? ' border-success bg-success/10 text-success-foreground' 
          : ' border-error bg-error/10 text-error-foreground';
      }
      
      return (
        <td 
          key={`${row}-${col}`}
          className={`${baseCellClass} ${columnBg}`}
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
            onChange={(e) => handleInputChange(holeId, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, holeId)}
            onFocus={() => setFocusedInput(holeId)}
            onBlur={() => setFocusedInput(null)}
            aria-label={`ช่อง ${row} คูณ ${col}`}
          />
        </td>
      );
    }
    
    // ช่องที่แสดงคำตอบ
    const cellClass = isPerfectSquareCell 
      ? 'text-perfect-square font-bold text-xl' 
      : 'text-foreground font-semibold text-lg';
      
    return (
      <td 
        key={`${row}-${col}`}
        className={`${baseCellClass} ${columnBg} flex items-center justify-center`}
      >
        <span className={cellClass}>{value}</span>
      </td>
    );
  };
  
  // สุ่มช่องเริ่มต้นเมื่อโหลด component
  useEffect(() => {
    handleNewSet();
  }, [holeCount, dedupeSymmetric]);
  
  const scoreData = getScoreData();
  
  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-foreground mb-2 font-mali">
            🎯 ตารางสูตรคูณ 1–13 🎯
          </h1>
          <p className="text-xl text-foreground/70 font-prompt">
            ฝึกสูตรคูณสำหรับเด็กแบบสนุก ๆ 📚✨
          </p>
        </div>
        
        {/* Controls */}
        <div className="bg-card rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* จำนวนช่อง */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-card-foreground">จำนวนช่อง ?:</span>
              <div className="flex gap-1 bg-background rounded-lg p-1">
                {HOLE_OPTIONS.map(count => (
                  <button
                    key={count}
                    onClick={() => setHoleCount(count)}
                    className={`px-4 py-2 rounded-md font-semibold transition-all ${
                      holeCount === count
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-foreground hover:bg-primary/10'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Timer */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-card-foreground">เวลา:</span>
              <div className="bg-background px-4 py-2 rounded-lg">
                <span className="text-xl font-mono font-bold text-primary">
                  {formatTime(elapsedMs)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleNewSet}
                className="px-6 py-2 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
              >
                สุ่มชุดใหม่
              </button>
              
              <button
                onClick={handleCheck}
                disabled={!startedAt || checked}
                className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ตรวจคำตอบ
              </button>
              
              <button
                onClick={handleShowAnswers}
                className="px-6 py-2 bg-card-foreground text-card font-semibold rounded-lg hover:bg-card-foreground/90 transition-colors"
              >
                เฉลยทั้งหมด
              </button>
            </div>
            
            {/* Symmetric Option */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={dedupeSymmetric}
                onChange={(e) => setDedupeSymmetric(e.target.checked)}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
              />
              <span className="text-sm text-card-foreground">
                ซ่อนค่าซ้ำแบบกลับด้าน (a×b = b×a)
              </span>
            </label>
          </div>
        </div>
        
        {/* Times Table */}
        <div className="bg-card rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-table-header">
                  <th className="sticky left-0 top-0 z-20 w-16 h-16 min-w-[64px] min-h-[64px] bg-table-header border border-border">
                    <span className="text-lg font-bold text-foreground">×</span>
                  </th>
                  {Array.from({length: size}, (_, i) => i + 1).map(col => (
                    <th 
                      key={col}
                      className="sticky top-0 z-10 w-16 h-16 min-w-[64px] min-h-[64px] bg-table-header border border-border"
                    >
                      <span className="text-lg font-bold text-foreground">{col}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({length: size}, (_, i) => i + 1).map(row => (
                  <tr key={row}>
                    <th className="sticky left-0 z-10 w-16 h-16 min-w-[64px] min-h-[64px] bg-table-header-alt border border-border flex items-center justify-center">
                      <span className="text-lg font-bold text-foreground">{row}</span>
                    </th>
                    {Array.from({length: size}, (_, i) => i + 1).map(col => 
                      renderCell(row, col)
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Bottom Timer */}
        <div className="flex justify-end mt-4">
          <div className="bg-card px-4 py-2 rounded-lg shadow-md">
            <span className="text-sm text-card-foreground mr-2">เวลา:</span>
            <span className="text-lg font-mono font-bold text-primary">
              {formatTime(elapsedMs)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Result Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-card-foreground mb-4">
                ผลการทำแบบฝึกหัด
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {scoreData.percentage}%
                  </div>
                  <div className="text-lg text-card-foreground">
                    ตอบถูก {scoreData.correct} จาก {scoreData.total} ข้อ
                  </div>
                </div>
                
                <div className="text-lg text-card-foreground">
                  เวลาที่ใช้: {formatTime(finishedAt - startedAt)}
                </div>
                
                <div className="text-lg font-medium text-primary bg-primary/10 rounded-lg p-4">
                  {scoreData.message}
                </div>
              </div>
              
              <button
                onClick={() => setShowModal(false)}
                className="mt-6 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimesTableQuiz;

/*
การติดตั้งและใช้งาน (Setup Instructions)

1. สร้างโปรเจ็กต์ Vite + React:
   npm create vite@latest times-table-quiz -- --template react
   cd times-table-quiz

2. ติดตั้ง Tailwind CSS:
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p

3. ตั้งค่า tailwind.config.js
4. เพิ่ม Tailwind directives ใน src/index.css
5. รันโปรเจ็กต์: npm run dev

สำหรับรายละเอียดเพิ่มเติม กรุณาดูเอกสารการติดตั้ง Vite + React + Tailwind CSS
*/