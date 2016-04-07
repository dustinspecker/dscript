'use strict'
import {createElement} from 'react'
import {element} from 'deku'
import test from 'ava'

import dscript from '../lib/'

test('throws when createElement is not a function', t => {
  t.throws(dscript, TypeError)
  t.throws(dscript, /Expected createElement to be a function/)
})

test('returns an object with html tag names that execute createElement', t => {
  let aCalled = false
    , buttonCalled = false

  const {a, button} = dscript(tagName => {
    if (tagName === 'a') {
      aCalled = true
    }

    if (tagName === 'button') {
      buttonCalled = true
    }
  })

  a()
  button()

  t.truthy(aCalled)
  t.truthy(buttonCalled)
})

test('dscript fns pass attributes object', t => {
  let divCalled = false
    , pCalled = false

  const divAttrs = {
    id: 'hello'
  }

  const pAttrs = {
    class: 'goodbye'
  }

  const {div, p} = dscript((tagName, attrs, ...children) => {
    if (tagName === 'div' && attrs === divAttrs) {
      t.deepEqual(children, [])
      divCalled = true
    }

    if (tagName === 'p' && attrs === pAttrs) {
      t.deepEqual(children, [])
      pCalled = true
    }
  })

  div(divAttrs)
  p(pAttrs)

  t.truthy(divCalled)
  t.truthy(pCalled)
})

test('dscript fns pass empty object by default for attributes', t => {
  let inputCalled = false

  const {input} = dscript((tagName, attrs) => {
    if (tagName === 'input') {
      t.deepEqual(attrs, {})
      inputCalled = true
    }
  })

  input()

  t.truthy(inputCalled)
})

test('dscript fns pass children array', t => {
  let bCalled = false
    , videoCalled = false

  const bChildren = ['yo']
  const videoChildren = ['hello']

  const {b, video} = dscript((tagName, attrs, ...children) => {
    if (tagName === 'b') {
      t.deepEqual(children, bChildren)
      bCalled = true
    }

    if (tagName === 'video') {
      t.deepEqual(children, videoChildren)
      videoCalled = true
    }
  })

  b({}, bChildren)
  video({}, videoChildren)

  t.truthy(bCalled)
  t.truthy(videoCalled)
})

test('dscript fns pass empty children array by default', t => {
  let spanCalled = false

  const {span} = dscript((tagName, attrs, ...children) => {
    if (tagName === 'span') {
      t.deepEqual(children, [])
      spanCalled = true
    }
  })

  span()

  t.truthy(spanCalled)
})

test('dscript fn can handle no attrs, but selector and chilren', t => {
  let spanCalled = false

  const {span} = dscript((tagName, attrs, ...children) => {
    if (tagName === 'span') {
      t.is(attrs.class, 'hi')
      t.deepEqual(children, ['yo'])
      spanCalled = true
    }
  })

  span('.hi', ['yo'])

  t.truthy(spanCalled)
})

test('dscript fns pass empty object if attrs is not passed but children is', t => {
  let divCalled = false

  const divChildren = ['hi']

  const {div} = dscript((tagName, attrs, ...children) => {
    if (tagName === 'div') {
      t.deepEqual(attrs, {})
      t.deepEqual(children, divChildren)
      divCalled = true
    }
  })

  div(divChildren)

  t.truthy(divCalled)
})

test('dscript is a fn that accepts a list of non html tags to pass to createElement', t => {
  let fancyCalled = false

  const fancy = dscript(tagName => {
    if (tagName === 'fancy') {
      fancyCalled = true
    }
  })('fancy')

  fancy()

  t.truthy(fancyCalled)
})

test('dscript attaches optional classes and id to attributes and overrides provided attrs', t => {
  let divCalled = false

  const {div} = dscript((tagName, attrs, ...children) => {
    if (tagName === 'div') {
      t.is(attrs.id, 'world')
      t.deepEqual(children, [])
      divCalled = true
    }
  })

  div('.hello#world.good-bye', {class: 'yo', id: '3'})

  t.truthy(divCalled)
})

test('id selector overrides attrs.id if provided', t => {
  let divCalled = false

  const {div} = dscript((tagName, attrs) => {
    if (tagName === 'div') {
      t.is(attrs.id, 'yo')
      t.is(attrs.class, 'hi')
      divCalled = true
    }
  })

  div('#yo', {class: 'hi', id: '3'})

  t.truthy(divCalled)
})

test('class selector overrides attrs.clas if provided', t => {
  let divCalled = false

  const {div} = dscript((tagName, attrs) => {
    if (tagName === 'div') {
      t.is(attrs.id, '3')
      t.is(attrs.class, 'yo')
      divCalled = true
    }
  })

  div('.yo', {class: 'hi', id: '3'})

  t.truthy(divCalled)
})

test('verify it works with Deku\'s element', t => {
  const {div} = dscript(element)

  const dekuDiv = div('.yo#hi', {title: 'hello'}, ['world'])

  t.is(dekuDiv.type, 'div')
  t.deepEqual(dekuDiv.attributes, {title: 'hello', class: 'yo', id: 'hi'})
  t.deepEqual(dekuDiv.children[0], {type: '#text', nodeValue: 'world'})
})

test('verify it works with React\'s createElement', t => {
  const {div} = dscript(createElement)

  const reactDiv = div('.yo#hi', {title: 'hello'}, ['world'])

  t.is(reactDiv.type, 'div')
  t.is(reactDiv.props.title, 'hello')
  t.is(reactDiv.props.id, 'hi')
  t.is(reactDiv.props.class, 'yo')
  t.deepEqual(reactDiv.props.children[0], 'world')
})
