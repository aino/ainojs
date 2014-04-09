/*
 * htmlToText
 * Returns stripped text with preserved linebreaks as <br>
 */

!function(a,i,n,o){o=i.length&&typeof require=="function"?function(e,t,n){n=[];for(t=0;t<i.length;t++){n.push(require(i[t].toLowerCase()))}return e.apply(null,n)}(n):n.apply(this,i.map(function(j){return this[j]},this));if(typeof module=="object"){module.exports=o}else if(typeof define=="function"){define(i,n)}else{this[a]=o}}.call
(this, 'Detect', [], function() {

  return function(html) {

    // wrap child text nodes
    var elm = document.createElement('div')
    elm.innerHTML = html
    Array.prototype.forEach.call(elm.childNodes, function(node) {
      if(node.nodeType == 3) {
        var br = document.createElement('br')
        var next = node.nextSibling
        if (next && next.nodeName != 'BR')
          elm.insertBefore(br, next)
      }
    })
    html = elm.innerHTML.replace(/<(?:br|\/div|\/p)>/g, '\n')
               .replace(/<.*?>/g, '')
               .replace(/\n/g,'{br}')
               .replace(/\{br\}\s*$/,'')
    var elm = document.createElement('div')
    elm.innerHTML = html
    return ( elm.textContent || elm.innerText ).replace(/\{br\}/g,'<br>')
  }
})