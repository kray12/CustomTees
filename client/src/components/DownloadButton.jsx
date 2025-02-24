import React from 'react';

const DownloadButton = () => {
  const handleDownload = (format = 'png') => {
    // Get all canvases and find the one with the 3D model
    const canvases = document.querySelectorAll('canvas');
    const canvas = Array.from(canvases).find(c => c.classList.contains('w-full'));
    
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    // Make sure WebGL context preserves the drawing buffer
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
    if (!gl) {
      console.error('WebGL context not found');
      return;
    }

    try {
      // Force a render to ensure the buffer is up to date
      gl.finish();
      
      // Create temporary link
      const link = document.createElement('a');
      
      // Get canvas data with specified format
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const quality = format === 'png' ? 1.0 : 0.92;
      const dataURL = canvas.toDataURL(mimeType, quality);
      
      // Set download attributes
      const timestamp = new Date().getTime();
      link.download = `shirt-design-${timestamp}.${format}`;
      link.href = dataURL;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log(`Downloaded ${format} successfully`);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="absolute bottom-4 right-4 flex gap-3 z-50">
      <button 
        onClick={() => handleDownload('png')}
        className="download-btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg"
      >
        Download PNG
      </button>
      <button 
        onClick={() => handleDownload('jpg')}
        className="download-btn bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-lg"
      >
        Download JPEG
      </button>
    </div>
  );
};

export default DownloadButton; 