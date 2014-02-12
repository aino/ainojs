/*
 * Masonry
 * Lightweight masonry script
 */

!function(a,i,n,o){o=i.length&&typeof require=="function"?function(e,t,n){n=[];for(t=0;t<i.length;t++){n.push(require(i[t]))}return e.apply(null,n)}(n):n();if(typeof module=="object"){module.exports=o}else if(typeof define=="function"){define(i,n)}else{this[a]=o}}.call
(this, 'Masonry', ['jquery'], function($) {

  return function(elem, options) {

    options = $.extend({
        width: null,
        gutter: null,
        onbrick: $.noop
    }, options )

    var $elem = $(elem)

    if ( $elem.data('masonry') ) 
      return $elem.data('masonry')

    var layout = function() {
        
      var $bricks = $elem.children()
      var width = $elem.width()
      var brickWidth = options.width || $bricks.eq(0).outerWidth()
      var gutter = options.gutter || $bricks.eq(0).outerWidth(true) - brickWidth
      var colCount = Math.floor( width / (brickWidth+gutter) )
      var colHeight = []
      var i = 0
      var thisCol
      var mH
      var css = {
        'float': 'none',
        'position': 'absolute',
        'display': /^(?!.*chrome).*safari/i.test(navigator.userAgent) ? 'inline-block' : 'block'
      }
      
      if ( !$bricks.length )
        return
        
      for ( ; i < colCount; i++ )
        colHeight[ i ] = 0

      $elem.css( 'position', 'relative' )
      $bricks.css( css ).each( function( j, brick ) {

        var $brick = $( brick )

        for ( i = colCount-1; i > -1; i-- ) {
          if ( colHeight[ i ] === Math.min.apply( Math, colHeight ) )
            thisCol = i;
        }

        var sz = {
          top: colHeight[ thisCol ],
          left: (brickWidth+gutter) * thisCol
        }

        if ( typeof sz.top !== 'number' || typeof sz.left !== 'number' )
          return

        sz.top = Math.round(sz.top)
        sz.left = Math.round(sz.left)
        
        $brick.css( sz )
        options.onbrick.call( brick )
        
        colHeight[ thisCol ] += $brick.outerHeight( true )
        
      })
      
      mH = Math.max.apply( Math, colHeight )
      if (mH < 0 || typeof mH !== 'number')
        return
        
      $elem.height( Math.ceil(mH) )
    }

    var refresh = function(elem) {
      if ( elem && !$(elem).data('masonry') ) {
        $elem = $(elem).data('masonry', true)
      }
      layout()
    }

    var api = {
      layout: layout,
      options: options,
      element: elem,
      refresh: refresh
    }

    $elem.data('api', api)
    return api
  }
})