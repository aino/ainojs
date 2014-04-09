/*
 * ClickFast
 */

!function(a,i,n,o){o=i.length&&typeof require=="function"?function(e,t,n){n=[];for(t=0;t<i.length;t++){n.push(require(i[t].toLowerCase()))}return e.apply(null,n)}(n):n.apply(this,i.map(function(j){return this[j]},this));if(typeof module=="object"){module.exports=o}else if(typeof define=="function"){define(i,n)}else{this[a]=o}}.call
(this, 'ClickFast', ['jQuery'], function($) {

  var support = 'ontouchstart' in document

  return {
    propagate: true,
    add: function(handleObj) {
      var prop = this.propagate
      if ( support ) {
        $(this).on('touchstart.fast', function start(e) {
          var ev = e.originalEvent
          var x
          var y
          var dist = 0
          if ( ev.touches.length == 1 ) {
            x = ev.touches[0].pageX
            y = ev.touches[0].pageY
            $(this).on('touchmove.fast', function(f) {
              var ft = f.originalEvent.touches
              if ( ft.length == 1 )
                dist = M.max( M.abs( x - ft[0].pageX ), M.abs( y - ft[0].pageY ) )
            })
            $(this).on('touchend.fast', function() {
              if( dist > 4 )
                return $(this).off('touchend.fast touchmove.fast')

              handleObj.handler.call(this, e)
              $(this).off('touchend.fast touchmove.fast')
            })
          }
        })
      } else {
        $(this).on('click.fast', handleObj.handler)
      }
    },
    remove: function(handleObj) {
      if ( support )
        $(this).off('touchstart.fast touchmove.fast touchend.fast')
      else
        $(this).off('click.fast', handleObj.handler)
    }
  }
})