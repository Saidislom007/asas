import { useEffect } from "react";

const Part2 = ({ data, onNext, isRecording, prepTime, timer, onStart, onStop }) => {
  useEffect(() => {
    // Auto start after prep time ends
    if (prepTime === 0 && !isRecording) {
      onStart(data.topic);
    }
  }, [prepTime, isRecording]);

  useEffect(() => {
    // Auto stop and go to next when timer ends
    if (timer === 0 && isRecording) {
      onStop(data.topic);
      onNext();
    }
  }, [timer, isRecording]);

  return (
    <div className="card">
      <h1>🗣️ Speaking — Part 2</h1>
      <h2>{data.topic}</h2>
      <ul>
        {data.points.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>

      {prepTime > 0 && <div className="timer">🕐 Preparing: {prepTime}s</div>}
      {isRecording && timer > 0 && <div className="timer">🎙️ Recording: {timer}s</div>}

      {!isRecording && prepTime === 0 && (
        <button onClick={() => onStart(data.topic)} className="start-btn">🎤 Start</button>
      )}

      {isRecording && (
        <button onClick={() => { onStop(data.topic); onNext(); }} className="stop-btn">⏹️ Stop</button>
      )}
    </div>
  );
};

export default Part2;

