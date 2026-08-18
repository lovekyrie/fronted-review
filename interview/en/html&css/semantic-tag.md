### Semantic Tags
Semantic tags mean building page structure with meaningful HTML elements, so the code is easier to read and maintain, and it also helps SEO and accessibility.

#### 1. Document structure tags
##### 1.1 Basic structure
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Page title</title>
</head>
<body>
  <header>Header area</header>
  <nav>Navigation area</nav>
  <main>Main content area</main>
  <footer>Footer area</footer>
</body>
</html>
```

##### 1.2 Header tags
```html
<header>
  <h1>Site title</h1>
  <nav>
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#contact">Contact us</a></li>
    </ul>
  </nav>
</header>
```

##### 1.3 Navigation tags
```html
<nav>
  <ul>
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact us</a></li>
  </ul>
</nav>
```

##### 1.4 Main content tags
```html
<main>
  <article>
    <h2>Article title</h2>
    <p>Article content</p>
  </article>
  <section>
    <h2>Section title</h2>
    <p>Section content</p>
  </section>
  <aside>
    <h3>Sidebar title</h3>
    <p>Sidebar content</p>
  </aside>
</main>
```

##### 1.5 Footer tags
```html
<footer>
  <p>Copyright information</p>
  <nav>
    <ul>
      <li><a href="#privacy">Privacy policy</a></li>
      <li><a href="#terms">Terms of use</a></li>
    </ul>
  </nav>
</footer>
```

#### 2. Text semantic tags
##### 2.1 Heading tags
```html
<h1>Heading level 1</h1>
<h2>Heading level 2</h2>
<h3>Heading level 3</h3>
<h4>Heading level 4</h4>
<h5>Heading level 5</h5>
<h6>Heading level 6</h6>
```

##### 2.2 Paragraph and text tags
```html
<p>Paragraph text</p>
<strong>Important text</strong>
<em>Emphasized text</em>
<mark>Highlighted text</mark>
<small>Small text</small>
<del>Deleted text</del>
<ins>Inserted text</ins>
```

##### 2.3 Quotation tags
```html
<blockquote>
  <p>Quoted text</p>
  <footer>Quote source</footer>
</blockquote>

<q>Short quote</q>

<cite>Citation title</cite>
```

##### 2.4 List tags
```html
<!-- Unordered list -->
<ul>
  <li>List item 1</li>
  <li>List item 2</li>
  <li>List item 3</li>
</ul>

<!-- Ordered list -->
<ol>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ol>

<!-- Definition list -->
<dl>
  <dt>Term</dt>
  <dd>Definition</dd>
</dl>
```

#### 3. Media semantic tags
##### 3.1 Image tags
```html
<figure>
  <img src="image.jpg" alt="Image description">
  <figcaption>Image caption</figcaption>
</figure>
```

##### 3.2 Audio tags
```html
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  Your browser does not support audio playback
</audio>
```

##### 3.3 Video tags
```html
<video controls>
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  Your browser does not support video playback
</video>
```

#### 4. Form semantic tags
##### 4.1 Form structure
```html
<form>
  <fieldset>
    <legend>Form title</legend>
    <label for="username">Username:</label>
    <input type="text" id="username" name="username">
  </fieldset>
</form>
```

##### 4.2 Form elements
```html
<label for="email">Email:</label>
<input type="email" id="email" name="email">

<label for="password">Password:</label>
<input type="password" id="password" name="password">

<label for="message">Message:</label>
<textarea id="message" name="message"></textarea>
```

#### 5. Other semantic tags
##### 5.1 Time tags
```html
<time datetime="2024-03-20">March 20, 2024</time>
```

##### 5.2 Collapsible content
```html
<details>
  <summary>Click to expand</summary>
  <p>Detailed content</p>
</details>
```

##### 5.3 Progress tags
```html
<progress value="70" max="100">70%</progress>
<meter value="0.6" min="0" max="1">60%</meter>
```

#### 6. Best practices
1. Use appropriate semantic tags
2. Keep the heading hierarchy intact
3. Use meaningful class names and IDs
4. Ensure accessibility
5. Consider SEO
6. Keep the code clean
7. Use comments where appropriate
8. Follow the HTML5 specification
9. Consider mobile adaptation
10. Review the code

#### 7. Common interview questions
1. **The role of semantic tags**
   - Improve code readability
   - Improve SEO
   - Enhance accessibility
   - Easier to maintain and develop

2. **When to use header and footer**
   - header: the header of a page or a section
   - footer: the footer of a page or a section
   - Can be nested
   - A page can have more than one

3. **Differences between article and section**
   - article: an independent content block
   - section: a thematically related content block
   - article can contain section
   - section can contain article
