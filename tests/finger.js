/** @jsx React.DOM */

var React = require('react')
var Finger = require('../finger')

/*CSS
.container{width:400px;height:400px;overflow:hidden;background:black}
.container .items{width:1200px;}
.container .items .item{width:400px;height:400px;background:yellow;position:absolute;left:0;}
.container .items .item.i2{background:green;left:400px}
.container .items .item.i3{background:blue;left:800px}
*/

var App = React.createClass({
  componentDidMount: function() {
    var finger = Finger(this.getDOMNode())
  },
  render: function() {
    return (
      <div className="container" style={{ background: '#000', position:'relative' }}>
        <div className="items">
          <div className="item i1" />
          <div className="item i2" />
          <div className="item i3" />
        </div>
      </div>
    )
  }
})

React.renderComponent(App(), document.body)