import React, { useState } from "react";
import "./MatchingHeadings.css";

const MatchingHeadings = ({ question }) => {
  const qNum = question.question_number;

  const [userAnswers, setUserAnswers] = useState({});
  const [correctMap, setCorrectMap] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const handleSelect = (gapKey, value) => {
    setUserAnswers((prev) => {
      const updated = { ...prev, [gapKey]: value };

      // To‘g‘ri javoblarni va correctMap ni yangilash
      let correctCount = 0;
      const newCorrectMap = {};

      for (const key in updated) {
        const userVal = updated[key]?.trim().toLowerCase() || "";
        const correctVal = (question.correct_answer || "").toString().trim().toLowerCase();

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

  const renderWithSelects = (text) => {
    return text.split(/(\[\[[0-9]+\]\])/g).map((part, i) => {
      const match = part.match(/\[\[([0-9]+)\]\]/);
      if (match) {
        const gapNum = match[1]; // To‘g‘ri indeks
        const gapKey = `${qNum}-${gapNum}`;

        return (
          <select
            key={gapKey}
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
            <option value="">Q {gapNum}</option>
            {question.options?.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="matching-headings">
      {question.instruction && (
        <p
          style={{
            color: "black",
            marginBottom: 20,
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {question.instruction}
        </p>
      )}

      {(qNum === 23 || qNum === 32) && question.options?.length > 0 && (
        <div className="matching-options-box">
          <strong>Headings:</strong>
          <ul>
            {question.options.map((opt, idx) => (
              <li key={idx}>{opt}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="matching-text-box">{renderWithSelects(question.question_text)}</div>

      <p>To‘g‘ri javoblar soni: {correctAnswers}</p>
    </div>
  );
};

export default MatchingHeadings;







// import React, {  } from "react";

// const TrueFalseNotGiven = ({ question, onCorrectCountChange }) => {
//   const qNum = question.question_number;
//   const [userValue, setUserValue] = useState("");
//   const [isCorrect, setIsCorrect] = useState(null); // null = hali tanlanmagan

//   const handleSelect = (value) => {
//     setUserValue(value);
//     const correct =
//       value.trim().toLowerCase() ===
//       question.correct_answer.trim().toLowerCase();
//     setIsCorrect(correct);
//     if (onCorrectCountChange) {
//       onCorrectCountChange(correct ? 1 : 0);
//     }
//   };

//   return (
//     <div>
//       <p>
//         <strong>Q{qNum}.</strong> {question.question_text}
//       </p>

//       {question.options?.map((opt, idx) => (
//         <label key={idx} style={{ display: "block" }}>
//           <input
//             type="radio"
//             name={`q-${qNum}`}
//             value={opt}
//             checked={userValue === opt}
//             onChange={() => handleSelect(opt)}
//           />
//           {opt}
//         </label>
//       ))}

//       {isCorrect !== null && (
//         <p style={{ color: isCorrect ? "green" : "red", fontWeight: "bold" }}>
//           {isCorrect
//             ? "To‘g‘ri!"
//             : `Noto‘g‘ri. To‘g‘ri javob: ${question.correct_answer}`}
//         </p>
//       )}
//     </div>
//   );
// };

