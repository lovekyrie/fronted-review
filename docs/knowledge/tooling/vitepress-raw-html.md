# VitePress 会把尖括号当 HTML 标签

> Related source: [interview/en/daily-prep/_template.md](../../../interview/en/daily-prep/_template.md)

## Meaning

VitePress 先把 Markdown 编成 HTML，再包进 Vue SFC 交给 Vue 编译器。裸写的 `<tag>` 只要标签名是英文字母开头，就会原样进模板。Vue 要求这个标签有结束标签，否则构建报 `Element is missing end tag`。

报错行列是生成后的 SFC，不是 Markdown 源文件的同一行。典型结构是 3 行 `<script>` 注入页数据，第 4 行才是 `<template>`。

安全写法：放进行内代码（反引号），或写成 `&lt;topic&gt;`。标签名含中文（如 `<主题>`）不符合 HTML 标签名，Markdown 会转义，所以中文页可以过、英文页会挂。

## In This Project

`interview/en/daily-prep/_template.md` 标题里的 `<topic>` 触发了这次 `docs:build` 失败。同页 `` `dayN-<slug>.md` `` 在反引号里，会被转成 `&lt;slug&gt;`，不是报错点。
