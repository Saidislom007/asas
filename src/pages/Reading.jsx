import React, { useState } from "react";
import Passage1 from "../components/Passage1";
import Passage2 from "../components/Passage2";
import Passage3 from "../components/Passage3";
import ReadingTimer from "../components/ReadingTimer";
import "./m.css";

const Reading = () => {
  const [results, setResults] = useState({
    passage1: null,
    passage2: null,
    passage3: null,
  });

  const [fontSize, setFontSize] = useState(16);
  const [testFinished, setTestFinished] = useState(false);
  const [testStarted, setTestStarted] = useState(false); // test boshlandimi?
  const [timerKey, setTimerKey] = useState(0); // timer reset uchun

  // 🔧 Font zoom funksiyalari
  const increaseFont = () => {
    setFontSize((prev) => Math.min(prev + 2, 48));
  };
  const decreaseFont = () => {
    setFontSize((prev) => Math.max(prev - 2, 10));
  };

  const handleTimeUp = () => {
    alert("Time is up! Submitting your test automatically...");
    handleFinalSubmit();
  };

  const handlePassageResult = (passageKey, correctCount) => {
    setResults((prev) => ({
      ...prev,
      [passageKey]: correctCount,
    }));
  };

  const handleFinalSubmit = () => {
    if (testFinished) return;
    setTestFinished(true);

    const total =
      (results.passage1 || 0) +
      (results.passage2 || 0) +
      (results.passage3 || 0);

    const userData = localStorage.getItem("user");
    if (!userData) {
      alert("Foydalanuvchi ma'lumoti topilmadi.");
      return;
    }

    const user = JSON.parse(userData);
    const userId = user.id;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/test-results/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: userId,
        reading_correct_answers: total,
        listening_correct_answers: 0,
        speaking_score: 0,
        writing_score: 0,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Xatolik yuz berdi.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Natija yuborildi:", data);
        alert("Test natijalari muvaffaqiyatli yuborildi!");
      })
      .catch((error) => {
        console.error("Server xatosi:", error);
        alert("Natijalarni yuborishda xatolik yuz berdi.");
      });
  };

  const startTest = () => {
    setTestStarted(true);
    setTestFinished(false);
    setTimerKey((prev) => prev + 1); // timer reset bo‘lishi uchun
  };

  return (
    <div className="reading-main">
      {/* Yuqori panel */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        {testStarted && !testFinished && (
          <ReadingTimer onTimeUp={handleTimeUp} isRunning={testStarted && !testFinished} />
        )}

        <div
          style={{
            background: "#f0f0f0",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "20px",
            fontWeight: "bold",
            boxShadow: "0 0 6px rgba(0,0,0,0.1)",
            display: "flex",
            gap: "10px",
          }}
        >
          <button onClick={decreaseFont} style={{ marginRight: "8px" }}>
            -
          </button>
          <button onClick={increaseFont}>+</button>
        </div>
      </div>

      {/* Agar test boshlanmagan bo‘lsa */}


      {/* Test boshlanganida Passagelar */}
   
        <>
          <div className="passage1">
            <Passage1
              fontSize={fontSize}
              onSubmit={(count) => handlePassageResult("passage1", count)}
              showAnswers={false}
            />
          </div>

          <div className="passage2">
            <Passage2
              fontSize={fontSize}
              onSubmit={(count) => handlePassageResult("passage2", count)}
              showAnswers={false}
            />
          </div>

          <div className="passage3">
            <Passage3
              
              fontSize={fontSize}
              onSubmit={(count) => handlePassageResult("passage3", count)}
              showAnswers={false}
            />
          </div>

          {/* Manual Complete tugmasi */}
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <button
              className="nav-button"
              onClick={handleFinalSubmit}
              disabled={testFinished}
            >
              Complete
            </button>
          </div>
        </>

    </div>
  );
};

export default Reading;
