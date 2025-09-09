import React from 'react';
import { formatTime } from '../utils/gameUtils';

const TimerDisplay = ({ elapsedMs, variant = 'default' }) => {
  const baseClasses = "font-mono font-bold";
  const variantClasses = {
    default: "text-xl text-primary",
    card: "text-lg text-primary"
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {formatTime(elapsedMs)}
    </span>
  );
};

export default TimerDisplay;