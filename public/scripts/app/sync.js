define(function ()
{

    function sync(socket)
    {
        var offsets = [];
        this.offsets = offsets;
        this.socket = socket;
        socket.on('ntp:server_sync', function (data)
        {
            var now = Date.now();
            var transTime = (now - data.t0) / 2;
            var diff = now - data.t1 - transTime;

            offsets.unshift(
            {
                diff: diff,
                transTime: transTime
            });

            if (offsets.length > 20)
            {
                offsets.pop()
            };
        });

        setInterval(function ()
        {
            socket.emit('ntp:client_sync', {
                t0: Date.now()
            });
        }, 1000);
    };

    sync.prototype.offset = function ()
    {
        var sum = 0;
        var offsets = this.offsets;
        var offsetsSorted = offsets.slice().sort(function (a, b) //slice to copy entire array before sort
        {
            return a.transTime - b.transTime; //sort by transmission time
        });

        /*
        var printArray = [];
        
        offsetsSorted.forEach(function(data, i) {
          printArray.push(data.transTime);
        });
        
        console.log(printArray);

        */
        
        if (offsetsSorted[0]) {
          //this.socket.emit('diffLog', [offsetsSorted[0].transTime, offsetsSorted[0].diff]);
          return offsetsSorted[0].diff; //return the offset with the shortest transmission time
        }
        
        return 'noSync'; 
    };


    return sync;

});