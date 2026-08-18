### Browser Compatibility
Browser compatibility is the ability of a page to display and run correctly across different browsers.

#### 1. Vendor prefixes
##### 1.1 Common prefixes
```css
.element {
  /* Webkit (Chrome, Safari) */
  -webkit-transform: rotate(45deg);
  -webkit-transition: all 0.3s;
  -webkit-animation: slide 1s;

  /* Mozilla (Firefox) */
  -moz-transform: rotate(45deg);
  -moz-transition: all 0.3s;
  -moz-animation: slide 1s;

  /* Opera */
  -o-transform: rotate(45deg);
  -o-transition: all 0.3s;
  -o-animation: slide 1s;

  /* Microsoft (IE) */
  -ms-transform: rotate(45deg);
  -ms-transition: all 0.3s;
  -ms-animation: slide 1s;

  /* Standard properties */
  transform: rotate(45deg);
  transition: all 0.3s;
  animation: slide 1s;
}
```

##### 1.2 Adding prefixes automatically
```javascript
// Use PostCSS
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}

// Use webpack
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  }
}
```

#### 2. Feature detection
##### 2.1 CSS feature detection
```css
/* Use @supports */
@supports (display: grid) {
  .container {
    display: grid;
  }
}

@supports not (display: grid) {
  .container {
    display: flex;
  }
}
```

##### 2.2 JavaScript feature detection
```javascript
// Feature detection
if (typeof window.localStorage !== 'undefined') {
  // localStorage is supported
}

// Use Modernizr
if (Modernizr.flexbox) {
  // flexbox is supported
}

// Use a feature-detection library
if (supports.cssGrid) {
  // CSS Grid is supported
}
```

#### 3. Handling browser compatibility
##### 3.1 CSS compatibility
```css
/* Use conditional comments */
<!--[if IE]>
<link rel="stylesheet" href="ie.css">
<![endif]-->

/* Use media queries */
@media screen and (-webkit-min-device-pixel-ratio:0) {
  /* Chrome, Safari */
}

@media screen and (-moz-images-in-menus:0) {
  /* Firefox */
}

@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  /* IE */
}
```

##### 3.2 JavaScript compatibility
```javascript
// Use polyfills
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Use Babel
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: ['> 1%', 'last 2 versions']
      }
    }]
  ]
}
```

#### 4. Common compatibility issues
##### 4.1 CSS compatibility issues
```css
/* Box model */
.element {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}

/* Flexbox */
.container {
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: flex;
}

/* Grid */
.container {
  display: -ms-grid;
  display: grid;
}

/* Gradients */
.element {
  background: -webkit-linear-gradient(top, #fff, #000);
  background: -moz-linear-gradient(top, #fff, #000);
  background: linear-gradient(to bottom, #fff, #000);
}
```

##### 4.2 JavaScript compatibility issues
```javascript
// Event handling
if (window.addEventListener) {
  element.addEventListener('click', handler);
} else {
  element.attachEvent('onclick', handler);
}

// AJAX
if (window.XMLHttpRequest) {
  xhr = new XMLHttpRequest();
} else {
  xhr = new ActiveXObject('Microsoft.XMLHTTP');
}

// Local storage
if (window.localStorage) {
  localStorage.setItem('key', 'value');
} else {
  // Fallback
}
```

#### 5. Best practices
1. Prefer feature detection over browser detection
2. Provide fallbacks
3. Use modern build tools
4. Keep the code simple
5. Test across browsers
6. Use a CSS preprocessor
7. Use a JavaScript transpiler
8. Consider mobile compatibility
9. Use a CDN for faster delivery
10. Keep dependencies up to date

#### 6. Common interview questions
1. **How do you handle browser compatibility issues**
   - Use feature detection
   - Provide fallbacks
   - Use polyfills
   - Use build tools

2. **What vendor prefixes are for**
   - Support experimental features
   - Provide browser-specific implementations
   - Ensure backward compatibility
   - Transition to standard properties

3. **How do you test browser compatibility**
   - Use browser DevTools
   - Use online testing tools
   - Use automated tests
   - Run cross-browser tests
