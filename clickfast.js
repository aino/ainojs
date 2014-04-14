/*
 * ClickFast
 */

!function(a,i,n,o){o=i.length&&typeof require=="function"?function(e,t,n){n=[];for(t=0;t<i.length;t++){n.push(require(i[t].toLowerCase()))}return e.apply(null,n)}(n):n.apply(this,i.map(function(j){return this[j]},this));if(typeof module=="object"){module.exports=o}else if(typeof define=="function"){define(i,n)}else{this[a]=o}}.call
(this, 'ClickFast', ['jQuery'], function($) {

  return {
    propagate: true,
    add: function(handleObj) {
      
      var prop = this.propagate
      var $this = $(this)
      var timer
      
      var cargs = ['click.fast', handleObj.handler]
      if ( handleObj.selector )
        cargs.splice(1, 0, handleObj.selector)

      $this.on.apply($this, cargs)

      var targs = ['touchstart.fast', function start(e) {
        var target = this
        var ev = e.originalEvent
        var x
        var y
        var dist = 0
        $this.off.apply($this, cargs)
        clearTimeout(timer)
        if ( ev.touches.length == 1 ) {
          x = ev.touches[0].pageX
          y = ev.touches[0].pageY
          $this.on('touchmove.fast', function(f) {
            var ft = f.originalEvent.touches
            if ( ft.length == 1 )
              dist = Math.max( Math.abs( x - ft[0].pageX ), Math.abs( y - ft[0].pageY ) )
          })
          $this.on('touchend.fast', function() {
            timer = setTimeout(function() {
              $this.on.apply($this, cargs)
            }, 800)
            if( dist > 4 )
              return $this.off('touchend.fast touchmove.fast')
            handleObj.handler.call(target, e)
            $this.off('touchend.fast touchmove.fast')
          })
        }
      }]

      if ( handleObj.selector )
        targs.splice(1, 0, handleObj.selector)

      console.log(targs)

      $this.on.apply($this, targs)

    },
    remove: function(handleObj) {
      $(this).off('touchstart.fast touchmove.fast touchend.fast click.fast')
    }
  }
})