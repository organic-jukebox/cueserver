define(function() {

  function textModule(canvasObj, fontsize, align, xpos) {
    this.fontsize = (typeof fontsize !== 'undefined') ? fontsize : 0.07;
    this.align = (typeof align !== 'undefined') ? align : "center";
    this.canvasObj = canvasObj;
    this.oscGate = false; //make sure not to process osc messages until module has finished rendering
    this.Xpos = (typeof xpos !== 'undefined') ? xpos : 0.08;
    this.heightFrac = 0.25;
    this.text = "Cueserver";

    this.renderText = function() {
      this.canvasObj.clearAll();
      this.canvasObj.ctx.font = this.font;
      this.canvasObj.ctx.textAlign = this.align;
      this.canvasObj.ctx.fillText(this.text, this.textX, this.textY, this.textW);
    };
  };

  textModule.prototype.osc_address = "/text";
  
  textModule.prototype.osc = function(data) {
      var message = data.message;
      this.text = message[0];
      this.renderText();
  };

  textModule.prototype.render = function(width, height) {
    var left, top, newWidth, newHeight, centerX;
    this.oscGate = false;

    centerX = Math.round(width * this.Xpos);
    newWidth = Math.round((width - centerX) * 0.9);
    left = Math.round(centerX + ((width - centerX - newWidth) / 2));
    newHeight = Math.round(height * this.heightFrac);
    top = 0;

    this.canvasObj.position(left, top, newWidth, newHeight);
    this.textX = Math.round(newWidth / 2);
    this.textY = Math.round(newHeight / 2);
    this.textW = newWidth;
    this.font = Math.round(((width + height) / 2) * this.fontsize).toString() + "px Arial";
    this.renderText();
    this.oscGate = true;
  };

/*
  textModule.prototype.update = function(now, pixnow) {

  };
*/
  return textModule;

});