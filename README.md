<p align="center">
  <a href="https://finderlzy.github.io/writing/"><img src="theme/assets/favicon.svg" width="96" height="96" alt="Writing 的星星标志"></a>
</p>

<h1 align="center">writing</h1>

<p align="center">个人文章网站：<a href="https://finderlzy.github.io/writing/">finderlzy.github.io/writing</a></p>

这里放我的思考、初稿、博客和文学作品。所有内容在 Obsidian 里写，用仓库里自带的 Python 脚本生成网站，推送到 GitHub 后自动发布到 GitHub Pages。

当前版本：**5.3.1**，版本记录见 [开发文档/DEVELOPMENT.md](开发文档/DEVELOPMENT.md)。

## 网站页面

| 页面 | 内容 |
| --- | --- |
| 首页 | 对话气泡里是 `docs/index.md` 正文的第一段，下面是其余的话；两张卡片画出“想法 → 思考 → 博客”和“灵感 → 初稿 → 作品”两条线和各阶段篇数；最后是博客和作品，按 `createdDate` 从新到旧、按月分组 |
| 全部文章 `/posts/` | 所有公开文章，按月分组，可以按阶段（思考、初稿、博客、作品）和标签筛选 |
| 文章页 | 标题、日期、阶段、标签、读完大约几分钟、简介、目录、正文、上一篇和下一篇，最后是评论区 |

- `04博客` 下的子文件夹是一组系列博客，比如订阅教程的 `原理版/`、`操作版/`。首页只放 `04博客` 根目录里代表系列的那篇，系列里的各篇在全部文章里，文章页能顺着系列往下读。新建系列时要在 `tools/content.py` 的 `SERIES` 里登记入口篇，否则构建报错。


## Obsidian 设置

在“文件与链接”中：

- “内部链接类型”设为“基于仓库根目录的绝对路径”（`newLinkFormat: "absolute"`）；
- 附件目录保持 `09附件`；
- 开启“始终更新内部链接”，这样在 Obsidian 里移动文件时，双链会自动跟着更新。

嵌入附件请写 `![[09附件/图片.png]]`，不要写 `![[../../09附件/图片.png]]` 这种依赖目录深度的相对路径；仓库测试会列出违规位置和建议写法。

## 评论区

- 评论区：每篇文章底部都有 [Giscus](https://giscus.app/zh-CN) 评论区，留言存放在本仓库的 GitHub Discussions，读者需要登录 GitHub。配置在 `site.toml` 的 `[giscus]`，`category_id` 为空时不显示评论区。评论按网址对应，页面网址变了，旧留言不会跟过去。
