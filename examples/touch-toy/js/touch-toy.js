/*
* Copyright (c) 2012 @alteredq & Eric Kryski
* MIT Licensed
*
* Original JavaScript written by http://alteredqualia.com/touchtoy/
* so he/she deserves the credit for this awesome app! Modified by Eric Kryski
*/

// debug

var DBG_START = Date.now();

// progress

var LOAD_COUNTER = 0;
var LOAD_TOTAL = 0;

// options

var USE_RAF = false;
var USE_CACHE = true;

// simulation

var MAX_PARTICLES = 500;
var FRAME_DURATION = 25;  // milliseconds
var EPSILON = 0.01;     // float comparison precision

// gestures

var DOUBLE_TOUCH_DURATION = 300;
var TOUCH_CLICK_TOLERANCE = 10;
var TOUCH_CLICK_TOLERANCE_MENU = 50;

// constants

var T_STATE_TOUCH = 0, T_STATE_FREE = 1;

var T_PARTICLE_CIRCLE = 0, T_PARTICLE_DISC = 1, T_PARTICLE_LINE = 2, T_PARTICLE_SPRITE = 3, T_PARTICLE_SPRITE_MULTI = 4, T_PARTICLE_SPRITE_TIME = 5;
var T_DISTRIBUTION_FULL = 0, T_DISTRIBUTION_CROSS = 1, T_DISTRIBUTION_LINE = 2, T_DISTRIBUTION_STAR = 3, T_DISTRIBUTION_TRAIL = 4, T_DISTRIBUTION_ORBIT = 5;
var T_PATTERN_SOLID = 0, T_PATTERN_RANDOM = 1, T_PATTERN_HALF = 2, T_PATTERN_STRIPES = 3, T_PATTERN_GRID = 4, T_PATTERN_ANTIGRID = 5, T_PATTERN_CHECKER = 6, T_PATTERN_MASK = 7;
var T_ATTENUATION_NONE = 0, T_ATTENUATION_GROW = 1, T_ATTENUATION_SHRINK = 2, T_ATTENUATION_SIN = 3;

// Galaxy Bubbles Stars Hypnos Storm Steam Turbulent Flame Orbital Spring Luminous Growth Roots Moss Juniper Fir Crystal Metropolis

// all themes

