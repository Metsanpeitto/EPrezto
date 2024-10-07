const { searchDeep } = require('./searchDeep')

const findInArray = (arr, query) => {
  const { keyQuery, value } = query
  return arr.find(obj => {
    return searchDeep(obj, keyQuery, value);
  });
};

module.exports = { findInArray }