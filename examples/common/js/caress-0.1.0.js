/*! caress-client - v0.1.0 - 2012-10-17
* https://github.com/ekryski/caress-client
* Copyright (c) 2012 Eric Kryski; Licensed  */

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
      _.bindAll(this, 'connect', 'onConnect', 'onDisconnect', 'processPacket', 'processMessage', 'processSource', 'processAlive', 'processSet', 'processFseq');
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
      var profiles = {
        // '/tuio/2Dobj': this.process2dObjectMessage,
        '/tuio/2Dcur': this.process2dCursorMessage
        // '/tuio/2Dblb': this.process2dBlobMessage
        // '/tuio/25Dobj': this.process25dObjectMessage(message),
        // '/tuio/25Dcur': this.process25dCursorMessage(message),
        // '/tuio/25Dblb': this.process25dBlobMessage(message),
        // '/tuio/3Dobj': this.process3dObjectMessage(message),
        // '/tuio/3Dcur': this.process3dCursorMessage(message),
        // '/tuio/3Dblb': this.process3dBlobMessage(message)
      };

      var types = {
        'source': this.processSource,
        'alive': this.processAlive,
        'set': this.processSet,
        'fseq': this.processFseq
      };

      // console.log('PACKET', packet);

      // Ignore duplicate packets for now
      if (!packet.duplicate){

        // Default all the sources to localhost in assuming that if
        // we don't have an address then it is from localhost. Maybe
        // this is a bad assumption to make. We also override this if
        // a source was actually provided
        packet.source = 'localhost';

        for (var message in packet.messages) {
          var key = packet.messages[message].type;
          types[key](packet, packet.messages[message]);
        }
      }
    };

    Client.prototype.processSource = function(packet, message){
      packet.source = message.address;
      if (this.cursors[packet.source] === undefined){
        this.cursors[packet.source] = {};
      }

      if (this.touches[packet.source] === undefined){
        this.touches[packet.source] = {};
      }
    };

    Client.prototype.processAlive = function(packet, message){
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
          this.createTouchEvent('touchend', touch);
        }

        delete this.touches[packet.source][key];
        delete this.cursors[packet.source][key];
      }
    };

    Client.prototype.processSet = function(packet, message){
      var cursor;
      var touch;
      var id = message.sessionId.toString();

      if (this.cursors[packet.source][id] !== undefined && this.cursors[packet.source][id].sessionId.toString() === id){

        // Existing cursor so we update it
        this.cursors[packet.source][id] = new TuioCursor(message);

        // Find existing touch in touches hash, replace it with the
        // updated touch and then create a 'touchmove' event
        if (this.touches[packet.source][id] !== undefined && this.touches[packet.source][id].identifier.toString() === id){
          touch = this.cursors[packet.source][id].coherceToTouch();
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
      cursor = new TuioCursor(message);
      touch = cursor.coherceToTouch();

      this.cursors[packet.source][id] = cursor;
      this.touches[packet.source][id] = touch;

      this.createTouchEvent('touchstart', touch);
      // console.log('SET', this.cursors[packet.source], this.touches[packet.source]);
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
      touchEvent.initUIEvent(type || "", true, true, touch.view || null, 0);
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
    var TuioObject = Caress.TuioObject = {

    };

    /**
     * A TUIO Blob Object
     */
    var TuioBlob = Caress.TuioBlob = {

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