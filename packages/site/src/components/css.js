let cache = {}
let prefix = 'x'
const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
const rules = []
let insert = (rule) => rules.push(rule)
const hyphen = (str) => str.replace(/[A-Z]|^ms/g, '-$&').toLowerCase()
const wrapMediaQuery = (rule, media) => {
  return media === '' ? rule : `${media}{${rule}}`
}
const createRule = (name, selector, prop, value) => {
  const className =
    selector === ''
      ? `.${name}`
      : selector.includes('&')
      ? selector.replace('&', `.${name}`)
      : `.${name}${selector}`
  return `${className.trim()}{${hyphen(prop)}:${value}}`
}

function parse(styles, selector = '', parentMedia = '') {
  let className = ''
  for (let key in styles) {
    const value = styles[key]
    if (value === undefined || value === null) {
      continue
    }
    if (typeof value === 'object') {
      const media = /^@/.test(key) ? key : null
      const chainedSelector = media
        ? selector
        : key.startsWith(':')
        ? `${selector}${key}`
        : `${selector} ${key}`
      className += parse(value, chainedSelector, media || parentMedia)
      continue
    }
    const cacheKey = key + value + selector + parentMedia
    if (cache[cacheKey]) {
      className += ' ' + cache[cacheKey]
    } else {
      const utilityClassName = prefix + rules.length.toString(36)
      const rule = wrapMediaQuery(
        createRule(utilityClassName, selector, key, value),
        parentMedia
      )
      insert(rule)
      cache[cacheKey] = utilityClassName
      className += ' ' + utilityClassName
    }
  }
  return className
}

function cxs(...styles) {
  return styles
    .map((style) => parse(style))
    .join(' ')
    .trim()
}

cxs.css = () => rules.sort().join('')

cxs.reset = () => {
  cache = {}
  while (rules.length) rules.pop()
}

if (typeof document !== 'undefined') {
  const sheet = document.head.appendChild(document.createElement('style')).sheet
  insert = (rule) => {
    try {
      rules.push(rule)
      sheet.insertRule(rule, sheet.cssRules.length)
    } catch (error) {
      if (isDev) {
        console.warn('whoops, illegal rule inserted', rule)
      }
    }
  }
}

export default cxs
