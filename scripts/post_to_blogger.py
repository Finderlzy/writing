#!/usr/bin/env python3
"""把新发布的文章以「摘要 + 原文链接」的形式，通过邮件发布到 Blogger（Mail2Blogger）。

只处理两个提交之间「新增」的文章，所以每篇只会发一次，改旧文章不会重发。
只用标准库，在 GitHub Actions 的 ubuntu-latest 上直接能跑。

用法：
  python3 scripts/post_to_blogger.py --base <旧提交> --head <新提交> [--dry-run]
  python3 scripts/post_to_blogger.py --files "blogs/a.md blogs/b.md" [--dry-run]  # 手动补发

需要的环境变量（--dry-run 时不需要）：
  BLOGGER_POST_EMAIL  Blogger 投稿地址（用户名.暗号@blogger.com）
  GMAIL_USER          发件的 Gmail 地址
  GMAIL_APP_PASSWORD  Gmail 应用专用密码
"""

import argparse
import html
import json
import os
import re
import smtplib
import subprocess
import sys
from email.message import EmailMessage
from pathlib import Path
from urllib.parse import quote

SITE_URL = "https://finderlzy.github.io"
CONTENT_DIR = "content"
INDEX_PATH = "public/static/contentIndex.json"
# 只同步中文博客；笔记（notes/）和英文版（en/）不发
SYNC_PREFIXES = ("blogs/",)
EXCERPT_CHARS = 200


def git(*args: str) -> str:
    return subprocess.run(["git", "-c", "core.quotePath=false", *args], check=True, capture_output=True, text=True).stdout


def permalink_of(text: str) -> str | None:
    return frontmatter_from_text(text, "permalink")


def git_added_files(base: str, head: str) -> list[str]:
    """返回 base..head 之间新增的 Markdown 文件（相对 content/ 的路径）。

    用 --no-renames：跨多个提交比较时，git 会把「新文章」误认成某个旧文件的重命名。
    真正的改名（文件名变了但 permalink 没变）再用 permalink 排除掉，避免重发。
    """
    if not base or set(base) == {"0"}:
        print("没有可比较的旧提交（首次推送或手动触发），跳过。")
        return []
    try:
        out = git("diff", "--name-status", "--no-renames", base, head, "--", CONTENT_DIR)
    except subprocess.CalledProcessError as e:
        # 例如强推后旧提交已不在历史里：宁可不发，也不要误发一堆
        print(f"git diff 失败，跳过：{e.stderr.strip()}")
        return []

    added, old_permalinks = [], set()
    for line in out.splitlines():
        status, path = line.split("\t", 1)
        if not path.endswith(".md"):
            continue
        if status == "D":
            pl = permalink_of(git("show", f"{base}:{path}"))
            if pl:
                old_permalinks.add(pl)
        elif status == "A":
            rel = path.removeprefix(f"{CONTENT_DIR}/")
            if Path(rel).name != "index.md" and rel.startswith(SYNC_PREFIXES):
                added.append(rel)

    files = []
    for rel in added:
        pl = permalink_of(git("show", f"{head}:{CONTENT_DIR}/{rel}"))
        if pl and pl in old_permalinks:
            print(f"跳过（只是改了文件名）：{rel}")
            continue
        files.append(rel)
    return files


def frontmatter_value(md_path: Path, key: str) -> str | None:
    return frontmatter_from_text(md_path.read_text(encoding="utf-8"), key)


def frontmatter_from_text(text: str, key: str) -> str | None:
    m = re.match(r"^---\n(.*?)\n---", text, re.S)
    if not m:
        return None
    for line in m.group(1).splitlines():
        km = re.match(rf"^{re.escape(key)}:\s*(.*)$", line)
        if km:
            return km.group(1).strip().strip("'\"") or None
    return None


def build_post(entry: dict, md_path: Path) -> tuple[str, str]:
    title = entry["title"]
    url = f"{SITE_URL}/{quote(entry['slug'])}"
    excerpt = frontmatter_value(md_path, "description")
    if not excerpt:
        body = " ".join(entry.get("content", "").split())
        excerpt = body[:EXCERPT_CHARS] + ("……" if len(body) > EXCERPT_CHARS else "")
    tags = entry.get("tags") or []

    parts = [f"<p>{html.escape(excerpt)}</p>"]
    if tags:
        parts.append(f"<p>标签：{html.escape('、'.join(tags))}</p>")
    parts.append(
        f'<p><a href="{html.escape(url)}">阅读全文 →</a></p>'
        f'<p><small>本文首发于 <a href="{SITE_URL}/">知行录</a>。</small></p>'
    )
    return title, "\n".join(parts)


def send(title: str, body_html: str) -> None:
    user = os.environ["GMAIL_USER"]
    msg = EmailMessage()
    msg["Subject"] = title
    msg["From"] = user
    msg["To"] = os.environ["BLOGGER_POST_EMAIL"]
    msg.set_content("请用支持 HTML 的客户端查看。")
    msg.add_alternative(body_html, subtype="html")
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as s:
        s.login(user, os.environ["GMAIL_APP_PASSWORD"])
        s.send_message(msg)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base")
    ap.add_argument("--head")
    ap.add_argument("--files", help="手动指定要发的文章（相对 content/，空格分隔），不看 git 历史")
    ap.add_argument("--dry-run", action="store_true", help="只打印，不发邮件")
    args = ap.parse_args()

    if args.files:
        added = args.files.split()
    elif args.head:
        added = git_added_files(args.base or "", args.head)
    else:
        ap.error("需要 --files，或 --base 和 --head")
    if not added:
        print("没有新文章。")
        return 0

    index = json.loads(Path(INDEX_PATH).read_text(encoding="utf-8"))
    by_path = {v["filePath"]: v for v in index.values()}

    failed = 0
    for rel in added:
        entry = by_path.get(rel)
        if entry is None:
            # 草稿等不会出现在站点里的文章
            print(f"跳过（不在站点索引中）：{rel}")
            continue
        title, body_html = build_post(entry, Path(CONTENT_DIR) / rel)
        if args.dry_run:
            print(f"=== {title} ===\n{body_html}\n")
            continue
        try:
            send(title, body_html)
            print(f"已发送：{title}")
        except Exception as e:  # 一篇失败不影响其他篇
            failed += 1
            print(f"发送失败：{title}：{e}", file=sys.stderr)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
