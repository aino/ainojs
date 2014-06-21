/** @jsx React.DOM */

var React = require('react')
var Animate = require('../animate')
var Easing = require('../easing')

var App = React.createClass({
  getInitialState: function() {
    return { height: 0, isOpening: false }
  },
  open: function() {
    this.animation = Animate({
      from: 0,
      to: 400,
      duration: 2000,
      easing: Easing('easeOutQuint'),
      step: function(val) {
        this.setState({ height: val })
      }.bind(this),
      complete: function() {
        this.setState({ isOpening: false })
      }.bind(this)
    })
    this.setState({
      isOpening: true
    })
  },
  stop: function() {
    this.animation.stop(true)
    this.setState({ isOpening: false })
  },
  render: function() {
    var style = {
      width: 500,
      height: this.state.height,
      background: '#222',
      position: 'absolute',
      top: 100
    }
    var btn = this.state.isOpening ?
      <button onClick={this.stop}>Stop</button> :
      <button onClick={this.open}>Open</button>
    return (
      <div>
        {btn}
        <div style={style} />
      </div>
    )
  }
})

React.renderComponent(App(), document.body)