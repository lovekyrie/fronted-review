# Markdown 有序列表会自己续号

> Related source: [interview/jscore/basic/scope-closure.md](../../../interview/jscore/basic/scope-closure.md)

## Meaning

CommonMark（VitePress 用的 markdown-it）里，有序列表的起始数字只看**这一列的第一项**。后面每一项写 `1.` 还是 `2.` 都会被忽略，HTML 的 `<ol>` 按 1、2、3… 递增。

两项之间的空行拆不开列表，只会变成「宽松列表」。要新开一张从 1 开始的列表，中间得有一个非列表块：标题、段落、`---`，或 HTML 注释 `<!-- -->`。

代码围栏可以打断列表。打断之后的下一项如果写成 `2.`，会新开一张 `start="2"` 的列表，页面上就从 2 开始。

## In This Project

`interview/jscore/basic/scope-closure.md` 第 11–13 行是 1、2、3。第 15 行的 `1. **全局作用域 (Global Scope)**` 和前面只隔了一个空行，被并进同一张 `<ol>`，所以页面上是 4。
