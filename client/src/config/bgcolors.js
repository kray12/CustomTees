// Enhanced color utilities
export const colorUtils = {
  // Convert hex to RGB
  hexToRGB: (hex) => {
    const color = hex.replace('#', '');
    return {
      r: parseInt(color.substr(0, 2), 16),
      g: parseInt(color.substr(2, 2), 16),
      b: parseInt(color.substr(4, 2), 16)
    };
  },

  // Convert RGB to hex
  rgbToHex: (r, g, b) => {
    return '#' + [r, g, b]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
  },

  // Get darker shade
  getDarkerShade: (hex, percent = 40) => {
    const { r, g, b } = colorUtils.hexToRGB(hex);
    const darker = {
      r: Math.max(0, r - (r * (percent / 100))),
      g: Math.max(0, g - (g * (percent / 100))),
      b: Math.max(0, b - (b * (percent / 100)))
    };
    return colorUtils.rgbToHex(
      Math.round(darker.r),
      Math.round(darker.g),
      Math.round(darker.b)
    );
  },

  // Get complementary color with darkness
  getComplementaryDark: (hex, percent = 30) => {
    const { r, g, b } = colorUtils.hexToRGB(hex);
    const comp = {
      r: Math.max(0, 255 - r - (255 - r) * (percent / 100)),
      g: Math.max(0, 255 - g - (255 - g) * (percent / 100)),
      b: Math.max(0, 255 - b - (255 - b) * (percent / 100))
    };
    return colorUtils.rgbToHex(
      Math.round(comp.r),
      Math.round(comp.g),
      Math.round(comp.b)
    );
  },

  // Create gradient string
  createGradient: (baseColor) => {
    const darker1 = colorUtils.getDarkerShade(baseColor, 40);
    const darker2 = colorUtils.getDarkerShade(baseColor, 60);
    const comp = colorUtils.getComplementaryDark(baseColor, 30);
    const compDarker = colorUtils.getDarkerShade(comp, 40);

    return `linear-gradient(
      135deg,
      ${darker2} 0%,
      ${darker1} 25%,
      ${baseColor} 50%,
      ${comp} 75%,
      ${compDarker} 100%
    )`;
  }
};