var THEMES = [

// -------------------------------------------

{ "label": "Galaxy",

  "globalAlphaTouch"  : 1,
  "globalAlphaFree" : 1,

  "globalCompositeOperationTouch" : "lighter",
  "globalCompositeOperationFree"  : "source-over",
  "globalCompositeOperationClear" : "source-over",

  "images"   : [ "img/spikey.png" ],
  "versions" : [ 0 ],

  "palette": [
         "rgb( 255, 125, 0 )",
         "rgb( 0, 125, 255 )",
         "rgba( 255, 25, 0, 0.75 )",
         "rgba( 0, 50, 255, 0.75 )",
         "rgba( 200, 105, 255, 0.75 )",

         "rgba( 255, 0, 255, 0.75 )",
         "rgba( 255, 125, 0, 0.75 )",
         "rgba( 0, 125, 255, 0.75 )",
         "rgba( 255, 0, 125, 0.75 )",
         "rgba( 255, 125, 125, 0.75 )"
         ],

  "clearColor"    : "rgba( 0, 0, 0, 1 )",
  "backgroundColor" : "rgb( 0, 0, 0 )",

  "clearTouch" : true,
  "clearFree"  : true,

  "lineWidth": 0,

  "fingerSize"  : 5,
  "particleSize"  : 3,

  "speedX"    : 42,
  "speedY"    : 42,

  "randomX"   : 60,
  "randomY"   : 60,

  "gravityEnabled" : false,
  "gravity"    : 0,

  "spawnThreshold" : 0,
  "spawnRate"    : 2,

  "lifeMin"    : 1,
  "lifeRange"    : 2,

  "lifeMultiplierFree" : 5,

  "timedTurns"  : false,

  "spriteRotation"    : true,
  "spriteRotationSpeed" : 5,

  "spriteOffsetX" : 0,
  "spriteOffsetY" : 0,

  "particleType"        : T_PARTICLE_SPRITE,

  "radialDistributionType"  : T_DISTRIBUTION_FULL,
  "colorifyType"        : T_PATTERN_SOLID,

  "attenuationType"   : T_ATTENUATION_SHRINK,
  "attenuationStart"  : 0.05,
  "attenuationSpeed"  : 1.27
},

// -------------------------------------------

{ "label": "Bubbles",

  "globalAlphaTouch"  : 1,
  "globalAlphaFree" : 1,

  "globalCompositeOperationTouch" : "source-over",
  "globalCompositeOperationFree"  : "source-over",
  "globalCompositeOperationClear" : "source-over",

  "images"   : [ "img/bubble-frames.png" ],
  "versions" : [ 1 ],

  "palette": [
         "rgba( 255, 255, 255, 1 )",
         "rgba( 0, 125, 255, 1 )",
         "rgba( 255, 0, 100, 1 )",
         "rgba( 205, 0, 255, 1 )",
         "rgba( 0, 50, 255, 1 )",

         "rgba( 255, 125, 0, 1 )",
         "rgba( 255, 50, 0, 1 )",
         "rgba( 0, 205, 255, 1 )",
         "rgba( 255, 125, 0, 1 )",
         "rgba( 0, 125, 255, 1 )"
         ],

  "clearColor"    : "rgb( 0, 0, 0 )",
  "backgroundColor" : "rgb( 0, 0, 0 )",

  "clearTouch" : true,
  "clearFree"  : true,

  "lineWidth": 2,

  "fingerSize"  : 10,
  "particleSize"  : 2,

  "speedX"    : 50,
  "speedY"    : 50,

  "randomX"   : 10,
  "randomY"   : 10,

  "gravityEnabled" : true,
  "gravity"    : -100,

  "spawnThreshold" : 0,
  "spawnRate"    : 2,

  "lifeMin"    : 1,
  "lifeRange"    : 2,

  "lifeMultiplierFree" : 3,

  "timedTurns"  : true,

  "spriteRotation"    : false,
  "spriteRotationSpeed" : 2,

  "spriteOffsetX" : 0,
  "spriteOffsetY" : 0,

  "particleType"        : T_PARTICLE_SPRITE_MULTI,
  "radialDistributionType"  : T_DISTRIBUTION_FULL,

  "colorifyType"  : T_PATTERN_SOLID,

  "attenuationType"   : T_ATTENUATION_SHRINK,
  "attenuationStart"  : 0.5,
  "attenuationSpeed"  : 1.75
},

// -------------------------------------------

{ "label": "Stars",

  "globalAlphaTouch"  : 1,
  "globalAlphaFree" : 1,

  "globalCompositeOperationTouch" : "source-over",
  "globalCompositeOperationFree"  : "source-over",
  "globalCompositeOperationClear" : "source-over",

  "images"   : [ "img/star-frames.png" ],
  "versions" : [ 0 ],

  "palette": [
         "rgba( 255, 255, 255, 1 )",
         "rgba( 255, 0, 0, 1 )",
         "rgba( 255, 150, 0, 1 )",
         "rgba( 255, 225, 0, 1 )",
         "rgba( 0, 125, 255, 1 )",

         "rgba( 255, 125, 0, 1 )",
         "rgba( 255, 50, 0, 1 )",
         "rgba( 0, 205, 255, 1 )",
         "rgba( 255, 125, 0, 1 )",
         "rgba( 0, 125, 255, 1 )"
         ],

  "clearColor"    : "rgb( 0, 0, 0 )",
  "backgroundColor" : "rgb( 0, 0, 0 )",

  "clearTouch" : true,
  "clearFree"  : true,

  "lineWidth": 2,

  "fingerSize"  : 15,
  "particleSize"  : 2,

  "speedX"    : 70,
  "speedY"    : 70,

  "randomX"   : 10,
  "randomY"   : 10,

  "gravityEnabled" : true,
  "gravity"    : 100,

  "spawnThreshold" : 0,
  "spawnRate"    : 3,

  "lifeMin"    : 1,
  "lifeRange"    : 0,

  "lifeMultiplierFree" : 3,

  "timedTurns"  : false,

  "spriteRotation"    : false,
  "spriteRotationSpeed" : 2,

  "spriteOffsetX" : 0,
  "spriteOffsetY" : 0,

  "particleType"        : T_PARTICLE_SPRITE_MULTI,
  "radialDistributionType"  : T_DISTRIBUTION_FULL,

  "colorifyType"  : T_PATTERN_SOLID,

  "attenuationType"   : T_ATTENUATION_SHRINK,
  "attenuationStart"  : 1,
  "attenuationSpeed"  : 1
},


// -------------------------------------------

{ "label": "Hypnos",

  "globalAlphaTouch"  : 1,
  "globalAlphaFree" : 1,

  "globalCompositeOperationTouch" : "source-over",
  "globalCompositeOperationFree"  : "source-over",
  "globalCompositeOperationClear" : "source-over",

  "images"   : [ "img/spiral.png" ],
  "versions" : [ 0 ],

  "palette": [
         "rgb( 255, 0, 0 )",
         "rgb( 255, 75, 0 )",
         "rgb( 255, 175, 0 )",
         "rgb( 255, 225, 0 )",
         "rgb( 255, 255, 0 )",

         "rgb( 0, 125, 255 )",
         "rgb( 0, 0, 255 )",
         "rgb( 0, 225, 255 )",
         "rgb( 255, 0, 125 )",
         "rgb( 255, 125, 125 )"
         ],

  "clearColor"    : "rgba( 0, 0, 0, 0.5 )",
  "backgroundColor" : "rgb( 0, 0, 0 )",

  "clearTouch" : true,
  "clearFree"  : true,

  "lineWidth": 0,

  "fingerSize"  : 40,
  "particleSize"  : 3,

  "speedX"    : 80,
  "speedY"    : 80,

  "randomX"   : 10,
  "randomY"   : 10,

  "gravityEnabled" : false,
  "gravity"    : 0,

  "spawnThreshold" : 0.05,
  "spawnRate"    : 1,

  "lifeMin"    : 1,
  "lifeRange"    : 4,

  "lifeMultiplierFree" : 10,

  "timedTurns"  : false,

  "spriteRotation"    : true,
  "spriteRotationSpeed" : 2,

  "spriteOffsetX" : 10,
  "spriteOffsetY" : 10,

  "particleType"        : T_PARTICLE_SPRITE,
  "radialDistributionType"  : T_DISTRIBUTION_FULL,

  "colorifyType"  : T_PATTERN_MASK,
  "colorifyMask"  : "img/spiralMask.png",

  "attenuationType"   : T_ATTENUATION_SHRINK,
  "attenuationStart"  : 0.75,
  "attenuationSpeed"  : 0.75

},

// -------------------------------------------

{ "label": "Storm",

  "globalAlphaTouch"  : 0.2,
  "globalAlphaFree" : 0.2,

  "globalCompositeOperationTouch" : "source-over",
  "globalCompositeOperationFree"  : "source-over",
  "globalCompositeOperationClear" : "source-over",

  "images"   : [ "img/snowflake7_alpha.png" ],
  "versions" : [ 0 ],

  "palette": [
         "rgb( 255, 255, 255 )",
         "rgb( 255, 25, 0 )",
         "rgb( 0, 125, 255 )",
         "rgb( 0, 50, 255 )",
         "rgb( 200, 105, 255 )",

         "rgb( 255, 0, 255 )",
         "rgb( 255, 125, 0 )",
         "rgb( 0, 125, 255 )",
         "rgb( 255, 0, 125 )",
         "rgb( 255, 125, 125 )"
         ],

  "clearColor"    : "rgba( 0, 0, 0, 0.5 )",
  "backgroundColor" : "rgb( 0, 0, 0 )",

  "clearTouch" : true,
  "clearFree"  : true,

  "lineWidth": 0,

  "fingerSize"  : 30,
  "particleSize"  : 3,

  "speedX"    : 40,
  "speedY"    : 40,

  "randomX"   : 40,
  "randomY"   : 40,

  "gravityEnabled" : false,
  "gravity"    : 0,

  "spawnThreshold" : 0.05,
  "spawnRate"    : 1,

  "lifeMin"    : 1,
  "lifeRange"    : 4,

  "lifeMultiplierFree" : 7,

  "timedTurns"  : false,

  "spriteRotation"    : true,
  "spriteRotationSpeed" : 1.5,

  "spriteOffsetX" : 20,
  "spriteOffsetY" : 20,

  "particleType"        : T_PARTICLE_SPRITE,
  "radialDistributionType"  : T_DISTRIBUTION_FULL,

  "colorifyType"        : T_PATTERN_SOLID,

  "attenuationType"   : T_ATTENUATION_SHRINK,
  "attenuationStart"  : 0.75,
  "attenuationSpeed"  : 0.75
},

// -------------------------------------------

{ "label": "Steam",

  "globalAlphaTouch"  : 0.1,
  "globalAlphaFree" : 0.1,

  "globalCompositeOperationTouch" : "lighter",
  "globalCompositeOperationFree"  : "source-over",
  "globalCompositeOperationClear" : "source-over",

  "images"   : [ "img/snowflake7_alpha.png" ],
  "versions" : [ 0 ],

  "palette": [
         "rgba( 255, 255, 255, 0.15 )",
         "rgba( 80, 155, 255, 0.15 )",
         "rgba( 255, 175, 125, 0.15 )",
         "rgba( 255, 100, 100, 0.15 )",
         "rgba( 180, 180, 255, 0.15 )",

         "rgba( 255, 0, 255, 0.15 )",
         "rgba( 255, 125, 0, 0.15 )",
         "rgba( 0, 125, 255, 0.15 )",
         "rgba( 255, 0, 125, 0.15 )",
         "rgba( 255, 125, 125, 0.15 )"
         ],

  "clearColor"    : "rgba( 0, 0, 0, 1 )",
  "backgroundColor" : "rgb( 0, 0, 0 )",

  "clearTouch" : true,
  "clearFree"  : true,

  "lineWidth": 0,

  "fingerSize"  : 3,
  "particleSize"  : 3,

  "speedX"    : 80,
  "speedY"    : 80,

  "randomX"   : 140,
  "randomY"   : 140,

  "gravityEnabled" : false,
  "gravity"    : 0,

  "spawnThreshold" : 0,
  "spawnRate"    : 1,

  "lifeMin"    : 1,
  "lifeRange"    : 3,

  "lifeMultiplierFree" : 7,

  "timedTurns"  : true,

  "spriteRotation"    : true,
  "spriteRotationSpeed" : 0.5,

  "spriteOffsetX" : 0,
  "spriteOffsetY" : 0,

  "particleType"        : T_PARTICLE_SPRITE,
  "radialDistributionType"  : T_DISTRIBUTION_FULL,

  "colorifyType"        : T_PATTERN_SOLID,

  "attenuationType"   : T_ATTENUATION_GROW,
  "attenuationStart"  : 1.5,
  "attenuationSpeed"  : 1
},

// -------------------------------------------

{ "label": "Turbulent",

  "globalAlphaTouch"  : 0.5,
  "globalAlphaFree" : 0.5,

  "globalCompositeOperationTouch" : "source-over",
  "globalCompositeOperationFree"  : "source-over",
  "globalCompositeOperationClear" : "source-over",

  "images"   : [ "img/smoke.png" ],
  "versions" : [ 0 ],

  "palette": [
         "rgb( 255, 50, 0 )",
         "rgb( 0, 55, 255 )",
         "rgb( 255, 150, 0 )",
         "rgb( 0, 50, 255 )",
         "rgb( 0, 255, 255 )",

         "rgb( 255, 0, 255 )",
         "rgb( 255, 125, 0 )",
         "rgb( 0, 125, 255 )",
         "rgb( 255, 0, 125 )",
         "rgb( 255, 125, 125 )"
         ],

  "clearColor"    : "rgba( 0, 0, 0, 0.15 )",
  "backgroundColor" : "rgb( 0, 0, 0 )",

  "clearTouch" : true,
  "clearFree"  : true,

  "lineWidth": 2,

  "fingerSize"  : 10,
  "particleSize"  : 2,

  "speedX"    : 60,
  "speedY"    : 60,

  "randomX"   : 85,
  "randomY"   : 85,

  "gravityEnabled" : false,
  "gravity"    : 0,

  "spawnThreshold" : 0,
  "spawnRate"    : 2,

  "lifeMin"    : 1,
  "lifeRange"    : 2,

  "lifeMultiplierFree" : 2,

  "timedTurns"  : false,

  "spriteRotation"    : true,
  "spriteRotationSpeed" : 2,

  "spriteOffsetX" : 0,
  "spriteOffsetY" : 0,

  "particleType"        : T_PARTICLE_SPRITE,
  "radialDistributionType"  : T_DISTRIBUTION_LINE,

  "colorifyType" : T_PATTERN_SOLID,

  "attenuationType"   : T_ATTENUATION_GROW,
  "attenuationStart"  : 0.4,
  "attenuationSpeed"  : 1.3
},

// -------------------------------------------

{ "label": "Flame",

  "globalAlphaTouch"  : 1,
  "globalAlphaFree" : 1,

  "globalCompositeOperationTouch" : "lighter",
  "globalCompositeOperationFree"  : "source-over",
  "globalCompositeOperationClear" : "source-over",

  "images"   : [ "img/fluffy.png" ],
  "versions" : [ 0 ],

  "palette": [
         "rgba( 255, 55, 0, 0.9 )",
         "rgba( 55, 60, 255, 0.45 )",
         "rgba( 255, 125, 0, 0.45 )",
         "rgba( 255, 25, 0, 0.75 )",
         "rgba( 0, 50, 255, 0.75 )",

         "rgba( 200, 105, 255, 0.75 )",
         "rgba( 255, 0, 255, 0.75 )",
         "rgba( 255, 125, 0, 0.75 )",
         "rgba( 0, 125, 255, 0.75 )",
         "rgba( 255, 0, 125, 0.75 )"
         ],

  "clearColor"    : "rgba( 0, 0, 0, 1 )",
  "backgroundColor" : "rgb( 0, 0, 0 )",

  "clearTouch" : true,
  "clearFree"  : true,

  "lineWidth": 0,

  "fingerSize"  : 5,
  "particleSize"  : 3,

  "speedX"    : 90,
  "speedY"    : 90,

  "randomX"   : 20,
  "randomY"   : 20,

  "gravityEnabled" : false,
  "gravity"    : -10,

  "spawnThreshold" : 0,
  "spawnRate"    : 1,

  "lifeMin"    : 1,
  "lifeRange"    : 2,

  "lifeMultiplierFree" : 3,

  "timedTurns"  : false,

  "spriteRotation"    : true,
  "spriteRotationSpeed" : 4,

  "spriteOffsetX" : 0,
  "spriteOffsetY" : 0,

  "particleType"        : T_PARTICLE_SPRITE,

  "radialDistributionType"  : T_DISTRIBUTION_LINE,
  "colorifyType"        : T_PATTERN_SOLID,

  "attenuationType"   : T_ATTENUATION_SIN,
  "attenuationStart"  : 0.15,
  "attenuationSpeed"  : 1
},

// -------------------------------------------

{ "label": "Orbital",

  "globalAlphaTouch"  : 1,
  "globalAlphaFree" : 1,

  "globalCompositeOperationTouch" : "lighter",
  "globalCompositeOperationFree"  : "source-over",
  "globalCompositeOperationClear" : "source-over",

  "images"   : [ "img/fluffy.png" ],
  "versions" : [ 0 ],

  "palette": [
         "rgb( 255, 100, 0 )",
         "rgb( 0, 125, 255 )",
         "rgb( 255, 50, 0 )",
         "rgb( 0, 50, 255 )",
         "rgb( 0, 255, 255 )",

         "rgb( 255, 0, 255 )",
         "rgb( 255, 125, 0 )",
         "rgb( 0, 125, 255 )",
         "rgb( 255, 0, 125 )",
         "rgb( 255, 125, 125 )"
         ],

  "clearColor"    : "rgba( 0, 0, 0, 1 )",
  "backgroundColor" : "rgb( 0, 0, 0 )",

  "clearTouch" : true,
  "clearFree"  : true,

  "lineWidth": 1,

  "fingerSize"  : 70,
  "particleSize"  : 4,

  "speedX"    : 70,
  "speedY"    : 70,

  "randomX"   : 50,
  "randomY"   : 50,

  "gravityEnabled" : false,
  "gravity"    : 0,

  "spawnThreshold" : 0,
  "spawnRate"    : 1,

  "lifeMin"    : 1.5,
  "lifeRange"    : 1,

  "lifeMultiplierFree" : 10,

  "timedTurns"  : false,

  "spriteRotation"    : false,
  "spriteRotationSpeed" : 0,

  "spriteOffsetX" : 0,
  "spriteOffsetY" : 0,

  "orbitSpeed"  : 3,

  "particleType"        : T_PARTICLE_SPRITE,
  "radialDistributionType"  : T_DISTRIBUTION_ORBIT,

  "colorifyType"        : T_PATTERN_SOLID,

  "attenuationType"   : T_ATTENUATION_SHRINK,
  "attenuationStart"  : 0,
  "attenuationSpeed"  : 1
},

// -------------------------------------------

{ "label": "Spring",

  "globalAlphaTouch"  : 1,
  "globalAlphaFree" : 1,

  "globalCompositeOperationTouch" : "lighter",
  "globalCompositeOperationFree"  : "lighter",
  "globalCompositeOperationClear" : "source-over",

  "images"   : [ "img/circleOutline.png" ],
  "versions" : [ 2 ],

  "palette": [
         "rgb( 0, 150, 255 )",
         "rgb( 255, 50, 0 )",
         "rgb( 255, 5, 0 )",
         "rgb( 0, 50, 255 )",
         "rgb( 200, 105, 255 )",

         "rgb( 255, 0, 255 )",
         "rgb( 255, 125, 0 )",
         "rgb( 0, 125, 255 )",
         "rgb( 255, 0, 125 )",
         "rgb( 255, 125, 125 )"
         ],

  "clearColor"    : "rgb( 0, 0, 0 )",
  "backgroundColor" : "rgb( 0, 0, 0 )",

  "clearTouch" : true,
  "clearFree"  : true,

  "lineWidth": 0,

  "fingerSize"  : 0.1,
  "particleSize"  : 1,

  "speedX"    : 0,
  "speedY"    : 0,

  "randomX"   : 0,
  "randomY"   : 0,

  "gravityEnabled" : false,
  "gravity"    : 0,

  "spawnThreshold" : 0,
  "spawnRate"    : 1,

  "lifeMin"    : 3,
  "lifeRange"    : 0,

  "lifeMultiplierFree" : 1,

  "timedTurns"  : false,

  "spriteRotation"    : true,
  "spriteRotationSpeed" : 1.57,

  "spriteOffsetX" : 0,
  "spriteOffsetY" : 0,

  "particleType"        : T_PARTICLE_SPRITE,

  "radialDistributionType"  : T_DISTRIBUTION_CROSS,
  "colorifyType"        : T_PATTERN_SOLID,

  "attenuationType"   : T_ATTENUATION_SIN,
  "attenuationStart"  : 0.2,
  "attenuationSpeed"  : 0.5
},

// -------------------------------------------

{ "label": "Luminous",

  "globalAlphaTouch"  : 1,
  "globalAlphaFree" : 1,

  "globalCompositeOperationTouch" : "lighter",
  "globalCompositeOperationFree"  : "lighter",
  "globalCompositeOperationClear" : "source-over",

  "images"   : [ "img/dots.png" ],
  "versions" : [ 0 ],

  "palette": [
         "rgb( 255, 155, 0 )",
         "rgb( 0, 125, 255 )",
         "rgb( 255, 25, 0 )",
         "rgb( 0, 50, 255 )",
         "rgb( 200, 105, 255 )",

         "rgba( 255, 0, 255, 0.75 )",
         "rgba( 255, 125, 0, 0.75 )",
         "rgba( 0, 125, 255, 0.75 )",
         "rgba( 255, 0, 125, 0.75 )",
         "rgba( 255, 125, 125, 0.75 )"
         ],

  "clearColor"    : "rgb( 0, 0, 0 )",
  "backgroundColor" : "rgb( 0, 0, 0 )",

  "clearTouch" : true,
  "clearFree"  : true,

  "lineWidth": 0,

  "fingerSize"  : 0.1,
  "particleSize"  : 1,

  "speedX"    : 0,
  "speedY"    : 0,

  "randomX"   : 0,
  "randomY"   : 0,

  "gravityEnabled" : false,
  "gravity"    : 0,

  "spawnThreshold" : 0,
  "spawnRate"    : 1,

  "lifeMin"    : 2,
  "lifeRange"    : 0,

  "lifeMultiplierFree" : 1,

  "timedTurns"  : false,

  "spriteRotation"    : true,
  "spriteRotationSpeed" : 1.57,

  "spriteOffsetX" : 0,
  "spriteOffsetY" : 0,

  "particleType"        : T_PARTICLE_SPRITE,

  "radialDistributionType"  : T_DISTRIBUTION_CROSS,
  "colorifyType"        : T_PATTERN_SOLID,

  "attenuationType"   : T_ATTENUATION_SIN,
  "attenuationStart"  : 0.1,
  "attenuationSpeed"  : 0.75
},

// -------------------------------------------

{ "label": "Growth",

  "globalAlphaTouch"  : 0.3,
  "globalAlphaFree" : 1,

  "globalCompositeOperationTouch" : "lighter",
  "globalCompositeOperationFree"  : "source-over",
  "globalCompositeOperationClear" : "source-over",

  "images"   : [ "img/circle.png" ],
  "versions" : [ 0 ],

  "palette": [
         "rgba( 255, 125, 0, 0.75 )",
         "rgba( 0, 125, 255, 0.75 )",
         "rgba( 255, 25, 0, 0.75 )",
         "rgba( 0, 50, 255, 0.75 )",
         "rgba( 200, 105, 255, 0.75 )",

         "rgba( 255, 0, 255, 0.75 )",
         "rgba( 255, 125, 0, 0.75 )",
         "rgba( 0, 125, 255, 0.75 )",
         "rgba( 255, 0, 125, 0.75 )",
         "rgba( 255, 125, 125, 0.75 )"
         ],

  "clearColor"    : "rgb( 0, 0, 0 )",
  "backgroundColor" : "rgb( 0, 0, 0 )",

  "clearTouch" : false,
  "clearFree"  : true,

  "lineWidth": 0,

  "fingerSize"  : 10,
  "particleSize"  : 3,

  "speedX"    : 42,
  "speedY"    : 42,

  "randomX"   : 160,
  "randomY"   : 160,

  "gravityEnabled" : false,
  "gravity"    : 0,

  "spawnThreshold" : 0,
  "spawnRate"    : 1,

  "lifeMin"    : 1,
  "lifeRange"    : 1.75,

  "lifeMultiplierFree" : 7,

  "timedTurns"  : false,

  "spriteRotation"    : true,
  "spriteRotationSpeed" : 1,

  "spriteOffsetX" : 0,
  "spriteOffsetY" : 0,

  "particleType"        : T_PARTICLE_SPRITE,

  "radialDistributionType"  : T_DISTRIBUTION_FULL,
  "colorifyType"        : T_PATTERN_SOLID,

  "attenuationType"   : T_ATTENUATION_GROW,
  "attenuationStart"  : 0.05,
  "attenuationSpeed"  : 0.15
},

// -------------------------------------------

{ "label": "Roots",

  "globalAlphaTouch"  : 0.25,
  "globalAlphaFree" : 1,

  "globalCompositeOperationTouch" : "lighter",
  "globalCompositeOperationFree"  : "source-over",
  "globalCompositeOperationClear" : "source-over",

  "images"   : [ "img/circle.png" ],
  "versions" : [ 0 ],

  "palette": [
         "rgba( 255, 50, 0, 0.5 )",
         "rgba( 0, 125, 255, 0.75 )",
         "rgba( 255, 155, 0, 0.35 )",
         "rgba( 50, 255, 0, 0.25 )",
         "rgba( 0, 50, 255, 0.75 )",

         "rgba( 255, 100, 255, 0.75 )",
         "rgba( 255, 125, 100, 0.75 )",
         "rgba( 100, 125, 255, 0.75 )",
         "rgba( 255, 100, 125, 0.75 )",
         "rgba( 255, 125, 125, 0.75 )"
         ],

  "clearColor"    : "rgb( 0, 0, 0 )",
  "backgroundColor" : "rgb( 0, 0, 0 )",

  "clearTouch" : false,
  "clearFree"  : true,

  "lineWidth": 0,

  "fingerSize"  : 3,
  "particleSize"  : 3,

  "speedX"    : 50,
  "speedY"    : 50,

  "randomX"   : 100,
  "randomY"   : 100,

  "gravityEnabled" : false,
  "gravity"    : 0,

  "spawnThreshold" : 0,
  "spawnRate"    : 3,

  "lifeMin"    : 1.5,
  "lifeRange"    : 2,

  "lifeMultiplierFree" : 7,

  "timedTurns"  : true,

  "spriteRotation"    : false,
  "spriteRotationSpeed" : 0,

  "spriteOffsetX" : 0,
  "spriteOffsetY" : 0,

  "particleType"        : T_PARTICLE_SPRITE,
  "radialDistributionType"  : T_DISTRIBUTION_LINE,

  "colorifyType"        : T_PATTERN_SOLID,

  "attenuationType"   : T_ATTENUATION_SHRINK,
  "attenuationStart"  : 0,
  "attenuationSpeed"  : 0.2
},

// -------------------------------------------

{ "label": "Moss",

  "globalAlphaTouch"  : 0.175,
  "globalAlphaFree" : 1,

  "globalCompositeOperationTouch" : "lighter",
  "globalCompositeOperationFree"  : "source-over",
  "globalCompositeOperationClear" : "source-over",

  "images"   : [ "img/circle.png" ],
  "versions" : [ 0 ],

  "palette": [
         "rgba( 0, 200, 0, 0.85 )",
         "rgba( 0, 125, 255, 0.9 )",
         "rgba( 255, 50, 0, 0.95 )",
         "rgba( 255, 180, 0, 0.95 )",
         "rgba( 0, 255, 255, 0.85 )",

         "rgba( 255, 0, 255, 0.85 )",
         "rgba( 255, 125, 0, 0.85 )",
         "rgba( 0, 125, 255, 0.85 )",
         "rgba( 255, 0, 125, 0.85 )",
         "rgba( 255, 125, 125, 0.85 )"
         ],

  "clearColor"    : "rgb( 0, 0, 0 )",
  "backgroundColor" : "rgb( 0, 0, 0 )",

  "clearTouch" : false,
  "clearFree"  : true,

  "lineWidth": 2,

  "fingerSize"  : 10,
  "particleSize"  : 2,

  "speedX"    : 80,
  "speedY"    : 80,

  "randomX"   : 400,
  "randomY"   : 400,

  "gravityEnabled" : false,
  "gravity"    : 0,

  "spawnThreshold" : 0,
  "spawnRate"    : 2,

  "lifeMin"    : 1,
  "lifeRange"    : 3,

  "lifeMultiplierFree" : 7,

  "timedTurns"  : false,

  "spriteRotation"    : false,
  "spriteRotationSpeed" : 0,

  "spriteOffsetX" : 0,
  "spriteOffsetY" : 0,

  "particleType"        : T_PARTICLE_SPRITE,
  "radialDistributionType"  : T_DISTRIBUTION_FULL,

  "colorifyType"        : T_PATTERN_SOLID,

  "attenuationType"   : T_ATTENUATION_SHRINK,
  "attenuationStart"  : 0,
  "attenuationSpeed"  : 0.2
},

// -------------------------------------------

{ "label": "Juniper",

  "globalAlphaTouch"  : 1,
  "globalAlphaFree" : 1,

  "globalCompositeOperationTouch" : "lighter",
  "globalCompositeOperationFree"  : "source-over",
  "globalCompositeOperationClear" : "source-over",

  "images"   : [ "img/circle.png" ],
  "versions" : [ 0 ],

  "palette": [
         "rgba( 255, 100, 255, 0.2 )",
         "rgba( 0, 125, 255, 0.2 )",
         "rgba( 255, 100, 0, 0.2 )",
         "rgba( 100, 255, 0, 0.2 )",
         "rgba( 255, 50, 0, 0.2 )",

         "rgba( 0, 50, 255, 0.2 )",
         "rgba( 0, 255, 255, 0.2 )",
         "rgba( 255, 0, 255, 0.2 )",
         "rgba( 255, 125, 0, 0.2 )",
         "rgba( 0, 125, 255, 0.2 )"
         ],

  "clearColor"    : "rgba( 0, 0, 0, 1 )",
  "backgroundColor" : "rgb( 0, 0, 0 )",

  "clearTouch" : false,
  "clearFree"  : true,

  "lineWidth": 1,

  "fingerSize"  : 2,
  "particleSize"  : 4,

  "speedX"    : 80,
  "speedY"    : 80,

  "randomX"   : 50,
  "randomY"   : 50,

  "gravityEnabled" : false,
  "gravity"    : 0,

  "spawnThreshold" : 0,
  "spawnRate"    : 1,

  "lifeMin"    : 2,
  "lifeRange"    : 0,

  "lifeMultiplierFree" : 10,

  "timedTurns"  : false,

  "spriteRotation"    : false,
  "spriteRotationSpeed" : 0,

  "spriteOffsetX" : 0,
  "spriteOffsetY" : 0,

  "particleType"        : T_PARTICLE_SPRITE,
  "radialDistributionType"  : T_DISTRIBUTION_TRAIL,

  "colorifyType"        : T_PATTERN_SOLID,

  "attenuationType"   : T_ATTENUATION_SHRINK,
  "attenuationStart"  : 0,
  "attenuationSpeed"  : 0.3
},

// -------------------------------------------

{ "label": "Fir",

  "globalAlphaTouch"  : 0.75,
  "globalAlphaFree" : 1.0,

  "globalCompositeOperationTouch" : "lighter",
  "globalCompositeOperationFree"  : "source-over",
  "globalCompositeOperationClear" : "source-over",

  "images"   : [],
  "versions" : [],

  "palette": [
         "rgba( 255, 85, 0, 0.75 )",
         "rgba( 55, 255, 0, 0.35 )",
         "rgba( 255, 150, 0, 0.75 )",
         "rgba( 0, 200, 255, 0.5 )",
         "rgba( 0, 50, 255, 0.5 )",

         "rgba( 255, 0, 255, 0.5 )",
         "rgba( 255, 125, 0, 0.5 )",
         "rgba( 0, 125, 255, 0.5 )",
         "rgba( 255, 0, 125, 0.5 )",
         "rgba( 255, 125, 125, 0.5 )"
        ],

  "clearColor"    : "rgb( 0, 0, 0 )",
  "backgroundColor" : "rgb( 0, 0, 0 )",

  "clearTouch" : false,
  "clearFree"  : true,

  "lineWidth": 2,

  "fingerSize"  : 2,
  "particleSize"  : 4,

  "speedX"    : 150,
  "speedY"    : 150,

  "randomX"   : 50,
  "randomY"   : 50,

  "gravityEnabled" : false,
  "gravity"    : 0,

  "spawnThreshold" : 0,
  "spawnRate"    : 6,

  "lifeMin"    : 0.15,
  "lifeRange"    : 0.1,

  "lifeMultiplierFree" : 5,

  "timedTurns"  : false,

  "spriteRotation"    : false,
  "spriteRotationSpeed" : 0,

  "spriteOffsetX" : 0,
  "spriteOffsetY" : 0,

  "particleType"        : T_PARTICLE_LINE,
  "radialDistributionType"  : T_DISTRIBUTION_TRAIL,

  "colorifyType"        : T_PATTERN_SOLID,

  "attenuationType"       : T_ATTENUATION_NONE
},

// -------------------------------------------

{ "label": "Crystal",

  "globalAlphaTouch"  : 1,
  "globalAlphaFree" : 1,

  "globalCompositeOperationTouch" : "lighter",
  "globalCompositeOperationFree"  : "source-over",
  "globalCompositeOperationClear" : "source-over",

  "images"   : [ "img/circle.png" ],
  "versions" : [ 0 ],

  "palette": [
         "rgba( 0, 125, 255, 0.2 )",
         "rgba( 255, 100, 0, 0.2 )",
         "rgba( 255, 50, 0, 0.2 )",
         "rgba( 0, 50, 255, 0.2 )",
         "rgba( 0, 255, 255, 0.2 )",

         "rgba( 255, 0, 255, 0.2 )",
         "rgba( 255, 125, 0, 0.2 )",
         "rgba( 0, 125, 255, 0.2 )",
         "rgba( 255, 0, 125, 0.2 )",
         "rgba( 255, 125, 125, 0.2 )"
         ],

  "clearColor"    : "rgba( 0, 0, 0, 1 )",
  "backgroundColor" : "rgb( 0, 0, 0 )",

  "clearTouch" : false,
  "clearFree"  : true,

  "lineWidth": 1,

  "fingerSize"  : 2,
  "particleSize"  : 4,

  "speedX"    : 80,
  "speedY"    : 80,

  "randomX"   : 30,
  "randomY"   : 30,

  "gravityEnabled" : false,
  "gravity"    : 0,

  "spawnThreshold" : 0,
  "spawnRate"    : 2,

  "lifeMin"    : 2.5,
  "lifeRange"    : 0,

  "lifeMultiplierFree" : 10,

  "timedTurns"  : false,

  "spriteRotation"    : false,
  "spriteRotationSpeed" : 0,

  "spriteOffsetX" : 0,
  "spriteOffsetY" : 0,

  "particleType"        : T_PARTICLE_SPRITE,
  "radialDistributionType"  : T_DISTRIBUTION_STAR,

  "colorifyType"        : T_PATTERN_SOLID,

  "attenuationType"   : T_ATTENUATION_SHRINK,
  "attenuationStart"  : 0,
  "attenuationSpeed"  : 0.2
},

{ "label": "Metropolis",

  "globalAlphaTouch"  : 0.85,
  "globalAlphaFree" : 1,

  "globalCompositeOperationTouch" : "lighter",
  "globalCompositeOperationFree"  : "source-over",
  "globalCompositeOperationClear" : "source-over",

  "images"   : [],
  "versions" : [],

  "palette": [
         "rgba( 255, 125, 0, 0.75 )",
         "rgba( 0, 125, 255, 0.75 )",
         "rgba( 255, 50, 0, 0.75 )",
         "rgba( 0, 50, 255, 0.75 )",
         "rgba( 0, 255, 255, 0.75 )",

         "rgba( 255, 0, 255, 0.75 )",
         "rgba( 255, 125, 0, 0.75 )",
         "rgba( 0, 125, 255, 0.75 )",
         "rgba( 255, 0, 125, 0.75 )",
         "rgba( 255, 125, 125, 0.75 )"
         ],

  "clearColor"    : "rgb( 0, 0, 0 )",
  "backgroundColor" : "rgb( 0, 0, 0 )",

  "clearTouch" : false,
  "clearFree"  : true,

  "lineWidth": 1,

  "fingerSize"  : 3,
  "particleSize"  : 4,

  "speedX"    : 65,
  "speedY"    : 65,

  "randomX"   : 10,
  "randomY"   : 10,

  "gravityEnabled" : false,
  "gravity"    : 0,

  "spawnThreshold" : 0,
  "spawnRate"    : 1,

  "lifeMin"    : 0.5,
  "lifeRange"    : 0.5,

  "lifeMultiplierFree" : 5,

  "timedTurns"  : true,

  "spriteRotation"    : false,
  "spriteRotationSpeed" : 0,

  "spriteOffsetX" : 0,
  "spriteOffsetY" : 0,

  "orbitSpeed"  : 6,

  "particleType"        : T_PARTICLE_LINE,
  "radialDistributionType"  : T_DISTRIBUTION_STAR,

  "colorifyType"        : T_PATTERN_SOLID,

  "attenuationType"       : T_ATTENUATION_NONE
}

];

