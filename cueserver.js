// load modules:
var yaml = require('js-yaml');
var fs = require('fs');
var colors = require('colors');
var ArgumentParser = require('argparse').ArgumentParser;
var extend = require('extend');

var parser = new ArgumentParser({
  addHelp:true,
  description: 'Argparse example'
});

parser.addArgument([ '-I', '--html-ip' ], {
    help: 'IP for the HTML communication',
    defaultValue: '0.0.0.0',
    type: 'string',
    est: 'html-ip'
});

parser.addArgument([ '-P', '--html-port' ], {
    help: 'Port for the HTML communication',
    defaultValue: 8080,
    type: 'int',
    dest: 'html-port'
});

parser.addArgument([ '-i', '--ip' ], {
    help: 'IP for the OSC communication',
    defaultValue: '127.0.0.1',
    type: 'string',
    dest: 'osc-ip'
});

parser.addArgument([ '-p', '--port' ], {
    help: 'Port for the OSC communication',
    defaultValue: 5004,
    type: 'int',
    dest: 'osc-port'
});

parser.addArgument([ '-c', '--config-path' ], {
    help: 'Path to yaml configuration file',
    defaultValue: './default_config.yaml',
    dest: 'configpath',
});

parser.addArgument([ '-n', '--no-login' ], {
    help: 'If set, no login window is presented',
    dest: 'no-login',
    action: 'storeTrue'
});


var args = parser.parseArgs();
var defaults = {
    'some-default': 'some value'
};

// load the config file:
try {
  var yaml_config = yaml.safeLoad(fs.readFileSync(args.configpath, 'utf8'));
} catch (e) {
  console.log(e);
};

var config = extend( {}, defaults, yaml_config, args);

//load the app:
require('./lib/app.js')(config);

        


