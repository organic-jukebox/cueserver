define(['jquery'], function($) {

    function cueModule(canvasObj) {
        this.canvasObj = canvasObj;
        this.Xpos = 0.08; // X-position of "impact", percent of window width
        this.crossFrac = 0.06; // width of cross shapes, percent of window width
        this.cues = []; // container for time cues
        this.shapes = {}; // container for pre-rendered shapes
    };

    //pre-render X-shapes of various colors
    cueModule.prototype.renderCross = function(color, width) {
        var can, ctx;
        can = document.createElement('canvas');
        $(can).attr("height", width).attr("width", width);
        ctx = can.getContext('2d');
        ctx.lineWidth = (Math.round(width * 0.08) * 2) + 1;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, width);
        ctx.strokeStyle = color;
        //ctx.beginPath();
        //ctx.moveTo(0.5, 0.5);
        //ctx.lineTo(width - 0.5, width - 0.5);
        //ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0.5, width - 0.5);
        ctx.lineTo(width - 0.5, 0.5);
        ctx.stroke();
        return can;
    };

    cueModule.prototype.osc_address = "/cue";
    
    cueModule.prototype.osc = function(data) {
        var message = data.message;
        var color = message[0];
        var direction = message[1];
        var text = message[2];
        var shapes = this.shapes;
        var shape;
        switch (color || "black") {
            case "red":
                shape = shapes.redCross;
                break;
            case "black":
                shape = shapes.blackCross;
                break;
            case "blue":
                shape = shapes.blueCross;
                break;
            default:
                shape = shapes.blackCross; 
        };
        
        this.cues.push({
            pix: data.pixstamp,
            shape: shape,
            text: text,
            lastX: data.pixstamp
        });
    };


    cueModule.prototype.render = function(width, height) {
        this.cues = []; //remove existing time cues when re-rendering
    
        //calculate size of X-shapes
        var crossHalfWidth = Math.round(width * (this.crossFrac / 2));
        this.crossWidth = (crossHalfWidth * 2) + 1;
    
        //pre-render X-shapes
        this.shapes.blackCross = this.renderCross("black", this.crossWidth);
        this.shapes.redCross = this.renderCross("red", this.crossWidth);
        this.shapes.blueCross = this.renderCross("blue", this.crossWidth);
    
        var centerX = Math.round(width * this.Xpos);
        var centerY = Math.round(height / 2);
    
        this.canvasObj.position(centerX - crossHalfWidth - 1, centerY - crossHalfWidth - 1, width - centerX + crossHalfWidth + 1, this.crossWidth);
    };

    cueModule.prototype.update = function(now, pixnow) {
        var cues = this.cues;
        var ctx = this.canvasObj.ctx;
        var crossW = this.crossWidth;
        var h = this.canvasObj.height;
        var w = this.canvasObj.width;
    
        //remove old cues that has passed the "impact" position ("now");
        if (cues.length > 0) {
            if ((cues[0].pix - pixnow) < 0) {
                var cue = cues.shift();
                ctx.clearRect(cue.lastX, 0, crossW, h);
            }
        };

        //draw time cues
        cues.forEach(function(cue, i) {
            var x = cue.pix - pixnow;
            if (x < w) {
                ctx.clearRect(x + crossW, 0, cue.lastX - x, h); //clear old, only what is necessary
                ctx.drawImage(cue.shape, x, 0); //draw new
                cue.lastX = x;
            };
        });
    };

    return cueModule;
});
