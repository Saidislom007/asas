import { useState, useMemo, useEffect } from "react";

const SentenceCompletion = ({
  number,
  questionText,
  onChange,
  submitted = false,  // endi default false, ya'ni yozish mumkin
  instruction,
  question,
  onCorrectCountChange,
}) => {
  const [userValues, setUserValues] = useState({});

  const handleChange = (blankNum, value) => {
    setUserValues((prev) => {
      const updated = { ...prev, [blankNum]: value };
      if (onChange) onChange(updated);
      return updated;
    });
  };

  const correctMap = useMemo(() => {
    const map = {};
    const correctAnswer = (question?.correct_answer || "")
      .toString()
      .trim()
      .toLowerCase();

    const blanks = [...questionText.matchAll(/\[\[(\d+)\]\]/g)];
    blanks.forEach((match) => {
      const blankNum = match[1];
      const userAns = (userValues[blankNum] || "").toString().trim().toLowerCase();
      map[blankNum] = userAns === correctAnswer;
    });

    return map;
  }, [userValues, question?.correct_answer, questionText]);

  useEffect(() => {
    if (onCorrectCountChange) {
      const correctCount = Object.values(correctMap).filter(Boolean).length;
      onCorrectCountChange(correctCount);
    }
  }, [correctMap, onCorrectCountChange]);

  const parts = questionText.split(/(\[\[\d+\]\])/g);

  return (
    <div className="instruction">
      {instruction && (
        <p
          style={{
            color: "black",
            marginBottom: 20,
            fontSize: 20,
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
          padding: 15,
          borderRadius: 8,
          backgroundColor: "#f9f9f9",
          lineHeight: 1.6,
        }}
      >
        <p style={{ margin: 0 }}>
          {parts.map((part, idx) => {
            const match = part.match(/\[\[(\d+)\]\]/);
            if (match) {
              const blankNum = match[1];
              const isTrue = correctMap[blankNum] === true;
              const hasValue = userValues[blankNum]?.length > 0;

              return (
                <input
                  key={blankNum}
                  type="text"
                  placeholder={`Q${blankNum}`}
                  className="border border-gray-300 p-1 mx-1 rounded"
                  value={userValues[blankNum] || ""}
                  disabled={false}   // yozish doim mumkin
                  autoComplete="off"
                  onChange={(e) => handleChange(blankNum, e.target.value)}
                  style={{
                    borderColor: hasValue
                      ? (isTrue ? "green" : "red")
                      : undefined,
                    backgroundColor: isTrue ? "#d4edda" : undefined,
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
