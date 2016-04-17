# dscript
[![NPM version](https://badge.fury.io/js/dscript.svg)](https://badge.fury.io/js/dscript)
[![Build Status](https://travis-ci.org/dustinspecker/dscript.svg)](https://travis-ci.org/dustinspecker/dscript)
[![Coverage Status](https://img.shields.io/coveralls/dustinspecker/dscript.svg)](https://coveralls.io/r/dustinspecker/dscript?branch=master)

[![Code Climate](https://codeclimate.com/github/dustinspecker/dscript/badges/gpa.svg)](https://codeclimate.com/github/dustinspecker/dscript)
[![Dependencies](https://david-dm.org/dustinspecker/dscript.svg)](https://david-dm.org/dustinspecker/dscript/#info=dependencies&view=table)
[![DevDependencies](https://david-dm.org/dustinspecker/dscript/dev-status.svg)](https://david-dm.org/dustinspecker/dscript/#info=devDependencies&view=table)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> Framework agnostic hyperscript

> Should work with any JSX pragma that works out of the box with Babel's JSX implementation or a function that accepts an HTML tag or component, attributes object, and children list.

## Install
```
npm install --save dscript
```

**Note: Webpack users will need to setup a [json-loader](https://github.com/webpack/json-loader) as dscript relies on [html-tags](https://github.com/sindresorhus/html-tags), which uses a [JSON file](https://github.com/sindresorhus/html-tags/blob/master/html-tags.json)**

## General Usage
```javascript
import dscript from 'dscript'
import {element} from 'deku'

const {div, li, ul} = dscript(element)

const handleClick = () => alert('hi!')

export default ({props}) =>
  div('.list-container', {onClick: handleClick}, [
    ul(
      props.items.map(item =>
        li([item.name])
      )
    )
  ])
```

## Usage with React
**It is recommended to use [dscript-react](https://github.com/dustinspecker/dscript-react) to remove dscript boilerplate.**

Take the following:
```javascript
import React from 'react'

export default props =>
  <ul>
    {props.items.map(item =>
      <li>{item.name}</li>
    )}
  </ul>
```
or:
```javascript
import {createElement} from 'react'

export default props =>
  createElement('ul', {},
    props.items.map(item =>
      createElement('li', {}, [
        item.name
      ])
    )
  )
```

and instead write:

```javascript
import {createElement} from 'react'
import dscript from 'dscript'

const {li, ul} = dscript(createElement)

export default props =>
  ul(
    props.items.map(item =>
      li([item.name])
    )
  )

```

## Usage with Deku
**It is recommended to use [dscript-deku](https://github.com/dustinspecker/dscript-deku) to remove dscript boilerplate.**

Take the following:
```javascript
import {element} from 'deku'

export default ({props}) =>
  <ul>
    {props.items.map(item =>
      <li>{item.name}</li>
    }
  </ul>
```

or:

```javascript
import {element} from 'deku'

export default ({props}) =>
  element('ul', {},
    props.items.map(item =>
      element('li', {}, [
        item.name
      ])
    )
  )
```

and instead write:
```javascript
import dscript from 'dscript'
import {element} from 'deku'

const {li, ul} = dscript(element)

export default ({props}) =>
  ul(
    props.items.map(item =>
      li([item.name])
    )
  )
```

## Usage with Custom Components
Custom components example is shown using React, but works with any framework that works with dscript's basic functionality.

```javascript
import dscript from 'dscript'
import {createElement} from 'react'

import customComponent from './custom-component'

const creator = dscript(createElement)

const {div, li, ul} = creator
const customComponentCreator = creator(customComponent)

const handleClick = () => alert('hi!')

export default props =>
  div('.list-container', {onClick: handleClick}, [
    customComponentCreator({total: props.total}),
    ul(
      props.items.map(item =>
        li([item.name])
      )
    )
  ])
```

## API
### dscript(createElement)
Returns an object with properties consisting of HTML tags with values being [creator functions](#creator-functions).

#### createElement
type: `function`

A function to use to create the Virtual DOM. For example, React's `createElement` or Deku's `element`.

### dscript(createElement)(customComponent)

Returns a [creator function](#creator-functions) to be used in dscript.

For example:

```javascript
import {createElement} from 'react'
import customComponent from './lib/custom-react-component/'
import dscript from 'dscript'

const creator = dscript(createElement)

const {div} = creator
const custom = creator(customComponent)

export default div([custom()])
```

#### createElement

Same as above

#### customComponent

type: `any`

Should be a valid component for the `createElement` function.


### Creator Functions
`creatorFunction([cssClassesAndOrIdSelector,] [attributes,] [children])`

A function that returns a virtual DOM node created with `createElement`.

#### cssClassesAndOrIdSelector
type: `string`

default: `null`

A convenience to add class names and an id to a virtual DOM node. **Note: The provided selector will override `attribute`'s class and id.**

### attributes
type: `object`

default: `{}`

An object that will be passed as the attributes to the virutal DOM node.

### children
type: `...Elements`

default: `[]`

The list of children passed to the created virtual DOM node.

## LICENSE
MIT © [Dustin Specker](https://github.com/dustinspecker)
