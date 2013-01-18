/*! caress-client - v0.1.0 - 2012-11-01
* https://github.com/ekryski/caress-client
* Copyright (c) 2012 Eric Kryski; Licensed MIT */

(function(namespace) {

  /**
  * Boilerplate to make Caress compatible with AMD,
  * CommonJS 'require' (NodeJS) and vanilla JavaScript.
  *
  * Courtesy of David Luecke @daffl
  * http://daffl.github.com/2012/02/22/javascript-modules.html
  */
  if(typeof define == "undefined") {
    define = function(fn) {
      var myModule = fn();
      if (typeof exports == "undefined") {
        window[namespace] = myModule; //Vanilla JS
      }
      else {
        module.exports = myModule; //NodeJS
      }
    };
  }

  define(function(require, exports, module) {

    var root = root || window;
    var _ = root._;

    if (!_ && (typeof require !== "undefined")) {
        _ = require('underscore');
    }

    /**
     * Caress namespace.
     *
     * @namespace
     */

    var Caress = exports || {};

    /**
     * Caress version
     *
     * @api public
     */

    Caress.version = '0.1.0';

    /**
     * TUIO Protocol implemented.
     *
     * @api public
     */

    Caress.protocol = '1.1';

    /**
     * Expose any NodeJS specific stuff
     */
    if ('object' === typeof module && 'function' === typeof require) {

      /**
       * Expose utils
       *
       * @api private
       */
    }

    /**
     * The Caress Client Object
     */
    var Client = Caress.Client = function Client(options) {
      options = options || {};
      this.host = options.host ||'127.0.0.1';
      this.port = options.port || 5000;
      this.connected = false;
      this.sessions = {}; // {id: pointerToObjectInList}
      this.cursors = {};
      this.objects = {};
      this.blobs = {};
      this.touches = {};
      this.touchList = document.createTouchList();

      // _.bindAll(this, 'connect', 'onConnect', 'onDisconnect', 'processPacket', 'processMessage', 'process2dCursorMessage', 'source2dCursor', 'alive2dCursor', 'set2dCursor');
      _.bindAll(this, 'connect', 'onConnect', 'onDisconnect', 'processPacket', 'processMessage', 'processCursorSource', 'processObjectSource', 'processBlobSource',
        'processCursorAlive', 'processObjectAlive', 'processBlobAlive', 'processCursorSet', 'processObjectSet', 'processBlobSet', 'processFseq');
    };

    Client.prototype.connect = function(){
      this.socket = io.connect('http://' + this.host + ':' + this.port);
      this.socket.on("connect", this.onConnect);
      this.socket.on("disconnect", this.onDisconnect);
    };

    Client.prototype.onConnect = function(){
      this.connected = true;

      this.socket.on('tuio', this.processPacket);
      // this.trigger("connect");
      console.log('Connected to Socket.io');
    };

    Client.prototype.onDisconnect = function(){
      this.connected = false;

      // We disconnected from the server so we emit touch cancel
      // events for each touch point still remaining.
      for (var namespace in this.touches) {
        for (var touch in this.touches[namespace]) {
          var cancelledTouch = this.touches[namespace][touch];
          delete this.touches[namespace][touch];

          this.createTouchEvent('touchcancel', cancelledTouch);
        }
      }

      // Clean up all the TUIO and touch lists
      this.touches = {};
      this.cursors = {};
      this.objects = {};
      this.blobs = {};

      // this.trigger("disconnect");
      console.log('Disconnected from Socket.io');
    };

    Client.prototype.processPacket = function(packet){
      if (packet.bundle){
        this.processMessage(packet);
      }
      else {
        // It's a regular message and not a bundle
        // TODO: Figure out what to do. Haven't seen one of these yet
      }
    };

    Client.prototype.processMessage = function(packet){
      var cursorTypes = {
        'source': this.processCursorSource,
        'alive': this.processCursorAlive,
        'set': this.processCursorSet,
        'fseq': this.processFseq
      };

      var objectTypes = {
        'source': this.processObjectSource,
        'alive': this.processObjectAlive,
        'set': this.processObjectSet,
        'fseq': this.processFseq
      };

      var blobTypes = {
        'source': this.processBlobSource,
        'alive': this.processBlobAlive,
        'set': this.processBlobSet,
        'fseq': this.processFseq
      };

      // console.log('PACKET', packet);

      // Ignore duplicate packets for now
      if (!packet.duplicate){

        // Default all the sources to localhost, assuming that if
        // we don't have an address then it is from localhost. Maybe
        // this is a bad assumption to make. We override this if
        // a source was actually provided!
        packet.source = 'localhost';

        for (var message in packet.messages) {
          var key = packet.messages[message].type;

          switch (packet.messages[message].profile) {
              case "/tuio/2Dcur":
              case "/tuio/25Dcur":
              case "/tuio/3Dcur":
                cursorTypes[key](packet, packet.messages[message]);
                break;
              case "/tuio/2Dobj":
              case "/tuio/25Dobj":
              case "/tuio/3Dobj":
                objectTypes[key](packet, packet.messages[message]);
                break;
              case "/tuio/2Dblb":
              case "/tuio/25Dblb":
              case "/tuio/3Dblb":
                blobTypes[key](packet, packet.messages[message]);
                break;
          }
        }
      }
    };

    Client.prototype.processCursorSource = function(packet, message){
      packet.source = message.address;
      if (this.cursors[packet.source] === undefined){
        this.cursors[packet.source] = {};
      }

      if (this.touches[packet.source] === undefined){
        this.touches[packet.source] = {};
      }
    };

    Client.prototype.processObjectSource = function(packet, message){
      packet.source = message.address;
      if (this.objects[packet.source] === undefined){
        this.objects[packet.source] = {};
      }

      if (this.touches[packet.source] === undefined){
        this.touches[packet.source] = {};
      }
    };

    Client.prototype.processBlobSource = function(packet, message){
      packet.source = message.address;
      if (this.blobs[packet.source] === undefined){
        this.blobs[packet.source] = {};
      }

      if (this.touches[packet.source] === undefined){
        this.touches[packet.source] = {};
      }
    };

    Client.prototype.processCursorAlive = function(packet, message){
      // Setup multiplexing namespacing if it doesn't already exist.
      // Also needs to be done in here because sometimes you don't get source
      // messages.
      if (this.cursors[packet.source] === undefined){
        this.cursors[packet.source] = {};
      }

      if (this.touches[packet.source] === undefined){
        this.touches[packet.source] = {};
      }

      // Remove the non-active cursors from the cursor namespace
      var activeCursors = _.map(message.sessionIds, function(id){ return id.toString(); });
      var notActiveCursors = _.difference(_.keys(this.cursors[packet.source]), activeCursors);

      for (var i = 0; i < notActiveCursors.length; i++){
        var key = notActiveCursors[i];
        var touch = this.touches[packet.source][key];

        if (touch !== undefined){
          delete this.touches[packet.source][key];
          delete this.cursors[packet.source][key];
          this.createTouchEvent('touchend', touch);
        }
      }
    };

    Client.prototype.processObjectAlive = function(packet, message){
      // Setup multiplexing namespacing if it doesn't already exist.
      // Also needs to be done in here because sometimes you don't get source
      // messages.
      if (this.objects[packet.source] === undefined){
        this.objects[packet.source] = {};
      }

      if (this.touches[packet.source] === undefined){
        this.touches[packet.source] = {};
      }

      // Remove the non-active objects from the object namespace
      var activeObjects = _.map(message.sessionIds, function(id){ return id.toString(); });
      var notActiveObjects = _.difference(_.keys(this.objects[packet.source]), activeObjects);

      for (var i = 0; i < notActiveObjects.length; i++){
        var key = notActiveObjects[i];
        var touch = this.touches[packet.source][key];

        if (touch !== undefined){
          delete this.touches[packet.source][key];
          delete this.objects[packet.source][key];
          this.createTouchEvent('touchend', touch);
        }
      }
    };

    Client.prototype.processBlobAlive = function(packet, message){
      // Setup multiplexing namespacing if it doesn't already exist.
      // Also needs to be done in here because sometimes you don't get source
      // messages.
      if (this.blobs[packet.source] === undefined){
        this.blobs[packet.source] = {};
      }

      if (this.touches[packet.source] === undefined){
        this.touches[packet.source] = {};
      }

      // Remove the non-active blobs from the blob namespace
      var activeBlobs = _.map(message.sessionIds, function(id){ return id.toString(); });
      var notActiveBlobs = _.difference(_.keys(this.blobs[packet.source]), activeBlobs);

      for (var i = 0; i < notActiveBlobs.length; i++){
        var key = notActiveBlobs[i];
        var touch = this.touches[packet.source][key];

        if (touch !== undefined){
          delete this.touches[packet.source][key];
          delete this.blobs[packet.source][key];
          this.createTouchEvent('touchend', touch);
        }
      }
    };

    Client.prototype.processCursorSet = function(packet, message){
      var cursor = new TuioCursor(message);
      var touch = cursor.coherceToTouch();
      var id = message.sessionId.toString();

      if (this.cursors[packet.source][id] !== undefined && this.cursors[packet.source][id].sessionId.toString() === id){

        // Existing cursor so we update it
        this.cursors[packet.source][id] = cursor;

        // Find existing touch in touches hash, replace it with the
        // updated touch and then create a 'touchmove' event
        if (this.touches[packet.source][id] !== undefined && this.touches[packet.source][id].identifier.toString() === id){
          this.touches[packet.source][id] = touch;
          this.createTouchEvent('touchmove', touch);
          // console.log('UPDATE', this.cursors, this.touches);

          return;
        }

        // Shouldn't really get here unless somebody removed the touch from
        // the touches hash without removing the cursor from cursors as well.
        return;
      }

      // New cursor
      this.cursors[packet.source][id] = cursor;
      this.touches[packet.source][id] = touch;

      this.createTouchEvent('touchstart', touch);
      // console.log('SET', this.cursors[packet.source], this.touches[packet.source]);
    };

    Client.prototype.processObjectSet = function(packet, message){
      var tuioObject;
      var touch;
      var id = message.sessionId.toString();

      if (this.objects[packet.source][id] !== undefined && this.objects[packet.source][id].sessionId.toString() === id){

        // Existing object so we update it
        this.objects[packet.source][id] = new TuioObject(message);

        // Find existing touch in touches hash, replace it with the
        // updated touch and then create a 'touchmove' event
        if (this.touches[packet.source][id] !== undefined && this.touches[packet.source][id].identifier.toString() === id){
          touch = this.objects[packet.source][id].coherceToTouch();
          this.touches[packet.source][id] = touch;
          this.createTouchEvent('touchmove', touch);
          // console.log('UPDATE', this.objects, this.touches);

          return;
        }

        // Shouldn't really get here unless somebody removed the touch from
        // the touches hash without removing the object from objects as well.
        return;
      }

      // New TUIO object
      tuioObject = new TuioObject(message);
      touch = tuioObject.coherceToTouch();

      this.objects[packet.source][id] = tuioObject;
      this.touches[packet.source][id] = touch;

      this.createTouchEvent('touchstart', touch);
      // console.log('SET', this.objects[packet.source], this.touches[packet.source]);
    };

    Client.prototype.processBlobSet = function(packet, message){
      var blob;
      var touch;
      var id = message.sessionId.toString();

      if (this.blobs[packet.source][id] !== undefined && this.blobs[packet.source][id].sessionId.toString() === id){

        // Existing blob so we update it
        this.blobs[packet.source][id] = new TuioBlob(message);

        // Find existing touch in touches hash, replace it with the
        // updated touch and then create a 'touchmove' event
        if (this.touches[packet.source][id] !== undefined && this.touches[packet.source][id].identifier.toString() === id){
          touch = this.blobs[packet.source][id].coherceToTouch();
          this.touches[packet.source][id] = touch;
          this.createTouchEvent('touchmove', touch);
          // console.log('UPDATE', this.blobs, this.touches);

          return;
        }

        // Shouldn't really get here unless somebody removed the touch from
        // the touches hash without removing the blob from blobs as well.
        return;
      }

      // New blob
      blob = new TuioBlob(message);
      touch = blob.coherceToTouch();

      this.blobs[packet.source][id] = blob;
      this.touches[packet.source][id] = touch;

      this.createTouchEvent('touchstart', touch);
      // console.log('SET', this.blobs[packet.source], this.touches[packet.source]);
    };

    Client.prototype.processFseq = function(packet, message){
      // TODO: Figure out what to do with fseq messages.
    };

    Client.prototype.getCursor = function(sessionID){
      return this.cursors[sessionId];
    };

    Client.prototype.getObject = function(sessionId){
      return this.objects[sessionId];
    };

    Client.prototype.getBlob = function(sessionId){
      return this.blobs[sessionId];
    };

    Client.prototype.getCursors = function(){
      return this.cursors;
    };

    Client.prototype.getObjects = function(){
      return this.objects;
    };

    Client.prototype.getBlobs = function(){
      return this.blobs;
    };

    // Create our custom TouchEvent
    Client.prototype.createTouchEvent = function(type, touch){

      // Get all currently active touches so they can be attached
      // to the touchEvent
      var touches = [];

      // Convert touches hash to array because that's what W3C says
      // it should be.
      // TODO: Find a better way! This is super efficient, NOT!
      for (var namespace in this.touches){
        for (var key in this.touches[namespace]){
          touches.push(this.touches[namespace][key]);
        }
      }

      // Get the touches that started on the attribute so they can
      // be attached to the touchEvent
      var targetTouches = touch.getTargetTouches();

      // Get the touches that contributed to the event so they can
      // be attached to the touchEvent
      var changedTouches = document.createTouchList([touch]);

      // This is used in place of document.createEvent('TouchEvent');
      // because almost all browsers except for Firefox at the moment
      // do not support it.
      var touchEvent = document.createEvent('UIEvent');

      switch(type){
        // Init as canBubble and is cancelable
        case 'touchstart':
        case 'touchend':
        case 'touchmove':
          touchEvent.initUIEvent(type || "", true, true, touch.view || null, 0);
          break;
        // Init as not cancelable
        case 'touchcancel':
          touchEvent.initUIEvent(type || "", true, false, touch.view || null, 0);
          break;
        // Init as cannot bubble
        case 'touchenter':
        case 'touchleave':
          touchEvent.initUIEvent(type || "", false, true, touch.view || null, 0);
          break;
      }

      touchEvent.initTouchEvent(touches, targetTouches, changedTouches, type, window, touch.screenX, touch.screenY, touch.clientX, touch.clientY, touchEvent.ctrlKey, touchEvent.altKey, touchEvent.shiftKey, touchEvent.metaKey);

      // Dispatch the event
      if (touch.target) {
        touch.target.dispatchEvent(touchEvent);
      }
      else {
        var val = document.dispatchEvent(touchEvent);
      }
    };

    /**
     * A TUIO Cursor Object
     */
    var TuioCursor = Caress.TuioCursor = function TuioCursor(options){
      for (var key in options){
        this[key] = options[key];
      }
    };

    TuioCursor.prototype.coherceToTouch = function() {
      var identifier = this.sessionId;

      //TODO: Verify? I think these are correct but not 100% sure
      var clientX = window.innerWidth * this.xPosition;
      var clientY = window.innerHeight * this.yPosition;
      var pageX = document.documentElement.clientWidth * this.xPosition;
      var pageY = document.documentElement.clientHeight * this.yPosition;
      var target = document.elementFromPoint(pageX, pageY);
      var screenX = screen.width * this.xPosition;
      var screenY = screen.height * this.yPosition;
      var radiusX = this.radius;
      var radiusY = this.radius;
      var rotationAngle = this.rotationAngle;
      var force = this.force;

      return document.createTouch(target, identifier, clientX, clientY, pageX, pageY, screenX, screenY, radiusX, radiusY, rotationAngle, force);
    };

    /**
     * A TUIO Object Object (an Object Object? whaaat?)
     */
    var TuioObject = Caress.TuioObject = function TuioObject(options){
      for (var key in options){
        this[key] = options[key];
      }
    };

    TuioObject.prototype.coherceToTouch = function() {
      var identifier = this.sessionId;

      var clientX = window.innerWidth * this.xPosition;
      var clientY = window.innerHeight * this.yPosition;
      var pageX = document.documentElement.clientWidth * this.xPosition;
      var pageY = document.documentElement.clientHeight * this.yPosition;
      var target = document.elementFromPoint(pageX, pageY);
      var screenX = screen.width * this.xPosition;
      var screenY = screen.height * this.yPosition;
      var radiusX = this.radius;
      var radiusY = this.radius;
      var rotationAngle = this.rotationAngle;
      var force = this.force;

      return document.createTouch(target, identifier, clientX, clientY, pageX, pageY, screenX, screenY, radiusX, radiusY, rotationAngle, force);
    };

    /**
     * A TUIO Blob Object
     */
    var TuioBlob = Caress.TuioBlob = function TuioBlob(options){
      for (var key in options){
        this[key] = options[key];
      }
    };

    TuioBlob.prototype.coherceToTouch = function() {
      var identifier = this.sessionId;

      //TODO: Verify? I think these are correct but not 100% sure
      var clientX = window.innerWidth * this.xPosition;
      var clientY = window.innerHeight * this.yPosition;
      var pageX = document.documentElement.clientWidth * this.xPosition;
      var pageY = document.documentElement.clientHeight * this.yPosition;
      var target = document.elementFromPoint(pageX, pageY);
      var screenX = screen.width * this.xPosition;
      var screenY = screen.height * this.yPosition;
      var radiusX = this.radius;
      var radiusY = this.radius;
      var rotationAngle = this.rotationAngle;
      var force = this.force;

      return document.createTouch(target, identifier, clientX, clientY, pageX, pageY, screenX, screenY, radiusX, radiusY, rotationAngle, force);
    };

    /**
     * A W3C Touch Object
     * http://dvcs.w3.org/hg/webevents/raw-file/tip/touchevents.html#touch-interface
     */
    var Touch = Caress.Touch = function Touch(target, identifier, clientX, clientY, pageX, pageY, screenX, screenY, radiusX, radiusY, rotationAngle, force){
      // TODO: Still need to type check the input parameters
      // if ( view === null || view === undefined || target === null || target === undefined || identifier === null || identifier === undefined || pageX === null || pageX === undefined || pageY === null || pageY === undefined || screenX === null || screenX === undefined || screenY === null || screenY === undefined){
      //   return undefined;
      // }

      this.identifier = identifier;
      this.target = target;
      this.screenX = screenX;
      this.screenY = screenY;
      this.clientX = clientX;
      this.clientY = clientY;
      this.pageX = pageX;
      this.pageY = pageY;
      this.radiusX = radiusX;
      this.radiusY = radiusY;
      this.rotationAngle = rotationAngle;
      this.force = force;

      return this;
    };

    Touch.prototype.getTargetTouches = function() {
      var targetTouches = document.createTouchList();

      for (var namespace in window.client.touches) {
        for (var key in window.client.touches[namespace]){
          var touch = window.client.touches[namespace][key];

          if (touch.target == this.target) {
            targetTouches.push(touch);
          }
        }
      }

      return targetTouches;
    };

    /**
     * A W3C TouchList Object
     * http://dvcs.w3.org/hg/webevents/raw-file/tip/touchevents.html#touchlist-interface
     */
    var TouchList = Caress.TouchList = function TouchList(){
      // TODO: Maybe should check to make sure that only Touch objects are being passed in
      var args = [].slice.call( arguments );
      var length = args.length;
      var i = 0;

      this.length = length;

      for ( ; i < length; i++ ) {
          this[ i ] = args[ i ];
      }

      return this;
    };

    TouchList.prototype = [];

    TouchList.prototype.identifiedTouch = function(identifier){

      for (var i = 0; i < this.length; i++){
        if (this[i].identifier === identifier) return this[i];
      }

      return undefined;
    };

    TouchList.prototype.item = function(index){
      return this[index];
    };


    /**
     * A W3C TouchEvent Object
     * http://dvcs.w3.org/hg/webevents/raw-file/tip/touchevents.html#touchevent-interface
     */
    var TouchEvent = Caress.TouchEvent = function TouchEvent(){
      this.touches = document.createTouchList(); // a TouchList
      this.targetTouches = document.createTouchList(); // a TouchList
      this.changedTouches = document.createTouchList(); // a TouchList
      this.altKey = false;
      this.metaKey = false;
      this.ctrlKey = false;
      this.shiftKey = false;
      this.relatedTarget = null; // an EventTarget - used for touchenter and touchleave events
    };

    // TouchEvent.prototype = document.createEvent('UIEvent');
    TouchEvent.prototype = UIEvent.prototype;

    TouchEvent.prototype.initTouchEvent = function(touches, targetTouches, changedTouches, type, view, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey) {
      this.touches = touches || document.createTouchList(); // a TouchList
      this.targetTouches = targetTouches || document.createTouchList(); // a TouchList
      this.changedTouches = changedTouches || document.createTouchList(); // a TouchList
      this.screenX = screenX || null;
      this.screenY = screenY || null;
      this.clientX = clientX || null;
      this.clientY = clientY || null;
      this.altKey = altKey || false;
      this.metaKey = metaKey || false;
      this.ctrlKey = ctrlKey || false;
      this.shiftKey = shiftKey || false;
      this.relatedTarget = null; // an EventTarget - used for touchenter and touchleave events

      // TODO: Look at maybe adding isTrusted = true;
    };

    TouchEvent.prototype.isTouchEvent = function() {
      return true;
    };


    /**********************************************************************************************
     * DOM FUNCTIONS
     **********************************************************************************************/

    /**
     * A W3C Document Interface Extensions
     * http://dvcs.w3.org/hg/webevents/raw-file/tip/touchevents.html#extensions-to-the-document-interface
     */

    document.createTouch = function(view, target, identifier, pageX, pageY, screenX, screenY, radiusX, radiusY, rotationAngle, force){
      return new Touch(view, target, identifier, pageX, pageY, screenX, screenY, radiusX, radiusY, rotationAngle, force);
    };

    document.createTouchList = function(touches){
      // TODO: Maybe should check to make sure that only Touch objects are being passed in
      var touchList = new TouchList();

      // return TouchList with multiple touches
      if (_.isArray(touches) && touches.length){
        for (var i = 0; i < touches.length; i++){
          touchList.push(touches[i]);
        }

        return touchList;
      }
      // return TouchList with a single touch
      else if (!_.isArray(touches) && touches !== undefined) {
        touchList.push(touches);
        return touchList;
      }

      // return an empty TouchList
      return touchList;
    };

    /*
    * Commence Dirty Hacks for typical touch detection
    *
    * You SHOULD NOT use ontouchstart, ontouchend, ontouchmove to bind for touch events!
    * That shit is attributed to old balls DOM 2 spec anyway. Instead use:
    *
    *    addEventListener( 'touchstart', function(evt){...})
    *
    *    or
    *
    *    jQuery's $.on('touchstart', function) or $.bind('touchstart', function)
    *
    * TODO: Figure out how to actually implement this is JavaScript. Not sure how these
    * functions get called when a 'touchstart' event is dispatched. Might only be possible
    * to do this in native browser code. Plus it is old DOM 2 spec so maybe I shouldn't bother,
    * unless I want to support old shitty browsers (ie5, ie6, ie7, ie8).
    *
    * Maybe look into:
    * http://www.w3.org/TR/DOM-Level-2-Events/
    * http://www.w3.org/TR/DOM-Level-3-Events/
    */

    window.ontouchstart = document.ontouchstart = null;
    window.ontouchend = document.ontouchend = null;
    window.ontouchmove = document.ontouchmove = null;
    window.ontouchcancel = document.ontouchcancel = null;
    window.ontouchenter = document.ontouchenter = null;
    window.ontouchleave = document.ontouchleave = null;


    // Return the Caress module API
    return Caress;
  });
})('Caress');