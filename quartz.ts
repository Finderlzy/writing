import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { componentRegistry } from "./quartz/components/registry"

// Inbox Filer 发布时，被正式文章链到而带进来的笔记放在 content/notes/（插件设置“带进来的笔记文件夹”）。
// 它们不进目录和最近文章，但仍能搜索、出现在关系图和反链里，所以不用 unlisted（它会把这些也藏掉）。
// 改了插件里的文件夹名，要同步改下面两处的 "notes"。

// 只装了 npm 插件时 `quartz plugin install` 不会生成 .quartz/plugins/index.ts，
// 所以不走文档里的 ExternalPlugin.Explorer(...)，直接登记它内部做的同一件事：按包名记下选项覆盖。
// 回调会被转成字符串送到浏览器里执行，不能引用外面的变量
componentRegistry.setOptionOverrides("@quartz-community/explorer", {
  filterFn: (node: { slugSegment: string; isFolder: boolean; data?: { filePath?: string } | null }) =>
    node.slugSegment !== "tags" &&
    !(node.isFolder && node.slugSegment === "notes") &&
    !/(^|\/)notes\//.test(node.data?.filePath ?? ""),
})

componentRegistry.setOptionOverrides("@quartz-community/recent-notes", {
  filter: (f: { slug?: string; filePath?: string }) =>
    f.slug !== "index" && !/(^|\/)notes\//.test(f.filePath ?? ""),
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
