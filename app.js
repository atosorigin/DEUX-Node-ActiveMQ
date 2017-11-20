var Stomp = require('stomp-client'); // The STOMP Client for interacting with ActiveMQ
var AMQPClient = require('amqp10').Client
var Promise = require('bluebird');

var controller = require('./example-summarization-controller');

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

var destination = 'queue://test';


if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {

    var Policy = require("amqp10").Policy;
    var client = new AMQPClient(Policy.Utils.RenewOnSettle(5, 2, Policy.ActiveMQ));

    client.connect("amqp://localhost:5672", { 'saslMechanism': 'ANONYMOUS' })
        .catch((e) => { console.log("ERROR") })
        .then(function () {
            return client.createReceiver(destination);
        })
        .then(function (receiver) {
            receiver.on('errorReceived', function (err) { });
            receiver.on('message', function (message) {
                console.log(`Worker[${process.pid}] - Processing message: ${message.body.text}`)
                controller.testFunction().then(() => {
                    console.log(`Worker[${process.pid}] - Finished processing message`)
                    receiver.accept(message);
                })
            });
        });

    console.log(`Worker [${process.pid}] started`);
}
