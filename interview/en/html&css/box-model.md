### CSS Box Model
The CSS box model describes how an element's content, padding, border, and margin are laid out.

#### 1. Box model parts
##### 1.1 Standard box model
```css
.box {
  width: 200px;
  height: 100px;
  padding: 20px;
  border: 5px solid black;
  margin: 10px;
  background-color: #f0f0f0;
}
```
- Content area (Content)
- Padding
- Border
- Margin

##### 1.2 Box model calculation
```css
/* Standard box model */
.box {
  box-sizing: content-box; /* Default */
  width: 200px;
  padding: 20px;
  border: 5px solid;
  /* Total width = 200px + 2*20px + 2*5px = 250px */
}

/* IE box model */
.box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid;
  /* Total width = 200px (includes padding and border) */
}
```

#### 2. Box model properties
##### 2.1 Content area
```css
.box {
  width: 200px;
  height: 100px;
  min-width: 100px;
  max-width: 300px;
  min-height: 50px;
  max-height: 200px;
}
```

##### 2.2 Padding
```css
.box {
  /* Shorthand */
  padding: 20px;
  padding: 20px 40px;
  padding: 20px 40px 30px 50px;

  /* Individual properties */
  padding-top: 20px;
  padding-right: 40px;
  padding-bottom: 30px;
  padding-left: 50px;
}
```

##### 2.3 Border
```css
.box {
  /* Shorthand */
  border: 5px solid black;
  border: 5px solid;
  border: 5px;

  /* Individual properties */
  border-width: 5px;
  border-style: solid;
  border-color: black;

  /* Per-side properties */
  border-top: 5px solid black;
  border-right: 5px solid black;
  border-bottom: 5px solid black;
  border-left: 5px solid black;
}
```

##### 2.4 Margin
```css
.box {
  /* Shorthand */
  margin: 20px;
  margin: 20px 40px;
  margin: 20px 40px 30px 50px;

  /* Individual properties */
  margin-top: 20px;
  margin-right: 40px;
  margin-bottom: 30px;
  margin-left: 50px;

  /* Horizontal centering */
  margin: 0 auto;
}
```

#### 3. Box model behavior
##### 3.1 Margin collapsing
```css
/* Adjacent elements' margins collapse */
.box1 {
  margin-bottom: 20px;
}
.box2 {
  margin-top: 30px;
  /* Actual gap is 30px (the larger value wins) */
}

/* Parent and child margins collapse */
.parent {
  margin-top: 20px;
}
.child {
  margin-top: 30px;
  /* Actual gap is 30px (the larger value wins) */
}
```

##### 3.2 Box model overflow
```css
.box {
  width: 200px;
  height: 100px;
  overflow: visible; /* Default */
  overflow: hidden;
  overflow: scroll;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
```

##### 3.3 Box shadows
```css
.box {
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
  /* Horizontal offset, vertical offset, blur radius, color */
}
```

#### 4. Box model in practice
##### 4.1 Centering
```css
/* Horizontal centering */
.box {
  width: 200px;
  margin: 0 auto;
}

/* Vertical centering */
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
```

##### 4.2 Responsive layout
```css
.box {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}
```

##### 4.3 Card layout
```css
.card {
  width: 300px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 10px;
}
```

#### 5. Best practices
1. Use `box-sizing: border-box`
2. Use margin collapsing reasonably
3. Watch out for box model overflow
4. Use shorthand properties for efficiency
5. Consider responsive layout
6. Use CSS variables to manage sizes
7. Watch browser compatibility
8. Use DevTools for debugging
9. Follow BEM naming conventions
10. Keep the code clean

#### 6. Common interview questions
1. **Differences between the standard box model and the IE box model**
   - Standard box model: width/height include content only
   - IE box model: width/height include content, padding, and border
   - Switch with the box-sizing property

2. **Rules of margin collapsing**
   - Adjacent elements: the larger value wins
   - Parent and child: the larger value wins
   - Empty elements' margins also collapse

3. **How to center an element**
   - Horizontal centering: margin: 0 auto
   - Vertical centering: Flex layout
   - Absolute positioning: transform
   - Grid layout: place-items: center
