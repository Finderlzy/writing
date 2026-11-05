---
createdDate: 2026-11-05
tags:
  - Java
  - SpringBoot
  - 架构
  - voicecast
description: 记录开发 voicecast 时添加模型选择和管理角色两个功能的实现思路：整体沿用 Controller、Service、Repository 的框架，模型选择是在请求 Tts 时多传 speaker 参数，角色管理则新增了一套 Spea…
slug: voicecast-architecture-notes
---
虽然很想写点什么，但是仔细想想，好像整个框架都是一样的。

Controller 处理请求，然后调用 Service 的方法，有需要读取和写入数据库的就调用 Repository ，没有就在；然后在 Service 完成核心逻辑。

添加模型选择，就是在向 Tts 请求时，要多加一个 speaker 参数。然后在 TtsService 中，加入了查询 VoiceModelRepository 的步骤。

管理角色，就是多了一套 Speaker 的框架。