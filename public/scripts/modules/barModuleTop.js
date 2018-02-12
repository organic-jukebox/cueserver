define(function() {

  function barModule(canvasObj) {
    this.canvasObj = canvasObj;
    this.Xpos = 0.08; // X-position of "impact", percent of window width
    this.barColor = "#000000";
  };

  barModule.prototype.osc_address = "/cue";
  
  barModule.prototype.osc = function(data) {
    var message = data.message;
    var color = message[0];
    var direction = message[1];
    var text = message[2];
    
    if (direction != "bottom") {
      this.timeQueue.unshift({pix:data.pixstamp});
      this.queueLength = this.timeQueue.length;
    };
  };
      
  barModule.prototype.render = function(width, height) {
    var barHalf = Math.round(width * 0.01);
    var newWidth = (barHalf * 2) + 1;
    var centerX = Math.round(width * this.Xpos);
    this.canvasObj.position(centerX - barHalf - 1, 0, newWidth, height);
    this.width = newWidth;
    this.height = height;
    this.edge = width / 2;
    this.timeQueue = [];
    this.queueLength = 0;
    this.state = 0;
    this.lastPixY = 0;
    this.span = height / 2;
    this.canvasObj.ctx.fillColor = this.barColor;
  };

  barModule.prototype.update = function(now, pixnow) {
    var obj = this;
    var between, angle;
    var ctx = this.canvasObj.ctx;

    var loadNewB = function () {
       var cue;
          cue = obj.timeQueue.pop();
          obj.queueLength = obj.timeQueue.length;
          obj.b = cue.pix
    };
    
    var bOverEdge = function () {
      return (obj.timeQueue[obj.queueLength - 1].pix < (pixnow + obj.edge));
    };
    

    switch (this.state) {
      //both edge
      /*
       runs through case 0 all the way until a time cue arrives, then it switches to case 2
       */
      
    case 0:
      //calculate angle:
      angle = 1;
      
      //find next state:
      if (obj.queueLength > 0) {
        if (bOverEdge()) {
          loadNewB();
          obj.state = 2;
        };
      };
      break;

      
    case 1: //both numbers
       //calculate angle:
       between = (pixnow - obj.a) / obj.diff;
      angle = Math.abs(Math.sin(between * Math.PI));
      
      //find next state:
      if (obj.b < pixnow) {
        obj.a = obj.b;
        if (obj.queueLength > 0) {
          if (bOverEdge()) {
            loadNewB();
            obj.diff = obj.b - obj.a;
          } else {
            obj.state = 3;
          }
        } else {
          obj.state = 3;
        }
      } else if (obj.a < (pixnow - obj.edge)) {
        obj.state = 2;
      };
      break;

      
      //a is edge
      /*
       * obj.edge is halfway (in the middle of the screen, on both sides of the bar) where the bar starts to move
       * obj.a is left of the bar
       * obj.b is right of the bar
       *
       */
    case 2:
      //calculate angle:
      between = obj.edge / (obj.edge + obj.b - pixnow);
      angle = Math.abs(Math.sin(between * Math.PI));
      
     //find next state:
      if (obj.b < pixnow) { //if obj.b is in the past (to the left), move it to obj.a
        obj.a = obj.b;
        if (obj.queueLength > 0) { //if there is any more cues, else switch to state 3
          if (bOverEdge()) {//if timecue is within edge, add this to b, and switch to state 1 (both), else switch to state 3
             loadNewB();
            obj.state = 1;
            obj.diff = obj.b - obj.a;
          } else {
            obj.state = 3;
          }
        } else {
          obj.state = 3;
        };
      };
      break;

      //b is edge
    case 3:
      //calculate angle:
      between = obj.edge / (obj.edge + pixnow - obj.a);
      angle = Math.abs(Math.sin(between * Math.PI));
      
      //find next state:
      if (obj.a < (pixnow - obj.edge)) {
        obj.state = 0
      } else if (obj.queueLength > 0) {
        if (bOverEdge()) {
           loadNewB();
          obj.state = 1;
          obj.diff = obj.b - obj.a;
        }
      };
      break;
    };

    var pixY = Math.round((1 - angle) * obj.span);

    if (pixY > obj.lastPixY) {
      ctx.fillRect(0, obj.lastPixY, obj.width, pixY - obj.lastPixY);
    } else if (pixY < obj.lastPixY) {
      ctx.clearRect(0, pixY, obj.width, obj.lastPixY - pixY);
    };

    obj.lastPixY = pixY;
  };

  return barModule;

});