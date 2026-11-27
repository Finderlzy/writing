import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { QuartzPluginData } from "../../plugins/vfile"
import { FullSlug, resolveRelative, slugTag } from "../../util/path"
import { isLocaleHome, slugPrefix } from "../../util/pageLocale"

// 首页文章列表：标题 + 日期 · 标签 + 摘要（karpathy.github.io 的样子）。
// 只列正式文章：排除首页、tags/ 生成页、notes/ 里被带进来的笔记。
export const isPost = (f: QuartzPluginData) =>
  !!f.slug &&
  f.slug !== "index" &&
  f.slug !== "404" &&
  !f.slug.startsWith("tags/") &&
  !f.slug.endsWith("/index") &&
  !/(^|\/)notes\//.test(f.filePath ?? "") &&
  f.frontmatter?.unlisted !== true

const created = (f: QuartzPluginData) => f.dates?.created ?? f.dates?.modified

const fmt = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

const MAX_TAGS = 3

export default (() => {
  const PostList: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
    // 每种语言的首页（index、en/index）只列同一语言的文章
    if (!isLocaleHome(fileData.slug)) return null
    const prefix = slugPrefix(fileData.slug)

    const posts = allFiles
      .filter((f) => isPost(f) && slugPrefix(f.slug) === prefix)
      .sort((a, b) => (created(b)?.getTime() ?? 0) - (created(a)?.getTime() ?? 0))

    const here = fileData.slug as FullSlug
    return (
      <ul class="post-list">
        {posts.map((f) => {
          const date = created(f)
          const tags = ((f.frontmatter?.tags as string[] | undefined) ?? []).slice(0, MAX_TAGS)
          const desc = (f.frontmatter?.description as string | undefined) ?? f.description
          return (
            <li class="post">
              <a class="post-title internal" href={resolveRelative(here, f.slug as FullSlug)}>
                {f.frontmatter?.title ?? f.slug}
              </a>
              <div class="post-meta">
                {date && <time datetime={date.toISOString()}>{fmt(date)}</time>}
                {tags.map((t) => (
                  <a
                    class="post-tag internal"
                    href={resolveRelative(here, `tags/${slugTag(t)}` as FullSlug)}
                  >
                    #{t}
                  </a>
                ))}
              </div>
              {desc && <p class="post-desc">{desc}</p>}
            </li>
          )
        })}
      </ul>
    )
  }
  PostList.displayName = "PostList"
  return PostList
}) satisfies QuartzComponentConstructor
