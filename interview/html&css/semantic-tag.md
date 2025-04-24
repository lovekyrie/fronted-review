### 语义化标签
语义化标签是指使用有意义的HTML标签来构建页面结构，使代码更易读、更易维护，同时有助于SEO和可访问性。

#### 1. 文档结构标签
##### 1.1 基本结构
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>页面标题</title>
</head>
<body>
  <header>头部区域</header>
  <nav>导航区域</nav>
  <main>主要内容区域</main>
  <footer>底部区域</footer>
</body>
</html>
```

##### 1.2 头部标签
```html
<header>
  <h1>网站标题</h1>
  <nav>
    <ul>
      <li><a href="#home">首页</a></li>
      <li><a href="#about">关于</a></li>
      <li><a href="#contact">联系我们</a></li>
    </ul>
  </nav>
</header>
```

##### 1.3 导航标签
```html
<nav>
  <ul>
    <li><a href="#home">首页</a></li>
    <li><a href="#about">关于</a></li>
    <li><a href="#contact">联系我们</a></li>
  </ul>
</nav>
```

##### 1.4 主要内容标签
```html
<main>
  <article>
    <h2>文章标题</h2>
    <p>文章内容</p>
  </article>
  <section>
    <h2>区块标题</h2>
    <p>区块内容</p>
  </section>
  <aside>
    <h3>侧边栏标题</h3>
    <p>侧边栏内容</p>
  </aside>
</main>
```

##### 1.5 底部标签
```html
<footer>
  <p>版权信息</p>
  <nav>
    <ul>
      <li><a href="#privacy">隐私政策</a></li>
      <li><a href="#terms">使用条款</a></li>
    </ul>
  </nav>
</footer>
```

#### 2. 文本语义标签
##### 2.1 标题标签
```html
<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>
```

##### 2.2 段落和文本标签
```html
<p>段落文本</p>
<strong>重要文本</strong>
<em>强调文本</em>
<mark>标记文本</mark>
<small>小号文本</small>
<del>删除文本</del>
<ins>插入文本</ins>
```

##### 2.3 引用标签
```html
<blockquote>
  <p>引用文本</p>
  <footer>引用来源</footer>
</blockquote>

<q>短引用</q>

<cite>引用标题</cite>
```

##### 2.4 列表标签
```html
<!-- 无序列表 -->
<ul>
  <li>列表项1</li>
  <li>列表项2</li>
  <li>列表项3</li>
</ul>

<!-- 有序列表 -->
<ol>
  <li>第一项</li>
  <li>第二项</li>
  <li>第三项</li>
</ol>

<!-- 定义列表 -->
<dl>
  <dt>术语</dt>
  <dd>定义</dd>
</dl>
```

#### 3. 媒体语义标签
##### 3.1 图片标签
```html
<figure>
  <img src="image.jpg" alt="图片描述">
  <figcaption>图片说明</figcaption>
</figure>
```

##### 3.2 音频标签
```html
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  您的浏览器不支持音频播放
</audio>
```

##### 3.3 视频标签
```html
<video controls>
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  您的浏览器不支持视频播放
</video>
```

#### 4. 表单语义标签
##### 4.1 表单结构
```html
<form>
  <fieldset>
    <legend>表单标题</legend>
    <label for="username">用户名：</label>
    <input type="text" id="username" name="username">
  </fieldset>
</form>
```

##### 4.2 表单元素
```html
<label for="email">邮箱：</label>
<input type="email" id="email" name="email">

<label for="password">密码：</label>
<input type="password" id="password" name="password">

<label for="message">留言：</label>
<textarea id="message" name="message"></textarea>
```

#### 5. 其他语义标签
##### 5.1 时间标签
```html
<time datetime="2024-03-20">2024年3月20日</time>
```

##### 5.2 可折叠内容
```html
<details>
  <summary>点击展开</summary>
  <p>详细内容</p>
</details>
```

##### 5.3 进度标签
```html
<progress value="70" max="100">70%</progress>
<meter value="0.6" min="0" max="1">60%</meter>
```

#### 6. 最佳实践
1. 使用合适的语义化标签
2. 保持标签的层级结构
3. 使用有意义的类名和ID
4. 确保可访问性
5. 考虑SEO优化
6. 保持代码整洁
7. 使用适当的注释
8. 遵循HTML5规范
9. 考虑移动端适配
10. 进行代码审查

#### 7. 常见面试题
1. **语义化标签的作用**
   - 提高代码可读性
   - 改善SEO效果
   - 提升可访问性
   - 便于维护和开发

2. **header和footer标签的使用场景**
   - header: 页面或区块的头部
   - footer: 页面或区块的底部
   - 可以嵌套使用
   - 一个页面可以有多个

3. **article和section的区别**
   - article: 独立的内容块
   - section: 主题相关的内容块
   - article可以包含section
   - section可以包含article 