// MultipleChoice.jsx
import React from 'react';

const MultipleChoice = ({ question, userAnswers, submitted, onChange,instruction }) => {
  const isMultiSelect = question.type=="matching" || false;
  const qNum = question.question_number;

  const handleSelect = (option) => {
    const existing = userAnswers[qNum] || [];
    let updated;

    if (isMultiSelect) {
      // Multi select: tanlangan bo‘lsa o‘chiramiz, bo‘lmasa qo‘shamiz
      updated = existing.includes(option)
        ? existing.filter((opt) => opt !== option)
        : [...existing, option];
    } else {
      // Radio: faqat bitta qiymat
      updated = [option];
    }

    onChange(qNum, updated);
    
  };

  return (
    <div className="multiple-choice">
      {question.instruction && (
        <p className="question-instruction">{question.instruction}</p>
      )}
      <p className="question-text">
        <strong>Q{qNum}.</strong> {question.question_text}
      </p>



      <div className="options">
        {question.options?.map((opt, idx) => (
          <label key={idx} className="option-label">
            <input
              type={isMultiSelect ? 'checkbox' : 'radio'}
              name={`q-${qNum}`}
              value={opt}
              checked={(userAnswers[qNum] || []).includes(opt)}
              onChange={() => handleSelect(opt)}
              disabled={submitted}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoice;
