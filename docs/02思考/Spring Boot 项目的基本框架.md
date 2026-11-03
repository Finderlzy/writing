---
createdDate: 2026-11-03
tags:
  - SpringBoot
  - 架构
  - Web服务
description: "用文字图记录 Spring Boot 项目的分层调用关系：Launcher 启动，Controller 接收请求，Service 处理 text 与 emotion，Repository 读写 refAudio 并生成 .wav，另有日志…"
slug: spring-boot-project-structure
---
```text
服务启动 ——> Launcher
				|
				↓
用户请求 ——> Controller
				|
				↓
	text ——> Service1 ——> emotion
				|
				↓
emotion ——> Reposity ——> refAudio
				|
				|
  text          ↓
	+    ——> Service2 ——> .wav
refAudio
```

服务层还会有 `log` 、`Exception` 的处理。

数据库层还有连接数据库的逻辑。写配置+依赖建立 Hikari 连接池、JdbcTemplate 帮忙发送 sql 语句和处理返回结果、驱动用来翻译。