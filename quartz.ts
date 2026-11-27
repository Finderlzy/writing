import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import PostList from "./quartz/components/custom/PostList"

// Inbox Filer 发布时，被正式文章链到而带进来的笔记放在 content/notes/（插件设置“带进来的笔记文件夹”）。
// 它们不进首页文章列表（规则在 PostList 的 isPost 里），但仍能搜索、出现在关系图和反链里，
// 所以不用 unlisted（它会把这些也藏掉）。改了插件里的文件夹名，要同步改 isPost 里的 "notes"。

const config = await loadQuartzConfig()
export default config

// 首页文章列表不是插件，挂到所有页面 beforeBody 的末尾；组件自己只在 index 上渲染。
// 渲染用的是 loader 内部的 activeLayout，必须通过 overrides 传进去，不能改返回值。
const base = await loadQuartzLayout()
export const layout = await loadQuartzLayout({
  defaults: { beforeBody: [...(base.defaults.beforeBody ?? []), PostList()] },
})
