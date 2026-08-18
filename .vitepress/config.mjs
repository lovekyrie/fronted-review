import { defineConfig } from 'vitepress'
import { en } from './config/en.mjs'
import { shared } from './config/shared.mjs'
import { zh } from './config/zh.mjs'

export default defineConfig({
  ...shared,
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      ...zh,
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      ...en,
    },
  },
})
