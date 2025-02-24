import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Center } from '@react-three/drei'
import { useSelector, useDispatch } from 'react-redux'
import { selectIntro, setIntro, selectColor } from '../store'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation,
  fadeAnimation 
} from '../config/motion'
import { CustomButton } from '../components'
import { colorUtils } from '../config/bgcolors'

import Shirt from '../canvas/Shirt'
import Hoodie from '../canvas/hoodie'

function Home() {
  const intro = useSelector(selectIntro);
  const color = useSelector(selectColor);
  const dispatch = useDispatch();
  const [gradientStyle, setGradientStyle] = useState({});
  const [hoveredModel, setHoveredModel] = useState(null);

  const dynamicBackground = {
    background: colorUtils.createGradient(color),
    backgroundSize: '400% 400%',
    animation: 'gradient 15s ease infinite'
  };

  // Function to get complementary color
  const getComplementaryColor = (hexColor) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const compR = 255 - r;
    const compG = 255 - g;
    const compB = 255 - b;
    return `#${compR.toString(16).padStart(2, '0')}${compG.toString(16).padStart(2, '0')}${compB.toString(16).padStart(2, '0')}`;
  };

  // Get lighter and darker shades
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

  return (
    <AnimatePresence>
      {intro && (
        <motion.section 
          className="home fixed inset-0 transition-all duration-700"
          style={dynamicBackground}
        >
          {/* Main Content */}
          <div className="absolute inset-0 flex justify-between items-center px-32 pt-32">
            {/* Left Side - Slides in from left */}
            <motion.div 
              className="flex flex-col gap-6"
              initial={{ x: -500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                type: "spring",
                damping: 20,
                stiffness: 100,
                duration: 1.5 
              }}
            >
              {["T-SHIRT", "HOODIE"].map((item, index) => (
                <motion.div 
                  key={item}
                  className="product-card bg-white/10 backdrop-blur-md rounded-2xl p-8 w-[320px] hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl"
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ 
                    delay: index * 0.2,
                    type: "spring",
                    damping: 20,
                    stiffness: 100
                  }}
                >
                  <img src={`/${item.toLowerCase()}-blue.png`} alt={item} className="w-20 h-20 object-contain mb-4" />
                  <div className="text-sm">
                    <p>{item}</p>
                    <p className="text-gray-500">$22.05</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Center Content */}
            <motion.div
              className="flex flex-col items-center justify-center"
              {...fadeAnimation}
            >
              <h1 className="text-6xl font-bold mb-8">T-Shirt & Hoodie</h1>
             
              <div className='flex flex-row justify-center items-center' style={{ gap: '-50px' }}>
                {/* Shirt Canvas */}
                <motion.div 
                  className="canvas-container w-[500px] h-[450px] relative cursor-pointer"
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 3,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                >
                  <Canvas
                    camera={{ 
                      position: [0, 0, 1.5],
                      fov: 30
                    }}
                    gl={{ preserveDrawingBuffer: true }}
                    className="w-full h-full transition-all duration-300"
                  >
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[0, 0, 0.05]} />
                    <Environment preset="city" />
                    <Center scale={1.2}>
                      <Shirt />
                    </Center>
                  </Canvas>
                </motion.div>

                {/* Hoodie Canvas */}
                <motion.div 
                  className="canvas-container w-[500px] h-[450px] relative cursor-pointer"
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: -3,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                >
                  <Canvas
                    camera={{ 
                      position: [1.15, 0, 2.2],
                      fov: 30
                    }}
                    gl={{ preserveDrawingBuffer: true }}
                    className="w-full h-full transition-all duration-300"
                  >
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[0, 0, 0.05]} />
                    <Environment preset="city" />
                    <Center scale={1.3}>
                      <Hoodie />
                    </Center>
                  </Canvas>
                </motion.div>
              </div>
              
              <CustomButton 
                type="filled"
                title="Customize It"
                handleClick={() => dispatch(setIntro(false))}
                customStyles="mt-8 px-8 py-3 text-xl font-bold bg-white text-black rounded-full"
              />
            </motion.div>

            {/* Right Side - Slides in from right */}
            <motion.div 
              className="flex flex-col gap-6"
              initial={{ x: 500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                type: "spring",
                damping: 20,
                stiffness: 100,
                duration: 1.5 
              }}
            >
              <motion.div 
                className="feature-card bg-white/10 backdrop-blur-md rounded-2xl p-8 w-[320px] hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  damping: 20,
                  stiffness: 100
                }}
              >
                <p className="text-2xl font-bold">PRICE</p>
                <p className="text-4xl font-bold">$22.05</p>
              </motion.div>
              
              <motion.div 
                className="recent-card bg-white/10 backdrop-blur-md rounded-2xl p-8 w-[320px] hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.2,
                  type: "spring",
                  damping: 20,
                  stiffness: 100
                }}
              >
                <p>RECENT</p>
                <div className="flex space-x-2 mt-2">
                  <img src="/shirt-blue.png" alt="Recent" className="w-16 h-16 object-contain bg-white rounded-lg" />
                  <img src="/hoodie-blue.png" alt="Recent" className="w-16 h-16 object-contain bg-white rounded-lg" />
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="absolute top-0 left-0 w-full p-4 flex justify-between items-center">
            <div className="logo text-2xl font-bold text-white">Dextolis</div>
            <div className="nav-links flex space-x-8 text-white">
              <a href="#" className="border-b-2 border-white">RURE</a>
              <a href="#">RBUNTS</a>
              <a href="#">MONCH</a>
              <a href="#">MUHKS</a>
              <a href="#">OORE</a>
            </div>
            <div className="actions flex space-x-4">
              <button className="bg-white/20 p-2 rounded-lg">
                <img src="/copy.png" alt="Copy" className="w-6 h-6" />
              </button>
              <button className="bg-white/20 p-2 rounded-lg">
                <img src="/share.png" alt="Share" className="w-6 h-6" />
              </button>
            </div>
          </nav>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

export default Home