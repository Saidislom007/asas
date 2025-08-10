import { useEffect } from "react";

const Part3 = ({
  data,
  onFinish,
  isRecording,
  prepTime,
  timer,
  onStart,
  onStop,
  setPrepTime,
  setTimer
}) => {
  useEffect(() => {
    // Boshlang‘ich tayyorgarlik va yozuv vaqtlarini o‘rnatish
    setPrepTime(60);  // 1 daqiqa tayyorlanish
    setTimer(120);    // 2 daqiqa recording
  }, []);

  useEffect(() => {
    // Tayyorlanish tugagach yozishni boshlash
    if (prepTime === 0 && !isRecording) {
      onStart(data.join(" ")); // barcha savollarni bitta stringga birlashtirib yuboramiz
    }
  }, [prepTime]);

  useEffect(() => {
    // Yozish tugagach to‘xtatish va yakunlash
    if (timer === 0 && isRecording) {
      onStop(data.join(" "));
      alert("✅ Part 3 tugadi!");
      onFinish?.();
    }
  }, [timer, isRecording]);

  return (
    <div className="card">
      <h1>🗣️ Speaking — Part 3</h1>

      <p><strong>Ko‘rsatma:</strong> Quyidagi savollarga 2 daqiqa davomida javob bering:</p>

      <ul className="question-list">
        {data.map((question, idx) => (
          <li key={idx}>
            <strong>Q{idx + 1}:</strong> {question}
          </li>
        ))}
      </ul>

      {prepTime > 0 && <div className="timer">🕐 Preparing: {prepTime}s</div>}
      {isRecording && timer > 0 && <div className="timer">🎙️ Recording: {timer}s</div>}

      {!isRecording && prepTime === 0 && (
        <button onClick={() => onStart(data.join(" "))} className="start-btn">🎤 Start</button>
      )}

      {isRecording && (
        <button
          className="stop-btn"
          onClick={() => {
            onStop(data.join(" "));
            onFinish?.();
            alert("✅ Part 3 tugadi!");
          }}
        >
          ⏹️ Stop
        </button>
      )}
    </div>
  );
};

export default Part3;
