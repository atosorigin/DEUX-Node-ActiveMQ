var Stomp = require('stomp-client'); // The STOMP Client for interacting with ActiveMQ
var spawn = require('threads').spawn;

var controller = require('./example-summarization-controller');

var destination = '/queue/test';

var client = new Stomp('127.0.0.1', 61613, 'admin', 'admin');

var threadId = 1;

const subscriber = spawn(function (input, done) {

    console.log('Thread[' + input.id + ']: Processing message: ' + input.message);
    return new Promise((resolve) => {
        setTimeout(resolve, 1000);
    }).then(() => console.log('Thread[' + input.id + ']: Finished processing message'));
})

client.connect(function (sessionId) {
    client.subscribe(destination, function (body, headers) {
        subscriber.send({ controller: controller, message: body, id: threadId });
        threadId += 1;
    });

});
