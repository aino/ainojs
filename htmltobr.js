/*
 * htmlToText
 * Returns stripped text with preserved linebreaks as <br>
 */

module.exports = function(html) {

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