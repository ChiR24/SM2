/**
 * Utility functions for handling styles in React Native Web
 */

/**
 * Converts React Native shadow properties to CSS boxShadow
 * @param {Object} style - Style object with shadow properties
 * @returns {Object} - Style object with boxShadow property
 */
export const convertShadowToBoxShadow = (style) => {
  const {
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    elevation,
    ...restStyle
  } = style;

  // Only process if shadow properties exist
  if (shadowColor && shadowOpacity) {
    // Extract shadow offset values or use defaults
    const offsetX = shadowOffset?.width || 0;
    const offsetY = shadowOffset?.height || 0;
    const radius = shadowRadius || 0;
    
    // Convert shadowColor with opacity to rgba
    let color = shadowColor;
    if (shadowColor.startsWith('#')) {
      // Convert hex to rgba
      const r = parseInt(shadowColor.slice(1, 3), 16);
      const g = parseInt(shadowColor.slice(3, 5), 16);
      const b = parseInt(shadowColor.slice(5, 7), 16);
      color = `rgba(${r}, ${g}, ${b}, ${shadowOpacity})`;
    }
    
    // Create boxShadow value
    const boxShadow = `${offsetX}px ${offsetY}px ${radius}px ${color}`;
    
    return {
      ...restStyle,
      boxShadow,
    };
  }
  
  return style;
};

/**
 * Fixes deprecated pointerEvents prop by moving it to style
 * @param {Object} props - Component props
 * @returns {Object} - Updated props with pointerEvents in style
 */
export const fixPointerEvents = (props) => {
  const { pointerEvents, style, ...restProps } = props;
  
  if (pointerEvents) {
    return {
      ...restProps,
      style: {
        ...style,
        pointerEvents,
      },
    };
  }
  
  return props;
};
