require(['jquery', 'app/app', 'socketio', 'app/sync', 'moduleSetup'],
		function ($, app, io, sync, moduleSetup)
{
    
	//SOCKET
	var socket = io.connect(window.location.host + window.location.search);

    socket.on('init_sync', function (fn)
    {
        var date = (new Date()).getTime();
        fn(date);
    });

    socket.on('reload', function ()
    {
        window.location.reload(true);
    });

	
	//SYNC
    var mySync = new sync(socket);

	
    //APP
    var myApp = new app(socket, mySync);

    moduleSetup(myApp);
	
    myApp.render();

    $(window).resize(function ()
    {
        myApp.render();
    });

    myApp.start();
    
});
