'use strict'
import htmlTags from 'html-tags'
import objectAssign from 'object-assign'
import parseCssClassIdSelector from 'parse-css-class-id-selector'

/**
 * Retrieve class names and id from a selector
 * @param {String} selector - CSS class and/or id selector to parse
 * @return {Object} - object with class and id properties, if found in selector
 *   {String} class
 *   {String} id
 */
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

/**
 * Return a creator function with properties having HTML tag names with values
 * being creator functions for the respective HTML element.
 *
 * The stand-alone returned creator function is meant to be used with custom
 * components
 *
 * @param {Function} createElement - function producing virtual nodes - typically the function used for JSX
 * @return {Function} - explained above
 */
module.exports = createElement => {
  if (typeof createElement !== 'function') {
    throw new TypeError('Expected createElement to be a function')
  }

  const creator = tagOrComponent => (classesAndId, attrs, children) => {
    let attrsToPass = attrs || {}
      , childrenToPass = children || []

    if (Array.isArray(attrsToPass)) {
      // case: div('.hello', ['hi'])
      childrenToPass = attrsToPass
      attrsToPass = {}
    }

    if (Array.isArray(classesAndId)) {
      // case: div(['hi'])
      childrenToPass = classesAndId
    } else if (typeof classesAndId === 'object') {
      // case: div({tabindex: 4})
      attrsToPass = classesAndId
    }

    if (typeof classesAndId === 'string') {
      // case: div('.hello')
      objectAssign(attrsToPass, getClassesAndId(classesAndId))
    }

    return createElement(tagOrComponent, attrsToPass, childrenToPass)
  }

  // attach each HTML creator function to a creator function for custom components
  return htmlTags.reduce((acc, tag) => {
    acc[tag] = creator(tag)
    return acc
  }, creator)
}
