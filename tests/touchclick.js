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
    var css = '.btn{border:1px solid #ddd;background:#fff;padding:0 10px;height:30px;display:inline-block;line-height:30px}'+
              '.btn.active{background:#000;color:white}'
    var info = log.map(function(i) {
      return <div>{i}</div>
    })
    return (
      <div>
        <style dangerouslySetInnerHTML={{__html: css}} />
        <TouchClick click={this.onClick} down={this.onDown} 
          up={this.onUp} className={'btn' + (this.state.active ? ' active' : '')}>
          <a href="#/foo">Touch/click/drag me</a>
        </TouchClick>
        {info}
        <h2>Forms:</h2>
        <TouchClick nodeName="form">
          <textarea />
          <br />
          <input />
          <br />
          <input type="text" />
          <br />
          <input type="email" />
          <br />
          <input type="date" />
          <br />
          <input type="datetime" />
          <br />
          <input type="number" />
          <br />
          <input type="radio" />
          <br />
          <input type="checkbox" />
          <br />
          <input type="submit" />
          <br />
          <button type="submit">Button submit</button>
        </TouchClick>
        <input type="date" />
      </div>
    )
  }
})

React.renderComponent(App(), document.body)