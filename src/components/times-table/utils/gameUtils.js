/**
 * สร้างตารางสูตรคูณ size x size
 */
export const buildTimesTable = (size) => {
  const table = [];
  for (let r = 1; r <= size; r++) {
    const row = [];
    for (let c = 1; c <= size; c++) {
      row.push(r * c);
    }
    table.push(row);
  }
  return table;
};

/**
 * สุ่มตำแหน่งช่องว่าง (?) โดยไม่ซ้ำกัน
 */
export const pickRandomHoles = (count, size, options = {}) => {
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
};

/**
 * แปลงเวลาเป็นรูปแบบ mm:ss
 */
export const formatTime = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * ตรวจสอบว่าเป็นกำลังสอง (แนวทแยง)
 */
export const isPerfectSquare = (row, col) => row === col;

/**
 * คำนวณคะแนนและข้อความชมเชย
 */
export const getScoreData = (holes, answers) => {
  let correct = 0;
  let total = 0;
  
  holes.forEach(holeId => {
    const [, r, c] = holeId.match(/r(\d+)c(\d+)/);
    const row = parseInt(r);
    const col = parseInt(c);
    const userAnswer = parseInt(answers[holeId] || '');
    const correctAnswer = row * col;

    total++;
    if (!isNaN(userAnswer) && userAnswer === correctAnswer) {
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