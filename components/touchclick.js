/*
 * TouchClick
 * Normalize and optimize touch events as clicks without delay
 * Also provides optimized "down" and "up" callbacks for active states
 */

var React = require('react')

module.exports = React.createClass({

  propTypes: {
    click: React.PropTypes.func,
    up: React.PropTypes.func,
    down: React.PropTypes.func,
    nodeName: React.PropTypes.string,
    className: React.PropTypes.string
  },

  timer: null,

  defaults: {
    touched: false,
    touchdown: false,
    coords: { x:0, y:0 },
    evObj: {}
  },

  getInitialState: function() {
    return this.defaults
  },

  trigger: function(type, ev) {
    typeof this.props[type] == 'function' && this.props[type].call(this, ev)
  },

  getCoords: function(e) {
    if ( e.touches && e.touches.length ) {
      var touch = e.touches[0]
      return {
        x: touch.pageX,
        y: touch.pageY
      }
    }
  },

  onTouchStart: function(e) {
    clearTimeout(this.timer)
    this.setState({
      touched: true, 
      touchdown: true,
      coords: this.getCoords(e),
      evObj: e
    })
    this.trigger('down', e)
  },

  onTouchMove: function(e) {
    var coords = this.getCoords(e)
    var distance = Math.max( 
      Math.abs(this.state.coords.x - coords.x), 
      Math.abs(this.state.coords.y - coords.y) 
    )
    if ( distance > 6 ) {
      this.state.touchdown && this.trigger('up', e)
      this.setState({ touchdown: false })
    }
  },

  onTouchEnd: function(e) {
    if(this.state.touchdown) {
      this.trigger('up', this.state.evObj)
      this.trigger('click', this.state.evObj)
    }
    this.timer = setTimeout(function() {
      if ( this.isMounted() )
        this.setState(this.defaults)
    }.bind(this), 400)
  },

  onClick: function(e) {
    if ( this.state.touched )
      return false
    this.setState(this.defaults)
    this.trigger('click', e)
  },

  on: function(type, fn) {
    var d = document
    if ( d.addEventListener )
      return d.addEventListener(type, fn)
    else if ( d.attachEvent )
      return d.attachEvent('on'+type, fn)
  },

  off: function(type, fn) {
    var d = document
    if ( d.removeEventListener )
      return d.removeEventListener(type, fn)
    else if ( d.detachEvent )
      return d.detachEvent('on'+type, fn)
  },

  onMouseDown: function(e) {
    if( this.state.touched )
      return false
    this.trigger('down', e)
    var forget = function(){}
    var c = {}
    for( var i in e )
      c[i] = e[i]

    var onMove = function(m) {
      c.type = 'mousemove'
      if ( m.target != e.currentTarget && !c.currentTarget.contains(m.target) ) {
        this.trigger('up', c)
        forget()
      }
    }.bind(this)

    var onDragLeave = function(m) {
      c.type = 'drag'
      if ( m.target == c.currentTarget ) {
        this.trigger('up', c)
        forget()
      }
    }.bind(this)

    var onMouseUp = function(m) {
      this.trigger('up', m)
      forget()
    }.bind(this)

    forget = function() {
      this.off('mousemove', onMove)
      this.off('dragleave', onDragLeave)
      this.off('mouseup', onMouseUp)
    }.bind(this)

    this.on('mousemove', onMove)
    this.on('dragleave', onDragLeave)
    this.on('mouseup', onMouseUp)

  },

  onDragLeave: function(e) {
    console.log(e.target)
  },

  render: function() {
    var classNames = ['touchclick']
    this.props.className && classNames.push(this.props.className)

    return React.DOM[this.props.nodeName || 'div']({
      className: classNames.join(' '),
      onTouchStart: this.onTouchStart,
      onTouchMove: this.onTouchMove,
      onTouchEnd: this.onTouchEnd,
      onClick: this.onClick,
      onMouseDown: this.onMouseDown
    }, this.props.children)
  }
})