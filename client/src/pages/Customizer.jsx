import { useSelector, useDispatch } from 'react-redux';
import React, { useState } from 'react';
import { 
  selectIntro, selectIsLogoTexture, selectIsFullTexture, selectLogoDecal, selectFullDecal, selectColor,
  setIntro, setIsLogoTexture, setIsFullTexture, setLogoDecal, setFullDecal, setColor 
} from '../store';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab, TextureControls } from '../components';
import { AnimatePresence, motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Center, Environment } from '@react-three/drei';
import Shirt from '../canvas/Shirt';
import Hoodie from '../canvas/hoodie';

const Customizer = () => {
  const intro = useSelector(selectIntro);
  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState('');
  const [activeModel, setActiveModel] = useState('shirt'); // 'shirt' or 'hoodie'
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  const dispatch = useDispatch();

  const handleSubmit = async (type) => {
    if(!prompt) return alert("Please enter a prompt");

    try {
      setGeneratingImg(true);

      const response = await fetch('http://localhost:8080/api/v1/dalle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
        })
      });

      const data = await response.json();

      if(type === 'logo') {
        dispatch(setLogoDecal(`data:image/png;base64,${data.photo}`));
      } else {
        dispatch(setFullDecal(`data:image/png;base64,${data.photo}`));
      }
    } catch (error) {
      alert(error);
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  };

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        dispatch(setIsLogoTexture(!activeFilterTab[tabName]));
        break;
      case "stylishShirt":
        dispatch(setIsFullTexture(!activeFilterTab[tabName]));
        break;
      default:
        dispatch(setIsLogoTexture(true));
        dispatch(setIsFullTexture(false));
        break;
    }

    setActiveFilterTab((prevState) => ({
      ...prevState,
      [tabName]: !prevState[tabName]
    }));
  };

  const readFile = (type) => {
    reader(file)
      .then((result) => {
        if(type === 'logo') {
          dispatch(setLogoDecal(result));
          dispatch(setIsLogoTexture(true));
        } else {
          dispatch(setFullDecal(result));
          dispatch(setIsFullTexture(true));
        }
        setActiveEditorTab("");
      });
  };

  return (
    <AnimatePresence>
      {!intro && (
        <>
          {/* Left Sidebar */}
          <motion.div
            className="absolute left-0 top-0 z-10 h-full"
            {...slideAnimation('left')}
          >
            <div className="flex h-full">
              {/* Editor Tabs */}
              <div className="editortabs-container">
                {EditorTabs.map((tab) => (
                  <Tab 
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)}
                  />
                ))}

                {/* Model Toggle */}
                <div className="mt-4">
                  <CustomButton 
                    type={activeModel === 'shirt' ? "filled" : "outline"}
                    title="Shirt"
                    handleClick={() => setActiveModel('shirt')}
                    customStyles="w-full mb-2"
                  />
                  <CustomButton 
                    type={activeModel === 'hoodie' ? "filled" : "outline"}
                    title="Hoodie"
                    handleClick={() => setActiveModel('hoodie')}
                    customStyles="w-full"
                  />
                </div>
              </div>

              {/* Tab Content */}
              <div className="pl-1">
                {activeEditorTab === "colorpicker" && <ColorPicker />}
                {activeEditorTab === "filepicker" && (
                  <FilePicker
                    file={file}
                    setFile={setFile}
                    readFile={readFile}
                  />
                )}
                {activeEditorTab === "aipicker" && (
                  <AIPicker 
                    prompt={prompt}
                    setPrompt={setPrompt}
                    generatingImg={generatingImg}
                    handleSubmit={handleSubmit}
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Texture Controls - Top Right */}
          <motion.div
            className="absolute top-5 right-5 z-10"
            {...fadeAnimation}
          >
            <TextureControls />
          </motion.div>

          {/* Filter Tabs - Bottom */}
          <motion.div
            className="filtertabs-container"
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

          {/* Canvas */}
          <motion.div
            className="absolute top-0 left-0 z-0 h-full w-full"
            {...slideAnimation('left')}
          >
            <Canvas
              camera={{ position: [0, 0, 2.5], fov: 25 }}
              gl={{ preserveDrawingBuffer: true }}
              className="w-full max-w-full h-full transition-all ease-in"
            >
              <ambientLight intensity={0.5} />
              <Environment preset="city" />
              <Center>
                {activeModel === 'shirt' ? <Shirt /> : <Hoodie />}
              </Center>
            </Canvas>
          </motion.div>

          {/* Action Buttons - Bottom Right */}
          <motion.div
            className="absolute bottom-5 right-5 z-10 flex gap-3"
            {...fadeAnimation}
          >
            <CustomButton 
              type="filled"
              title="Go Back"
              handleClick={() => dispatch(setIntro(true))}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
            <CustomButton 
              type="filled"
              title="Download"
              handleClick={downloadCanvasToImage}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;