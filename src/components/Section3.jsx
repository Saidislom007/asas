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

  // For multi-matching groups (21-22 and 23-24)
  const [multiMatchingAnswers21_22, setMultiMatchingAnswers21_22] = useState([]);
  const [multiMatchingAnswers23_24, setMultiMatchingAnswers23_24] = useState([]);

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
  }, [testId]);

  // For single-answer questions
  const handleInputChange = (number, _, value) => {
    setUserAnswers((prev) => ({
      ...prev,
      [number]: value,
    }));
  };

  // Multi-matching group input handler
  const handleMultiMatchingChange = (which, option) => {
    if (which === '21_22') {
      setMultiMatchingAnswers21_22((prev) => {
        if (prev.includes(option)) {
          return prev.filter((val) => val !== option);
        } else if (prev.length < 2) {
          return [...prev, option];
        }
        return prev;
      });
    } else if (which === '23_24') {
      setMultiMatchingAnswers23_24((prev) => {
        if (prev.includes(option)) {
          return prev.filter((val) => val !== option);
        } else if (prev.length < 2) {
          return [...prev, option];
        }
        return prev;
      });
    }
  };

  // Javobni tekshirish
  const checkCorrect = (number, correctAnswer, type) => {
    // Multi-matching groups
    if (type === 'matching' && (number === 21 || number === 22)) {
      const idx = number === 21 ? 0 : 1;
      const userAns = multiMatchingAnswers21_22[idx];
      if (!userAns) return false;
      const correctVariants = correctAnswer
        .replace(/"/g, '')
        .split(',')
        .map((s) => s.trim().toUpperCase());
      return correctVariants.includes(userAns.toUpperCase());
    }
    if (type === 'matching' && (number === 23 || number === 24)) {
      const idx = number === 23 ? 0 : 1;
      const userAns = multiMatchingAnswers23_24[idx];
      if (!userAns) return false;
      const correctVariants = correctAnswer
        .replace(/"/g, '')
        .split(',')
        .map((s) => s.trim().toUpperCase());
      return correctVariants.includes(userAns.toUpperCase());
    }

    // Single-matching or other
    const userValue = userAnswers[number];

    if (type === 'matching') {
      if (!userValue) return false;
      const userStr = (userValue || '').trim().toUpperCase();
      const correctVariants = correctAnswer
        .replace(/"/g, '')
        .split(',')
        .map((s) => s.trim().toUpperCase());
      return correctVariants.includes(userStr);
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
    // Multi-matching javoblarni userAnswers state ga joylash
    setUserAnswers((prev) => ({
      ...prev,
      21: multiMatchingAnswers21_22[0],
      22: multiMatchingAnswers21_22[1],
      23: multiMatchingAnswers23_24[0],
      24: multiMatchingAnswers23_24[1],
    }));
    setSubmitted(true);
    let count = 0;

    data.questions.forEach((q) => {
      if (
        q.question_type === 'matching' &&
        (q.question_number === 21 || q.question_number === 22)
      ) {
        if (checkCorrect(q.question_number, q.correct_answer, q.question_type)) count++;
      } else if (
        q.question_type === 'matching' &&
        (q.question_number === 23 || q.question_number === 24)
      ) {
        if (checkCorrect(q.question_number, q.correct_answer, q.question_type)) count++;
      } else if (q.question_type === 'table_completion' && q.table?.answers) {
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

  if (!data) return <div></div>;

  // Multi-matching render flaglari
  let renderedMultiMatching21_22 = false;
  let renderedMultiMatching23_24 = false;

  return (
    <div className="section-container">
      <h2 className="section-title">Section 3</h2>

      {data.audio_file && <CustomAudioPlayer src={data.audio_file} />}

      {data.questions.map((q, idx) => {
        // 21-22 multi-matching group
        if (
          q.question_type === 'matching' &&
          (q.question_number === 21 || q.question_number === 22)
        ) {
          if (renderedMultiMatching21_22) return null;
          renderedMultiMatching21_22 = true;

          // 21-savol options ni ishlatamiz
          const options =
            data.questions.find(
              (quest) =>
                quest.question_type === 'matching' && quest.question_number === 21
            )?.options || [];

          return (
            <div key="matching-21-22" className="matching-checkbox-question" style={{ marginBottom: '20px' }}>
              <p style={{ fontWeight: 'bold' }}>
                Questions 21 and 22 Choose <b>TWO</b> letters, A-E.<br />
                Which TWO groups of people is the display primarily intended for?
              </p>
              {options.map((option, idxOption) => (
                <label
                  key={idxOption}
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    cursor: submitted ? 'default' : 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    name="matching-21-22"
                    value={option}
                    checked={multiMatchingAnswers21_22.includes(option)}
                    disabled={
                      submitted ||
                      (multiMatchingAnswers21_22.length === 2 &&
                        !multiMatchingAnswers21_22.includes(option))
                    }
                    onChange={() => handleMultiMatchingChange('21_22', option)}
                    style={{ marginRight: '8px' }}
                  />
                  {option}
                </label>
              ))}
              {submitted && (
                <div style={{ color: 'green' }}>
                  Your answers: {multiMatchingAnswers21_22.join(', ')}
                </div>
              )}
            </div>
          );
        }

        // 23-24 multi-matching group
        if (
          q.question_type === 'matching' &&
          (q.question_number === 23 || q.question_number === 24)
        ) {
          if (renderedMultiMatching23_24) return null;
          renderedMultiMatching23_24 = true;

          // 23-savol options ni ishlatamiz
          const options =
            data.questions.find(
              (quest) =>
                quest.question_type === 'matching' && quest.question_number === 23
            )?.options || [];

          return (
            <div key="matching-23-24" className="matching-checkbox-question" style={{ marginBottom: '20px' }}>
              <p style={{ fontWeight: 'bold' }}>
                Questions 23 and 24 Choose <b>TWO</b> letters, A-E.<br />
                Which TWO things can visitors do at the display?
              </p>
              {options.map((option, idxOption) => (
                <label
                  key={idxOption}
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    cursor: submitted ? 'default' : 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    name="matching-23-24"
                    value={option}
                    checked={multiMatchingAnswers23_24.includes(option)}
                    disabled={
                      submitted ||
                      (multiMatchingAnswers23_24.length === 2 &&
                        !multiMatchingAnswers23_24.includes(option))
                    }
                    onChange={() => handleMultiMatchingChange('23_24', option)}
                    style={{ marginRight: '8px' }}
                  />
                  {option}
                </label>
              ))}
              {submitted && (
                <div style={{ color: 'green' }}>
                  Your answers: {multiMatchingAnswers23_24.join(', ')}
                </div>
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
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        cursor: submitted ? 'default' : 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name={`matching-${q.question_number}`}
                        value={value}
                        checked={checked}
                        disabled={submitted}
                        onChange={() =>
                          handleInputChange(q.question_number, null, value)
                        }
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

        // Qolgan savollar uchun
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