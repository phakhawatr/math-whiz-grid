import { useState, useCallback } from 'react';
import { pickRandomHoles } from '../utils/gameUtils';
import { TABLE_SIZE, DEFAULT_HOLE_COUNT } from '../utils/constants';

export const useTimesTableQuiz = () => {
  const [holeCount, setHoleCount] = useState(DEFAULT_HOLE_COUNT);
  const [holes, setHoles] = useState(new Set());
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [dedupeSymmetric, setDedupeSymmetric] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  /**
   * สุ่มชุดใหม่
   */
  const handleNewSet = useCallback(() => {
    const newHoles = pickRandomHoles(holeCount, TABLE_SIZE, { dedupeSymmetric });
    setHoles(newHoles);
    setAnswers({});
    setChecked(false);
    setShowAnswers(false);
    setShowModal(false);
    setFocusedInput(null);
  }, [holeCount, dedupeSymmetric]);

  /**
   * ตรวจคำตอบ
   */
  const handleCheck = useCallback((startedAt) => {
    if (!startedAt) return;

    const hasAnswers = Object.values(answers).some(answer => answer && answer.trim() !== '');
    if (!hasAnswers) return;

    setChecked(true);
    setShowAnswers(false);
    setTimeout(() => setShowModal(true), 1000);
  }, [answers]);

  /**
   * แสดงเฉลยทั้งหมด
   */
  const handleShowAnswers = useCallback(() => {
    const newAnswers = { ...answers };

    holes.forEach(holeId => {
      const [, r, c] = holeId.match(/r(\d+)c(\d+)/);
      const row = parseInt(r);
      const col = parseInt(c);
      const correctAnswer = row * col;
      newAnswers[holeId] = correctAnswer.toString();
    });

    setAnswers(newAnswers);
    setShowAnswers(true);
    setChecked(false);
  }, [answers, holes]);

  /**
   * จัดการการพิมพ์ในช่อง input
   */
  const handleInputChange = useCallback((holeId, value) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 3);
    setAnswers(prev => ({
      ...prev,
      [holeId]: numericValue
    }));
  }, []);

  return {
    // State
    holeCount,
    holes,
    answers,
    checked,
    showAnswers,
    dedupeSymmetric,
    showModal,
    focusedInput,
    
    // Setters
    setHoleCount,
    setDedupeSymmetric,
    setShowModal,
    setFocusedInput,
    
    // Handlers
    handleNewSet,
    handleCheck,
    handleShowAnswers,
    handleInputChange
  };
};