// QuestionRenderer.jsx
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

const QuestionRenderer = ({ question, userAnswers, submitted, onChange, allQuestions }) => {
  const Component = componentMap[question.question_type];
  if (!Component) return null;

  let props = {};

  // Sentence completion
  if (question.question_type === 'sentence_completion') {
    props = {
      number: question.question_number,
      questionText: question.question_text,
      instruction: question.instruction || '',
      userAnswer: userAnswers[question.question_number] || '',
    };
  }

  // Multiple choice (choose TWO answers) — guruh bo‘lib ko‘rsatish
  else if (question.question_type === 'multiple_choice_two') {
    const groupQuestions = allQuestions.filter(
      q => q.question_type === 'multiple_choice_two'
    );

    props = {
      instruction: groupQuestions[0]?.instruction || '',
      options: groupQuestions[0]?.options || [],
      questionNumbers: groupQuestions.map(q => q.question_number),
      userAnswers,
      submitted,
      onChange
    };
  }

  // Table completion
  else if (question.question_type === 'table_completion') {
    props = {
      table: question.table,
      instruction: question.instruction || '',
    };
  }

  // Form completion
  else if (question.question_type === 'form_completion') {
    props = {
      form: question.form,
      instruction: question.instruction || '',
    };
  }

  // Single multiple choice
  else if (question.question_type === 'multiple_choice') {
    props = {
      question,
      instruction: question.instruction || '',
      allQuestions
    };
  }

  // Map labelling
  else if (question.question_type === 'map_labelling') {
    props = {
      imageSrc: question.imageSrc || question.map_image || '',
      questionText: question.question_text || '',
      instruction: question.instruction || '',
      options: Array.isArray(question.options) ? question.options : [],
      questionNumber: question.question_number,
    };
  }

  // Matching headings
  else if (question.question_type === 'matching_headings') {
    props = { question,
      userAnswers,
      submitted,
      onChange,
      correctAnswers: question.correctAnswers || {},};
  }

  // True / False / Not Given
  else if (question.question_type === 'true_false_not_given') {
    props = { question };
  }

  return (
    <Component
      {...props}
      userAnswers={userAnswers}
      submitted={submitted}
      onChange={onChange}
      allQuestions={allQuestions}
    />
  );
};

export default QuestionRenderer;
