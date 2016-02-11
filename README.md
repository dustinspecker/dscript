# dscript
[![NPM version](https://badge.fury.io/js/dscript.svg)](https://badge.fury.io/js/dscript) [![Build Status](https://travis-ci.org/dustinspecker/dscript.svg)](https://travis-ci.org/dustinspecker/dscript) [![Coverage Status](https://img.shields.io/coveralls/dustinspecker/dscript.svg)](https://coveralls.io/r/dustinspecker/dscript?branch=master)

[![Code Climate](https://codeclimate.com/github/dustinspecker/dscript/badges/gpa.svg)](https://codeclimate.com/github/dustinspecker/dscript) [![Dependencies](https://david-dm.org/dustinspecker/dscript.svg)](https://david-dm.org/dustinspecker/dscript/#info=dependencies&view=table) [![DevDependencies](https://david-dm.org/dustinspecker/dscript/dev-status.svg)](https://david-dm.org/dustinspecker/dscript/#info=devDependencies&view=table)

> Framework agnostic hyperscript

## Install
```
npm install --save dscript
```

## Usage with React
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

## API
### dscript(createElement)

#### createElement

Returns an object with properties consisting of HTML tags with function values. Each of these functions accepts an optional attributes object and children array.

type: `function`

A function to use to create the Virtual DOM. For example, React's `createElement` or Deku's `element`.

### dscript(createElement)(customComponent)

Returns a function to be used in dscript.

For example:

```javascript
import {createElement} from 'react'
import customComponent from './lib/custom-react-component/'
import dscript from 'dscript'

const {div} = dscript(createElement)
const custom = dscript(createElement)(customComponent)

export default div([custom()])
```

#### createElement

Same as above

#### customComponent

type: `any`

Should be a valid component for the `createElement` function.

## LICENSE
MIT © [Dustin Specker](https://github.com/dustinspecker)
