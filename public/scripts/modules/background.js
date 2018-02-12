define(function() {

  function background(canvasObj) {
    this.canvasObj = canvasObj;
    this.Xpos = 0.08; // X-position of "impact", percent of window width
  };


  background.prototype.osc = function(data) {};


  background.prototype.render = function(width, height) {

    var x = Math.round(width * this.Xpos);
    var y = Math.round(height / 2);
    var context = this.canvasObj.ctx;

    this.canvasObj.position(0, 0, width, height);

    context.clearRect(0, 0, width, height);

    var len = Math.round(height / 10);
    for (var i = 0; i < len; i++) {
      context.beginPath();
      context.moveTo(x - 0.5, (i * 10) + 0.5);
      context.lineTo(x - 0.5, (i * 10) + 5.5);
      context.fillStyle = "#DDDDDD";
      context.stroke();
    };
    len = Math.round(width / 10);

    for (var i = 0; i < len; i++) {
      context.beginPath();
      context.moveTo((i * 10) + 0.5, y - 0.5);
      context.lineTo((i * 10) + 5.5, y - 0.5);
      context.fillStyle = "#DDDDDD";
      context.stroke();
    };
  };
  
/*
  background.prototype.update = function(now, pixnow) {};
*/

  return background;

});