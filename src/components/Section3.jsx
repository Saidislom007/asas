import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Section3.css';
import QuestionRenderer from './QuestionRenderer';
import CustomAudioPlayer from './CustomAudioPlayer';

// Global audio tracker
let globalAudioRefs = [];

const Section3 = ({ onSubmit, sectionIndex = 0 }) => {
  const [data, setData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const testId = import.meta.env.VITE_TEST_ID;

  const audioRef = useRef(null);

  // Register audioRef
  useEffect(() => {
    globalAudioRefs[sectionIndex] = audioRef;
    return () => {
      globalAudioRefs[sectionIndex] = null;
    };
  }, [sectionIndex]);

  // Fetch section data
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/listening-tests/${testId}/section/3/`)
      .then((res) => setData(res.data))
      .catch((err) => console.error('Error fetching section 3:', err));
  }, []);

  // Input boshqaruvi
  const handleInputChange = (number, _, value) => {
    setUserAnswers((prev) => ({
      ...prev,
      [number]: value,
    }));
  };

  // Javobni tekshirish
  const checkCorrect = (number, correctAnswer, type) => {
    const userValue = userAnswers[number];

    if (type === 'matching') {
      if (!Array.isArray(userValue)) return false;
      const correctVariants = correctAnswer
        .replace(/"/g, '')
        .split(',')
        .map((s) => s.trim().toUpperCase());
      return (
        userValue.length === 2 &&
        userValue.every((ans) => correctVariants.includes(ans.toUpperCase()))
      );
    }

    const userStr = (userValue || '').trim().toLowerCase();
    const correctVariants = correctAnswer
      .replace(/"/g, '')
      .split(',')
      .map((s) => s.trim().toLowerCase());
    return correctVariants.includes(userStr);
  };

  // Submit
  const handleSubmit = () => {
    setSubmitted(true);
    let count = 0;

    data.questions.forEach((q) => {
      if (q.question_type === 'table_completion' && q.table?.answers) {
        q.table.answers.forEach((ans) => {
          if (checkCorrect(ans.number, ans.correct_answer, q.question_type)) count++;
        });
      } else if (q.question_type === 'form_completion' && q.form?.answers) {
        q.form.answers.forEach((ans) => {
          if (checkCorrect(ans.number, ans.correct_answer, q.question_type)) count++;
        });
      } else if (q.question_type === 'sentence_completion') {
        if (checkCorrect(q.question_number, q.correct_answer, q.question_type)) count++;
      } else if (q.question_type === 'multiple_choice') {
        if (checkCorrect(q.question_number, q.correct_answer, q.question_type)) count++;
      } else if (q.question_type === 'multiple_choice_two') {
        if (checkCorrect(q.question_number, q.correct_answer, q.question_type)) count++;
      } else if (q.question_type === 'matching') {
        if (checkCorrect(q.question_number, q.correct_answer, q.question_type)) count++;
      } else if (q.question_type === 'map_labelling' && q.map?.answers) {
        q.map.answers.forEach((ans) => {
          if (checkCorrect(ans.number, ans.correct_answer, q.question_type)) count++;
        });
      }
    });

    setCorrectCount(count);
    if (onSubmit) onSubmit(count);
  };

  // Audio boshqaruvi
  const handleAudioPlay = () => {
    globalAudioRefs.forEach((ref, idx) => {
      if (idx !== sectionIndex && ref?.current && !ref.current.paused) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });
  };
  
  if (!data) return <div>Loading...</div>;

  // multiple_choice_two ni faqat 1 marta render qilish uchun nazorat


  return (
    <div className="section-container">
      <h2 className="section-title">Section 3</h2>

      {data.audio_file && <CustomAudioPlayer src={data.audio_file} />}

{data.questions.map((q, idx) => {
  // Questions 21 va 22 guruhiga oid bo'lsa:
  if (q.question_type === 'matching' && (q.question_number === 21 || q.question_number === 22)) {
    // Faqat 21-savol uchun instruction ni chiqaring
    const showInstruction = q.question_number === 21;

    return (
      <div key={q.id} className="matching-radio-question" style={{ marginBottom: '20px' }}>
        {showInstruction && (
          <p style={{ fontWeight: 'bold' }}>
            Questions 21 and 22 Choose TWO letters, A-E.<br />
            Which TWO groups of people is the display primarily intended for?
          </p>
        )}

        {q.options && q.options.length > 0 ? (
          q.options.map((option, idxOption) => {
            const value = option;
            const checked = userAnswers[q.question_number] === value;
            return (
              <label
                key={idxOption}
                style={{ display: 'block', marginBottom: '8px', cursor: submitted ? 'default' : 'pointer' }}
              >
                <input
                  type="radio"
                  name={`matching-${q.question_number}`}
                  value={value}
                  checked={checked}
                  disabled={submitted}
                  onChange={() => handleInputChange(q.question_number, null, value)}
                  style={{ marginRight: '8px' }}
                />
                {option}
              </label>
            );
          })
        ) : (
          <p>Options are not defined.</p>
        )}
      </div>
    );
  }

  // Boshqa matching savollar uchun oddiy radio buttonlar
  if (q.question_type === 'matching') {
    return (
      <div key={q.id} className="matching-radio-question" style={{ marginBottom: '20px' }}>
        <p style={{ fontWeight: 'bold' }}>
          {q.instruction ? q.instruction : `Question ${q.question_number}`}
        </p>

        {q.options && q.options.length > 0 ? (
          q.options.map((option, idxOption) => {
            const value = option;
            const checked = userAnswers[q.question_number] === value;
            return (
              <label
                key={idxOption}
                style={{ display: 'block', marginBottom: '8px', cursor: submitted ? 'default' : 'pointer' }}
              >
                <input
                  type="radio"
                  name={`matching-${q.question_number}`}
                  value={value}
                  checked={checked}
                  disabled={submitted}
                  onChange={() => handleInputChange(q.question_number, null, value)}
                  style={{ marginRight: '8px' }}
                />
                {option}
              </label>
            );
          })
        ) : (
          <p>Options are not defined.</p>
        )}
      </div>
    );
  }

        return (
          <QuestionRenderer
            key={q.id}
            question={q}
            userAnswers={userAnswers}
            submitted={submitted}
            onChange={handleInputChange}
            allQuestions={data.questions}
          />
        );
      })}

      
    </div>
  );
};

export default Section3;
