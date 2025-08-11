import React from 'react';
import SentenceCompletion from './SentenceCompletion';
import TableCompletion from './TableCompletion';
import FormCompletion from './FormCompletion';
import MultipleChoice from './MultipleChoice';
import MapLabelling from './MapLabelling';
import MatchingHeadings from './MatchingHeadings';
import TrueFalseNotGiven from './TrueFalseNotGiven';
import MatchingTwoAnswers from './MatchingTwoAnswers';

const componentMap = {
  sentence_completion: SentenceCompletion,
  table_completion: TableCompletion,
  form_completion: FormCompletion,
  multiple_choice: MultipleChoice,
  map_labelling: MapLabelling,
  matching_headings: MatchingHeadings,
  true_false_not_given: TrueFalseNotGiven,
  multiple_choice_two: MatchingTwoAnswers,
};

const QuestionRenderer = ({
  question,
  userAnswers,
  submitted,
  onChange,
  allQuestions,
  onCorrectCountChange,
}) => {
  const Component = componentMap[question.question_type];
  if (!Component) return null;

  // Har bir question tipiga mos to'g'ri javoblar sonini hisoblab, onCorrectCountChange ga yuborish uchun
  // Example: MatchingHeadings ichida count hisoblanadi va chaqiriladi

  // Sentence completion
  if (question.question_type === 'sentence_completion') {
    return (
      <Component
        number={question.question_number}
        questionText={question.question_text}
        instruction={question.instruction || ''}
        userAnswer={userAnswers[question.question_number] || ''}
        correctAnswer={question.correct_answer}
        submitted={submitted}
        onChange={onChange}
        onCorrectCountChange={onCorrectCountChange}
      />
    );
  }

  // Table completion
  if (question.question_type === 'table_completion') {
    return (
      <Component
        table={question.table}
        instruction={question.instruction || ''}
        correctAnswers={question.table?.answers?.map((a) => a.correct_answer) || []}
        userAnswers={userAnswers}
        submitted={submitted}
        onChange={onChange}
        onCorrectCountChange={onCorrectCountChange}
      />
    );
  }

  // Form completion
  if (question.question_type === 'form_completion') {
    return (
      <Component
        form={question.form}
        instruction={question.instruction || ''}
        correctAnswers={question.form?.answers?.map((a) => a.correct_answer) || []}
        userAnswers={userAnswers}
        submitted={submitted}
        onChange={onChange}
        onCorrectCountChange={onCorrectCountChange}
      />
    );
  }

  // Multiple choice
  if (question.question_type === 'multiple_choice') {
    return (
      <Component
        question={question}
        instruction={question.instruction || ''}
        correctAnswer={question.correct_answer}
        userAnswer={userAnswers[question.question_number] || ''}
        submitted={submitted}
        onChange={onChange}
        onCorrectCountChange={onCorrectCountChange}
      />
    );
  }

  // Map labelling
  if (question.question_type === 'map_labelling') {
    return (
      <Component
        imageSrc={question.imageSrc || question.map_image || ''}
        questionText={question.question_text || ''}
        instruction={question.instruction || ''}
        options={Array.isArray(question.options) ? question.options : []}
        questionNumber={String(question.question_number)}
        correctAnswers={question.map?.answers?.map((a) => a.correct_answer) || []}
        userAnswers={userAnswers}
        submitted={submitted}
        onChange={onChange}
        onCorrectCountChange={onCorrectCountChange}
      />
    );
  }

  // Matching headings
  if (question.question_type === 'matching_headings') {
    return (
      <Component
        question={question}
        userAnswers={userAnswers}
        correctAnswers={question.correctAnswers || {}}
        submitted={submitted}
        onChange={onChange}
        onCorrectCountChange={onCorrectCountChange}
      />
    );
  }

  // True/False/Not Given
  if (question.question_type === 'true_false_not_given') {
    return (
      <Component
        question={question}
        correctAnswer={question.correct_answer}
        userAnswer={userAnswers[question.question_number] || ''}
        submitted={submitted}
        onChange={onChange}
        onCorrectCountChange={onCorrectCountChange}
      />
    );
  }

  return null;
};

export default QuestionRenderer;
