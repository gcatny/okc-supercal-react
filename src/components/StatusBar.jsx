import React from 'react';

export default function StatusBar({ status, text }) {
  return (
    <div className="status-bar">
      <span className={`sdot ${status}`}></span>
      <span id="stext">{text}</span>
    </div>
  );
}
