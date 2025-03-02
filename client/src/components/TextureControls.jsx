import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectTextureScale, 
  selectTexturePosition, 
  selectClipMask,
  setTextureScale,
  setTexturePosition,
  setClipMask
} from '../store';
import CustomButton from './CustomButton';

const TextureControls = () => {
  const dispatch = useDispatch();
  const textureScale = useSelector(selectTextureScale);
  const texturePosition = useSelector(selectTexturePosition);
  const clipMask = useSelector(selectClipMask);

  const handleScaleChange = (type, value) => {
    dispatch(setTextureScale(type, parseFloat(value)));
  };

  const handlePositionChange = (type, axis, value) => {
    const currentPosition = texturePosition[type];
    dispatch(setTexturePosition(type, {
      ...currentPosition,
      [axis]: parseFloat(value)
    }));
  };

  const handleClipMaskChange = (value) => {
    dispatch(setClipMask({
      ...clipMask,
      intensity: parseFloat(value)
    }));
  };

  const toggleClipMask = () => {
    dispatch(setClipMask({
      ...clipMask,
      enabled: !clipMask.enabled
    }));
  };

  return (
    <div className="glassmorphism p-4 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Texture Controls</h3>
      
      {/* Logo Texture Controls */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Logo Texture</h4>
        <div className="flex flex-col gap-2">
          <div>
            <label className="block text-sm mb-1">Scale</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={textureScale.logo}
              onChange={(e) => handleScaleChange('logo', e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <div>
              <label className="block text-sm mb-1">X Position</label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={texturePosition.logo.x}
                onChange={(e) => handlePositionChange('logo', 'x', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Y Position</label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={texturePosition.logo.y}
                onChange={(e) => handlePositionChange('logo', 'y', e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Full Texture Controls */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Full Texture</h4>
        <div className="flex flex-col gap-2">
          <div>
            <label className="block text-sm mb-1">Scale</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={textureScale.full}
              onChange={(e) => handleScaleChange('full', e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <div>
              <label className="block text-sm mb-1">X Position</label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={texturePosition.full.x}
                onChange={(e) => handlePositionChange('full', 'x', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Y Position</label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={texturePosition.full.y}
                onChange={(e) => handlePositionChange('full', 'y', e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clipping Mask Controls */}
      <div>
        <h4 className="font-semibold mb-2">Clipping Mask</h4>
        <div className="flex flex-col gap-2">
          <CustomButton
            type={clipMask.enabled ? "filled" : "outline"}
            title={clipMask.enabled ? "Disable Clipping" : "Enable Clipping"}
            handleClick={toggleClipMask}
            customStyles="w-full"
          />
          {clipMask.enabled && (
            <div>
              <label className="block text-sm mb-1">Intensity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={clipMask.intensity}
                onChange={(e) => handleClipMaskChange(e.target.value)}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextureControls;
