import React from 'react';

const MapLabelling = ({
  imageSrc,
  userAnswers,
  onChange,
  submitted,
  questionText,
  options,
  questionNumber,
  instruction
}) => {
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    onChange(questionNumber, selectedValue); // value + questionNumber yuboriladi
  };

  return (
    <div style={{ paddingTop: '20px' }}>
      <p >{instruction}</p>
      {/* Xarita rasmi */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Map"
          style={{
            maxWidth: '500px',
            height: 'auto',
            borderRadius: '4px',
            border: '1px solid #ddd',
            marginBottom: '20px'
          }}
        />
      )}

      {/* Savol va select */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '12px',
          gap: '6px'
        }}
      >
        {questionText && (
          <label
            htmlFor={`q${questionNumber}`}
            style={{
              fontWeight: '600',
              flexShrink: 0
            }}
          >
            {questionNumber}: {questionText}
          </label>
        )}

        {options?.length > 0 && (
          <select
            id={`q${questionNumber}`}
            style={{
              border: '1px solid #ccc',
              minWidth: '70px',
              padding: '4px 6px',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            value={userAnswers?.[questionNumber] || ''}
            disabled={submitted}
            onChange={handleSelectChange}
          >
            <option value="">Select</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default MapLabelling;
