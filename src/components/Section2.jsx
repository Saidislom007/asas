import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Section2.css';
import QuestionRenderer from './QuestionRenderer';
import CustomAudioPlayer from './CustomAudioPlayer';

let globalAudioRefs = [];

const Section2 = ({ onSubmit, sectionIndex = 0 }) => {
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
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/listening-tests/${testId}/section/2/`)
      .then((res) => setData(res.data))
      .catch((err) => console.error('Error fetching section 2:', err));
  }, []);

  // Universal handleInputChange
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

  const checkCorrect = (number, correctAnswer) => {
    const userValue = (userAnswers[number] || '').trim?.().toLowerCase?.() || '';
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
        // Nested blanklar uchun
        if (Array.isArray(q.correct_answer)) {
          q.correct_answer.forEach((ans) => {
            if (
              userAnswers[q.question_number]?.[ans.number] &&
              checkCorrect(q.question_number, ans.correct_answer)
            ) {
              count++;
            }
          });
        } else {
          if (checkCorrect(q.question_number, q.correct_answer)) count++;
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

  const handleAudioPlay = () => {
    globalAudioRefs.forEach((ref, idx) => {
      if (idx !== sectionIndex && ref?.current && !ref.current.paused) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });
  };

  if (!data) return <div></div>;

  return (
    <div className="section-container">
      <h2 className="section-title">Section 2</h2>

      {data.audio_file && (
        <CustomAudioPlayer src={data.audio_file} />
      )}

      <p className="instruction-text">{data.instruction}</p>

      {data.questions.map((q) => (
        <QuestionRenderer
          key={q.id}
          question={q}
          userAnswers={userAnswers}
          allQuestions={data.questions}
          submitted={submitted}
          onChange={handleInputChange}
        />
      ))}


    </div>
  );
};

export default Section2;