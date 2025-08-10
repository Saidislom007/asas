import React from "react";
import "./Sentence.css";

const SentenceCompletion = ({
  number,
  questionText,
  userAnswer = {},
  onChange,
  submitted,
  instruction
}) => {
  // [[ ]] joylarini bo‘lib olish
  const parts = questionText.split(/(\[\[\d+\]\])/g);

  return (
    <div className="instruction">
      {instruction && <p>{instruction}</p>}

      {/* Umumiy bitta ramka */}
      <div
        className="sentence-completion"
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          lineHeight: "1.6"
        }}
      >
        <p style={{ margin: 0 }}>
          {parts.map((part, idx) => {
            const match = part.match(/\[\[(\d+)\]\]/);
            if (match) {
              const qNum = parseInt(match[1], 10);
              return (
                <input
                  key={idx}
                  type="text"
                  placeholder={`Q${qNum}`}
                  className="border border-gray-300 p-1 mx-1 rounded w-24"
                  value={userAnswer[qNum] || ""}
                  disabled={submitted}
                  onChange={(e) => onChange(qNum, e.target.value)}
                />
              );
            }
            return <span key={idx}>{part}</span>;
          })}
        </p>
      </div>
    </div>
  );
};

export default SentenceCompletion;
