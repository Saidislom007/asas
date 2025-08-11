import React from 'react';

const TableCompletion = ({ table, userAnswers = {}, onChange, instruction, question }) => {
  // API dan kelgan to'g'ri javoblarni object shaklida olish
  const correctAnswers = {};
  (question?.table?.answers || []).forEach(ans => {
    correctAnswers[ans.number] = ans.correct_answer.toString().trim().toLowerCase();
  });

  const renderTableCell = (text) => {
    const regex = /\[\[(\d+)]]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      parts.push(text.slice(lastIndex, match.index));
      const number = match[1];

      const userAnswer = (userAnswers[number] || "").toString().trim().toLowerCase();
      const correctAnswer = correctAnswers[number] || "";
      const isCorrect = userAnswer.length > 0 && userAnswer === correctAnswer;

      parts.push(
        <input
          key={number}
          type="text"
          placeholder={`Q${number}`}
          className="border border-gray-300 p-1 mx-1 rounded w-24"
          value={userAnswers[number] || ''}
          disabled={false} // yozish doimo mumkin
          onChange={(e) => onChange(number, null, e.target.value)}
          autoComplete="off"
          style={{
            borderColor: userAnswer.length > 0 ? (isCorrect ? 'green' : 'red') : undefined,
            backgroundColor: isCorrect ? '#d4edda' : undefined,
          }}
        />
      );

      lastIndex = regex.lastIndex;
    }
    parts.push(text.slice(lastIndex));
    return parts;
  };

  return (
    <div className="table-container">
      {instruction && (
        <p
          style={{
            color: 'black',
            marginBottom: '20px',
            fontSize: '20px',
            fontWeight: 'bold',
          }}
        >
          {instruction}
        </p>
      )}
      <table className="table-listening" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {table.columns.map((col, idx) => (
              <th
                key={idx}
                style={{
                  border: '1px solid #ccc',
                  padding: '8px',
                  backgroundColor: '#f2f2f2',
                  textAlign: 'left',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.id}>
              {row.row_data.map((cell, idx) => (
                <td
                  key={idx}
                  style={{ border: '1px solid #ccc', padding: '8px', verticalAlign: 'middle' }}
                >
                  {renderTableCell(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableCompletion;
