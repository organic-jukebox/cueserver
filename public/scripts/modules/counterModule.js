define(function() {

  function counterModule(canvasObj) {
    this.oscGate = false; //make sure not to process osc messages until module has finished rendering
    this.canvasObj = canvasObj;
    this.currentBeat = 0;
    this.lastBeat = 0;
    this.radiusFrac = 0.02; // percentage of windows width
    this.beatsInBar = 4;
    this.counterQueue = [];
    this.Xpos = 0.08;
    this.widthFrac = 0.7;

    this.drawDot = function(dot, color) {
      var ctx = this.canvasObj.ctx;
      ctx.fillStyle = color;
      ctx.fillRect(dot.x - this.radius, dot.y - this.radius, this.radius * 2, this.radius * 2);
    };
  };

  counterModule.prototype.osc_address = "/beat";
  
  counterModule.prototype.osc = function(data) {
    if (this.oscGate) {
      var message = data.message;
      var beat = message[0];
      this.counterQueue.push({
        timestamp: data.timestamp,
        beat: beat
      });
    };
  };

  counterModule.prototype.render = function(width, height) {
    var obj = this;
    var ctx = this.canvasObj.ctx;
    var left, top, newWidth, newHeight;
    var centerX = Math.round(width * this.Xpos);
    this.radius = Math.round(width * this.radiusFrac);
    newWidth = Math.round(width * this.widthFrac);
    left = Math.round(centerX + ((width - centerX - newWidth) / 2));
    top = Math.round((height / 2) + (((height / 2) - (this.radius * 2)) / 2));

    this.canvasObj.position(left, top, newWidth, this.radius * 2);

    var interval = Math.round((newWidth - (this.radius * 2)) / (this.beatsInBar - 1));
    this.dots = [];

    for (var i = 0; i < this.beatsInBar; i++) {
      var dot = {
        x: (interval * i) + this.radius,
        y: this.radius
      };
      this.dots.push(dot);
    };

    this.dots.forEach(function(dot, i) {
      obj.drawDot.call(obj, dot, "black");
    });

    this.oscGate = true;
  };


  counterModule.prototype.update = function(now, pixnow) {
    var obj = this;
    var ctx = this.canvasObj.ctx;
    if (obj.counterQueue.length > 0) {
      if (obj.counterQueue[0].timestamp <= now) {
        obj.lastBeat = obj.currentBeat;
        obj.currentBeat = obj.counterQueue.shift().beat;
        obj.drawDot(obj.dots[obj.lastBeat], "black");
        obj.drawDot(obj.dots[obj.currentBeat], "red");
      }
    };
  };

  return counterModule;

});