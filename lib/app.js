app = function(config){    
    
    //modules:
    var url = require('url');
    
    // html side:
    var html_server = require('./html_server.js')(config);
    var html_clients = new (require('./html_clients'))(); //placeholder for clients
    var HTML_Client = require('./client'); //the Client class
    var socket_io = require('socket.io').listen(html_server);
    
    // osc side:
    var osc_server = new (require('node-osc').Server)(config['osc-port'], config['osc-ip']);
    var osc_clients = new (require('./osc_clients'))(osc_server._sock);
    var osc_funcs = require('./osc_funcs');
    
    //load pre-registered osc-clients:
    if (config['pre-register']) {
        config['pre-register'].forEach(function (data, i) {
            osc_clients.register(data.ip, data.port);
        });
    };
    
    function update_names(names) {
        var message = osc_funcs.create_message.apply(osc_funcs.create_message, ['/clients'].concat(names));
        osc_clients.send_to_all(message);
    };    
    
    //dispatch OSC messages:
    osc_server.on("message", function (msg, rinfo){
        var parsed_bundles = osc_funcs.get_bundles(msg);
        parsed_bundles.forEach(function (osc_message, i){
            switch (osc_message.address){
                case "/ping":
                    // return what we received:
                    var message = osc_funcs.create_message.apply(osc_funcs.create_message, ['/pingreply'].concat(osc_message.message));
                    osc_clients.send(message, rinfo.address, rinfo.port);
                    break;
                case "/register":
                    // register new OSC client:
                    osc_clients.register(rinfo.address, rinfo.port);
                    break;
                case "/clients":
                    update_names(html_clients.names);
                    break;
                case "/mapping":
                    config['mapping'] = osc_message.message[0]
                    break;
                case "/reload":
                    if (osc_message.message.length > 1)
                        {config['mapping'] = osc_message.message[1]}
                    html_clients.filter_send(osc_message);
                    break;
                case "/cue":
                    html_clients.filter_send(osc_message);
                    break;
                case "/beat":
                    html_clients.filter_send(osc_message);
                    break;
                case "/text":
                    html_clients.filter_send(osc_message);
                    break;
            };
        });
    });
    
    // socket io:
    socket_io.on('connection', function(socket) {
        var name = url.parse(socket.request.url, true).query.n;
        var client = new HTML_Client(socket, name);
        
        function on_sync_callback(client) {
            html_clients.add(client, update_names);
        };
        
        client.sync(on_sync_callback);
    
        socket.on('disconnect', function () {
            html_clients.remove(client, update_names);
        });
    
        socket.on('buttonClick', function (value) {
            var message = osc_funcs.create_message.apply(osc_funcs.create_message, ['/buttonclick'].concat([client.name, value]));
            osc_clients.send_to_all(message);
        }); 
    });
};

module.exports = app;
