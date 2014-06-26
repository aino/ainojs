
module.exports = function(e) {
  var t = e || 1
  var c = 0
  var n = 0
  var r = 0
  var i = -1e6
  var s = 1e9
  var o = 1e5
  
  this.velocity = 0

  this.setTarget = function(e) { 
    r = Math.max(i,Math.min(s,e)) 
  }
  this.getTarget = function() { 
    return r 
  }
  this.updateTarget = function(e) { 
    r += e 
  }
  this.setLimits = function(e, t) {
    i = e
    s = t
  }
  this.easeVal = function() {
    r = Math.max(i,Math.min(s,r))
    this.velocity = (r - n) * t
    n += this.velocity
    if ( this.velocity <= 0.1 )
      this.velocity = 0
      n = Math.round(n)
    return n
  }
  this.setEase = function(e) {
    t = e
  }
  this.reset = function(e) {
    n = e || 0
    r = e || 0
  }
}