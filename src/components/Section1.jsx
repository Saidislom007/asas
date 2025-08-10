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

  // 🔹 Nested userAnswers uchun yangilangan funksiya
  const handleInputChange = (questionNumber, blankNumber, value) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionNumber]: {
        ...(prev[questionNumber] || {}),
        [blankNumber]: value,
      },
    }));
  };

  const checkCorrect = (number, correctAnswer) => {
    const userValue = (userAnswers[number] || '').trim().toLowerCase();
    const correctVariants = correctAnswer
      .replace(/"/g, '')
      .split(',')
      .map((s) => s.trim().toLowerCase());
    return correctVariants.includes(userValue);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    let count = 0;

    data.questions.forEach((q) => {
      if (q.question_type === 'table_completion' && q.table?.answers) {
        q.table.answers.forEach((ans) => {
          if (checkCorrect(ans.number, ans.correct_answer)) count++;
        });
      } else if (q.question_type === 'form_completion' && q.form?.answers) {
        q.form.answers.forEach((ans) => {
          if (checkCorrect(ans.number, ans.correct_answer)) count++;
        });
      } else if (q.question_type === 'sentence_completion') {
        // 🔹 SentenceCompletion uchun nested inputlarni tekshirish
        if (Array.isArray(q.correct_answer)) {
          q.correct_answer.forEach((ans) => {
            if (
              userAnswers[q.question_number]?.[ans.number] &&
              checkCorrect(q.question_number, ans.correct_answer)
            ) {
              count++;
            }
          });
        }
      } else if (q.question_type === 'multiple_choice') {
        if (checkCorrect(q.question_number, q.correct_answer)) count++;
      } else if (q.question_type === 'map_labelling' && q.map?.answers) {
        q.map.answers.forEach((ans) => {
          if (checkCorrect(ans.number, ans.correct_answer)) count++;
        });
      }
    });

    setCorrectCount(count);
    if (onSubmit) onSubmit(count);
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="section-container">
      <h2 className="section-title">Section 1</h2>
      <div className="audio-player">
        {data.audio_file && <CustomAudioPlayer src={data.audio_file} />}
      </div>

      <p className="instruction-text">{data.instruction}</p>

      {data.questions.map((q) => (
        <QuestionRenderer
          key={q.id}
          question={q}
          userAnswers={userAnswers}
          submitted={submitted}
          onChange={handleInputChange}
        />
      ))}
    </div>
  );
};

export default Section1;
