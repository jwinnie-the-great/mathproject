# Number Name

A library to convert numbers to their English names.

## Setup Instructions

### In the Browser

To use the Number Name Library in your project, download
[number-name.js](https://github.com/fasttime/Number-Name/blob/master/lib/number-name.js) or
[number-name.min.js](https://github.com/fasttime/Number-Name/blob/master/lib/number-name.min.js)
from GitHub and include it in your HTML file.

```html
<script src="number-name.js"></script>
```

Alternatively, you can hotlink the online file.

```html
<script src="https://rawgithub.com/fasttime/Number-Name/master/lib/number-name.min.js"></script>
```

## Usage

```js
var name = numberName(12345);
// twelve thousand three hundred forty-five
```

```js
var name = numberName(-Math.PI);
// minus three point one four one five nine two six five three five eight nine seven nine
```

```js
var name = numberName(1e42);
// one tredecillion
```

*This is a preliminary documentation and may be subject to change at any time.*
