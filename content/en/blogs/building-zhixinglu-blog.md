---
title: "Building My Blog 'Zhixinglu': A Behind-the-Scenes Look"
permalink: "en/building-zhixinglu-blog"
description: "A walkthrough of how I built my personal blog 'Zhixinglu': writing in Obsidian, using a custom Inbox Filer plugin to organize and publish posts to a Quartz repo, deploying via GitHub Actions to GitHub Pages and syncing to Blogger, while keeping some content private."
created: 2026-11-27
tags:
  - "blog"
  - "quartz"
  - "obsidian"
  - "automation"
  - "github-actions"
---
## Requirements

- **Lightweight and convenient**: Publish with a single button click in Obsidian, without manually writing frontmatter tags.
- **Sharing channel**: A place where I can easily show my articles to others.
- **Multi-device sync**: I can view all my articles on my phone too.
- **Partly private, partly published**: Private content must not be discoverable by others from the repository source.

## Overall architecture

Let me explain the three repositories involved in this blog. The first repository, the **Obsidian vault**: this is where I write all my articles, and where the plugin mentioned later is installed. The second repository, the **private repository**: a private repository on GitHub, the remote associated with the Obsidian vault, used to sync all the articles I write. The third repository, the **blog repository**: the repository where Quartz lives `finderlzy.github.io`, public. After I click publish in Obsidian, the plugin copies the article and its English version into `content/` of this repository.

Why so complicated? To put it in fancy terms, "modularity"; to put it simply, a clear division of labor: the Obsidian vault is only responsible for writing, and locally is the only place where articles can be edited; the private repository is only responsible for syncing; the blog repository is only responsible for sharing and publishing. Both GitHub repositories are merely the result of pushing from local, and the three work together through the plugin.

This also satisfies the "partly private" requirement: the blog repository is public, but it only contains the articles I have clicked publish on and the notes they link to, and only carries the properties title, URL, summary, tags, aliases, and date; other properties in the vault are not carried over. Unpublished articles exist only in the private repository, and others cannot see them even by browsing the source of the blog repository. Why do I have this requirement? I don't know why, but I feel that putting my scattered thoughts on the internet is about the same as running around naked.

Below is the architecture diagram:
```text
本地 Obsidian（唯一可以修改文章的地方）
├─ Obsidian Git 自动推送 → 私密仓库
│    ├─ iPhone 上的 Obsidian 拉取 → 给现在的自己看（还没做）
│    └─ 每天定时存进 Google Drive → 留给将来的模型（还没做）
└─ 插件右键发布 → 整理、翻译、改写链接
     → finderlzy.github.io 的 main 分支 → GitHub Actions 自动构建 → 博客网站
                                         └→ 新文章同步到 Blogger
```

## Why Quartz

Since the internet has developed to this day, there are already many, many blog frameworks, so I did not consider reinventing the wheel (at first I did want to build one myself, but after finding that many ready-made ones already exist, I gave up that idea), so I went looking for whether there was an existing framework I could use directly. Unfortunately, there is no out-of-the-box framework that satisfies all the above requirements, so the final approach was: **choose a framework responsible for building the site, and fill in the missing parts myself**.

Most blog frameworks have similar functionality. I chose [Quartz](https://quartz.jzhao.xyz/) because it displays a relationship graph for an article, and I quite like this feature, so I did not use Hexo, WordPress, or other frameworks.

Quartz is a static site generator (for convenience, referred to below as "the framework"), responsible for **turning Markdown files into a website**. It is simple to use: put articles into the `content/` folder, and it can generate a static website. Its build process is basically completed by plugins, divided into three categories:

- **Transform**: parse and rewrite Markdown into web content, such as rendering LaTeX, code highlighting, and handling Obsidian's double links.
- **Filter**: decide which articles are not published.
- **Emit**: generate the final files, such as article pages, tag pages, search index, and RSS.

Features such as the relationship graph, search, backlinks, and comments are also each individual plugins. So Quartz is not "first generate pages, then add plugin features"; the plugins themselves are the build process.

## Writing and publishing: the Inbox Filer plugin

I write all my articles in Obsidian, so I wanted to publish directly after finishing writing, but Quartz does not provide this feature, so I wrote an Obsidian plugin, Inbox Filer, and built in some features I like along the way. To be honest, Obsidian plugins really can implement quite a lot of functionality, and most of this blog's requirements are realized through plugins.

This plugin mainly does two things:

- **Organize**: use a model to fill in properties, add tags, write summaries, and create English URLs, and along the way convert math written as plain text into LaTeX, put code into code blocks, and normalize quotation marks.
- **Publish**: right-click an article, first automatically organize this article once; then put it into `content/blogs/` of the blog repository, put the notes it double-links to into `content/notes/`, put attachments into `content/attachments/`, and rewrite double links into paths in the blog; then translate an English version for each article into `content/en/`, and finally commit and push.

English translations are saved back into the Obsidian vault and can be proofread manually; retranslation only happens when the Chinese version has changed, and if translation fails, only the Chinese version is published.

## Deployment

Since I wanted to use the domain [finderlzy.github.io](https://finderlzy.github.io/), I named the blog repository [finderlzy.github.io](https://github.com/finderlzy/finderlzy.github.io). It can be deployed directly with GitHub Pages, and the URL is finderlzy.github.io. I wrote `.github/workflows/deploy.yaml`, and every time I push to `main`, GitHub Actions builds automatically and then publishes to GitHub Pages.

I also want to sync to Google Blogger, so that Gemini can read my articles through the Google ecosystem. So after a successful deployment, GitHub Actions runs another task: it sends the **newly added** formal Chinese articles from this push (counting only those under `blogs/`; notes and English versions are not sent) to Blogger (Mail2Blogger) by email in the form of "summary + link to the original". Each article is sent only once; editing an old article will not resend it, and missed ones can also be manually triggered for resending.

## A few customizations to Quartz

**Notes that get pulled in do not appear on the homepage.** I don't want to put fragmented thoughts on the homepage, but I do want blog articles to be able to link to these thoughts. So `content/` is divided into `blogs/` and `notes/`: `blogs/` contains formal articles, and `notes/` contains notes that are linked to by formal articles and pulled in along with them. Notes do not appear in the article list on the homepage, but they can still be searched, and they also appear in the graph view and backlinks. So I did not use Quartz's built-in unlisted, which would also hide them from search and backlinks.

**English URLs.** Using Chinese filenames as URLs turns them into a long string of `%E6%A0%87...` encoding when copied out, so each article uses `permalink` to set an English URL, and the filename is also used when publishing to the blog repository. For example, 《逸夫楼506悟道》 is `awakening-in-yifu-506`.

**Chinese-English switching.** The English version is placed under `content/en/`, and its URL is `en/` plus the URL of the Chinese version. A language switch button was added to the top bar. The language switch is not a plugin and cannot be added to the toolbar groups in the configuration file, so the entire top bar toolbar was rebuilt in `quartz.ts`.

**Comments.** giscus is used, and comments are stored in the Discussions of the blog repository.

**Style.** The light mode references the style of [Karpathy's GitHub blog](https://karpathy.github.io/), which is plainer; the dark mode uses a self-tuned "winter night" color scheme.