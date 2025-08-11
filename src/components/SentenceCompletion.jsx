import React from "react";
import "./Sentence.css";

/**
 * SentenceCompletion component
 * Props:
 * - number: savol raqami (kerak bo‘lsa)
 * - questionText: gap matni, blanklar [[1]], [[2]], ...
 * - userAnswers: { [blankNumber]: value } tipida object (masalan: {1: "Paris", 2: "Seine"})
 * - onChange: (blankNumber, null, value) => void
 * - submitted: boolean (inputlar disabled bo‘lishi uchun)
 * - instruction: (ixtiyoriy) matn
 * - correctAnswer / correctAnswers: (ixtiyoriy) to‘g‘ri javob yoki javoblar (agar kerak bo‘lsa)
 */
const SentenceCompletion = ({
  number,
  questionText,
  userAnswers = {},
  onChange,
  submitted,
  instruction,
  correctAnswers = {},
}) => {
  // Matnni [[1]], [[2]] bo‘yicha bo‘lib olish
  const parts = questionText.split(/(\[\[\d+\]\])/g);

  // Javobni tekshirish uchun yordamchi funksiya
  const isCorrect = (blankNum) => {
    const userVal = (userAnswers[blankNum] || "").trim().toLowerCase();
    const correctVal = (correctAnswers[blankNum] || "").toString().trim().toLowerCase();
    return userVal && correctVal && userVal === correctVal;
  };

  return (
    <div className="instruction">
      {instruction && (
        <p
          style={{
            color: "black",
            marginBottom: "20px",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          {instruction}
        </p>
      )}

      <div
        className="sentence-completion"
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          lineHeight: "1.6",
        }}
      >
        <p style={{ margin: 0 }}>
          {parts.map((part, idx) => {
            const match = part.match(/\[\[(\d+)\]\]/);
            if (match) {
              const blankNum = parseInt(match[1], 10);
              return (
                <input
                  key={blankNum}
                  type="text"
                  placeholder={`Q${blankNum}`}
                  className="border border-gray-300 p-1 mx-1 rounded"
                  value={userAnswers[blankNum] || ""}
                  disabled={submitted}
                  onChange={(e) => onChange(blankNum, null, e.target.value)}
                  autoComplete="off"
                  style={{
                    borderColor:
                      submitted && !isCorrect(blankNum) ? "red" : undefined,
                    backgroundColor:
                      submitted && isCorrect(blankNum) ? "#d4edda" : undefined,
                  }}
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
