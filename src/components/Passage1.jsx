import React, { useEffect, useState } from "react";
import axios from "axios";
import "../pages/ReadingTestMock.css";
import QuestionRenderer from './QuestionRenderer';

const Passage1 = ({ onSubmit, fontSize }) => {
  const [passage, setPassage] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  // 📥 API orqali passage ma'lumotlarini olish
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/reading-tests/1/passage/1`)
      .then((res) => {
        setPassage(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Xatolik yuz berdi:", err);
        setLoading(false);
      });
  }, []);

  // ✅ Javoblarni tekshirish
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

  // 🔄 Javobni o‘zgartirish funksiyasi
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
        {/* 🧾 Header */}
        <div className="header">
          <div className="header-content">
            <h1 className="header-title">{passage.title}</h1>
            <div className="header-info">Passage 1</div>
          </div>
        </div>

        {/* 📖 Asosiy Matn */}
        <div className="main-content">
          <div className="passage-section">
            <div className="passage-header">
              <div className="passage-badge">Passage 1</div>
              <p className="passage-instruction">{passage.instruction}</p>
            </div>
            <div
              className="passage-text"
              style={{ whiteSpace: "pre-line", fontSize: `${fontSize}px` }}
            >
              {passage.text}
            </div>
          </div>

          {/* ❓ Savollar bo‘limi */}
          <div className="questions-section">
            <div className="questions-header">
              <div className="questions-badge">Questions</div>
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

            {/* 📝 Submit tugmasi */}
            {!submitted && (
              <button className="submit-btn" onClick={handleSubmit}>
                Submit Answers
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Passage1;