// build themes map

var THEMES_MAP = {};

for ( var i = 0; i < THEMES.length; i ++ ) {

  var theme = THEMES[ i ];
  THEMES_MAP[ theme.label ] = i;

  theme[ "sprites" ] = [];

}

// start theme

var START_THEME = localStorage.getItem( "startTheme" );

if ( ! START_THEME || THEMES_MAP[START_THEME] === undefined ) {

  START_THEME = "Galaxy";

}

// regexes

var reRGB = /rgb\( *(\d+), *(\d+), *(\d+) *\)/;
var reRGBA = /rgba\( *(\d+), *(\d+), *(\d+), *(\d?\.?\d+) *\)/;

// initial theme

var CURRENT_THEME_INDEX = THEMES_MAP[ START_THEME ];
var CURRENT_THEME = THEMES[ CURRENT_THEME_INDEX ];

// parameters cache

var OPT_GLOBAL_ALPHA_TOUCH = CURRENT_THEME[ "globalAlphaTouch" ];
var OPT_GLOBAL_ALPHA_FREE = CURRENT_THEME[ "globalAlphaFree" ];

var OPT_GLOBAL_COMPOSITE_OPERATION_TOUCH = CURRENT_THEME[ "globalCompositeOperationTouch" ];
var OPT_GLOBAL_COMPOSITE_OPERATION_FREE = CURRENT_THEME[ "globalCompositeOperationFree" ];
var OPT_GLOBAL_COMPOSITE_OPERATION_CLEAR = CURRENT_THEME[ "globalCompositeOperationClear" ];

