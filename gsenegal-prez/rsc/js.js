/*******************************************************************************
 * ORIENTATION
 ******************************************************************************/
function OrientationSlide(slide) {
  this._slide = $(slide);
  this._lastBeta = 0;
  this._lastGamma = 0;
  
  //this.onOrient();
  var orientHandler = $.proxy(this, 'onOrient');
  $(window).bind('deviceorientation', orientHandler);

  /*
  var orientHandler = $.proxy(this, 'onOrient');
  $(this._slide).bind('focusslide', function(evt){
    $(window).bind('deviceorientation', orientHandler);
  }).bind('blurslide', function(evt) {
    $(window).unbind('deviceorientation', orientHandler);
  });
  */
};

OrientationSlide.prototype.onOrient = function(evt) {
  evt = evt.originalEvent;
  var overThreshold = Math.abs(evt.gamma) > 4 || Math.abs(evt.beta) > 4;
  var gamma = overThreshold ? evt.gamma : 0; 
  var beta = overThreshold ? evt.beta : 0;
  
  if (this._lastGamma != gamma || this._lastBeta != beta) {
    var zindex = 0;
    $('.layer').each(function(index, elem) {
      zindex++;
      var x = Math.round(1.5 * gamma * zindex);
      var y = Math.round(1.5 * beta * zindex);
      $(elem).css('left', x.toString() + 'px')
             .css('top', y.toString() + 'px')
             .css('-webkit-transform', 'rotateY(' + -2.0 * gamma + 'deg) rotateX(' + -2.0 * beta + 'deg)');

    });
    this._lastGamma = gamma;
    this._lastBeta = beta;
  }
};