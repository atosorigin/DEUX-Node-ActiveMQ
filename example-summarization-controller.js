var exports = module.exports = {};
var Promise = require("bluebird");
var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
  id: Number,
  text: String
});

var Message = mongoose.model('Message', messageSchema);

exports.testFunction = function (message) {
  return new Promise((resolve) => {
    // Simulate random processing time
    setTimeout(resolve, Math.floor((Math.random() * 1000) + 500));
  })
    .then(() => {
      var input = JSON.parse(message);
      var m = new Message({ id: input.id, text:input.text });
      return m.save();
    });
}
