const findKeyAndSiblings = (data, key) => {
  // Check if the input is an object or an array
  if (typeof data !== 'object' || data === null) {
    return null; // Return null if not an object or array
  }

  // If it's an array, iterate through each item
  if (Array.isArray(data)) {
    for (const item of data) {
      const result = findKeyAndSiblings(item, key);
      if (result) {
        return result; // Return if found in any item
      }
    }
  } else {
    // If it's an object, check each property
    for (const prop in data) {
      if (typeof key === 'string' ? prop?.toLowerCase() === key?.toLowerCase() : false) {
        return data; // Return the parent object if the key matches
      }
      // Check nested objects or arrays
      const result = findKeyAndSiblings(data[prop], key);
      if (result) {
        return result; // Return if found in nested object
      }
    }
  }

  return null; // Return null if not found
};

module.exports = { findKeyAndSiblings }