var OPT_SPRITES = CURRENT_THEME[ "sprites" ];

var OPT_PALETTE = CURRENT_THEME[ "palette" ];
var OPT_CLEAR_COLOR = CURRENT_THEME[ "clearColor" ];
var OPT_BACKGROUND_COLOR = CURRENT_THEME[ "backgroundColor" ];

var OPT_CLEAR_TOUCH = CURRENT_THEME[ "clearTouch" ];
var OPT_CLEAR_FREE = CURRENT_THEME[ "clearFree" ];

var OPT_LINEWIDTH = CURRENT_THEME[ "lineWidth" ];

var OPT_FINGER_SIZE = CURRENT_THEME[ "fingerSize" ];
var OPT_PARTICLE_SIZE = CURRENT_THEME[ "particleSize" ];

var OPT_SPEED_X = CURRENT_THEME[ "speedX" ];
var OPT_SPEED_Y = CURRENT_THEME[ "speedY" ];

var OPT_RANDOM_X = CURRENT_THEME[ "randomX" ];
var OPT_RANDOM_Y = CURRENT_THEME[ "randomY" ];

var OPT_GRAVITY_ENABLED = CURRENT_THEME[ "gravityEnabled" ];
var OPT_GRAVITY = CURRENT_THEME[ "gravity" ];

