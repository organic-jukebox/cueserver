var min = require('osc-min');


function OSC_clients (socket) {
    this._sock = socket;
    this.clients = [];
};


OSC_clients.prototype.register = function(ip, port) {
    var client = {ip: ip, port: port};
    var registered = false;
    for (var i=0; i<this.clients.length; i++) {
        if ((this.clients[i].ip == ip) &&  (this.clients[i].port == port)){
            registered = true;
        }
    }
    if (registered) {
        console.log(('Already registered').blue);
    }
    else {
        this.clients.push(client);
        console.log(('New osc client registered at ' + ip + ':' + port).yellow);
    };
};


OSC_clients.prototype.unregister = function(ip, port) {
    "Removing osc client not yet implemented..."
};


OSC_clients.prototype.send_to_all = function(message) {
    var self = this;
    this.clients.forEach(function (client, i) {
        self.send(message, client.ip, client.port);
    });
};


OSC_clients.prototype.send = function(message, ip, port) {
    var buf = min.toBuffer(message);
    this._sock.send(buf, 0, buf.length, port, ip);
};


module.exports = OSC_clients;
