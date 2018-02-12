define(['jqueryui'], function() {

  function buttonModule(socket, buttons, xpos) {
    this.Xpos = (typeof xpos !== 'undefined') ? xpos : 0.08;
    this.buttons = (typeof buttons !== 'undefined') ? buttons : [];

    $("body").append('<div id="button_module"></div>');

    for (var i = 0; i < this.buttons.length; i++) {
        var button_text = this.buttons[i][0];
        $("#button_module").append('<button>' + button_text + '</button>');
        $("#button_module button:eq(" + i.toString() + ")").button({}).click(function(return_text) {
          return function(){
            socket.emit('buttonClick', return_text);
          }    
        }(this.buttons[i][1]));
    };
  };

  buttonModule.prototype.osc = function(data) {

  };


  buttonModule.prototype.render = function(width, height) {

    var left, top, newWidth, newHeight;
    var centerX = Math.round(width * this.Xpos);
    var buttons = this.buttons.length;
    var buttonWidth = Math.round((width - centerX) / (buttons + 1));
    var buttonHeight = Math.min(buttonWidth * 0.7, (height / 2) * 0.6);
    newWidth = buttonWidth * buttons;
    newHeight = buttonHeight;
    left = Math.round(centerX + ((width - centerX - newWidth) / 2));
    top = Math.round((height / 2) + (((height / 2) - newHeight) / 2));

    $("#button_module").css("left", left).css("top", top).attr("height", newHeight).attr("width", newWidth).css("position", "absolute");
    $(".ui-button").css("width", buttonWidth).css("height", buttonHeight).css("font-size", (buttonHeight * 0.3) + 'px').css("text-align", "center").css("line-height", buttonHeight);


  };

  /*
  textModule.prototype.update = function(now, pixnow) {

  };
  */

  return buttonModule;

});