var OPT_SPAWN_THRESHOLD = CURRENT_THEME[ "spawnThreshold" ];
var OPT_SPAWN_RATE = CURRENT_THEME[ "spawnRate" ];

var OPT_LIFE_MIN = CURRENT_THEME[ "lifeMin" ];
var OPT_LIFE_RANGE = CURRENT_THEME[ "lifeRange" ];

var OPT_LIFE_MULTIPLIER_FREE = CURRENT_THEME[ "lifeMultiplierFree" ];

var OPT_TIMED_TURNS = CURRENT_THEME[ "timedTurns" ];

var OPT_ATTENUATION_TYPE = CURRENT_THEME[ "attenuationType" ];
var OPT_ATTENUATION_START = CURRENT_THEME[ "attenuationStart" ];
var OPT_ATTENUATION_SPEED = CURRENT_THEME[ "attenuationSpeed" ];

var OPT_SPRITE_ROTATION = CURRENT_THEME[ "spriteRotation" ];
var OPT_SPRITE_ROTATION_SPEED = CURRENT_THEME[ "spriteRotationSpeed" ];

var OPT_SPRITE_OFFSET_X = CURRENT_THEME[ "spriteOffsetX" ];
var OPT_SPRITE_OFFSET_Y = CURRENT_THEME[ "spriteOffsetY" ];

var OPT_PARTICLE_TYPE = CURRENT_THEME[ "particleType" ];
var OPT_RADIAL_DISTRIBUTION_TYPE = CURRENT_THEME[ "radialDistributionType" ];

var OPT_ORBIT_SPEED = CURRENT_THEME[ "orbitSpeed" ];

// screen dimensions

var SCREEN_WIDTH = 0;
var SCREEN_HEIGHT = 0;

// canvas dimensions

var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;

// orientation

var ORIENTATION = window.orientation;

var ALPHA_DEG = 0, BETA_DEG = 0, GAMMA_DEG = 0;
var ALPHA_RAD = 0, BETA_RAD = 0, GAMMA_RAD = 0;

// timekeeping

var TIMER;

var DELTA_COUNT = 0;
var DELTA_TOTAL = 0;

// globals

var STATE = -1;

var GRAVITY_X = 0;
var GRAVITY_Y = 0;

var CAPABILITIES;

var CTX;

var EL_CANVAS, EL_MENU, EL_BADGE, EL_NOTOUCH;
var EL_PARTICLES, EL_FRAME;

var EL_PROGRESS = document.getElementById( "progress" );
var EL_PROGRESS_BAR = document.getElementById( "progress_bar" );

var MENU_VISIBLE = false;
var CLEAR_ENABLED = false;
var BADGE_VISIBLE = false;

// particles

var PARTICLES = [];

var FREE_INDICES = [];
var FREE_INDICES_TOP = -1;

var LIFE_MULTIPLIER = 1;

var RENDER_LIST = [];

// touches

var TOUCHES = [];
var OLD_TOUCHES = [];

var TOUCH_ANGLES = [];

for ( var i = 0; i < 10; i ++ ) TOUCH_ANGLES[ i ] = 0;

// menu

var MENU_TOUCH_X, MENU_TOUCH_Y;

// mouse

var MOUSE_DOWN = false;
var EMULATED_TOUCH_INDEX = 0;

var USE_EMULATED_TOUCHES = false;

// time

var OLD_TIME = Date.now();
var UPDATE_STARTED = false;

// double-touch

var LAST_TOUCH_TIME = OLD_TIME - 1000; // don't trigger double-touch on the first click
var LAST_TOUCH_X = -100, LAST_TOUCH_Y = -100;

// constants

var CLEAR_STYLE_RESET = "rgb( 0, 0, 0 )";

var PI2 = Math.PI * 2;
var PIHALF = Math.PI * 0.5;
var PIQUARTER = Math.PI * 0.25;

var RAD = PI2 / 360;

// canvas state

var GLOBAL_COMPOSITE_OPERATION;

// -------------------------------------------
// initialization
// -------------------------------------------

prepareSprites();
init();

// -------------------------------------------
// functions
// -------------------------------------------

function parseColor( colorString ) {

  // default to white opaque

  var r, g, b, a;
  r = g = b = a = 1;

  var matchRGBA = reRGBA.exec( colorString );

  if ( matchRGBA ) {

    r = parseInt( matchRGBA[ 1 ] ) / 255;
    g = parseInt( matchRGBA[ 2 ] ) / 255;
    b = parseInt( matchRGBA[ 3 ] ) / 255;
    a = parseFloat( matchRGBA[ 4 ] );

  } else {

    var matchRGB = reRGB.exec( colorString );

    if ( matchRGB ) {

      r = parseInt( matchRGB[ 1 ] ) / 255;
      g = parseInt( matchRGB[ 2 ] ) / 255;
      b = parseInt( matchRGB[ 3 ] ) / 255;

    }

  }

  return { "r": r, "g": g, "b": b, "a": a };

}

function xor( a, b ) {

  return ( a && !b ) || ( !a && b );

}

function mix( a, b, r ) {

  return a + r * ( b - a );

}

function colorifyPattern( pattern, x, y, width, height ) {

  if ( pattern === T_PATTERN_RANDOM ) {

    return Math.random() > 0.5;

  } else if ( pattern === T_PATTERN_HALF ) {

    return x > width * 0.5;

  } else if ( pattern === T_PATTERN_CHECKER ) {

    return xor( x > width * 0.5, y > height * 0.5 );

  } else if ( pattern === T_PATTERN_GRID ) {

    return ( x % 7 > 3 ) || ( y % 7 > 3 );

  } else if ( pattern === T_PATTERN_ANTIGRID ) {

    return ! ( ( x % 7 > 3 ) || ( y % 7 > 3 ) );

  } else if ( pattern === T_PATTERN_STRIPES ) {

    return ( x % 7 > 3 );

  }

  return true;

}

function colorify( ctx, width, height, colorString, colorPattern, ctxMask ) {

  var color = parseColor( colorString );

  var r = color.r;
  var g = color.g;
  var b = color.b;
  var a = color.a;

  var imageData = ctx.getImageData( 0, 0, width, height );
  var data = imageData.data;

  if ( colorPattern === T_PATTERN_MASK ) {

    var maskData = ctxMask.getImageData( 0, 0, width, height );
    var mask = maskData.data;

  }

  for ( var y = 0; y < height; y ++ ) {

    for ( var x = 0; x < width; x ++ ) {

      var index = ( y * width + x ) * 4;

      if ( colorPattern === T_PATTERN_MASK ) {

        var ratio = mask[ index ] / 255;

        var rr = data[ index ];
        var gg = data[ index + 1 ];
        var bb = data[ index + 2 ];
        var aa = data[ index + 3 ];

        data[ index ]     = mix( rr, rr * r, ratio );
        data[ index + 1 ] = mix( gg, gg * g, ratio );
        data[ index + 2 ] = mix( bb, bb * b, ratio );
        data[ index + 3 ] = mix( aa, aa * a, ratio );

      } else if ( colorifyPattern( colorPattern, x, y, width, height ) ) {

        data[ index ]     *= r;
        data[ index + 1 ] *= g;
        data[ index + 2 ] *= b;
        data[ index + 3 ] *= a;

      }

    }

  }

  ctx.putImageData( imageData, 0, 0 );

}

function imageToCanvas( image ) {

  var width = image.width;
  var height = image.height;

  var canvas = document.createElement( 'canvas' );

  canvas.width = width;
  canvas.height = height;

  var context = canvas.getContext( '2d' );
  context.drawImage( image, 0, 0, width, height );

  return canvas;

}

function cacheDataUrl( dataKey, version, dataUrl ) {

  try {

    // evict eventual old version

    var versionKey = "V_" + dataKey;
    var oldVersion = localStorage.getItem( versionKey );

    if ( oldVersion ) {

      localStorage.removeItem( dataKey );

    }

    // store new version

    localStorage.setItem( dataKey, dataUrl );
    localStorage.setItem( versionKey, version );

  } catch ( e ) {

    //console.warn( "Can't save cached image to local storage", e );

    localStorage.clear();
    saveStartTheme();

  }

}

function generateImageHandler( sourceImage, bakedImage, color, pattern, maskImage, dataKey, version ) {

  return function() {

    var canvas = imageToCanvas( sourceImage );
    var context = canvas.getContext( '2d' );

    var contextMask;

    if ( maskImage ) {

      var canvasMask = imageToCanvas( maskImage );
      contextMask = canvasMask.getContext( '2d' );

    }

    colorify( context, canvas.width, canvas.height, color, pattern, contextMask );

    var dataUrl = canvas.toDataURL();

    bakedImage.src = dataUrl;
    bakedImage.initialized = true;

    if ( USE_CACHE ) {

      setTimeout( function() { cacheDataUrl( dataKey, version, dataUrl ); }, 100 );

      //cacheDataUrl( dataKey, version, dataUrl );

    }

    LOAD_COUNTER += 1;

    loadGate();

  };

}

function generateSprites( theme, maskImage ) {

  var images = theme[ "images" ];
  var versions = theme[ "versions" ];

  var palette = theme[ "palette" ];
  var sprites = theme[ "sprites" ];

  var pattern = theme[ "colorifyType" ];

  for ( var j = 0; j < palette.length; j ++ ) {

    var bakedImage = sprites[ j ];

    var index = j % images.length;
    var url = images[ index ];
    var version = versions[ index ];

    var color = palette[ j ];

    var dataKey = url + "_" + color + "_" + pattern;

    var cached = null;

    if ( USE_CACHE ) {

      var versionKey = "V_" + dataKey;
      var storedVersion = parseInt( localStorage.getItem( versionKey ) );

      if ( storedVersion === version ) {

        cached = localStorage.getItem( dataKey );

      }

    }

    if ( cached ) {

      bakedImage.src = cached;
      bakedImage.initialized = true;

    } else {

      LOAD_TOTAL += 1;

      var sourceImage = new Image();

      sourceImage.onload = generateImageHandler( sourceImage, bakedImage, color, pattern, maskImage, dataKey, version );
      sourceImage.src = url;

    }

  }

}

function generateGenerator( theme, maskImage ) {

  return function() {

    generateSprites( theme, maskImage );
  };
}

function loadGate() {

  if ( LOAD_TOTAL > 0 ) {

    var percent = Math.max( 0.1, LOAD_COUNTER / LOAD_TOTAL );
    EL_PROGRESS_BAR.style.width = ( 100 * percent ) + "%";

  }

  if ( LOAD_COUNTER === LOAD_TOTAL ) {

    var elapsed = Date.now() - DBG_START;
    //console.log( "init time:", elapsed );
    //alert( elapsed );

    EL_PROGRESS_BAR.style.width = "100%";
    EL_PROGRESS.style.display = "none";

    // start the update loop

    TIMER = setInterval( requestUpdate, FRAME_DURATION );

  }

}

