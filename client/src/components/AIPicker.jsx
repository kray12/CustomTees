import React from 'react';

const AIPicker = ({ onSelect }) => {
  const handleAIImageSelect = () => {
    // Call DALL-E or other image API, get image
    const imageUrl = 'generated-image-url';
    onSelect(imageUrl);
  };

  return (
    <div>
      <button onClick={handleAIImageSelect}>Generate AI Image</button>
    </div>
  );
};

export default AIPicker;
