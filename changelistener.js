/*
 * ChangeListener
 * 
 */

!function(a,i,n,o){o=i.length&&typeof require=="function"?function(e,t,n){n=[];for(t=0;t<i.length;t++){n.push(require(i[t]))}return e.apply(null,n)}(n):n();if(typeof module=="object"){module.exports=o}else if(typeof define=="function"){define(i,n)}else{this[a]=o}}.call
(this, 'ChangeListener', ['jquery'], function($) {

  return function( node, onChange, getValue ) {

    var $node = $(node)

    getValue = getValue || function() {
      return $node.val()
    }

    if ( $node.data('ch_loop') ) 
      return

    $node.data('ch_loop', function() {
      var value = getValue.call(node)
      if ( !$node.data('ch_cache') ) {
        $node.data('ch_cache', value)
      }
      if ( $node.data('ch_cache').toLowerCase() !== value.toLowerCase() ) {
        $node.data('ch_cache', value)
        onChange(value)
      }
    })

    $node.on('focus', function() {
      $node.data('ch_interval', window.setInterval($node.data('ch_loop'), 20))
    }).on('blur', function() {
      window.clearInterval( $node.data('ch_interval') )
    })
  }
})