function prepareSprites() {

  for ( var i = 0; i < THEMES.length; i ++ ) {

    var theme = THEMES[ i ];

    var images = theme[ "images" ];

    if ( images.length > 0 ) {

      var sprites = theme[ "sprites" ];
      var palette = theme[ "palette" ];

      var pattern = theme[ "colorifyType" ];
      var mask = theme[ "colorifyMask" ];

      for ( var j = 0; j < palette.length; j ++ ) {

        var sprite = new Image();
        sprite.initialized = false;

        sprites[ j ] = sprite;

      }

      if ( pattern === T_PATTERN_MASK && mask !== undefined ) {

        var maskImage = new Image();
        maskImage.onload = generateGenerator( theme, maskImage );
        maskImage.src = mask;

      } else {

        generateSprites( theme );

      }

    }

  }

  loadGate();

}

// -------------------------------------------

function computeGravity() {

  // spherical => cartesian

  var dx = OPT_GRAVITY * Math.sin( GAMMA_RAD ) * Math.sin( BETA_RAD );
  var dy = OPT_GRAVITY * Math.cos( GAMMA_RAD ) * Math.sin( BETA_RAD );
  var dz = OPT_GRAVITY * Math.cos( BETA_RAD );

  if ( BETA_RAD < 0 ) {

    dy *= -1;

  }

  if ( ORIENTATION > 0 ) {

    var tmp = dy;
    dy = dx;
    dx = -tmp;

  }

  if ( ORIENTATION < 0 ) {

    var tmp = dy;
    dy = -dx;
    dx = tmp;

  }

  GRAVITY_X = dx;
  GRAVITY_Y = dy;

}

//

function timeSort( a, b ) {

  return a.life - b.life;

}

//

function render() {

  // clear canvas

  if ( CLEAR_ENABLED ) {

    CTX.globalCompositeOperation = OPT_GLOBAL_COMPOSITE_OPERATION_CLEAR;

    CTX.fillStyle = OPT_CLEAR_COLOR;
    CTX.fillRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );

    CTX.globalCompositeOperation = GLOBAL_COMPOSITE_OPERATION;

  }

  // sort


  if ( OPT_PARTICLE_TYPE === T_PARTICLE_SPRITE_TIME ) {

    for ( var i = 0; i < MAX_PARTICLES; i ++ ) {

      var ri = RENDER_LIST[ i ];

      ri.index = i;
      ri.life = PARTICLES[ i ].life;

    }

    RENDER_LIST.sort( timeSort );

  }


  // render particles

  for ( var i = 0; i < MAX_PARTICLES; i ++ ) {

    if ( OPT_PARTICLE_TYPE === T_PARTICLE_SPRITE_TIME ) {

      var particle = PARTICLES[ RENDER_LIST[ i ].index ];

    } else {

      var particle = PARTICLES[ i ];

    }

    if ( particle.active && particle.life > 0 && particle.x > 0 && particle.y > 0 && particle.x < CANVAS_WIDTH && particle.y < CANVAS_HEIGHT ) {

      var lifeRatio = 1;

      if ( OPT_ATTENUATION_TYPE === T_ATTENUATION_GROW ) {

        lifeRatio = 1 - particle.life / particle.totalLife;
        lifeRatio = OPT_ATTENUATION_START + OPT_ATTENUATION_SPEED * lifeRatio;

      } else if ( OPT_ATTENUATION_TYPE === T_ATTENUATION_SHRINK ) {

        lifeRatio = particle.life / particle.totalLife;
        lifeRatio = OPT_ATTENUATION_START + OPT_ATTENUATION_SPEED * ( lifeRatio * lifeRatio * lifeRatio * lifeRatio );

      } else if ( OPT_ATTENUATION_TYPE === T_ATTENUATION_SIN ) {

        lifeRatio = 1 - particle.life / particle.totalLife;
        lifeRatio = OPT_ATTENUATION_START + OPT_ATTENUATION_SPEED * Math.sin( lifeRatio * PI2 );

      }

      // disc

      if ( OPT_PARTICLE_TYPE === T_PARTICLE_DISC ) {

        CTX.fillStyle = OPT_PALETTE[ particle.color ];

        CTX.beginPath();
        CTX.arc( particle.x, particle.y, OPT_PARTICLE_SIZE * lifeRatio, 0, PI2, true );
        CTX.fill();

      // circle

      } else if ( OPT_PARTICLE_TYPE === T_PARTICLE_CIRCLE ) {

        CTX.strokeStyle = OPT_PALETTE[ particle.color ];

        CTX.beginPath();
        CTX.arc( particle.x, particle.y, OPT_PARTICLE_SIZE * lifeRatio, 0, PI2, true );
        CTX.stroke();

      // line

      } else if ( OPT_PARTICLE_TYPE === T_PARTICLE_LINE ) {

        CTX.strokeStyle = OPT_PALETTE[ particle.color ];

        CTX.beginPath();
        CTX.moveTo( particle.oldX, particle.oldY );
        CTX.lineTo( particle.x, particle.y );
        CTX.stroke();

      // sprite

      } else if ( OPT_PARTICLE_TYPE === T_PARTICLE_SPRITE || OPT_PARTICLE_TYPE === T_PARTICLE_SPRITE_TIME ) {

        if ( OPT_PARTICLE_TYPE === T_PARTICLE_SPRITE_TIME ) {

          var elapsed = 1 - particle.life / particle.totalLife;
          var nFrames = OPT_SPRITES.length;

          var index = Math.min( Math.floor( elapsed * nFrames ), nFrames - 1 );

          var sprite = OPT_SPRITES[ index ];

        } else {

          var sprite = OPT_SPRITES[ particle.color ];

        }

        if ( ! sprite.initialized ) continue;

        var attenuatedWidth = Math.round( lifeRatio * sprite.width );
        var attenuatedHeight = Math.round( lifeRatio * sprite.height );

        if ( attenuatedWidth < 1 || attenuatedHeight < 1 ) {

          particle.life = 0;
          continue;

        }

        var tiny = false;
        if ( attenuatedWidth < 3 || attenuatedHeight < 3 ) tiny = true;

        var x = -0.5 * attenuatedWidth + OPT_SPRITE_OFFSET_X;
        var y = -0.5 * attenuatedHeight + OPT_SPRITE_OFFSET_Y;

        if ( OPT_SPRITE_ROTATION && ! tiny ) {

          var rotation = OPT_SPRITE_ROTATION_SPEED * particle.elapsedCounter;

          CTX.save();

          CTX.translate( particle.x, particle.y );
          CTX.rotate( rotation );


        } else {

          x += particle.x;
          y += particle.y;

        }

        if ( OPT_ATTENUATION_TYPE ) {

          CTX.drawImage( sprite, x, y, attenuatedWidth, attenuatedHeight );

        } else {

          CTX.drawImage( sprite, x, y );

        }

        if ( OPT_SPRITE_ROTATION && ! tiny ) {

          CTX.restore();

        }

      } else if ( OPT_PARTICLE_TYPE === T_PARTICLE_SPRITE_MULTI ) {

        var sprite = OPT_SPRITES[ particle.color ];

        if ( ! sprite.initialized ) continue;

        var d = sprite.height;

        var ratio = particle.life / particle.totalLife;
        ratio = OPT_ATTENUATION_SPEED * ( ratio + OPT_ATTENUATION_START ) / 2;

        var attenuatedSize = d * ratio;

        if ( attenuatedSize < 1 ) {

          particle.life = 0;
          continue;

        }

        var x = - 0.5 * attenuatedSize;
        var y = - 0.5 * attenuatedSize;

        var nFrames = Math.floor( sprite.width / d );

        var elapsed = 1 - particle.life / particle.totalLife;

        var sx = Math.min( Math.floor( elapsed * nFrames ), nFrames - 1 ) * d;
        var sy = 0;

        if ( OPT_SPRITE_ROTATION ) {

          var rotation = OPT_SPRITE_ROTATION_SPEED * particle.elapsedCounter;

          CTX.save();

          CTX.translate( particle.x, particle.y );
          CTX.rotate( rotation );

        } else {

          x += particle.x;
          y += particle.y;

        }

        CTX.drawImage( sprite, sx, sy, d, d, x, y, attenuatedSize, attenuatedSize );

        if ( OPT_SPRITE_ROTATION ) {

          CTX.restore();

        }

      }

    }

  }

}

//

function requestUpdate() {

  if ( UPDATE_STARTED ) return;

  if ( USE_RAF ) {

    requestAnimationFrame( update );

  } else {

    update();

  }

}

function spawnParticle( x, y, dx, dy, color, delta ) {

  var life = OPT_LIFE_MIN + OPT_LIFE_RANGE * Math.random();

  var angle;

  if ( OPT_RADIAL_DISTRIBUTION_TYPE === T_DISTRIBUTION_FULL ) {

    angle = Math.random() * PI2;

  } else if ( OPT_RADIAL_DISTRIBUTION_TYPE === T_DISTRIBUTION_CROSS ) {

    angle = Math.random() * Math.PI/16 + PIHALF * Math.floor( Math.random() * 4 );

  } else if ( OPT_RADIAL_DISTRIBUTION_TYPE === T_DISTRIBUTION_LINE ) {

    angle = Math.PI;

  } else if ( OPT_RADIAL_DISTRIBUTION_TYPE === T_DISTRIBUTION_STAR ) {

    angle = Math.floor( 8 * Math.random() ) * PIQUARTER;

  } else if ( OPT_RADIAL_DISTRIBUTION_TYPE === T_DISTRIBUTION_TRAIL ) {

    if ( Math.abs( dx ) < EPSILON && Math.abs( dy ) < EPSILON ) {

      angle = Math.random() * PI2;

    } else {

      angle = Math.atan2( dx, dy ) + ( 0.5 - Math.random() ) * PIHALF * 2;

    }

  } else if ( OPT_RADIAL_DISTRIBUTION_TYPE === T_DISTRIBUTION_ORBIT ) {

    angle = TOUCH_ANGLES[ color ];
    TOUCH_ANGLES[ color ] += delta * OPT_ORBIT_SPEED;

  }


  var nx = OPT_FINGER_SIZE * Math.sin( angle );
  var ny = OPT_FINGER_SIZE * Math.cos( angle );

  var particleIndex = FREE_INDICES[ FREE_INDICES_TOP ];
  FREE_INDICES_TOP -= 1;

  var particle = PARTICLES[ particleIndex ];

  particle.x = x + nx;
  particle.y = y + ny;

  particle.oldX = particle.x;
  particle.oldY = particle.y;

  particle.dx = OPT_SPEED_X * nx / OPT_FINGER_SIZE;
  particle.dy = OPT_SPEED_Y * ny / OPT_FINGER_SIZE;

  particle.life = life;
  particle.totalLife = life;
  particle.color = color;

  particle.active = true;

  particle.angle = angle;

}

