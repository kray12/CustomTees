import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  intro: true,
  color: '#EFBD48',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: './threejs.png',
  fullDecal: './threejs.png',
  textureScale: {
    logo: 1,
    full: 1
  },
  texturePosition: {
    logo: { x: 0, y: 0 },
    full: { x: 0, y: 0 }
  },
  clipMask: {
    enabled: true,
    intensity: 1.0
  }
};

const store = configureStore({
  reducer: (state = initialState, action) => {
    switch (action.type) {
      case 'SET_INTRO':
        return { ...state, intro: action.payload };
      case 'SET_COLOR':
        return { ...state, color: action.payload };
      case 'SET_IS_LOGO_TEXTURE':
        return { ...state, isLogoTexture: action.payload };
      case 'SET_IS_FULL_TEXTURE':
        return { ...state, isFullTexture: action.payload };
      case 'SET_LOGO_DECAL':
        return { ...state, logoDecal: action.payload };
      case 'SET_FULL_DECAL':
        return { ...state, fullDecal: action.payload };
      case 'SET_TEXTURE_SCALE':
        return {
          ...state,
          textureScale: {
            ...state.textureScale,
            [action.payload.type]: action.payload.scale
          }
        };
      case 'SET_TEXTURE_POSITION':
        return {
          ...state,
          texturePosition: {
            ...state.texturePosition,
            [action.payload.type]: action.payload.position
          }
        };
      case 'SET_CLIP_MASK':
        return {
          ...state,
          clipMask: {
            ...state.clipMask,
            ...action.payload
          }
        };
      default:
        return state;
    }
  }
});

// Selectors
export const selectIntro = (state) => state.intro;
export const selectColor = (state) => state.color;
export const selectIsLogoTexture = (state) => state.isLogoTexture;
export const selectIsFullTexture = (state) => state.isFullTexture;
export const selectLogoDecal = (state) => state.logoDecal;
export const selectFullDecal = (state) => state.fullDecal;
export const selectTextureScale = (state) => state.textureScale;
export const selectTexturePosition = (state) => state.texturePosition;
export const selectClipMask = (state) => state.clipMask;

// Action Creators
export const setIntro = (value) => ({ type: 'SET_INTRO', payload: value });
export const setColor = (value) => ({ type: 'SET_COLOR', payload: value });
export const setIsLogoTexture = (value) => ({ type: 'SET_IS_LOGO_TEXTURE', payload: value });
export const setIsFullTexture = (value) => ({ type: 'SET_IS_FULL_TEXTURE', payload: value });
export const setLogoDecal = (value) => ({ type: 'SET_LOGO_DECAL', payload: value });
export const setFullDecal = (value) => ({ type: 'SET_FULL_DECAL', payload: value });
export const setTextureScale = (type, scale) => ({
  type: 'SET_TEXTURE_SCALE',
  payload: { type, scale }
});
export const setTexturePosition = (type, position) => ({
  type: 'SET_TEXTURE_POSITION',
  payload: { type, position }
});
export const setClipMask = (config) => ({
  type: 'SET_CLIP_MASK',
  payload: config
});

export default store;