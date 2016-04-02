# bibles-org
A convenience wrapper for the [bibles.org API](https://bibles.org/pages/api)

## Installation

```bash
$ npm install --save bibles-org
```

## Use

```js
var biblesOrg = require('bibles-org')(apiKey)
```

All methods can be passed a callback. If no callback is provided, the method will return a promise.
