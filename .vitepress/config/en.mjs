import { buildNav, buildSidebar } from './build.mjs'

export const en = {
  title: 'Frontend Interview Notes',
  description: 'My frontend interview review notes',
  themeConfig: {
    nav: buildNav('en'),
    sidebar: buildSidebar('en'),
    outline: { label: 'On this page' },
    lastUpdated: { text: 'Last updated' },
    docFooter: {
      prev: 'Previous page',
      next: 'Next page',
    },
    returnToTopLabel: 'Back to top',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Theme',
    lightModeSwitchTitle: 'Switch to light mode',
    darkModeSwitchTitle: 'Switch to dark mode',
    langMenuLabel: 'Change language',
  },
}
