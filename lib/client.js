function Client (socket, name) {
    this.socket = socket;
    this.id = socket.id;
    this.name = (name || "anonymous").toLowerCase();
    this.synced = false;
 
    socket.on('ntp:client_sync', function (data)
    {
        socket.emit('ntp:server_sync', {
            t1: Date.now(),
            t0: data.t0
        });
    });
}


Client.prototype.sync = function(callback_on_sync){
    var self = this;
    var pingtime = (new Date()).getTime();
    this.socket.emit('init_sync', function (timestamp)
    {
        var now = (new Date()).getTime();
        self.latency = (now - pingtime) / 2;
        self.timeAdjust = now - timestamp;
        self.synced = true;
        callback_on_sync(self);
    });
};


module.exports = Client;