// Copyright Google 2012 - All rights reserved.
// Author : zakelfassi@google.com (Zak)
// HTML5 Codelab in g|Maroc 2012.
// Darbouka Doodle - Celebrating Moroccan Music !

// DONE (Zak) : handle multiple audio channels for a more realistic effect.
// TODO (Zak) : implement correct event listening for doodle object and lose the _this hack !

/**
 * @codelaboverview
 * Start the codelab by presenting the elements of HTML5 we are going to use :
 *   -Audio http://html5doctor.com/native-audio-in-the-browser/
 *   -Canvas https://developer.mozilla.org/en/Canvas_tutorial/Basic_animations
 *   -Localstorage http://playground.html5rocks.com/#localstorage
 *   -CSS3 (very basic stuff: text-shadow, box-shadow, transitions) for doodle description
 *   and presentation page.
 *   -HTML5 markup (also, very basic talk about new elements, usage, when & why).
 */


var Doodle = {};


Doodle = function() {
  /**
   * Wait until all the elemnts are loaded, otherwise (using 
   * document.onload = init(); in index.html will cause the canvas to stay empty,
   * because the images aren't loaded totally, yet !)
   */
  this.init();
};


/**
 * The canvas.
 */
Doodle.prototype.mainCanvas = null; // The canvas HTML element.
Doodle.prototype.ctx = null; // The canvas context.


/**
 * The 6 Djembes.
 * @type {array.<Image>}
 */
Doodle.prototype.djembe = [];


//The record button.
Doodle.prototype.recordButton = null;



/**
 * Initialisation of the Doodle.
 */
Doodle.prototype.init = function() {
  var _this = this;
  document.addEventListener("keypress", function() {_this.handleKeyPress(event, _this);}, false);
  
  this.mainCanvas = document.getElementById('main-canvas');
  this.ctx = this.mainCanvas.getContext('2d');

/**
  this.recordButton = document.getElementById('record-button');
  this.recordButton.addEventListener('click', function() {_this.handleRecordButton(event, _this);}, false);
*/  
  this.mainCanvas.addEventListener('mousedown', function() {_this.touchDjembe(event, _this);}, false);
  

  var sprite = new Image();
  sprite.src = 'gmaroc-doodle/img/doodle-sprite.png';
  sprite.addEventListener('load', this.initCanvas.call(this), false);
  this.initSounds();
};


/**
 * Sets a global variable.
 * Used in recording and playback.
 */
Doodle.prototype.song = null;


/**
 * Sets a global variable.
 * Used while saving/retrieving data from localstorage.
 */
Doodle.APP_KEY = 'doodle';


/**
 * Handles the keypress event.
 * Play Djembe with F-G-H/V-B-N keys !
 * @param {event} e The event; e.keycode returns ASCII code in webKit.
 * @param {Object} _this The context. (the doodle Object).
 */
Doodle.prototype.handleKeyPress = function(e, _this) {
  _this.playDarboukaByKeyCode(e.keyCode);
};


/**
 * Handles the touch event.
 * Play Djembe with your fingers !
 * @param {event} e The event.
 * @param {Object} _this The context. (the doodle Object).
 */
Doodle.prototype.touchDjembe = function(e, _this) {
  var w = this.djembeFrameWidth;
  var h = this.djembeFrameHeigh;
  var djembeNumber;
  djembeNumber = Math.floor(e.offsetX/w) + 1;
  //console.log('Djembe #' + djembeNumber);
  this.playDarbouka(djembeNumber);
};


/**
 * Plays the i-Djembe based on ASCII code.
 * @param {number} code The key ASCII code.
 */
Doodle.prototype.playDarboukaByKeyCode = function(code) {
  //console.log(e.keyCode);
  switch(code) {
    case 102: //F
	  this.playDarbouka(1);
	  break;
    case 103: //G
      this.playDarbouka(2);
      break;
    case 104: //H
      this.playDarbouka(3);
      break;
    case 118: //V
      this.playDarbouka(4);
      break;
    case 98: //B
      this.playDarbouka(5);
      break;
    case 110: //N
      this.playDarbouka(6);
      break;
    default:
      console.log('Invalid key !'); // if any other key pressed. 
	}
	console.log('Current keycode : ' + code)
};


/****************************************
 *										                  *
 * The doodle sounds				         	*
 * Demonstrating the Sound API					        *
 *										                  *
 ****************************************/

Doodle.prototype.channels = [];


/**
 * Initialize and preload the sounds.
 */
Doodle.prototype.initSounds = function() {
  for(var i = 1; i <= 6; i++) {
    var a = new Audio( 'djembe-doodle/sounds/djembe' + i + '.mp3' );
    a.preload = 'auto';
    this.channels.push(a);
  }
};


/**
 * Play the selected Djembe (1 -> 6).
 * @param {number} n The Djembe number (order in the doodle).
 */
