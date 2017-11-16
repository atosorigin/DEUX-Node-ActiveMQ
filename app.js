var Stomp = require('stomp-client'); // The STOMP Client for interacting with ActiveMQ

var controller = require('./example-summarization-controller');

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

var destination = '/queue/test';

var client = new Stomp('127.0.0.1', 61613, 'admin', 'admin');

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

    client.connect(function (sessionId) {
        client.subscribe(destination, function (body, headers) {
            console.log(`Worker[${process.pid}] - Processing message: ${body}`)
            controller.testFunction()
                .then(() => console.log(`Worker[${process.pid}] - Finished processing message`))
        });

    });

    console.log(`Worker [${process.pid}] started`);
}
