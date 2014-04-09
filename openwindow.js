/*
 * OpenWindow
 * Opens a new browser window popup based on options and closes it when it looses focus, just like a modal
 * Useful for f.ex facebook share/login
 * Callbacks: onclose, onopen, onfail
 * Use only on interaction events (f.ex click) or else the browser will block it as a popup
 */

!function(a,i,n,o){o=i.length&&typeof require=="function"?function(e,t,n){n=[];for(t=0;t<i.length;t++){n.push(require(i[t]))}return e.apply(null,n)}(n):n.apply(this,i.map(function(j){return this[j]},this));if(typeof module=="object"){module.exports=o}else if(typeof define=="function"){define(i,n)}else{this[a]=o}}.call
(this, 'OpenWindow', [], function() {
  
  return function(url, options) {

    var left = window.screenX || window.screenLeft || 0
    var top  = window.screenY || window.screenTop || 0
    var width = window.innerWidth
    var height = window.innerHeight
    var F = function(){}
  
    var defaults = {
      left: null,
      top: null,
      width: 800,
      height: 500,
      menubar: 'no',
      scrollbars: 'yes',
      status: 'no',
      location: 'no',
      resizable: 'yes',
      title: '_blank',
      onclose: F,
      onopen: F,
      onfail: F
    }
  
    for( var i in defaults ) {
      if ( !options.hasOwnProperty(i) )
        options[ i ] = defaults[ i ]
    }
  
    options.left = Math.round( options.left === null ? left + width/2 - options.width/2 : left + options.left )
    options.top  = Math.round( options.top === null ? top + height/2 - options.height/2 : top + options.top )
  
    var opt = []

    for( var key in options ) {
      if ( key != 'onclose' && key != 'title' ) {
        opt.push(key + '=' + options[key] )
      }
    }
  
    var joined = opt.join(',')

    try {
      var win = window.open(url, options.title, joined)
      win.focus()
      setTimeout(function() {
        options.onopen()
        window.onfocus = function() {
          options.onclose()
          win.close()
          window.onfocus = null
        }
      },4)
    } catch(e) {
      options.onfail()
    }
  }
})