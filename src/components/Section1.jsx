import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Section1.css';
import QuestionRenderer from './QuestionRenderer';
import CustomAudioPlayer from './CustomAudioPlayer';

let globalAudioRefs = [];

const Section1 = ({ onSubmit, sectionIndex = 0 }) => {
  const [data, setData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  // Har bir savoldan kelgan to'g'ri javoblarni saqlash uchun
  const [individualCorrectCounts, setIndividualCorrectCounts] = useState({});

  const testId = 1;
  const audioRef = useRef(null);

  useEffect(() => {
    globalAudioRefs[sectionIndex] = audioRef;
    return () => {
      globalAudioRefs[sectionIndex] = null;
    };
  }, [sectionIndex]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/listening-tests/${testId}/section/1/`)
      .then((res) => setData(res.data))
      .catch((err) => console.error('Error fetching section 1:', err));
  }, []);

  // Universal userAnswers uchun funksiya
  const handleInputChange = (questionNumber, blankNumber, value) => {
    if (blankNumber === null || blankNumber === undefined) {
      setUserAnswers((prev) => ({
        ...prev,
        [questionNumber]: value,
      }));
    } else {
      setUserAnswers((prev) => ({
        ...prev,
        [questionNumber]: {
          ...(prev[questionNumber] || {}),
          [blankNumber]: value,
        },
      }));
    }
  };

  // Callback: har bir savoldan kelgan correctCount ni qabul qiladi
  const handleCorrectCountChange = (questionNumber, count) => {
    setIndividualCorrectCounts((prev) => {
      const newCounts = { ...prev, [questionNumber]: count };
      const total = Object.values(newCounts).reduce((a, b) => a + b, 0);
      setCorrectCount(total);
      return newCounts;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);

    // Agar handleSubmitda yana bir marta umumiy hisoblash kerak bo'lsa,
    // shu yerda ham hisoblash mumkin, lekin hozir biz individualCorrectCounts ga
    // ishonamiz. Agar kerak bo'lsa, bu yerda hisoblashni yozing.
    
    if (onSubmit) onSubmit(correctCount);
  };

  if (!data)
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );

  return (
    <div className="section-container">
      <h2 className="section-title">Section 1</h2>
      <div className="audio-player">{data.audio_file && <CustomAudioPlayer src={data.audio_file} />}</div>

      <p className="instruction-text">{data.instruction}</p>

      {data.questions.map((q) => (
        <QuestionRenderer
          key={q.id}
          question={q}
          userAnswers={userAnswers}
          submitted={submitted}
          onChange={handleInputChange}
          onCorrectCountChange={(count) => handleCorrectCountChange(q.question_number, count)}
        />
      ))}

      <button onClick={handleSubmit} disabled={submitted} className="submit-btn">
        Submit
      </button>

      {submitted && (
        <p className="correct-count">
          To'g'ri javoblar soni: {correctCount} / {data.questions.length}
        </p>
      )}
    </div>
  );
};

export default Section1;
