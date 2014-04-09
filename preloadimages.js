/*
 * PreloadImages
 * Preloads images with progress and complete callbacks
 */

!function(a,i,n,o){o=i.length&&typeof require=="function"?function(e,t,n){n=[];for(t=0;t<i.length;t++){n.push(require(i[t]))}return e.apply(null,n)}(n):n.apply(this,i.map(function(j){return this[j]},this));if(typeof module=="object"){module.exports=o}else if(typeof define=="function"){define(i,n)}else{this[a]=o}}.call
(this, 'PreloadImages', ['jQuery'], function($) {

  return function(images, callback, progress, error) {

    var loaded = 0
    var len = images.length

    if (!len)
      $.isFunction(callback) && callback()

    $.each(images, function(i, src) {
      $('<img>').data('index', i).load(function(e) {
        loaded++
        if ( typeof progress == 'function' ) {
          progress(loaded, len)
        }
        if (loaded == len && $.isFunction(callback)) {
          callback.call(this)
        }
      }).error(function() {
        $(this).trigger('load')
        $.isFunction(error) && error.call(this, $(this).data('index'))
      }).attr('src', src)
    })
  }
  
})