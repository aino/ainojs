/*
 * PreloadImages
 * Preloads images with progress and complete callbacks
 */

module.exports = function(images, callback, progress, error) {

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