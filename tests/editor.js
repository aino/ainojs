/** @jsx React.DOM */

var React = require('react')
var Editor = require('../editor')
var $ = require('jquery')

$('head').append($('<link>').attr({
  rel: 'stylesheet',
  href: '../editor.css'
}))

var App = React.createClass({
  componentDidMount: function() {
    var editor = Editor(this.getDOMNode())
  },
  render: function() {
    return (
      <div style={{width:800, height:400}} />
    )
  }
})

React.renderComponent(App(), document.body)