import React, { useState } from "react";

const MapLabelling = ({
  imageSrc,
  questionText,
  options = [],
  questionNumber,
  instruction,
  question,
}) => {
  const qNum = questionNumber;

  const [userAnswers, setUserAnswers] = useState({});
  const [correctMap, setCorrectMap] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const handleSelect = (gapKey, value) => {
    setUserAnswers((prev) => {
      const updated = { ...prev, [gapKey]: value };

      let correctCount = 0;
      const newCorrectMap = {};

      for (const key in updated) {
        const userVal = (updated[key] || "").toString().trim().toLowerCase();
        const correctVal =
          (question.correct_answer || "").toString().trim().toLowerCase();

        if (userVal === correctVal && userVal !== "") {
          correctCount++;
          newCorrectMap[key] = true;
        } else {
          newCorrectMap[key] = false;
        }
      }

      setCorrectAnswers(correctCount);
      setCorrectMap(newCorrectMap);
      console.log("To‘g‘ri javoblar soni:", correctCount);

      return updated;
    });
  };

  // Agar faqat bitta select bo‘lsa, gapKey ni shunday aniqlash mumkin:
  const gapKey = `${qNum}`;

  return (
    <div style={{ paddingTop: "20px" }}>
      {instruction && <p>{instruction}</p>}

      {imageSrc && (
        <img
          src={imageSrc}
          alt="Map"
          style={{
            maxWidth: "500px",
            height: "auto",
            borderRadius: "4px",
            border: "1px solid #ddd",
            marginBottom: "20px",
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
          gap: "6px",
        }}
      >
        {questionText && (
          <label
            htmlFor={`q${qNum}`}
            style={{ fontWeight: "600", flexShrink: 0 }}
          >
            {qNum}: {questionText}
          </label>
        )}

        {options.length > 0 && (
          <select
            id={`q${qNum}`}
            className="border border-gray-300 p-1 mx-1 rounded h-10"
            value={userAnswers[gapKey] || ""}
            onChange={(e) => handleSelect(gapKey, e.target.value)}
            style={{
              borderColor:
                correctMap[gapKey] === true
                  ? "green"
                  : correctMap[gapKey] === false
                  ? "red"
                  : undefined,
              backgroundColor:
                correctMap[gapKey] === true
                  ? "#d4edda"
                  : correctMap[gapKey] === false
                  ? "#f8d7da"
                  : undefined,
            }}
          >
            <option value="">Q {qNum}</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}
      </div>

      <p>To‘g‘ri javoblar soni: {correctAnswers}</p>
    </div>
  );
};

export default MapLabelling;
