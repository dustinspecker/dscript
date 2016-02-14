'use strict'
import htmlTags from 'html-tags'
import objectAssign from 'object-assign'
import parseCssClassIdSelector from 'parse-css-class-id-selector'

const getClassesAndId = selector => {
  const {classNames, id} = parseCssClassIdSelector(selector)

  const classesAndId = {}

  if (classNames.length) {
    classesAndId.class = classNames.join(' ')
  }

  if (id) {
    classesAndId.id = id
  }

  return classesAndId
}

module.exports = createElement => {
  if (typeof createElement !== 'function') {
    throw new TypeError('Expected createElement to be a function')
  }

  const creator = tagOrComponent => (classesAndId, attrs, children) => {
    let attrsToPass = attrs || {}
      , childrenToPass = children || []

    if (Array.isArray(classesAndId)) {
      childrenToPass = classesAndId
    } else if (typeof classesAndId === 'object') {
      attrsToPass = classesAndId
      childrenToPass = attrs
    }

    if (Array.isArray(attrsToPass)) {
      childrenToPass = attrs
      attrsToPass = {}
    }

    if (typeof classesAndId === 'string') {
      objectAssign(attrsToPass, getClassesAndId(classesAndId))
    }

    return createElement(tagOrComponent, attrsToPass, childrenToPass)
  }

  return htmlTags.reduce((acc, tag) => {
    acc[tag] = creator(tag)
    return acc
  }, creator)
}
