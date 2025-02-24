import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect, useRef } from 'react';
import { 
    selectIntro, selectIsLogoTexture, selectIsFullTexture,selectLogoDecal, selectFullDecal, selectColor,setIntro, setIsLogoTexture, setIsFullTexture, setLogoDecal, setFullDecal, setColor } from '../store';
import config from '../config/config';
import download from '../assets/download.png';
import { downloadCanvasToImage, downloadCanvasToJPG, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab, DownloadButton } from '../components'; // Import AIPicker and DownloadButton
import { AnimatePresence,motion  } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Center, Environment } from '@react-three/drei';
import Shirt from '../canvas/Shirt';
import { fabric } from '../fabric-init.js';

// Make sure images are imported correctly
import {
  fileIcon,
  swatch,
  logoShirt,
  stylishShirt,
  downloadImg   // Renamed to avoid conflict
} from '../assets'

const Customizer = () => {
  const intro = useSelector(selectIntro);
  const isLogoTexture = useSelector(selectIsLogoTexture);
  const isFullTexture = useSelector(selectIsFullTexture);
  const logoDecal = useSelector(selectLogoDecal);
  const fullDecal = useSelector(selectFullDecal);
  const color = useSelector(selectColor);
  const dispatch = useDispatch();

  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [currentTexture, setCurrentTexture] = useState(null);
  
  // Initialize Fabric canvas
  useEffect(() => {
    // Initialize Fabric canvas after component mounts
    if (canvasRef.current && !fabricCanvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        width: 300,
        height: 300,
        backgroundColor: 'transparent'
      });
    }

    // Cleanup
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  // Function to handle texture upload and manipulation
  const handleTextureUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.Image.fromURL(event.target.result, (img) => {
        // Clear previous objects
        fabricCanvasRef.current.clear();

        // Set image properties
        img.scaleToWidth(200);
        if (img.height * img.scaleX > 200) {
          img.scaleToHeight(200);
        }

        // Center the image
        img.set({
          left: fabricCanvasRef.current.width / 2,
          top: fabricCanvasRef.current.height / 2,
          originX: 'center',
          originY: 'center',
          cornerColor: 'white',
          cornerStrokeColor: 'black',
          cornerSize: 12,
          transparentCorners: false,
          rotatingPointOffset: 40,
        });

        // Enable all controls
        img.setControlsVisibility({
          mt: true, // middle top
          mb: true, // middle bottom
          ml: true, // middle left
          mr: true, // middle right
          bl: true, // bottom left
          br: true, // bottom right
          tl: true, // top left
          tr: true, // top right
          mtr: true, // middle top rotate
        });

        // Add to canvas
        fabricCanvasRef.current.add(img);
        fabricCanvasRef.current.setActiveObject(img);
        fabricCanvasRef.current.renderAll();
        setCurrentTexture(type);
      });
    };
    reader.readAsDataURL(file);
  };

  // Function to apply texture changes to the 3D model
  const applyTextureChanges = () => {
    if (!fabricCanvasRef.current) return;

    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      const { scaleX, scaleY, angle, left, top } = activeObject;
      // Here you can handle the texture transformation
      console.log('Texture transform:', { scaleX, scaleY, angle, left, top });
    }
  };

  // Function to get complementary color
  const getComplementaryColor = (hexColor) => {
    // Remove the # if present
    const hex = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Get complementary values
    const compR = 255 - r;
    const compG = 255 - g;
    const compB = 255 - b;
    
    // Convert back to hex
    return `#${compR.toString(16).padStart(2, '0')}${compG.toString(16).padStart(2, '0')}${compB.toString(16).padStart(2, '0')}`;
  };

  // Get lighter and darker shades of the complementary color
  const getLighterShade = (hexColor) => {
    const hex = hexColor.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + 40);
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + 40);
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + 40);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const getDarkerShade = (hexColor) => {
    const hex = hexColor.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 40);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 40);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 40);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Update gradient style when color changes
  const [gradientStyle, setGradientStyle] = useState({});
  
  useEffect(() => {
    const complementary = getComplementaryColor(color);
    const lighter = getLighterShade(complementary);
    const darker = getDarkerShade(complementary);
    
    setGradientStyle({
      background: `linear-gradient(45deg, ${darker} 0%, ${complementary} 50%, ${lighter} 100%)`,
      backgroundSize: '300% 300%',
      animation: 'gradientAnimation 15s ease infinite'
    });
  }, [color]);

  // show tab content depending on the activeTab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case 'colorpicker':
        return <ColorPicker />;
      case 'filepicker':
        return (
          <FilePicker
            file={file}
            setFile={setFile}
            readFile={(type) => {
              const isLogo = type === 'logo';
              handleTextureUpload(file, isLogo);
            }}
          />
        );
      case 'aipicker':
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (type) => {
    if (!prompt) return alert('Please enter a prompt');

    try {
      setGeneratingImg(true);

      const response = await fetch('http://localhost:8080/api/v1/dalle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = await response.json();

      handleDecals(type, `data:image/png;base64,${data.photo}`);
    } catch (error) {
      alert(error);
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab('');
    }
  };

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];

    if (decalType.stateProperty === 'logoDecal') {
      dispatch(setLogoDecal(result));
    } else if (decalType.stateProperty === 'fullDecal') {
      dispatch(setFullDecal(result));
    }

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case 'logoShirt':
        dispatch(setIsLogoTexture(!activeFilterTab[tabName]));
        break;
      case 'stylishShirt':
        dispatch(setIsFullTexture(!activeFilterTab[tabName]));
        break;
      default:
        dispatch(setIsLogoTexture(true));
        dispatch(setIsFullTexture(false));
        break;
    }

    setActiveFilterTab((prevState) => ({
      ...prevState,
      [tabName]: !prevState[tabName],
    }));
  };

  const readFile = (type) => {
    reader(file)
      .then((result) => {
        handleDecals(type, result);
        setActiveEditorTab('');
      });
  };

  const applyTexture = () => {
    if (!fabricCanvasRef.current || !currentTexture) return;

    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1
    });

    if (currentTexture === 'logo') {
      dispatch(setIsLogoTexture(true));
      dispatch(setLogoDecal(dataURL));
    } else {
      dispatch(setIsFullTexture(true));
      dispatch(setFullDecal(dataURL));
    }
  };

  return (
    <AnimatePresence>
      {!intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation('left')}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <div key={tab.name} className="relative">
                    <Tab 
                      key={tab.name}
                      tab={tab}
                      handleClick={() => setActiveEditorTab(tab.name)}
                    />
                    {activeEditorTab === tab.name && (
                      <div className="absolute left-full ml-3">
                        {generateTabContent()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton 
              type="filled"
              title="Go Back"
              handleClick={() => dispatch(setIntro(true))}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>

          <motion.div
            className='filtertabs-container'
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}
          </motion.div>

          {/* Background with dynamic gradient */}
          <div className="absolute left-0 top-0 z-0 h-screen w-screen transition-colors duration-500" style={gradientStyle}>
            <Canvas
              camera={{ position: [0, 0, 2.5], fov: 25 }}
            >
              <ambientLight intensity={0.5} />
              <directionalLight position={[0, 0, 0.05]} />
              {/* <directionalLight position={[0, 1, 0]} /> */}
              <Center scale={1.2}>
                <Shirt />
              </Center>
            </Canvas>
          </div>

          {/* Add Fabric.js canvas for texture manipulation */}
          <motion.div
            className="absolute right-5 top-20 z-10 bg-white/10 backdrop-blur-md rounded-lg p-4"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <canvas
              ref={canvasRef}
              className="border border-white/20 rounded"
            />
            <div className="mt-4 flex gap-2">
              <CustomButton
                type="filled"
                title="Apply"
                handleClick={applyTexture}
                customStyles="px-4 py-2 text-sm"
              />
              <CustomButton
                type="outlined"
                title="Reset"
                handleClick={() => {
                  if (fabricCanvasRef.current) {
                    fabricCanvasRef.current.clear();
                    fabricCanvasRef.current.renderAll();
                  }
                }}
                customStyles="px-4 py-2 text-sm"
              />
            </div>
          </motion.div>

          {/* Download buttons */}
          <div className="download-options absolute bottom-10 right-10 flex gap-3">
            <button
              className='download-btn'
              onClick={() => {
                try {
                  downloadCanvasToImage();
                } catch (error) {
                  console.error('Download PNG failed:', error);
                }
              }}
              title="Download as PNG"
            >
              <img 
                src='/download.png'
                alt="download png"
                className='w-8 h-8 object-contain'
              />
              <span className="tooltip">PNG</span>
            </button>

            <button
              className='download-btn'
              onClick={() => {
                try {
                  downloadCanvasToJPG();
                } catch (error) {
                  console.error('Download JPG failed:', error);
                }
              }}
              title="Download as JPG"
            >
              <img 
                src='/download.png'
                alt="download jpg"
                className='w-8 h-8 object-contain'
              />
              <span className="tooltip">JPG</span>
            </button>
          </div>

          {/* Add Download Button */}
          <DownloadButton />
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;