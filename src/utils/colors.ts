// Convert hex to HSL
export const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  // Remove the # if present
  hex = hex.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    
    h /= 6;
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100
  };
};

// Convert HSL to hex
export const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// Calculate contrasting color based on background color
export const getContrastingColor = (backgroundColor: string, lightnessDiff: number = 40): string => {
  const hsl = hexToHSL(backgroundColor);
  
  // Use 60% as the threshold for determining if a color is light or dark
  const LIGHTNESS_THRESHOLD = 60;
  
  // For light colors (L > 60%), return a darker version
  // For dark colors (L ≤ 60%), return a lighter version
  const newLightness = hsl.l > LIGHTNESS_THRESHOLD 
    ? Math.max(0, hsl.l - lightnessDiff)  // Make it darker
    : Math.min(100, hsl.l + lightnessDiff); // Make it lighter
  
  return hslToHex(hsl.h, hsl.s, newLightness);
};
