/*
 * Lipsum
 * Create random lipsum words, sentences or paragraphs
 * First & second arguments defines a range, f.ex Lipsum.word(2,6) returns minimum 2 and maximum 6 words.
 */

!function(a,i,n,o){o=i.length&&typeof require=="function"?function(e,t,n){n=[];for(t=0;t<i.length;t++){n.push(require(i[t].toLowerCase()))}return e.apply(null,n)}(n):n.apply(this,i.map(function(j){return this[j]},this));if(typeof module=="object"){module.exports=o}else if(typeof define=="function"){define(i,n)}else{this[a]=o}}.call
(this, 'Lipsum', [], function() {

  var words = 'lorem ipsum dolor sit amet consectetur adipiscing elit ut eget turpis dolor id elementum urna sed arcu magna accumsan volutpat tristique eu rhoncus at lectus quisque lacus ante semper in feugiat vitae commodo non mauris quisque vel sem sem maecenas pellentesque ultrices tristique fusce nibh enim porta in convallis id consequat quis purus fusce iaculis enim id mauris mollis id accumsan ipsum sagittis quisque in pharetra magna integer a mattis mauris nulla condimentum molestie massa a malesuada diam rutrum vel suspendisse fermentum lacus id erat volutpat cursus donec at felis ante eget cursus risus nunc in odio nec mi gravida rutrum nec pulvinar turpis quisque id tellus sem nunc sed dui quis mi tristique viverra'.split(' ')
  var endings = "................................??!"

  var rand = function( len ) {
    return Math.floor( Math.random() * len )
  }
  var range = function( min, max ) {
    return rand( max - min + 1 ) + min
  }
  var capitalize = function( word ) {
    return word.substr(0,1).toUpperCase() + word.substr(1)
  }
  var word = function() {
    return words[rand(words.length)]
  }
  var ending = function() {
    var i = rand(endings.length)
    return endings.substring(i, i+1)
  }

  return {

    words: function( min, max, cap ) {
      min = min || 1

      if ( min < 1 )
        return ''

      if ( max === true ) {
        cap = true
        max = undefined
      }
      if ( typeof max == 'number' )
        min = range(min, max)

      var text = cap ? capitalize(word()) : word()

      while( min-- )
        text += word() + ' '

      return text.replace(/^\s+|\s+$/g, '')
    },

    sentences: function( min, max ) {
      min = min || 8

      if ( min < 1 )
        return ''

      if ( typeof max == 'number' )
        min = range(min, max)

      var text = capitalize( word() )
      var comma = rand(2) ? rand( min-1 ) : false

      while( min-- )
        text += word() + (( comma && comma === min ) ? ', ' : ' ')

      return text.replace(/\s+/,' ').substr(0, text.length-2) + '.'
    },

    paragraphs: function( min, max ) {
      min = min || 40
      if ( min < 1 )
        return ''

      if ( min < 8 )
        return this.sentences( min )

      if ( typeof max == 'number' )
        min = range(min, max)

      var sentences = Math.floor(min/8)
      var rest = min - (sentences * 8)
      var text = ''

      while( sentences-- )
        text += this.sentences( 8 ) + ' '

      if ( rest )
        return text + this.sentences(rest)
      else
        return text.substr(0, text.length-2)
    }
  }
})

