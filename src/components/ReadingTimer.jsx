import React, { useEffect, useState } from "react";

const ReadingTimer = ({ onTimeUp, isRunning }) => {
  const totalTime = 60 * 60; // 60 daqiqa = 3600 sekund
  const [secondsLeft, setSecondsLeft] = useState(totalTime);

  useEffect(() => {
    if (!isRunning) return; // ❌ agar start bosilmagan bo‘lsa, timer ishlamaydi
    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, onTimeUp]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        background: "#f0f0f0",
        padding: "8px 16px",
        borderRadius: "6px",
        fontSize: "18px",
        fontWeight: "bold",
        boxShadow: "0 0 6px rgba(0,0,0,0.1)",
      }}
    >
      Time Left: {formatTime(secondsLeft)}
    </div>
  );
};

export default ReadingTimer;
