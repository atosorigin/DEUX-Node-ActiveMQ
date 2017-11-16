var exports = module.exports = {};

exports.testFunction = function() {
  return new Promise((resolve) => {
    setTimeout(resolve, 10);
  });
}