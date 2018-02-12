function HTML_clients () {
    this.clients = [];
    this.names = [];
};


HTML_clients.prototype.add = function(client, update_names_callback) {
    this.clients.push(client);
    console.log((client.name + ' connected! |  ID: ' + client.id + ' | Latency: ' + client.latency + ' | NTP difference: ' + client.timeAdjust).blue);
    this.update_names(update_names_callback);
};


HTML_clients.prototype.remove = function(client, update_names_callback) {
    var id = client.id;
    var self = this;
    this.clients.forEach(function (client2, i) {
        if (id === client2.id) {
            self.clients.splice(i, 1);
        }
    });
    console.log((client.name + ' disconnected!' + ' | Clients: ' + this.clients.length).blue);
    this.update_names(update_names_callback);
};


HTML_clients.prototype.filter_send = function(osc_obj) {
    var name = osc_obj.message.shift().toLowerCase();
    console.log(("TO " + name.toUpperCase() + ": " + osc_obj.address + "," + osc_obj.message).red);

    this.clients.forEach(function (client, i)
    {
        if ((name == client.name) || (name == "all"))
        {
            client.socket.emit("/osc", osc_obj);
        };
    });
};


HTML_clients.prototype.update_names = function(update_names_callback) {
    var names = [];
    this.clients.forEach(function (client, i)
    {
        var name = client.name;
        names.push(name);
    });
    this.names = names;
    console.log(('HTML clients: ' + this.clients.length + ' ---> ' + names.join(" | ")).green);
    update_names_callback(names);
};


module.exports = HTML_clients;