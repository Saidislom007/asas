import React, { useState } from 'react';
import Section1 from '../components/Section1';
import Section2 from '../components/Section2';
import Section3 from '../components/Section3';
import Section4 from '../components/Section4';
import axios from 'axios';

const Listening = () => {
  const [results, setResults] = useState({
    section1: null,
    section2: null,
    section3: null,
    section4: null
  });

  const handleSubmitAll = () => {
    // Barcha sectionlar yakunlanganini tekshirish
    const isAllCompleted = Object.values(results).every(val => val !== null);

    if (!isAllCompleted) {
      alert("Iltimos, barcha sectionlarni yakunlang.");
      return;
    }

    // Umumiy to‘g‘ri javoblarni hisoblash
    const totalCorrect =
      (results.section1 || 0) +
      (results.section2 || 0) +
      (results.section3 || 0) +
      (results.section4 || 0);

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      alert("User ID topilmadi.");
      return;
    }

    // Yuboriladigan ma’lumot
    const payload = {
      user: user.id,
      reading_correct_answers: 0,
      listening_correct_answers: totalCorrect,
      speaking_score: 0,
      writing_score: 0,
    };

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/user/test-results/`, payload)
      .then(() => alert(`Natijalar muvaffaqiyatli yuborildi.`))
      .catch((err) => {
        console.error("Xatolik yuz berdi:", err);
        alert("Xatolik yuz berdi, ma'lumotni yuborishda.");
      });
  };

  return (
    <div className="main">
      <Section1 onSubmit={(count) => setResults((prev) => ({ ...prev, section1: count }))} />
      <Section2 onSubmit={(count) => setResults((prev) => ({ ...prev, section2: count }))} />
      <Section3 onSubmit={(count) => setResults((prev) => ({ ...prev, section3: count }))} />
      <Section4 onSubmit={(count) => setResults((prev) => ({ ...prev, section4: count }))} />

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button onClick={handleSubmitAll} className="submit-btn">
          Complete
        </button>
      </div>
    </div>
  );
};

export default Listening;
