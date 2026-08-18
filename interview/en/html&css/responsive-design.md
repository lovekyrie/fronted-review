### Responsive Design
Responsive design is a method that lets a page adapt to different devices and screen sizes.

#### 1. Viewport setup
##### 1.1 Basic viewport
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

##### 1.2 Viewport attributes
```html
<!-- Disable zoom -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

<!-- Allow zoom -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=2.0">
```

#### 2. Media queries
##### 2.1 Basic syntax
```css
/* Basic media query */
@media screen and (max-width: 768px) {
  /* styles */
}

/* Multiple conditions */
@media screen and (min-width: 768px) and (max-width: 1024px) {
  /* styles */
}

/* Device orientation */
@media screen and (orientation: landscape) {
  /* Landscape styles */
}
```

##### 2.2 Common breakpoints
```css
/* Mobile devices */
@media screen and (max-width: 576px) {
  /* Phone styles */
}

/* Tablets */
@media screen and (min-width: 577px) and (max-width: 768px) {
  /* Tablet styles */
}

/* Small desktops */
@media screen and (min-width: 769px) and (max-width: 992px) {
  /* Small desktop styles */
}

/* Large desktops */
@media screen and (min-width: 993px) {
  /* Large desktop styles */
}
```

#### 3. Responsive units
##### 3.1 Relative units
```css
.element {
  /* Relative to the viewport width */
  width: 50vw;
  height: 50vh;

  /* Relative to the parent */
  width: 50%;
  padding: 2em;
  margin: 1rem;

  /* Relative to the root element */
  font-size: 1.5rem;
}
```

##### 3.2 Calculation functions
```css
.element {
  /* Calculate width */
  width: calc(100% - 20px);
  
  /* Calculate font size */
  font-size: calc(16px + 1vw);
  
  /* Calculate spacing */
  padding: calc(1rem + 2vw);
}
```

#### 4. Responsive images
##### 4.1 Basic setup
```html
<!-- Responsive image -->
<img src="image.jpg" alt="Responsive image" style="max-width: 100%; height: auto;">

<!-- Images at different sizes -->
<picture>
  <source srcset="large.jpg" media="(min-width: 800px)">
  <source srcset="medium.jpg" media="(min-width: 400px)">
  <img src="small.jpg" alt="Responsive image">
</picture>
```

##### 4.2 Background images
```css
.element {
  background-image: url('image.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```

#### 5. Responsive layout
##### 5.1 Flex layout
```css
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.item {
  flex: 1 1 300px;
}
```

##### 5.2 Grid layout
```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
```

#### 6. Responsive components
##### 6.1 Navigation bar
```css
/* Responsive navigation */
.nav {
  display: flex;
  flex-wrap: wrap;
}

@media screen and (max-width: 768px) {
  .nav {
    flex-direction: column;
  }
  
  .nav-item {
    width: 100%;
  }
}
```

##### 6.2 Card layout
```css
/* Responsive cards */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
}
```

#### 7. Best practices
1. Mobile-first design
2. Use relative units
3. Choose appropriate breakpoints
4. Optimize image loading
5. Account for touch interaction
6. Test on different devices
7. Keep performance in mind
8. Use CSS variables
9. Consider accessibility
10. Progressive enhancement

#### 8. Common interview questions
1. **What is mobile-first design**
   - Design the mobile experience first
   - Enhance features progressively
   - Consider performance
   - Simplify interactions

2. **How do you choose breakpoints**
   - Base them on content
   - Consider device characteristics
   - Stay consistent
   - Avoid too many breakpoints

3. **Optimizing responsive images**
   - Use srcset
   - Choose the right format
   - Consider loading performance
   - Use lazy loading
