/** @jsx React.DOM */

var React = require('react')
var TouchClick = require('../components/touchclick')

React.initializeTouchEvents(true)

var App = React.createClass({
  getInitialState: function() {
    return {
      info: ''
    }
  },
  handler: function(e) {
    this.setState({ info: e.type })
  },
  render: function() {
    return (
      <div>
        <TouchClick handler={this.handler} nodeName='button'>Touch me</TouchClick>
        <div>{this.state.info}</div>
      </div>
    )
  }
})

React.renderComponent(App(), document.body)