const searchDeep = (data, key, value) => {
  // If the input is not an object or array, return null
  if (typeof data !== 'object' || data === null) {
    return null;
  }

  // If it's an array, iterate through each item
  if (Array.isArray(data)) {
    for (const item of data) {
      const result = searchDeep(item, key, value);
      if (result) {
        return result; // Return if found in any item
      }
    }
  } else {
    // If it's an object, check for the key-value pair
    if (typeof value === 'string' ? data[key]?.toLowerCase() === value?.toLowerCase() : false) {
      return data; // Return the object if the key matches the value
    }

    // Iterate through each property in the object
    for (const prop in data) {
      const result = searchDeep(data[prop], key, value);
      if (result) {
        return result; // Return if found in nested object
      }
    }
  }

  return null; // Return null if not found
};



module.exports = { searchDeep }