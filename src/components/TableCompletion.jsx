import React from 'react';


const TableCompletion = ({ table, userAnswers = {}, onChange, submitted, instruction }) => {
  const renderTableCell = (text) => {
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
          onChange={(e) => onChange(number, null, e.target.value)}
          autoComplete="off"
          style={{
            borderColor: submitted && !userAnswers[number] ? 'red' : undefined,
            backgroundColor: submitted && userAnswers[number] ? '#d4edda' : undefined,
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
