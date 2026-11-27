import { ValidLocale } from "../i18n"
import { QuartzPluginData } from "../plugins/vfile"

// 多语言：默认语言（quartz.config.yaml 的 locale）的文章放在 content/ 根下，
// 其他语言放在 content/<前缀>/ 下，路径和默认语言版一一对应，例如
//   content/blogs/foo.md  ↔  content/en/blogs/foo.md
// 有 permalink 的文章，译文的 permalink 也要带前缀（"foo" ↔ "en/foo"）。
// 加一种语言：在这里加一行前缀，并在 LanguageSwitch 的 LABELS 里加名字。
export const LOCALE_PREFIXES: Record<string, ValidLocale> = {
  en: "en-US",
}

/** 这一页的语言前缀；默认语言返回 undefined */
export function slugPrefix(slug: string | undefined): string | undefined {
  const first = slug?.split("/")[0]
  return first && first in LOCALE_PREFIXES ? first : undefined
}

/** 站名：非默认语言的页面用该语言首页的 title，没有就用全站的 */
export function localizedPageTitle(
  fallback: string,
  fileData: QuartzPluginData,
  allFiles: QuartzPluginData[],
): string {
  const prefix = slugPrefix(fileData.slug)
  if (!prefix) return fallback
  const home = allFiles.find((f) => f.slug === `${prefix}/index`)
  return (home?.frontmatter?.title as string | undefined) ?? fallback
}

/** 这一页用哪种语言渲染界面：frontmatter 的 locale > 路径前缀 > 全站 locale */
export function pageLocale(fallback: ValidLocale, fileData: QuartzPluginData): ValidLocale {
  const fm = fileData.frontmatter?.locale as ValidLocale | undefined
  if (fm) return fm
  const prefix = slugPrefix(fileData.slug)
  return prefix ? LOCALE_PREFIXES[prefix] : fallback
}

/** 是不是某种语言的首页（index、en/index） */
export function isLocaleHome(slug: string | undefined): boolean {
  const prefix = slugPrefix(slug)
  return slug === (prefix ? `${prefix}/index` : "index")
}