function update() {

  UPDATE_STARTED = true;

  // delta

  var time = Date.now();
  var delta = ( time - OLD_TIME ) * 0.001;
  OLD_TIME = time;

  //if ( delta > 0.06 ) delta = 0.06;

  // gravity

  if ( OPT_GRAVITY_ENABLED ) {

    computeGravity();

  }

  // spawn particles at touches

  var particle;
  var i, il, index;
  var touch, px, py;
  var oldTouch, oldX, oldY;
  var dx, dy;

  for ( i = 0, il = TOUCHES.length; i < il; i ++ ) {

    touch = TOUCHES[ i ];

    if ( USE_EMULATED_TOUCHES ) {

      index = EMULATED_TOUCH_INDEX;

    } else {

      index = i;

    }

    px = touch.pageX;
    py = touch.pageY;

    if ( OLD_TOUCHES[ i ] !== undefined ) {

      oldTouch = OLD_TOUCHES[ i ];

      oldX = oldTouch.pageX;
      oldY = oldTouch.pageY;

      dx = px - oldX;
      dy = py - oldY;

    } else {

      OLD_TOUCHES[ i ] = { pageX: 0, pageY: 0 };

      dx = 0;
      dy = 0;

    }

    OLD_TOUCHES[ i ].pageX = px;
    OLD_TOUCHES[ i ].pageY = py;

    for ( var j = 0; j < OPT_SPAWN_RATE; j ++ ) {

      if ( FREE_INDICES_TOP >= 0 && Math.random() > OPT_SPAWN_THRESHOLD ) {

        spawnParticle( px, py, dx, dy, index, delta );

      }

    }

  }

  // update particles

  for ( i = 0; i < MAX_PARTICLES; i ++ ) {

    particle = PARTICLES[ i ];

    if ( particle.active ) {

      particle.life -= LIFE_MULTIPLIER * delta;

      particle.turnCounter += delta;
      particle.elapsedCounter += delta;

      particle.oldX = particle.x;
      particle.oldY = particle.y;

      if ( OPT_TIMED_TURNS ) {

        if ( particle.turnCounter > particle.turnTime ) {

          var rnd = Math.random();
          var angle = particle.angle + PIHALF * ( rnd > 0.333 ? ( rnd > 0.666 ? -1 : 0 ) : 1 );

          var nx = OPT_FINGER_SIZE * Math.sin( angle );
          var ny = OPT_FINGER_SIZE * Math.cos( angle );

          particle.dx = OPT_SPEED_X * nx / OPT_FINGER_SIZE;
          particle.dy = OPT_SPEED_Y * ny / OPT_FINGER_SIZE;

          particle.angle = angle;

          particle.turnCounter = 0;

          particle.turnTime = particle.life * 0.25 + 0.125;

        }

      }

      // move the particle

      particle.x += delta * ( particle.dx + ( 0.5 - Math.random() ) * OPT_RANDOM_X );
      particle.y += delta * ( particle.dy + ( 0.5 - Math.random() ) * OPT_RANDOM_Y );

      if ( OPT_GRAVITY_ENABLED ) {

        particle.x += delta * GRAVITY_X;
        particle.y += delta * GRAVITY_Y;

      }

      if ( particle.life <= 0 ){

        FREE_INDICES_TOP += 1;
        FREE_INDICES[ FREE_INDICES_TOP ] = i;

        particle.active = false;

      }

    }

  }

  // render particles

  render();

  /*

  // update stats

  DELTA_COUNT += 1;
  DELTA_TOTAL += delta;

  if ( DELTA_COUNT === 10 ) {

    EL_PARTICLES.innerHTML = MAX_PARTICLES - FREE_INDICES_TOP - 1;
    EL_FRAME.innerHTML = ( 1000 * DELTA_TOTAL / DELTA_COUNT ).toFixed( 0 );

    DELTA_COUNT = 0;
    DELTA_TOTAL = 0;

  }

  */

  //

  UPDATE_STARTED = false;

}

// -------------------------------------------

function hideUrlBar() {

  if ( CAPABILITIES.isMobile && ! CAPABILITIES.isChrome ) {

    var elContainer = document.getElementById( "container" );
    elContainer.style.minHeight = ( window.innerHeight + 75 ) + "px";

    window.scrollTo( 0, 1 );

  }

}

//

function handleResize() {

  hideUrlBar();

  var newWidth = window.innerWidth;
  var newHeight = window.innerHeight;

  if ( ( SCREEN_WIDTH !== newWidth ) || ( SCREEN_HEIGHT !== newHeight ) ) {

    SCREEN_WIDTH = newWidth;
    SCREEN_HEIGHT = newHeight;

    if ( CAPABILITIES.isMobile ) {

      CANVAS_WIDTH = SCREEN_WIDTH;
      CANVAS_HEIGHT = SCREEN_HEIGHT;

    }

    centerElement( EL_BADGE );

    if ( BADGE_VISIBLE ) {

      setInitTouches();

    }

    EL_CANVAS.style.width = CANVAS_WIDTH + 'px';
    EL_CANVAS.style.height = CANVAS_HEIGHT + 'px';

    EL_CANVAS.width = CANVAS_WIDTH;
    EL_CANVAS.height = CANVAS_HEIGHT;

    setStateTouch();

  }

}

function setInitTouches() {

  TOUCHES[ 0 ] = { pageX: -10, pageY: CANVAS_HEIGHT / 2 };
  TOUCHES[ 1 ] = { pageX: CANVAS_WIDTH + 10, pageY: CANVAS_HEIGHT / 2 };

}

//

function resetCanvas() {

  CTX.globalAlpha = 1;
  CTX.globalCompositeOperation = "source-over";

  CTX.fillStyle = OPT_BACKGROUND_COLOR;
  CTX.fillRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );

  EL_CANVAS.style.backgroundColor = OPT_BACKGROUND_COLOR;

  setStateTouch();

}

//

function setStateTouch() {

  GLOBAL_COMPOSITE_OPERATION = OPT_GLOBAL_COMPOSITE_OPERATION_TOUCH;
  CTX.globalCompositeOperation = GLOBAL_COMPOSITE_OPERATION;

  CTX.globalAlpha = OPT_GLOBAL_ALPHA_TOUCH;

  CTX.lineWidth = OPT_LINEWIDTH;

  CLEAR_ENABLED = OPT_CLEAR_TOUCH;

  LIFE_MULTIPLIER = 1;

  STATE = T_STATE_TOUCH;

}

function setStateFree() {

  GLOBAL_COMPOSITE_OPERATION = OPT_GLOBAL_COMPOSITE_OPERATION_FREE;
  CTX.globalCompositeOperation = GLOBAL_COMPOSITE_OPERATION;

  CTX.globalAlpha = OPT_GLOBAL_ALPHA_FREE;

  CLEAR_ENABLED = true;

  LIFE_MULTIPLIER = OPT_LIFE_MULTIPLIER_FREE;

  STATE = T_STATE_FREE;

}

//

function emulateTouch( x, y ) {

  var offsetX = EL_CANVAS.offsetLeft;
  var offsetY = EL_CANVAS.offsetTop;

  if ( TOUCHES.length === 0 ) {

    TOUCHES[ 0 ] = { pageX: 0, pageY: 0 };

  }

  TOUCHES[ 0 ].pageX = x - offsetX;
  TOUCHES[ 0 ].pageY = y - offsetY;

  TOUCHES.length = 1;

  setStateTouch();

}

function cleanEmulatedTouches() {

  TOUCHES.length  = 0;

}

//

function toggleMenu() {

  if ( MENU_VISIBLE ) {

    EL_MENU.style.display = "none";
    EL_CANVAS.style.display = "block";

    MENU_VISIBLE = false;

  } else {

    EL_MENU.style.display = "block";
    EL_CANVAS.style.display = "none";

    MENU_VISIBLE = true;

  }

}

function saveStartTheme() {

  try {

    localStorage.setItem( "startTheme", CURRENT_THEME[ "label" ] );

  } catch ( e ) {

    //console.warn( "Can't save startTheme to localStorage", e );

  };

}

function resetParticles() {

  for ( var i = 0; i < MAX_PARTICLES; i ++ ) {

    var particle = PARTICLES[ i ];

    particle.life = 0;
    particle.active = false;

    FREE_INDICES[ i ] = i;
    FREE_INDICES_TOP = i;

    RENDER_LIST[ i ].index = i;
    RENDER_LIST[ i ].life = 0;

  }

}

function setTheme( index ) {

  var theme = THEMES[ index ];

  OPT_GLOBAL_ALPHA_TOUCH = theme[ "globalAlphaTouch" ];
  OPT_GLOBAL_ALPHA_FREE = theme[ "globalAlphaFree" ];

  OPT_GLOBAL_COMPOSITE_OPERATION_TOUCH = theme[ "globalCompositeOperationTouch" ];
  OPT_GLOBAL_COMPOSITE_OPERATION_FREE = theme[ "globalCompositeOperationFree" ];
  OPT_GLOBAL_COMPOSITE_OPERATION_CLEAR = theme[ "globalCompositeOperationClear" ];

  OPT_SPRITES = theme[ "sprites" ];

  OPT_PALETTE = theme[ "palette" ];
  OPT_CLEAR_COLOR = theme[ "clearColor" ];
  OPT_BACKGROUND_COLOR = theme[ "backgroundColor" ];

  OPT_CLEAR_TOUCH = theme[ "clearTouch" ];
  OPT_CLEAR_FREE = theme[ "clearFree" ];

  OPT_LINEWIDTH = theme[ "lineWidth" ];

  OPT_FINGER_SIZE = theme[ "fingerSize" ];
  OPT_PARTICLE_SIZE = theme[ "particleSize" ];

  OPT_SPEED_X = theme[ "speedX" ];
  OPT_SPEED_Y = theme[ "speedY" ];

  OPT_RANDOM_X = theme[ "randomX" ];
  OPT_RANDOM_Y = theme[ "randomY" ];

  OPT_GRAVITY_ENABLED = theme[ "gravityEnabled" ];
  OPT_GRAVITY = theme[ "gravity" ];

  OPT_SPAWN_THRESHOLD = theme[ "spawnThreshold" ];
  OPT_SPAWN_RATE = theme[ "spawnRate" ];

  OPT_LIFE_MIN = theme[ "lifeMin" ];
  OPT_LIFE_RANGE = theme[ "lifeRange" ];

  OPT_LIFE_MULTIPLIER_FREE = theme[ "lifeMultiplierFree" ];

  OPT_TIMED_TURNS = theme[ "timedTurns" ];

  OPT_SPRITE_ROTATION = theme[ "spriteRotation" ];

  OPT_SPRITE_OFFSET_X = theme[ "spriteOffsetX" ];
  OPT_SPRITE_OFFSET_Y = theme[ "spriteOffsetY" ];

  OPT_SPRITE_ROTATION_SPEED = theme[ "spriteRotationSpeed" ];

  OPT_PARTICLE_TYPE = theme[ "particleType" ];
  OPT_RADIAL_DISTRIBUTION_TYPE = theme[ "radialDistributionType" ];

  OPT_ATTENUATION_TYPE = theme[ "attenuationType" ];
  OPT_ATTENUATION_START = theme[ "attenuationStart" ];
  OPT_ATTENUATION_SPEED = theme[ "attenuationSpeed" ];

  OPT_ORBIT_SPEED = theme[ "orbitSpeed" ];

  resetParticles();

  CURRENT_THEME = theme;
  saveStartTheme();

  hideUrlBar();
  resetCanvas();
  toggleMenu();

}

