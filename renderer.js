// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// Get the local IP addresses and display to user
var os = require('os');

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}
document.getElementById("localip").innerHTML = addresses;

// Get the external IP address and display to user
var http = require('http');
var dns = require('dns');

http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
  resp.on('data', function(ip) {
    var parsedIp = String(ip);
    console.log(parsedIp);
    document.getElementById("externalip").innerHTML = parsedIp;

    dns.reverse(parsedIp, function(err, hostnames) {
      document.getElementById("reversedns").innerHTML = hostnames;
    });
  });
});
