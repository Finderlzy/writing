import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import PostList from "./quartz/components/custom/PostList"
import LanguageSwitch from "./quartz/components/custom/LanguageSwitch"
import Flex from "./quartz/components/Flex"
import { componentRegistry } from "./quartz/components/registry"
import { QuartzComponent, QuartzComponentConstructor } from "./quartz/components/types"

// Inbox Filer 发布时，被正式文章链到而带进来的笔记放在 content/notes/（插件设置“带进来的笔记文件夹”）。
// 它们不进首页文章列表（规则在 PostList 的 isPost 里），但仍能搜索、出现在关系图和反链里，
// 所以不用 unlisted（它会把这些也藏掉）。改了插件里的文件夹名，要同步改 isPost 里的 "notes"。

const config = await loadQuartzConfig()
export default config

// 首页文章列表不是插件，挂到所有页面 beforeBody 的末尾；组件自己只在 index 上渲染。
// 渲染用的是 loader 内部的 activeLayout，必须通过 overrides 传进去，不能改返回值。
const base = await loadQuartzLayout()

// 顶栏工具栏：搜索、语言切换、夜间模式。语言切换不是插件，进不了 yaml 里的 toolbar 分组，
// 所以在这里把工具栏整个重建，替换掉 yaml 生成的那个（顶栏最后一项）。
// 从 registry 取插件组件：和 yaml 布局拿到的是同一个缓存实例，脚本不会重复注入。
// gap 同 quartz.config.yaml 里 layout.groups.toolbar.gap。
const plugin = (name: string): QuartzComponent => {
  const reg = componentRegistry.get(name)
  if (!reg) throw new Error(`quartz.ts: 找不到组件 ${name}，插件是不是没启用？`)
  return componentRegistry.instantiate(reg.component as QuartzComponentConstructor, undefined)
}
const toolbar = Flex({
  components: [
    { Component: plugin("Search") },
    { Component: LanguageSwitch() },
    { Component: plugin("Darkmode") },
  ],
  direction: "row",
  gap: "0.25rem",
})
const header = base.defaults.header ?? []

export const layout = await loadQuartzLayout({
  defaults: {
    beforeBody: [...(base.defaults.beforeBody ?? []), PostList()],
    header: [...header.slice(0, -1), toolbar],
  },
})
