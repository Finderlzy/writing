# 知行录

博客地址：<https://finderlzy.github.io>，基于 [jackyzha0/quartz](https://github.com/jackyzha0/quartz) v5 构建。

## 为什么要重构

受刘未鹏先生的影响，我觉得“博客”应该是很多篇思考融会贯通之后的新产物，由于之前的博客放了太多零散的思考上去，所以我再次重构博客。另外，之前的主题风格虽然很好看，但是可能我自己还是喜欢素一点的，所以借此机会换了一个主题风格。

## 需求与思路

这个博客基于 Quartz 和我自己做的 Obsidian 插件实现。

我的核心需求如下：

- **轻量便捷**：在 Obsidian 里点一个按钮就能发布，不用手写 frontmatter 标记。
- **分享渠道**：有一个地方能方便地把文章给别人看。
- **多端同步**：手机上也能看自己的全部文章。
- **部分私密、部分发表**：私密的内容不能被别人从仓库源码里翻到。

由于目前已经有很多的博客框架或者静态网站生成器，所以我就不考虑自己造轮子了（最开始确实想自己做一个框架，但发现已经有很多了，就打消了这个念头），就选择了 Quartz。为什么用 Quartz？因为它会显示一篇文章的关系图谱，这个功能我挺喜欢的，所以就没有使用 Hexo、WordPress 或者别的框架了。

因为我自己都是在 Obsidian 写文章，所以就想在 Obsidian 写完之后直接发表，但是 Quartz 没有提供这个功能，于是就自己写了一个小插件 Inbox Filer，顺便内置了一些我爱用的功能。有一说一，通过 Obsidian 插件真的可以实现挺多的功能的，这个博客的大部分需求都是通过插件实现的，Quartz 仅负责构建网站和关系图谱，外加几处小定制（隐藏 notes、中英文切换）。

## 插件

- **整理**：用模型补属性、打标签、写摘要、起英文网址，顺便把数学改成 LaTeX、规范引号。
- **发布**：右键文章，连同它双链到的笔记和附件一起复制进本仓库，翻译一份英文版，然后提交并推送。

## 架构

```text
本地 Obsidian（唯一可编辑处）
├─ Obsidian Git 自动推送 → 私密仓库
│    ├─ iPhone 上的 Obsidian 拉取 → 给现在的自己看
│    └─ 每天定时存进 Google Drive → 留给将来的模型
└─ 插件右键发布 → 整理、翻译、改写链接（见上文）
     → finderlzy.github.io 的 main 分支 → GitHub Actions 自动构建 → 博客网站
```

---

# Knowing & Doing (English)

Blog: <https://finderlzy.github.io>, built on [jackyzha0/quartz](https://github.com/jackyzha0/quartz) v5.

## Why I rebuilt it

Influenced by Liu Weipeng, I came to believe a blog post should be something new that emerges once many thoughts have been worked through and connected. My previous blog held too many scattered thoughts, so I rebuilt it once again. The old theme looked nice, but I prefer something plainer, so I took the chance to switch themes as well.

## Needs and approach

This blog is built on Quartz plus an Obsidian plugin I wrote myself.

My core needs:

- **Lightweight**: publish with one click in Obsidian, without writing frontmatter by hand.
- **Sharing**: one place where I can easily show my writing to others.
- **Sync across devices**: read all my notes on my phone too.
- **Partly private, partly public**: private content must not be findable in the repository's source.

There are already plenty of blog frameworks and static site generators, so I didn't reinvent the wheel (I did want to build my own framework at first, but gave up once I saw how many already exist) and picked Quartz. Why Quartz? It shows a graph of how each post connects to others, which I really like, so I went with it over Hexo, WordPress or the rest.

I write everything in Obsidian and wanted to publish straight from there, but Quartz doesn't offer that, so I wrote a small plugin, Inbox Filer, and built in a few features I like to use. Honestly, an Obsidian plugin can do a lot: most of this blog's needs are handled by the plugin, while Quartz only builds the site and the graph, plus a few small customizations (hiding notes, switching between Chinese and English).

## Plugin

- **Tidy**: uses a model to fill in properties, add tags, write a summary and pick an English URL, and also converts math to LaTeX and normalizes quotation marks.
- **Publish**: right-click a post to copy it, along with the notes and attachments it links to, into this repository, translate an English version, then commit and push.

## Architecture

```text
Local Obsidian (the only place I edit)
├─ Obsidian Git auto-push → private repository
│    ├─ Obsidian on iPhone pulls → for me to read now
│    └─ daily backup to Google Drive → kept for future models
└─ Plugin right-click publish → tidy, translate, rewrite links (see above)
     → main branch of finderlzy.github.io → GitHub Actions build → blog site
```
