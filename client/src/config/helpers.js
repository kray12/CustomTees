export const downloadCanvasToImage = () => {
  try {
    // Get the WebGL canvas
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    // Force a render update
    canvas.getContext('webgl2') || canvas.getContext('webgl');

    // Get the canvas data
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1.0,
      width: canvas.width,
      height: canvas.height
    });

    // Create and trigger download
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `shirt-design-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    console.error('Error downloading image:', error);
    alert('Failed to download image. Please try again.');
  }
};

export const downloadCanvasToJPG = () => {
  try {
    // Get the WebGL canvas
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    // Force a render update
    canvas.getContext('webgl2') || canvas.getContext('webgl');

    // Get the canvas data
    const dataURL = canvas.toDataURL('image/jpeg', 1.0);

    // Create and trigger download
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `shirt-design-${new Date().getTime()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    console.error('Error downloading image:', error);
    alert('Failed to download image. Please try again.');
  }
};

export const reader = (file) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.readAsDataURL(file);
  });

export const getContrastingColor = (color) => {
  // Remove the '#' character if it exists
  const hex = color.replace("#", "");

  // Convert the hex string to RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate the brightness of the color
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black or white depending on the brightness
  return brightness > 128 ? "black" : "white";
};