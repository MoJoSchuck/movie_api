// Module import
let http = require('http'),
    fs = require('fs'),
    url = require('url');

// Create server  
http.createServer((request, response) => {
    // Parse URL address
    let addr = request.url,
        q = new URL(addr, 'http://' + request.headers.host),
        filePath = '';

    // Update log file
    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added to log.');
        }
    });

    // Read and send file
    if (q.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html');
    } else {
        filePath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err;
        }

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(data);
        response.end();

    });
}).listen(8080);// Server listens on port 8080

console.log('My test server is running on Port 8080.');