define(['jquery'], function($) {


    function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    };

  
    function app(socket, sync) {
        this.modules = []; //array for holding modules
        this.modulesNoUpdate = []; //array for holding modules that doesn't need animation update
        this.pixdur = 1; //pixels per millisecond for horizontally moving objects
        this.timespan = 2500;
        this.socket = socket;
        this.localLatency = parseInt(getUrlVars()['l'] || "0", 10); //local latency setting from url variable "l"
    
        var obj = this;
    
        //forward osc messages to modules
        socket.on('/osc', function(data) {
            var lat = 50; //small rendering latency in milliseconds
            var ntpOffset = sync.offset();
            var pixdur = obj.pixdur;
            
            switch (data.address){
                case "/reload":
                    location.reload(true);
                    break;
                default:
                    if (!(ntpOffset == 'noSync')) {
                        data.timestamp = data.timetag + ntpOffset + obj.localLatency - lat;
                        data.pixstamp = Math.round(data.timestamp / pixdur);
                        obj.modules.concat(obj.modulesNoUpdate).forEach(function(module, i) {
                            console.log(module.osc_address);
                            if (module.osc_address == data.address)
                            {
                                module.osc(data);
                            };
                        });
                    };
            };
        });
    };

  
    app.prototype.use = function(module) {
        if (module.update)
        {
            //needs animation update:
            this.modules.push(module);
        }
        else
        {
            //does not need animation update:
            this.modulesNoUpdate.push(module);
        };
    };
  
  
    app.prototype.render = function() {
        var width = window.innerWidth;
        var height = window.innerHeight;
    
        this.pixdur = this.timespan / width;
    
        this.modules.forEach(function(module, i) {
            module.render(width, height);
        });
        
        this.modulesNoUpdate.forEach(function(module, i) {
            module.render(width, height);
        }); 
    };

  
    app.prototype.update = function(now, pixnow) {
        this.modules.forEach(function(module, i) {
            module.update(now, pixnow);
        })
    };

  
    app.prototype.start = function() {
        var obj = this;
    
        function animation(time) {
            requestAnimationFrame(animation);
            var now = (new Date()).getTime();
            var pixnow = Math.round((now / obj.pixdur));
            obj.update(now, pixnow);
        };
        
        requestAnimationFrame(animation);
    };

  
  return app;
});