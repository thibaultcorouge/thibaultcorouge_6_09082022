const http = require('http'); //Import Node.js core module
const app = require('./app');


const normalizePort = val => { //normalizePort this function returns a valid port wether it's a number or a string.
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if(port => 0) {
        return port;
    }
    return false;
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => { // errorHandler this function seek all the errors and handle it. then save it in the server. 
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
            default:
                throw error;
    }
};

const server = http.createServer(app); 


server.on('error', errorHandler);
server.on('listening', () => { // event listener store the port or the canal named after it on which the server is executing.
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('listening on ' + bind);
})

server.listen(port);