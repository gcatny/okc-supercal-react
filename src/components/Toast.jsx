import React, { useEffect, useState } from 'react';

export default function Toast({ message, visible, onHide }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => onHide(), 2200);
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);

  return (
    <div className={`toast${visible ? ' show' : ''}`}>
      {message}
    </div>
  );
}
