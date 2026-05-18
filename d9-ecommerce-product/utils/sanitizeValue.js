import sanitize from 'sanitize-html';

export const sanitizeValue = (value) => {
  if(typeof value === 'string') {
    return sanitize(value, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if(typeof value === 'object' && value !== null) {
    return sanitizeObject(value);
  }
  return value;
};

export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = sanitizeValue(obj[key]);
    return acc;
  }, {}); 
};
