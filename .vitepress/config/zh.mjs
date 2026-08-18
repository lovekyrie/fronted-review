import { buildNav, buildSidebar } from './build.mjs'

export const zh = {
  title: '前端面试知识库',
  description: '我的前端复习笔记',
  themeConfig: {
    nav: buildNav('zh'),
    sidebar: buildSidebar('zh'),
    outline: { label: '本页目录' },
    lastUpdated: { text: '最后更新' },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    langMenuLabel: '切换语言',
  },
}
