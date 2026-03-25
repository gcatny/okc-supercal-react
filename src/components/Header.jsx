import React from 'react';

export default function Header({ onReset, onSubmitToggle }) {
  return (
    <header>
      <div className="hdr-logo">
        <span className="logo-okc">OKC</span>
        <span className="logo-super">Super</span>
        <span className="logo-cal">CAL</span>
      </div>
      <div className="hdr-btns">
        <button className="btn-reset" onClick={onReset}>&#8634; Reset</button>
        <button className="btn-submit" onClick={onSubmitToggle}>+ Submit Event</button>
      </div>
    </header>
  );
}
