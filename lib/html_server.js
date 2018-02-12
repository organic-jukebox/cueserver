// EXPRESS SERVER:

var express = require('express');
var path = require('path');

var HTML_server = function(config){
        
    var app = express();

    app.use(express.static(path.join(__dirname, '../', 'public')));

    app.get('/scripts/moduleSetup.js', function (req, res){
        var name = req.query.n || "anonymous";
        var mapping = config['user-mappings'][config['mapping']];
        var mapping = (typeof mapping === 'undefined') ? config['user-mappings']['default'] : mapping
        var usertype = mapping['users'][name] || "default";
        var modpath = mapping['usertypes'][usertype];
        console.log(modpath)
        res.sendFile(path.join(__dirname, '../', modpath));
    });
    
    if (config['no-login']) {
        main_page = '/';
    }
    else {
        main_page = '/cueserver.html';
        app.get('/', function (req, res){
            var path2 = path.join(__dirname, '../private/index.html');
            res.sendFile(path2);
        });
    };
    
    app.get(main_page, function (req, res){

        var name = (req.query.n || "anonymous").toLowerCase();
        var n = "\n";

        res.send(
            "<!DOCTYPE html>" + n +
            "<html>" + n +
            "<head>" + n +
            "<title>Organic Nodes</title>" + n +
            "<link rel='stylesheet' href='/stylesheets/style.css'></link>" + n +
            "<link rel='stylesheet' href='/stylesheets/jquery-ui.css'></link>" + n +
            "<link rel='stylesheet' href='/stylesheets/jquery-ui.structure.css'></link>" + n +
            "<link rel='stylesheet' href='/stylesheets/jquery-ui.theme.css'></link>" + n +
            "<script>" + n +
                "var require = {" + n +
                    "shim: {" + n +
                        "'socketio': {" + n +
                            "exports: 'io',  " + n +
                            "}," + n +
                        "'jqueryui': {" + n +
                            "exports: '$'," + n +
                            "deps: ['jquery']" + n +
                        "}" + n +
                    "}," + n +
                    "paths: {" + n +
                        "socketio: '../socket.io/socket.io'," + n +
                        "jqueryui: 'jquery-ui'" + n +
                    "}," + n +
                    "urlArgs: 'n=" + name + "'};" + n +
            "</script>" + n +
            "<script data-main='scripts/main' src='scripts/require.js'></script>" + n +
            "</head>" + n +
            "<body>" + n +
            "</body>" + n +
            "</html>" + n
        );
        
    });
    
    return app.listen(config['html-port'], config['html-ip']);
};

module.exports = HTML_server;