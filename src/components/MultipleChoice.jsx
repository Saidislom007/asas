import React from 'react';

const MultipleChoice = ({
  question,
  userAnswers = {},   // Default qiymat
  onChange,
  instruction,
  submitted,
  correctAnswer,
  onCorrectCountChange,
}) => {
  const qNum = question.question_number;
  const userValue = userAnswers[qNum] || "";

  const handleSelect = (option) => {
    onChange(qNum, null, option);
  };

  // Javob to'g'riligi tekshiruvi
  React.useEffect(() => {
    if (submitted && onCorrectCountChange) {
      const isCorrect = userValue.toString().trim().toLowerCase() === correctAnswer.toString().trim().toLowerCase();
      onCorrectCountChange(isCorrect ? 1 : 0);
    }
    // Submit yoki userValue o'zgarganda qayta hisoblaymiz
  }, [submitted, userValue, correctAnswer, onCorrectCountChange]);

  return (
    <div className="multiple-choice">
      {instruction && (
        <p style={{ color: "black", marginBottom: "20px", fontSize: "20px", fontWeight: "bold" }}>
          {instruction}
        </p>
      )}
      <p className="question-text">
        <strong>Q{qNum}.</strong> {question.question_text}
      </p>
      <div className="options">
        {question.options?.map((opt, idx) => (
          <label key={idx} className="option-label" style={{ display: "block", marginBottom: "10px", cursor: "pointer" }}>
            <input
              type="radio"
              name={`q-${qNum}`}
              value={opt}
              checked={userValue === opt}
              onChange={() => handleSelect(opt)}
              disabled={submitted}
            />
            {opt}
          </label>
        ))}
      </div>
      {submitted && (
        <p style={{ marginTop: "10px", fontWeight: "bold", color: userValue === correctAnswer ? "green" : "red" }}>
          To'g'ri javob: {correctAnswer}
        </p>
      )}
    </div>
  );
};

export default MultipleChoice;
