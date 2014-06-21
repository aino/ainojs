/** @jsx React.DOM */

var React = require('react')
var Animate = require('../animate')
var Easing = require('../easing')
var $ = require('jquery')

var App = React.createClass({
  getInitialState: function() {
    return { left: 0 }
  },
  onStart: function() {
    this.animation = Animate({
      from: 0,
      to: 600,
      duration: 1000,
      easing: Easing('easeOutBounce'),
      step: function(val) {
        this.setState({ left: val })
      }.bind(this)
    })
  },
  render: function() {
    var style = {
      width: 100,
      height: 100,
      background: '#e22',
      position: 'absolute',
      top: 100,
      left: this.state.left
    }
    return (
      <div>
        <button onClick={this.onStart}>Start</button>
        <div style={style} />
      </div>
    )
  }
})

React.renderComponent(App(), document.body)