import { configureStore, createSlice, createSelector } from '@reduxjs/toolkit';


const initialState = {
  intro: true,
  color: '#EFBD48',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: './threejs.png',
  fullDecal: './threejs.png',
  pointer: {
    x: 0,
    y: 0,
  },
};

const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    setIntro: (state, action) => {
      state.intro = action.payload;
    },
    setColor: (state, action) => {
      state.color = action.payload;
    },
    setIsLogoTexture: (state, action) => {
      state.isLogoTexture = action.payload;
    },
    setIsFullTexture: (state, action) => {
      state.isFullTexture = action.payload;
    },
    setLogoDecal: (state, action) => {
      state.logoDecal = action.payload;
    },
    setFullDecal: (state, action) => {
      state.fullDecal = action.payload;
    },
    setPointer: (state, action) => {
      state.pointer = action.payload;
    },
  },
});


// Selectors (within index.js)
export const selectIntro = (state) => state.camera.intro;
export const selectColor = (state) => state.camera.color;
export const selectIsLogoTexture = (state) => state.camera.isLogoTexture;
export const selectIsFullTexture = (state) => state.camera.isFullTexture;
export const selectLogoDecal = (state) => state.camera.logoDecal;
export const selectFullDecal = (state) => state.camera.fullDecal;
export const selectPointerX = (state) => state.camera.pointer.x;
export const selectPointerY = (state) => state.camera.pointer.y;


const store = configureStore({
  reducer: {
    camera: cameraSlice.reducer, 
  },
});

export const { 
  setIntro, 
  setColor, 
  setIsLogoTexture, 
  setIsFullTexture, 
  setLogoDecal, 
  setFullDecal, 
  setPointer 
} = cameraSlice.actions;

export default store; 