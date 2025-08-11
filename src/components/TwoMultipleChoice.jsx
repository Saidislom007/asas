// TwoMultipleChoice.jsx
import React from 'react';
import MultipleChoice from './MultipleChoice';

const TwoMultipleChoice = ({
  question,
  userAnswer = "", // faqat string
  onChange,
  instruction,
  submitted = false
}) => {
  // question.sub_questions ichida ikkita sub-question bo'ladi
  if (!Array.isArray(question.sub_questions) || question.sub_questions.length === 0) {
    return null;
  }
  const qNum = question.question_number;

  const handleSelect = (option) => {
    onChange(qNum, null, option);
  };

  return (
    <div className="two-multiple-choice">
      {question.instruction && (
        <p className="question-instruction">{question.instruction}</p>
      )}

      <div className="two-questions-container" style={{ display: 'flex', gap: '20px' }}>
        {question.sub_questions.map((subQ, idx) => (
          <div key={idx} style={{ flex: 1 }}>
            <MultipleChoice
              question={subQ}
              userAnswers={userAnswers}
              submitted={submitted}
              onChange={onChange}
              allQuestions={allQuestions}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TwoMultipleChoice;
