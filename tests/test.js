'use strict'
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

  t.ok(aCalled)
  t.ok(buttonCalled)
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

  const {div, p} = dscript((tagName, attrs) => {
    if (tagName === 'div' && attrs === divAttrs) {
      divCalled = true
    }

    if (tagName === 'p' && attrs === pAttrs) {
      pCalled = true
    }
  })

  div(divAttrs)
  p(pAttrs)

  t.ok(divCalled)
  t.ok(pCalled)
})

test('dscript fns pass empty object by default for attributes', t => {
  let inputCalled = false

  const {input} = dscript((tagName, attrs) => {
    if (tagName === 'input') {
      t.same(attrs, {})
      inputCalled = true
    }
  })

  input()

  t.ok(inputCalled)
})

test('dscript fns pass children array', t => {
  let bCalled = false
    , videoCalled = false

  const bChildren = ['yo']
  const videoChildren = ['hello']

  const {b, video} = dscript((tagName, attrs, children) => {
    if (tagName === 'b' && children === bChildren) {
      bCalled = true
    }

    if (tagName === 'video' && children === videoChildren) {
      videoCalled = true
    }
  })

  b({}, bChildren)
  video({}, videoChildren)

  t.ok(bCalled)
  t.ok(videoCalled)
})

test('dscript fns pass empty children array by default', t => {
  let spanCalled = false

  const {span} = dscript((tagName, attrs, children) => {
    if (tagName === 'span') {
      t.same(children, [])
      spanCalled = true
    }
  })

  span()

  t.ok(spanCalled)
})

test('dscript fn can handle no attrs, but selector and chilren', t => {
  let spanCalled = false

  const {span} = dscript((tagName, attrs, children) => {
    if (tagName === 'span') {
      t.is(attrs.class, 'hi')
      t.same(children, ['yo'])
      spanCalled = true
    }
  })

  span('.hi', ['yo'])

  t.ok(spanCalled)
})

test('dscript fns pass empty object if attrs is not passed but children is', t => {
  let divCalled = false

  const divChildren = ['hi']

  const {div} = dscript((tagName, attrs, children) => {
    if (tagName === 'div') {
      t.same(attrs, {})
      t.is(children, divChildren)
      divCalled = true
    }
  })

  div(divChildren)

  t.ok(divCalled)
})

test('dscript is a fn that accepts a list of non html tags to pass to createElement', t => {
  let fancyCalled = false

  const fancy = dscript(tagName => {
    if (tagName === 'fancy') {
      fancyCalled = true
    }
  })('fancy')

  fancy()

  t.ok(fancyCalled)
})

test('dscript attaches optional classes and id to attributes and overrides provided attrs', t => {
  let divCalled = false

  const {div} = dscript((tagName, attrs) => {
    if (tagName === 'div') {
      t.is(attrs.id, 'world')
      t.is(attrs.class, 'hello good-bye')
      divCalled = true
    }
  })

  div('.hello#world.good-bye', {class: 'yo', id: '3'})

  t.ok(divCalled)
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

  t.ok(divCalled)
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

  t.ok(divCalled)
})
