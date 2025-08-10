import React from 'react';

import { useStateContext } from '../contexts/ContextProvider';

const Button = ({ icon, bgColor, color, bgHoverColor, size, text, borderRadius, width, onClick, customClick }) => {
  const { setIsClicked, initialState } = useStateContext();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (customClick) {
      customClick();
    } else {
      setIsClicked(initialState);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{ backgroundColor: bgColor, color, borderRadius }}
      className={` text-${size} p-3 w-${width} hover:drop-shadow-xl hover:bg-${bgHoverColor}`}
    >
      {icon} {text}
    </button>
  );
};

export default Button;
