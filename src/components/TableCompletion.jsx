import React from 'react';

const TableCompletion = ({ table, userAnswers, onChange, submitted,instruction}) => {
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
          onChange={(e) => onChange(e, number)}
        />
      );
      lastIndex = regex.lastIndex;
    }
    parts.push(text.slice(lastIndex));
    return parts;
  };

  return (
    <div className="table-container">
      <p >{instruction}</p>
      <table className="table-listening">
        <thead>
          <tr>
            {table.columns.map((col, idx) => (
              <th key={idx}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.id}>
              {row.row_data.map((cell, idx) => (
                <td key={idx}>{renderTableCell(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableCompletion;
