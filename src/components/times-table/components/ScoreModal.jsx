import React from 'react';
import { formatTime } from '../utils/gameUtils';

const ScoreModal = ({ 
  showModal, 
  onClose, 
  scoreData, 
  startedAt, 
  finishedAt 
}) => {
  if (!showModal) return null;

  return (
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
            onClick={onClose}
            className="mt-6 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreModal;