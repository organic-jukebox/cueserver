define(['app/makeCanvas', 'modules/barModule', 'modules/barModuleTop', 'modules/barModuleBottom', 'modules/counterModule', 'modules/textModule', 'modules/cueModule', 'modules/background', 'modules/cueTextModule', 'modules/buttonModule'],
	   function (makeCanvas, barModule, barModuleTop, barModuleBottom, counterModule, textModule, cueModule, background, cueTextModule, buttonModule)
{
    setup = function (app)
    {
        app.use(new background(new makeCanvas("backgroundCanvas")));
        app.use(new cueModule(new makeCanvas("cueCanvas")));
        app.use(new barModuleTop(new makeCanvas("barCanvas")));
        app.use(new barModuleBottom(new makeCanvas("barCanvas")));
        app.use(new counterModule(new makeCanvas("counterCanvas")));
        app.use(new textModule(new makeCanvas("textCanvas")));
        app.use(new cueTextModule(new makeCanvas("cueTextCanvas")));
        //app.use(new buttonModule(app.socket, [["Cng", "change"], ["Next", "next"]]));

        return app;
    };

    return setup;
});