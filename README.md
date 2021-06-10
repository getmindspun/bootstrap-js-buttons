<div align="center">
  <h1>bootstrap-js-buttons</h1>
  <h4>Create Bootstrap button variants in Javascript.</h4>
  <img src="img/buttons.png" alt="Bootstrap button variants"</img>
</div>

<div align="center">
  <sub>Maintained by <a href="https://www.mindspun.com/">Mindspun</a>.</sub>
</div>

## Live Demo
https://getmindspun.github.io/bootstrap-js-buttons/

## Installation

### From CDN
```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap-js-buttons@latest/dist/bootstrap-js-buttons.min.js"></script>
```

### As a module
```html
const bs = require('bootstrap-js-buttons');
```

## Quick Start
```js
bs.buttonVariant('.btn-accent-solid', '#FF1A75');
bs.buttonOutlineVariant('.btn-accent-outline', '#FF1A75');
```

## Motivation
Defining additional button styles in Bootstrap requires you to use a SASS mixin,
which you can only do at build time.  This makes changing buttons at runtime impossible and
prevents common use cases like letting a user choose their accent color.  Worse, you can't use
CSS custom properties for the colors since the SASS mixins won't work.
Defining the buttons in Javascript solves this and let's you redefine the style whenever
a color changes.

## How it works
Each call to one of the button functions generates an associated <style> tag that
is added to the head element of the document.  Calling the function again with the
same name replaces any previous styles so to update a given button variant, just
call the function again.

## Functions
There are two main functions corresponding to the SASS mixins *button-variant* and *button-outline-variant*.

**buttonVariant(name, background, border, options)**

**buttonOutlineVariant(name, color, options)**

### options
Each function takes an optional *options* parameter.  Options correspond to SASS
variables in Bootstrap.  In other words, what you'd modify in *_variables.scss* for Bootstrap
you pass as *options* in Javascript.  The names are the same, just translated to
CamelCase.  Below are the options and their associated default values.
```js
colorContrastLight = '#ffffff';
colorContrastDark = '#000000';
minContrastRatio = 4.5;
btnHoverBgShadeAmount = 15;

btnHoverBgTintAmount = 15;
btnHoverBorderShadeAmount = 20;
btnHoverBorderTintAmount = 10;
btnActiveBgShadeAmount = 20;
btnActiveBgTintAmount = 20;
btnActiveBorderShadeAmount = 25;
btnActiveBorderTintAmount = 10;
btnBoxShadow = `inset 0 1px 0 ${rgba('#ffffff', .15)}, 0 1px 1px ${rgba('#000000', .075)} !default`;
btnActiveBoxShadow = `inset 0 3px 5px ${rgba('#000000', .125)}`;

enableGradients = false;
enableShadows = false;
```
