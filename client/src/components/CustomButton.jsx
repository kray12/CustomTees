import React from 'react';
import { useSelector } from 'react-redux';
import { selectColor } from '../store'; // Assuming you have selectors
import { getContrastingColor } from '../config/helpers';

const CustomButton = ({ type, title, customStyles, handleClick }) => {
  const color = useSelector(selectColor);

  const generateStyle = (type) => {
    if (type === 'filled') {
      return {
        backgroundColor: color,
        color: getContrastingColor(color),
      };
    } else if (type === 'outline') {
      return {
        borderWidth: '1px',
        borderColor: color,
        color: color,
      };
    }
  };

  return (
    <button
      className={`px-2 py-1.5 flex-1 rounded-md ${customStyles}`}
      style={generateStyle(type)}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
