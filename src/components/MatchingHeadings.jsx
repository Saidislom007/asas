import React, { useEffect } from "react";
import "./MatchingHeadings.css";

const MatchingHeadings = ({ question, userAnswers, submitted, onChange, correctAnswers, onCorrectCountChange }) => {
  const qNum = question.question_number;

  const correctCount = Object.entries(userAnswers).reduce((count, [key, value]) => {
    if (correctAnswers[key] && correctAnswers[key] === value) {
      return count + 1;
    }
    return count;
  }, 0);

  // To‘g‘ri javoblar soni o‘zgarganda onCorrectCountChange chaqirish
  useEffect(() => {
    if (onCorrectCountChange) {
      onCorrectCountChange(correctCount);
    }
  }, [correctCount, onCorrectCountChange]);

  const renderWithSelects = (text) => {
    return text.split(/(\[\[[0-9]+\]\])/g).map((part, i) => {
      const match = part.match(/\[\[([0-9]+)\]\]/);
      if (match) {
        const gapNum = match[1];
        const key = `${qNum}-${gapNum}`;
        return (
          <select
            key={`gap-${gapNum}-${i}`}
            value={userAnswers[key] || ""}
            onChange={(e) => onChange(key, null, e.target.value)}
            disabled={submitted}
            className="border border-black-300 p-1 mx-1 rounded h-10"
          >
            <option value="">Q {gapNum}</option>
            {question.options?.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      }
      return part;
    });
  };

  return (
    <div className="matching-headings">
      {question.instruction && (
        <p style={{ color: "black", marginBottom: "20px", fontSize: "20px", fontWeight: "bold" }}>
          {question.instruction}
        </p>
      )}

      {(question.question_number === 23 || question.question_number === 32) && question.options?.length > 0 && (
        <div className="matching-options-box">
          <strong>Headings:</strong>
          <ul>
            {question.options.map((opt, idx) => (
              <li key={idx}>{opt}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="matching-text-box">
        {question.question_text ? renderWithSelects(question.question_text) : null}
      </div>

      {submitted && (
        <p className="correct-count">
          To'g'ri javoblar soni: {correctCount} / {Object.keys(correctAnswers).length}
        </p>
      )}
    </div>
  );
};

export default MatchingHeadings;
