import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString, locale = 'en') {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : locale === 'zh' ? 'zh-CN' : locale === 'pt' ? 'pt-BR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function truncate(str, length = 150) {
  if (!str) return ''
  if (str.length <= length) return str
  return str.slice(0, length).trim() + '...'
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
