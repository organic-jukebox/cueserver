var OSC_Message = require('node-osc/lib/Message');


function create_message() {
    args = Array.prototype.slice.call(arguments);
    msg = new OSC_Message(args[0]);
    for (var i = 1; i < args.length; i++) {
        msg.append(args[i]);
    };
    return msg;
};


function get_bundles(msg) {
    //check if osc message is a bundle
    if (msg[0] == "#bundle")
        {
            timetag = Math.round((msg[1] - 2208988800) * 1000); //convert to Unix epoch
            bundles = msg.slice(2);
        }
        
    //not a bundle
    else
        {
            bundles = [msg];
            timetag = (new Date()).getTime;
        }
        
    bundles.forEach(function (data, i) {
            bundles[i] = {
                address: data[0],
                message: data.slice(1),
                timetag: timetag
            }
        }
    );
    
    return bundles;
};
    
module.exports = {
    create_message: create_message,
    get_bundles: get_bundles
}


