var Stomp = require('stomp-client'); // The STOMP Client for interacting with ActiveMQ
var AMQPClient = require('amqp10').Client
var Promise = require('bluebird');

var destination = 'queue://test';


{
    var Policy = require("amqp10").Policy;
    var client = new AMQPClient(Policy.ActiveMQ);

    client.connect("amqp://localhost:5672", { 'saslMechanism': 'ANONYMOUS' })
        .catch((e) => { console.log("ERROR") })
        .then(function () {
            return client.createSender(destination);
        })
        .then(function (sender) {
            sender.on('errorReceived', function (err) { });

            var i = 0;

            setInterval(() => {
                for (cnt = 0; cnt < 100; i++, cnt++) {
                    sender.send(JSON.stringify({ "id": i, "text": "Message no: " + i.toString() }));
                }
    

            }, 2000);
        });
}
