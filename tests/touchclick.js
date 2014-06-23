/** @jsx React.DOM */

var React = require('react')
var TouchClick = require('../components/touchclick')

var log = []

React.initializeTouchEvents(true)

var App = React.createClass({
  getInitialState: function() {
    return {
      active: false
    }
  },
  onClick: function(e) {
    log.push('Click: '+e.type)
    this.forceUpdate()
  },
  onDown: function(e) {
    log.push('Down: '+e.type)
    this.setState({active: true})
  },
  onUp: function(e) {
    log.push('Up: '+e.type)
    this.setState({active: false})
  },
  render: function() {
    var css = 'button{border:1px solid #ddd;background:#fff;padding:0 10px;height:30px;outline:none}'+
              'button.active{background:#000;color:white}'
    var info = log.map(function(i) {
      return <div>{i}</div>
    })
    return (
      <div>
        <style dangerouslySetInnerHTML={{__html: css}} />
        <TouchClick click={this.onClick} down={this.onDown} 
          up={this.onUp} nodeName='button' className={this.state.active ? 'active':''}>Touch/click me</TouchClick>
        {info}
      </div>
    )
  }
})

React.renderComponent(App(), document.body)