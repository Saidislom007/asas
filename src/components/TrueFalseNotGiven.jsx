import React from "react";

const TrueFalseNotGiven = ({ question, userAnswers = {}, submitted, onChange }) => {
  const qNum = question?.question_number;
  const options = question?.options || [];

  return (
    <div className="true-false-not-given">
      {question?.instruction && (
        <p style={{color:"black",marginBottom:"20px",fontSize:"20px",fontWeight:"bold"}}>{question.instruction}</p>
      )}

      <div className="question-header">
        <strong>Q{qNum}.</strong> {question?.question_text}
      </div>

      <div className="options">
        {options.map((opt) => (
          <label key={opt} className="option-label">
            <input
              type="radio"
              name={`q-${qNum}`}
              value={opt}
              checked={opt}
              onChange={() => onChange(qNum, opt)}
              disabled={submitted}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
};

export default TrueFalseNotGiven;
