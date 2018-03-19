const flatten = array => array.reduce((flat, curr) => flat.concat(curr), []);

module.exports = {
  flatten,
};
