/*
 * Globals
 *
 */

!function(a,i,n,o){o=i.length&&typeof require=="function"?function(e,t,n){n=[];for(t=0;t<i.length;t++){n.push(require(i[t]))}return e.apply(null,n)}(n):n();if(typeof module=="object"){module.exports=o}else if(typeof define=="function"){define(i,n)}else{this[a]=o}}.call
(this, 'Globals', [], function() {

  var globals = {}
  var handlers = []
  var has = function(prop) {
    return globals.hasOwnProperty(prop)
  }
  var trigger = function(prop, value) {
    handlers.forEach(function(handleObj) {
      if (handleObj.prop === prop)
        handleObj.handler.call(handleObj.context, value)
    })
  }

  return function() {

    return {

    register: function(prop, value) {
      if ( !has(prop) )
        globals[prop] = value
    },

    set: function(prop, value) {
      if ( has(prop) ) {
        globals[prop] = value
        trigger(prop, value)
      }
    },

    get: function(prop) {
      if ( has(prop) )
        return globals[prop]
    },

    on: function(prop, handler, context) {
      handlers.push({
        prop: prop,
        handler: handler,
        context: context || this
      })
    },

    off: function(prop, handler) {
      if ( !prop )
        return handlers = []
      handlers.slice(0).forEach(function(handleObj, i) {
        if ( prop === handleObj.prop && ( !handler || handler === handleObj.handler ) )
          handlers.splice(i, 1)
      })
    }
  }
})