Doodle.prototype.playDarbouka = function(n) {
  //this.stopAllDjembes();
  //Create another node instance.
  var tmp = this.channels[n-1].cloneNode(true);
  tmp.play(); //Djembes are from 1-6 and channels is an array 0-5.
	this.createSoundwave(n);
};


/**
 * Stop all the Djembes currently playing (1 -> 6).
 */
Doodle.prototype.stopAllDjembes = function() {
  for(var i = 1; i <= 6; i++) {
	this.channels[i-1].pause();
	this.channels[i-1].currentTime = 0;
  }
};



/****************************************
 *										                  *
 * The doodle animator				         	*
 * Demonstrating Canvas					        *
 *										                  *
 ****************************************/


/**
 * Canvas global variables.
 * @type {number}
 */
Doodle.CANVAS_WIDTH = 800;
Doodle.CANVAS_HEIGHT = 400;


// Full Sprite width = 800px
// Original AI width = 2213 px
// Scale = 0,3615 
Doodle.prototype.djembeYPos = 241; // Where the Djembes are located within the sprite.
Doodle.prototype.djembeXPos = 0; // By default, it's located on the very left.
Doodle.prototype.djembeFrameWidth = 130; // Djembes frame width.
Doodle.prototype.djembeFrameHeight = 210; // Djembes frame height.
Doodle.prototype.djembeDrawingYPos = 50;

Doodle.prototype.initCanvas = function() {
  for(var i = 0; i < 6; i++) {
    this.djembe[i] = new Image();
    this.djembe[i].src = 'gmaroc-doodle/img/doodle-sprite.png';
  }

  // Initialisation
  this.clearCanvas();
    
  var newDjembePosX = this.djembeXPos;
  var newDjembeDrawingPosX = this.djembeXPos;

  for(var i = 0; i < 6; i++) {
    // (image, x to get, y to get, width to get, height to get, x to put, y to put) 
    this.ctx.drawImage(this.djembe[i], newDjembePosX, this.djembeYPos,
        this.djembeFrameWidth, this.djembeFrameHeight,
        newDjembePosX, this.djembeDrawingYPos,
        this.djembeFrameWidth, this.djembeFrameHeight);
        
    // Sets the new Djembe position.        
    newDjembePosX = this.djembeFrameWidth * (i+1);
  }
  
  this.drawGoogleLogo();
  this.drawAfrica();
};


/**
 * Draw & Place the Google logo.
 */
Doodle.prototype.drawGoogleLogo = function() {
  var googleLogo = new Image();
  googleLogo.src = 'gmaroc-doodle/img/doodle-sprite.png';

  this.ctx.drawImage(googleLogo, 0, 0,
      217, 78,
      400, 310,
      217, 78);  
};


/**
 * Draw & Place the Google logo.
 */
Doodle.prototype.drawAfrica = function() {
  var africa = new Image();
  africa.src = 'gmaroc-doodle/img/doodle-sprite.png';

  this.ctx.drawImage(africa, 0, 78,
      217, 160,
      600, 250,
      217, 160);
};


/**
 * The soundwave.
 */
Doodle.prototype.soundwave = null;
Doodle.prototype.soundwaveXPos = null; // Where to get it.
Doodle.prototype.soundwaveYPos = null; // Where to get it.
Doodle.prototype.soundwaveDrawingXPos = 0; // Where to put it.
Doodle.prototype.soundwaveDrawingYPos = 0; // Where to put it.
Doodle.prototype.soundwaveFrameSize = null;
Doodle.prototype.soundwaveSpriteIndex = 0;
Doodle.prototype.timer = null;

/**
 * Creating the sound wave effect.
 * @param {number} i The positionning of the soundwave relative to the Djembe
 * pressed.
 */
Doodle.prototype.createSoundwave = function(i) {
  if(!i) i=1;
  window.clearInterval(this.timer);
  
  this.soundwaveXPos = 0;
  this.soundwaveYPos = 451;
  this.soundwaveFrameSize = 43; //actually, 42.657 !
  
  this.soundwave = new Image();
  this.soundwave.src = 'gmaroc-doodle/img/doodle-sprite.png';
  
  var _this = this;
  this.timer = setInterval(function() { _this.animateSoundwave(i); }, 60);
};


/**
 * Animating the soundwave sprite.
 * @param {number} i The ID of the Djembe; this way, we can position the
 * soundwave properly on top of the active one.
 */

Doodle.prototype.animateSoundwave = function(i) {
  console.log(i);
  // debugger;
  this.soundwaveDrawingXPos = i * this.djembeFrameWidth - this.djembeFrameWidth/2 - this.soundwaveFrameSize / 2;
  this.soundwaveDrawingYPos = this.getDjembeYPos(i) + this.djembeDrawingYPos;
    
  this.ctx.drawImage(this.soundwave, this.soundwaveXPos, this.soundwaveYPos,
      this.soundwaveFrameSize, this.soundwaveFrameSize,
      this.soundwaveDrawingXPos, this.soundwaveDrawingYPos,
      this.soundwaveFrameSize, this.soundwaveFrameSize);
  // Move to next sprite.
  this.soundwaveXPos += this.soundwaveFrameSize;
  this.soundwaveSpriteIndex++;
  
  if(this.soundwaveSpriteIndex == 5) {
    window.clearInterval(this.timer);
    i = 0;
    this.initCanvas(); // Redraw the Djembes (but no soundwave).
    this.soundwaveSpriteIndex = 0;
  }
};


