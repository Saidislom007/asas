import React from 'react';

const NoteCompletion = ({ notes, userAnswers, onChange, submitted }) => {
  const renderNoteText = (text) => {
    const regex = /\[\[(\d+)]]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      parts.push(text.slice(lastIndex, match.index));
      const number = match[1];
      parts.push(
        <input
          key={number}
          type="text"
          placeholder={`Q${number}`}
          className="border border-gray-300 p-1 mx-1 rounded w-24"
          value={userAnswers[number] || ''}
          disabled={submitted}
          onChange={(e) => onChange(e, number)}
        />
      );
      lastIndex = regex.lastIndex;
    }
    parts.push(text.slice(lastIndex));
    return parts;
  };

  return (
    <div className="note-completion space-y-2">
      {notes.map((note, idx) => (
        <p key={idx}>{renderNoteText(note)}</p>
      ))}
    </div>
  );
};

export default NoteCompletion;
