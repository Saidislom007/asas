import React, { useEffect, useState } from "react";
import axios from "axios";
import "../pages/ReadingTestMock.css";
import QuestionRenderer from "./QuestionRenderer";

const Passage3 = ({ onSubmit, fontSize }) => {
  const [passage, setPassage] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/reading-tests/1/passage/3`)
      .then((res) => {
        setPassage(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Xatolik:", err);
        setLoading(false);
      });
  }, []);

  const checkCorrect = (userValue, correctAnswer) => {
    const normalizedUser = (userValue || "").trim().toLowerCase();
    const normalizedCorrect = (correctAnswer || "").trim().toLowerCase();
    return normalizedUser === normalizedCorrect;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    let count = 0;

    passage.questions.forEach((q) => {
      if (checkCorrect(userAnswers[q.id], q.correct_answer)) {
        count++;
      }
    });

    if (onSubmit) onSubmit(count);
  };

  const handleAnswerChange = (questionId, value) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  if (loading || !passage) {
    return <div className="reading-test-container">Yuklanmoqda...</div>;
  }

  return (
    <div className="reading-test-container">
      <div className="reading-test-wrapper">
        <div className="header">
          <div className="header-content">
            <h1 className="header-title">{passage.title}</h1>
            <div className="header-info">Passage 3</div>
          </div>
        </div>

        <div className="main-content">
          {/* Matn */}
          <div className="passage-section">
            <div className="passage-header">
              <div className="passage-badge">Passage 3</div>
              <p className="passage-instruction">{passage.instruction}</p>
            </div>
            <div className="passage-content">
              <div
                className="passage-text"
                style={{
                  whiteSpace: "pre-line",
                  fontSize: `${fontSize}px`,
                }}
              >
                {passage.text}
              </div>
            </div>
          </div>

          {/* Savollar */}
          <div className="questions-section">
            <div className="questions-header">
              <div className="questions-badge">
                Questions {passage.questions[0]?.question_number} -{" "}
                {passage.questions.at(-1)?.question_number}
              </div>
            </div>

            <div className="questions-list">
              {passage.questions.map((q) => (
                <QuestionRenderer
                  key={q.id}
                  question={q}
                  userAnswers={userAnswers}
                  submitted={submitted}
                  onChange={(num, val) => handleAnswerChange(q.id, val)}
                />
              ))}
            </div>

            {/* Summary bo‘limi */}
            {passage.summary && (
              <div className="summary-section">
                <div className="summary-badge">Summary</div>
                <p className="summary-instruction">
                  Complete the summary below. Use NO MORE THAN TWO WORDS.
                </p>
                <div className="summary-content">
                  <p className="summary-text">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: passage.summary.replace(
                          /\[\[([0-9]+)\]\]/g,
                          (_, idx) =>
                            `<input type="text" class="summary-input" placeholder="Gap ${idx}" disabled />`
                        ),
                      }}
                    />
                  </p>
                </div>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
};

export default Passage3;