/**
 * Returns the Djembe 'real' Y position in the screen.
 * @return {number} y The Y pos.
 */
Doodle.prototype.getDjembeYPos = function(i) {
  var y = 0;
  switch(i) {
    case 1:
      y = 0;
      break;
    case 2:
      y = 50;
      break;
    case 3:
      y = 50;
      break;
    case 4:
      y = 20;
      break;
    case 5:
      y = -20;
      break;
    case 6:
      y = 60;
      break;                              
  }
  return y;
};

/**
 * Clear the canvas to set up a new frame.
 */

Doodle.prototype.clearCanvas = function() {
  this.ctx.clearRect(0, 0, Doodle.CANVAS_WIDTH, Doodle.CANVAS_HEIGHT);
};



/****************************************
 *										                  *
 * The doodle Player / Recorder		    *
 * Demonstrating Localstorage			      *
 *										                  *
 ****************************************/

/**
 * @type {array.<Object>} Contains the song data.
 */
Doodle.prototype.song = new Array();


/**
 * Record button listener.
 * @param {event} e
 * @param {Object} Context.
 */
Doodle.prototype.handleRecordButton = function(e, _this) {
  if(_this.recordButton.value == 'Record !') {
    _this.recordButton.value = 'Stop recording !';
    _this.startRecording();
  }
  else {
    _this.recordButton.value = 'Record !';
    _this.stopRecording();    
  }
};

/**
 * @type {number} Substracted from the final this.song.
 */
Doodle.prototype.recordingStartTime = null;


/**
 * Start recording.
 * @return {array.<Object>}
 */
Doodle.prototype.startRecording = function() {
	this.recordingStartTime = new Date().getTime();	
  // add keylisteners.
  var _this = this;
  document.addEventListener("keypress", function() {_this.recordKey(event, _this);}, false);
  // add Timer.
  // Push {timestamp, keyvalue} into this.song.
};

/**
 * Record current key to this.song.
 * @param {event} e The keyboard event.
 * @param {Object} _this The context
 */
Doodle.prototype.recordKey = function(e, _this) {
  var ascii = e.keyCode;
  //var song = new Array();
  _this.song.push({'code': ascii, 'time': new Date().getTime()});
  //console.log(_this.song);
};


/**
 * Stop recording.
 * @return {array.<Object>}
 */
Doodle.prototype.stopRecording = function() {
  this.save(); // saves the song to localstorage.
  this.song = [];
	//document.removeEventListener();
};


/**
 * Playback.
 * @param {string} songId The song ID to play.
 */
Doodle.prototype.playback = function(songId) {
  var data = this.getSongData(songId);
	this.playSongData(data);
};


/**
 * Saves the song into localstorage.
 * @param {array.<Object>} song The just-stopped playing song.
 */
Doodle.prototype.save = function() {
	for(var i = 0; i < this.song.length; i++ ) {
		this.song[i].time = this.song[i].time - this.recordingStartTime;
	}
  // Save this.song to localstorage (using this.appkey).
  alert('Saved !');
	console.log(this.song);
	this.playSongData(this.song);
	
  this.loadSonglist();  
};


/**
 * Updates the songlist panel.
 */
Doodle.prototype.loadSonglist = function() {
  var songlist = document.getElementById('saved-songs');
  //foreach element in localstorage by Doodle.APP_KEY fetch + insert into songlist.
};


/**
 * Returns the song data Object (or array?).
 * @param {string} songId Return this song Id's data. Stored in localstorage.
 * @return {array.<Object>} songData
 */
Doodle.prototype.getSongData = function(songId) {
  //foreach element in localstorage by this.appkey fetch.
  var data = [];
  
  return data;
};


/**
 * Plays the song given the song data.
 * @param {array.<Object>} songData The song data array.
 */
Doodle.prototype.playSongData = function(songData) {
  // Sets a setTimeout function and plays keys according to playDarbouka(n).
	var _this = this;
	var timeout = 0;

	var i = 0;
	while(i < songData.length - 1) { //songData.length != 0
		var currentkeyData = songData.shift();
		var keyToPlay = currentkeyData.code;
		timeout += currentkeyData.time;
		_this.playDarboukaByKeyCode(keyToPlay);
		setTimeout(function() {i++;}, timeout);
	}
	
	setTimeout(function() {i++; if(i <  songData.length) _this.playNextKey();})
	
	/* DO WHILE would be a better solution to increment gradually the 'i' in setTimeout */
};