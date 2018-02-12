define(['jquery'], function($) {

  function makeCanvas(id) {
    $("body").append('<canvas id="' + id + '"></canvas>');
    this.canvas = document.getElementById(id);
    $(this.canvas).css('position', 'absolute');
    this.ctx = this.canvas.getContext('2d');
  };

  makeCanvas.prototype.position = function(left, top, width, height) {
    this.width = width;
    this.height = height;
    $(this.canvas).css("left", left).css("top", top).attr("height", height).attr("width", width);
  };

  makeCanvas.prototype.clearAll = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  };

  return makeCanvas;

});