function generateThemeClickHandler( index ) {
  return function( event ) {

    event.preventDefault();

    setTheme( index );

    MOUSE_DOWN = false;
    cleanEmulatedTouches();

  };

}

function generateThemeTouchEndHandler( index ) {

  return function( event ) {

    var touch = event.changedTouches[ 0 ];

    var x = touch.pageX;
    var y = touch.pageY;

    var d = distance( x, y, MENU_TOUCH_X, MENU_TOUCH_Y );

    if ( d < TOUCH_CLICK_TOLERANCE ) {

      setTheme( index );

    }

  };

}

//

function detectCapabilities() {

  var capabilities = {

    hasTouch: false,
    isMobile: false,
    isChrome: false,
    isOpera: false,
    isExplorer: false

  };

  // touch

  if ( window.ontouchstart !== undefined ) {

    capabilities.hasTouch = true;

  }

  // mobile (including tablets)
  // from http://detectmobilebrowsers.com

  var mobileRE = /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|playbook|silk|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
  var userAgent = navigator.userAgent;

  if ( mobileRE.test( userAgent ) ) {

    capabilities.isMobile = true;

  }

  // chrome

  if ( userAgent.indexOf( "Chrome" ) !== -1 ) {

    capabilities.isChrome = true;

  }

  // opera

  if ( userAgent.indexOf( "Opera" ) !== -1 ) {

    capabilities.isOpera = true;

  }

  // explorer

  if ( userAgent.indexOf( "MSIE" ) !== -1 ) {

    capabilities.isExplorer = true;

  }

  return capabilities;

}

function centerElement( element ) {

  if ( CAPABILITIES.isMobile ) {

    element.style.left = 0.5 * ( SCREEN_WIDTH - element.offsetWidth ) + "px";
    element.style.top = 0.5 * ( SCREEN_HEIGHT - element.offsetHeight ) + "px";

  } else {

    element.style.top = - 0.5 * ( CANVAS_HEIGHT + element.offsetHeight ) + "px";

  }

}

function hideBadge() {

  if ( BADGE_VISIBLE ) {

    EL_BADGE.style.display = "none";
    EL_NOTOUCH.style.display = "none";

    BADGE_VISIBLE = false;

    if ( ! CAPABILITIES.hasTouch ) {

      USE_EMULATED_TOUCHES = true;

    }

  }

}

function handleDoubleTouch( x, y ) {

  var deltaTouch = OLD_TIME - LAST_TOUCH_TIME;

  if ( deltaTouch > 0 && deltaTouch < DOUBLE_TOUCH_DURATION
     && TOUCHES.length === 1
     && distance( x, y, LAST_TOUCH_X, LAST_TOUCH_Y ) < TOUCH_CLICK_TOLERANCE_MENU ) {

    if ( CAPABILITIES.isExplorer ) {

      // must do this to prevent mysterious
      // event leaking to hidden menu elements

      setTimeout( toggleMenu, DOUBLE_TOUCH_DURATION );

    } else {

      toggleMenu();

    }

  }

  LAST_TOUCH_TIME = OLD_TIME;

  LAST_TOUCH_X = x;
  LAST_TOUCH_Y = y;

}

function handleKeyDown( event ) {

  switch ( event.keyCode ) {

  case 48: EMULATED_TOUCH_INDEX = 0; break;
  case 49: EMULATED_TOUCH_INDEX = 1; break;
  case 50: EMULATED_TOUCH_INDEX = 2; break;
  case 51: EMULATED_TOUCH_INDEX = 3; break;
  case 52: EMULATED_TOUCH_INDEX = 4; break;

  case 53: EMULATED_TOUCH_INDEX = 5; break;
  case 54: EMULATED_TOUCH_INDEX = 6; break;
  case 55: EMULATED_TOUCH_INDEX = 7; break;
  case 56: EMULATED_TOUCH_INDEX = 8; break;
  case 57: EMULATED_TOUCH_INDEX = 9; break;

  }

}

function handleVisibilityChange() {

  if ( document.webkitHidden ) {

    clearInterval( TIMER );

  } else {

    TIMER = setInterval( requestUpdate, FRAME_DURATION );

  }

}

function distance( x1, y1, x2, y2 ) {

  var dx = x1 - x2;
  var dy = y1 - y2;

  return Math.sqrt( dx * dx + dy * dy );

}

// -------------------------------------------

function init() {

  // cache DOM elements

  EL_MENU = document.getElementById( "menu" );

  EL_PARTICLES = document.getElementById( "particles" );
  EL_FRAME = document.getElementById( "frame" );

  EL_CANVAS = document.getElementById( 'canvas' );
  CTX = EL_CANVAS.getContext( '2d' );

  EL_BADGE = document.getElementById( "badge" );
  EL_NOTOUCH = document.getElementById( "notouch" );

  EL_HEADER = document.getElementById( "header" );

  // capabilities

  CAPABILITIES = detectCapabilities();

  // Set Canvas Size

  CANVAS_WIDTH =  window.innerWidth;
  CANVAS_HEIGHT = window.innerHeight;

  EL_CANVAS.style.position = "absolute";
  EL_MENU.style.position = "absolute";

  EL_BADGE.style.top = "0";
  EL_BADGE.style.left = "0";

  // browser specific fixes

  if ( CAPABILITIES.isOpera ) {

    document.body.style.fontSize = "0.8em";

  }

  //

  if ( ! USE_CACHE && localStorage ) {

    localStorage.clear();
    saveStartTheme();

  }

  hideUrlBar();

  // init screen effect

  setInitTouches();

  // particles

  for ( var i = 0; i < MAX_PARTICLES; i ++ ) {

    PARTICLES[ i ] = {
      x: 0,
      y: 0,

      dx: 0,
      dy: 0,

      oldX: 0,
      oldY: 0,

      angle: 0,

      life: 0,
      totalLife: 0,

      elapsedCounter: 0,
      turnCounter: 0,
      turnTime: 1,

      color: 0,

      active: false
    };

    FREE_INDICES[ i ] = i;
    FREE_INDICES_TOP = i;

    RENDER_LIST[ i ] = { index: i, life: 0 };

  }


  //

  EL_BADGE.style.display = "block";
  BADGE_VISIBLE = true;

  //

  if ( ! CAPABILITIES.hasTouch ) {

    EL_NOTOUCH.style.display = "block";
    EL_MENU.style.overflow = "auto"; // to show scrollbar on desktop (makes mess on mobile)

  }

  //

  handleResize();

  // touch events

  EL_CANVAS.addEventListener( 'touchend', function( event ) {

    event.preventDefault();

    TOUCHES = event.touches;

    if ( TOUCHES.length === 0 ) {

      if ( STATE !== T_STATE_FREE ) {

        setStateFree();

      }

    }

  });

  EL_CANVAS.addEventListener( 'touchmove', function( event ) {

    event.preventDefault();

    TOUCHES = event.touches;

    if ( STATE !== T_STATE_TOUCH ) {

      setStateTouch();

    }

  });

  EL_CANVAS.addEventListener( 'touchstart', function( event ) {

    event.preventDefault();

    TOUCHES = event.touches;

    if ( STATE !== T_STATE_TOUCH ) {

      setStateTouch();

    }

    hideBadge();

    var touch = event.touches[ 0 ];
    handleDoubleTouch( touch.pageX, touch.pageY );

  });

  // mouse events (fallback)

  if ( ! CAPABILITIES.hasTouch || !CAPABILITIES.isMobile ) {

    EL_CANVAS.addEventListener( 'mousemove', function( event ) {

      event.preventDefault();

      if ( MOUSE_DOWN ) {

        emulateTouch( event.pageX, event.pageY );

      }

    });

    EL_CANVAS.addEventListener( 'mousedown', function( event ) {

      event.preventDefault();

      MOUSE_DOWN = true;

      emulateTouch( event.pageX, event.pageY );

      hideBadge();
      handleDoubleTouch( event.pageX, event.pageY );

    });

    window.addEventListener( 'mouseup', function( event ) {

      event.preventDefault();

      MOUSE_DOWN = false;

      cleanEmulatedTouches();

    });

    window.addEventListener( 'keydown', handleKeyDown );

  }

  // orientation events

  window.addEventListener( 'orientationchange', function ( event ) {

    ORIENTATION = window.orientation;

  }, false );

  window.addEventListener( 'deviceorientation', function ( event ) {

    ALPHA_DEG = event.alpha;
    BETA_DEG = event.beta;
    GAMMA_DEG = event.gamma;

    ALPHA_RAD = RAD * ALPHA_DEG;
    BETA_RAD = RAD * BETA_DEG;
    GAMMA_RAD = RAD * GAMMA_DEG;

  }, false );

  // resize event

  window.addEventListener( 'resize', handleResize, false );

  // visibility event

  document.addEventListener( 'webkitvisibilitychange', handleVisibilityChange, false );

  // menu

  var buttonClassName = "button_theme";

  if ( ! CAPABILITIES.hasTouch ) {

    buttonClassName += " hoverable";

  }

  for ( var i = 0; i < THEMES.length; i ++ ) {

    var theme = THEMES[ i ];

    var elButtonTheme = document.createElement( "div" );
    elButtonTheme.className = buttonClassName;
    elButtonTheme.innerHTML = "<span class='pad'>" + theme.label + "</span>"; // hack to work around horizontal leeway on Android

    if ( CAPABILITIES.hasTouch ) {

      elButtonTheme.addEventListener( "touchstart", function( event ) {

        var touch = event.touches[ 0 ];

        MENU_TOUCH_X = touch.pageX;
        MENU_TOUCH_Y = touch.pageY;

      } );

      elButtonTheme.addEventListener( "touchend", generateThemeTouchEndHandler( i ) );

    }

    if ( !CAPABILITIES.isMobile ) {

      elButtonTheme.addEventListener( "click", generateThemeClickHandler( i ) );
    }

    EL_MENU.appendChild( elButtonTheme );

  }

};