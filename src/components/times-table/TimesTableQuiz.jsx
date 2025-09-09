import React, { useEffect, useRef } from 'react';
import ControlPanel from './components/ControlPanel';
import TimesTable from './components/TimesTable';
import TimerDisplay from './components/TimerDisplay';
import ScoreModal from './components/ScoreModal';
import { useTimesTableQuiz } from './hooks/useTimesTableQuiz';
import { useTimer } from './hooks/useTimer';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { getScoreData } from './utils/gameUtils';
import { TABLE_SIZE } from './utils/constants';

/**
 * TimesTableQuiz - แบบฝึกหัดท่องสูตรคูณ 1-13
 * 
 * เว็บสอนคณิตเด็กที่ให้เด็กฝึกสูตรคูณผ่านการกรอกตัวเลขในช่องที่สุ่ม
 * รองรับการใช้งานบนมือถือ และผ่านมาตรฐาน WCAG 2.1 AA
 */
const TimesTableQuiz = () => {
  // Refs
  const inputRefs = useRef({});

  // Custom hooks
  const {
    holeCount,
    holes,
    answers,
    checked,
    showAnswers,
    dedupeSymmetric,
    showModal,
    focusedInput,
    setHoleCount,
    setDedupeSymmetric,
    setShowModal,
    setFocusedInput,
    handleNewSet,
    handleCheck,
    handleShowAnswers,
    handleInputChange: baseHandleInputChange
  } = useTimesTableQuiz();

  const {
    startedAt,
    finishedAt,
    elapsedMs,
    startTimer,
    stopTimer,
    resetTimer
  } = useTimer();

  const {
    moveToNextInput,
    moveToPrevInput,
    moveToInputAbove,
    moveToInputBelow
  } = useKeyboardNavigation(holes, TABLE_SIZE, inputRefs);

  // Enhanced input change handler with timer integration
  const handleInputChange = (holeId, value) => {
    baseHandleInputChange(holeId, value);
    startTimer();

    // Auto-move เมื่อพิมพ์เต็มหรือกด →
    const numericValue = value.replace(/\D/g, '').slice(0, 3);
    if (numericValue.length >= 3) {
      moveToNextInput(holeId);
    }
  };

  // Enhanced check handler with timer integration
  const handleCheckWithTimer = () => {
    stopTimer();
    handleCheck(startedAt);
  };

  // Enhanced show answers handler with timer integration
  const handleShowAnswersWithTimer = () => {
    if (startedAt && !finishedAt) {
      stopTimer();
    }
    handleShowAnswers();
  };

  // Enhanced new set handler with timer integration
  const handleNewSetWithTimer = () => {
    resetTimer();
    handleNewSet();
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
          handleCheckWithTimer();
        } else {
          moveToNextInput(holeId);
        }
        break;
    }
  };

  // Initialize game on mount and when settings change
  useEffect(() => {
    handleNewSetWithTimer();
  }, [holeCount, dedupeSymmetric]);

  // Calculate score data
  const scoreData = getScoreData(holes, answers);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-foreground mb-2 my-[10px]">
            ตารางเทพสูตรคูณ 1–13
          </h1>
          <p className="text-lg text-foreground/70">
            ฝึกสูตรคูณสำหรับเด็กแบบสนุก ๆ
          </p>
        </div>
        
        {/* Controls */}
        <ControlPanel
          holeCount={holeCount}
          onHoleCountChange={setHoleCount}
          elapsedMs={elapsedMs}
          onNewSet={handleNewSetWithTimer}
          onCheck={handleCheckWithTimer}
          onShowAnswers={handleShowAnswersWithTimer}
          startedAt={startedAt}
          checked={checked}
          showAnswers={showAnswers}
          dedupeSymmetric={dedupeSymmetric}
          onDedupeSymmetricChange={setDedupeSymmetric}
        />
        
        {/* Times Table */}
        <TimesTable
          holes={holes}
          answers={answers}
          checked={checked}
          showAnswers={showAnswers}
          inputRefs={inputRefs}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={setFocusedInput}
          onBlur={setFocusedInput}
        />
        
        {/* Bottom Timer */}
        <div className="flex justify-end mt-4">
          <div className="bg-card px-4 py-2 rounded-lg shadow-md">
            <span className="text-sm text-card-foreground mr-2">เวลา:</span>
            <TimerDisplay elapsedMs={elapsedMs} variant="card" />
          </div>
        </div>
      </div>
      
      {/* Result Modal */}
      <ScoreModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        scoreData={scoreData}
        startedAt={startedAt}
        finishedAt={finishedAt}
      />
    </div>
  );
};

export default TimesTableQuiz;