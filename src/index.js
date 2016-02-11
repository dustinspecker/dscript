'use strict'
import htmlTags from 'html-tags'

module.exports = createElement => {
  if (typeof createElement !== 'function') {
    throw new TypeError('Expected createElement to be a function')
  }

  const creator = tagOrComponent => (attrs, children) => {
    let attrsToPass = attrs || {}
      , childrenToPass = children || []

    if (Array.isArray(attrs)) {
      childrenToPass = attrs
      attrsToPass = {}
    }

    return createElement(tagOrComponent, attrsToPass, childrenToPass)
  }

  return htmlTags.reduce((acc, tag) => {
    acc[tag] = creator(tag)
    return acc
  }, creator)
}
