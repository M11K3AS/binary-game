import React, { useState, useEffect } from 'react';
import './display.css';

function Display({ value }) {
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (value !== 0) {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 150); // Duration of the animation
    }
  }, [value]);

  const shakeElement = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 150); // Duration of the animation
  };

  return (
    <div className={`box ${isShaking ? 'shake' : ''}`} onClick={shakeElement}>
      {value}
    </div>
  );
}

export function DisplayWins({ wins }) {
  return (
    <h2>{'Wins: '}
    <Display value={wins.current ? wins.current : 0} />
    </h2>
  )
}

export function DisplayGuess({ guess }) {
  return (
    <h2>
      <Display value={guess ? guess : 'guess the number'} />
    </h2>
)}
