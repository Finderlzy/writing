import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { FullSlug, resolveRelative } from "../../util/path"
import { LOCALE_PREFIXES, slugPrefix } from "../../util/pageLocale"

// 顶栏的语言切换：链到这一页的另一种语言版本；那一版不存在时，链到那种语言的首页。
// 那种语言连首页都没有（还没建 content/en/index.md），就不显示。
// 按钮上写“要切到的语言”的简称，悬停提示全称。
const SHORT: Record<string, string> = {
  "zh-CN": "中文",
  "en-US": "EN",
}
const FULL: Record<string, string> = {
  "zh-CN": "中文",
  "en-US": "English",
}

export default (() => {
  const LanguageSwitch: QuartzComponent = ({ fileData, allFiles, ctx }: QuartzComponentProps) => {
    const here = fileData.slug as FullSlug | undefined
    if (!here) return null

    const slugs = new Set(allFiles.map((f) => f.slug))
    const prefix = slugPrefix(here)
    const base = prefix ? here.slice(prefix.length + 1) : here
    const withPrefix = (p: string | undefined, s: string) => (p ? `${p}/${s}` : s) as FullSlug

    // 默认语言（前缀 undefined）+ 所有带前缀的语言，去掉当前这一种
    const targets: [string | undefined, string][] = [
      [undefined, ctx.cfg.configuration.locale],
      ...Object.entries(LOCALE_PREFIXES),
    ]
    const links = targets
      .filter(([p]) => p !== prefix)
      .flatMap(([p, locale]) => {
        const page = withPrefix(p, base)
        const home = withPrefix(p, "index")
        const target = slugs.has(page) ? page : slugs.has(home) ? home : undefined
        return target ? [{ locale, href: resolveRelative(here, target) }] : []
      })

    if (links.length === 0) return null
    // 站名的链接由 page-title 插件写死到站点根（中文首页）；非默认语言页面由下面的脚本改到本语言首页
    const home = prefix ? resolveRelative(here, `${prefix}/index` as FullSlug) : undefined
    return (
      <nav class="language-switch" data-home={home}>
        {links.map(({ locale, href }) => (
          <a
            class="internal"
            href={href}
            hreflang={locale}
            lang={locale}
            title={FULL[locale] ?? locale}
            aria-label={FULL[locale] ?? locale}
          >
            {SHORT[locale] ?? locale}
          </a>
        ))}
      </nav>
    )
  }

  LanguageSwitch.afterDOMLoaded = `
document.addEventListener("nav", () => {
  const home = document.querySelector(".language-switch")?.dataset.home
  const title = document.querySelector(".page-title a")
  if (home && title) title.setAttribute("href", home)
})
`

  // 高度和 custom.scss 里顶栏的搜索、夜间模式按钮一致（32px），宽度随文字
  LanguageSwitch.css = `
.language-switch {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.language-switch a {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.35rem;
  box-sizing: border-box;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1;
  color: var(--darkgray);
}
.language-switch a:hover {
  background: var(--highlight);
  color: var(--dark);
}
`
  LanguageSwitch.displayName = "LanguageSwitch"
  return LanguageSwitch
}) satisfies QuartzComponentConstructor
