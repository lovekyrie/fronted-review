import { navData, sidebarData } from './nav-data.mjs'

function prefix(link, lang) {
  if (!link)
    return link
  return lang === 'en' ? `/en${link}` : link
}

function localizeItem(item, lang) {
  const next = {
    text: item[lang] ?? item.zh ?? item.text,
  }

  if (item.link)
    next.link = prefix(item.link, lang)
  if (item.collapsed != null)
    next.collapsed = item.collapsed
  if (item.items)
    next.items = item.items.map(child => localizeItem(child, lang))

  return next
}

export function buildNav(lang) {
  return navData.map(item => localizeItem(item, lang))
}

export function buildSidebar(lang) {
  return Object.fromEntries(
    Object.entries(sidebarData).map(([key, groups]) => [
      prefix(key, lang),
      groups.map(group => localizeItem(group, lang)),
    ]),
  )
}
