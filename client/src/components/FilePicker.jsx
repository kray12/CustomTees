import React from 'react';
import CustomButton from './CustomButton';
import { useDispatch } from 'react-redux';
import { setLogoDecal, setFullDecal, setIsLogoTexture, setIsFullTexture } from '../store';

const FilePicker = ({ file, setFile }) => {
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = (type) => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new Image();
      
      img.onload = () => {
        if (type === "logo") {
          // For logo, turn off full texture and enable logo
          dispatch(setIsFullTexture(false));
          dispatch(setIsLogoTexture(true));
          dispatch(setLogoDecal(dataUrl));
        } else if (type === "full") {
          // For full texture, turn off logo and enable full
          dispatch(setIsLogoTexture(false));
          dispatch(setIsFullTexture(true));
          dispatch(setFullDecal(dataUrl));
        }
        console.log(`Applied ${type} texture:`, dataUrl.substring(0, 50) + '...'); // Debug log
      };

      img.onerror = () => {
        console.error('Error loading image');
        alert('Failed to load the image. Please try another file.');
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      console.error('Error reading file');
      alert('Error reading the file. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="filepicker-container">
      <div className="flex-1 flex flex-col">
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="file-upload"
          className="border border-gray-300 py-1.5 px-2 rounded-md shadow-sm cursor-pointer hover:border-gray-400 transition-colors"
        >
          Upload File
        </label>

        <p className="mt-2 text-gray-500 text-xs truncate">
          {file === '' ? 'No file selected' : file.name}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <CustomButton
          type="outline"
          title="Logo"
          handleClick={() => handleSubmit('logo')}
          customStyles="text-xs"
        />
        <CustomButton
          type="filled"
          title="Full"
          handleClick={() => handleSubmit('full')}
          customStyles="text-xs"
        />
      </div>
    </div>
  );
};

export default FilePicker;
