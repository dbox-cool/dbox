/**
 *  Clamp value between two numbers 
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Clamp value between two numbers 
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
function circularClamp(value, min, max) {
  const range = max - min + 1;
  return min + ((value - min) % range + range) % range; 
}

export {clamp, circularClamp}