/*
 * Detect
 * Detects various browser features and vendors
 */

!function(a,i,n,o){o=i.length&&typeof require=="function"?function(e,t,n){n=[];for(t=0;t<i.length;t++){n.push(require(i[t]))}return e.apply(null,n)}(n):n();if(typeof module=="object"){module.exports=o}else if(typeof define=="function"){define(i,n)}else{this[a]=o}}.call
(this, 'Detect', [], function() {

  return {

    touch: !!('ontouchstart' in document),

    canvas: !!( 'getContext' in document.createElement('canvas') ),

    ie: (function() {

      var v = 3
      var div = document.createElement( 'div' )
      var all = div.getElementsByTagName( 'i' )

      do
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->'
      while 
        (all[0])
      return v > 4 ? v : document.documentMode

    }()),

    iphone: isWebkit && /iPhone/.test( platform ),
    ipad:   isWebkit && /iPad/.test( platform ),
    ipod:   isWebkit && /iPod/.test( platform ),
    ios:    isWebkit && /iPhone|iPad|iPod/.test( platform ),
    safari: !!(/safari/.test(ua) && !(/chrome/.test(ua))),
    chrome: /chrome/.test(ua),

    mac: platform.toUpperCase().indexOf('MAC') >= 0,
    
    translate3d: (function() {
      var el = document.createElement('p')
      var has3d
      var transforms = {
          'webkitTransform':'-webkit-transform',
          'OTransform':'-o-transform',
          'msTransform':'-ms-transform',
          'MozTransform':'-moz-transform',
          'transform':'transform'
      }

      document.documentElement.insertBefore(el, null)

      for (var t in transforms) {
        if ( typeof el.style[t] != 'undefined' ) {
          el.style[t] = 'translate3d(1px,1px,1px)'
          has3d = window.getComputedStyle(el).getPropertyValue(transforms[t])
        }
      }

      document.documentElement.removeChild(el)
      return (has3d !== undefined && has3d.length > 0 && has3d !== "none")
    }())
  }
})