import React, { useState } from "react";

const MultipleChoice = ({ question, onCorrectCountChange }) => {
  const qNum = question.question_number;
  const [userValue, setUserValue] = useState("");
  const [isCorrect, setIsCorrect] = useState(null); // null = hali tanlanmagan

  const handleSelect = (value) => {
    setUserValue(value);
    const correct =
      value.trim().toLowerCase() ===
      question.correct_answer.trim().toLowerCase();
    setIsCorrect(correct);
    if (onCorrectCountChange) {
      onCorrectCountChange(correct ? 1 : 0);
    }
  };

  return (
    <div>
      <p>
        <strong>Q{qNum}.</strong> {question.question_text}
      </p>

      {question.options?.map((opt, idx) => (
        <label key={idx} style={{ display: "block" }}>
          <input
            type="radio"
            name={`q-${qNum}`}
            value={opt}
            checked={userValue === opt}
            onChange={() => handleSelect(opt)}
          />
          {opt}
        </label>
      ))}

      {isCorrect !== null && (
        <p style={{ color: isCorrect ? "green" : "red", fontWeight: "bold" }}>
          {isCorrect
            ? "To‘g‘ri!"
            : `Noto‘g‘ri. To‘g‘ri javob: ${question.correct_answer}`}
        </p>
      )}
    </div>
  );
};

export default MultipleChoice;
