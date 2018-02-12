define(['jquery'], function($) {

  function cueTextModule(canvasObj) {
    this.canvasObj = canvasObj;
    this.oscGate = false; //make sure not to process osc messages until module has finished rendering
    this.Xpos = 0.12; // X-position of "impact", percent of window width
    this.boxW = 1 - this.Xpos; //percent of window width
    this.boxH = 0.25; //percent of window height
    this.cues = []; // container for time cues
    
    
    this.renderText = function() {
      var xpoint, context, obj, textGap;
      
      xpoint = 0;
      context = this.canvasObj.ctx;
      obj = this;
      textGap = 60;
      
      this.canvasObj.clearAll();
      context.font = this.font;
      context.textAlign = "left";
      
      this.cues.forEach(function(cue, i) {
        context.fillStyle = cue.color;
        context.fillText(cue.text, xpoint, Math.round(obj.height * 0.7), obj.width);
        xpoint = xpoint + context.measureText(cue.text).width + textGap;    
      });
      
    };
    
  };

  cueTextModule.prototype.osc_address = "/cue";

  cueTextModule.prototype.osc = function(data) {
    
    var message = data.message;
    var color = message[0];
    var direction = message[1];
    var text = message[2];
    
    this.cues.push({
        pix: data.pixstamp,
        text: text,
        color: color
      });

    this.renderText();
  };

  cueTextModule.prototype.render = function(width, height) {

    this.cues = []; //remove existing time cues when re-rendering

    var centerX = Math.round(width * this.Xpos);
    var centerY = Math.round(height / 2);
    var topY = Math.round(centerY - (height * (this.boxH + 0.04)));
    
    this.width = Math.round(this.boxW * width);
    this.height = Math.round(this.boxH * height);
    
    this.font = Math.round(((width + height) / 2) * 0.08).toString() + "px Arial";
    this.canvasObj.position(centerX, topY, this.width, this.height);
    
    this.oscGate = true;
  };

  cueTextModule.prototype.update = function(now, pixnow) {
    var cues = this.cues;
    var ctx = this.canvasObj.ctx;

    //remove old cues that has passed the "impact" position ("now");
    if (cues.length > 0) {
      if ((cues[0].pix - pixnow) < 0) {
        cues.shift();
        this.renderText();
      }
    };
  };

  return cueTextModule;

});