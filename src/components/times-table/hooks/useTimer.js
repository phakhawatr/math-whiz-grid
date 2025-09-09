import { useState, useEffect, useCallback } from 'react';

export const useTimer = () => {
  const [startedAt, setStartedAt] = useState(null);
  const [finishedAt, setFinishedAt] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  /**
   * เริ่มจับเวลาเมื่อพิมพ์คำตอบครั้งแรก
   */
  const startTimer = useCallback(() => {
    if (!startedAt) {
      setStartedAt(Date.now());
    }
  }, [startedAt]);

  /**
   * หยุดจับเวลา
   */
  const stopTimer = useCallback(() => {
    if (startedAt && !finishedAt) {
      setFinishedAt(Date.now());
    }
  }, [startedAt, finishedAt]);

  /**
   * รีเซ็ตจับเวลา
   */
  const resetTimer = useCallback(() => {
    setStartedAt(null);
    setFinishedAt(null);
    setElapsedMs(0);
  }, []);

  /**
   * อัพเดตเวลาที่ผ่านไป
   */
  useEffect(() => {
    let interval;
    if (startedAt && !finishedAt) {
      interval = setInterval(() => {
        setElapsedMs(Date.now() - startedAt);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [startedAt, finishedAt]);

  return {
    startedAt,
    finishedAt,
    elapsedMs,
    startTimer,
    stopTimer,
    resetTimer
  };
};