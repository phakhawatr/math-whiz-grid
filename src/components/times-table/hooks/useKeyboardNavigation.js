import { useCallback } from 'react';

export const useKeyboardNavigation = (holes, size, inputRefs) => {
  /**
   * เลื่อนไปช่องถัดไป
   */
  const moveToNextInput = useCallback((currentHoleId) => {
    const holeArray = Array.from(holes);
    const currentIndex = holeArray.indexOf(currentHoleId);
    if (currentIndex < holeArray.length - 1) {
      const nextHoleId = holeArray[currentIndex + 1];
      inputRefs.current[nextHoleId]?.focus();
    }
  }, [holes, inputRefs]);

  /**
   * เลื่อนไปช่องก่อนหน้า
   */
  const moveToPrevInput = useCallback((currentHoleId) => {
    const holeArray = Array.from(holes);
    const currentIndex = holeArray.indexOf(currentHoleId);
    if (currentIndex > 0) {
      const prevHoleId = holeArray[currentIndex - 1];
      inputRefs.current[prevHoleId]?.focus();
    }
  }, [holes, inputRefs]);

  /**
   * เลื่อนไปช่องด้านบน
   */
  const moveToInputAbove = useCallback((currentHoleId) => {
    const [, r, c] = currentHoleId.match(/r(\d+)c(\d+)/);
    const row = parseInt(r);
    const col = parseInt(c);
    if (row > 1) {
      const aboveHoleId = `r${row - 1}c${col}`;
      if (holes.has(aboveHoleId)) {
        inputRefs.current[aboveHoleId]?.focus();
      }
    }
  }, [holes, inputRefs]);

  /**
   * เลื่อนไปช่องด้านล่าง
   */
  const moveToInputBelow = useCallback((currentHoleId) => {
    const [, r, c] = currentHoleId.match(/r(\d+)c(\d+)/);
    const row = parseInt(r);
    const col = parseInt(c);
    if (row < size) {
      const belowHoleId = `r${row + 1}c${col}`;
      if (holes.has(belowHoleId)) {
        inputRefs.current[belowHoleId]?.focus();
      }
    }
  }, [holes, size, inputRefs]);

  return {
    moveToNextInput,
    moveToPrevInput,
    moveToInputAbove,
    moveToInputBelow
  };
};