var cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {

  for (var i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', function () {
    cluster.fork();
  });
} else {
  require('./server');
}


dns
load balancer
-2 servers
-8 processes npm forever