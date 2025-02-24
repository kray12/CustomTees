
import React from 'react';
import { SketchPicker } from 'react-color';
import { useSelector, useDispatch } from 'react-redux';
import { selectColor, setColor } from '../store';


const ColorPicker = () => {
  const color = useSelector(selectColor);
  const dispatch = useDispatch();

  return (
    <div className="absolute left-full ml-3">
      <SketchPicker
        color={color}
        disableAlpha
        onChange={(color) => dispatch(setColor(color.hex))} 
      />
    </div>
  );
};

export default ColorPicker;