---
title: 难忘的部署之旅：我的博客是如何上线 GitHub Pages 的
date: 2025-12-05
category: thoughts
tags: ['GitHub Pages', '部署', 'CI/CD', '开发故事']
description: 记录一次跌宕起伏的博客部署经历。从 Cloudflare 到 GitHub Pages 的抉择，从私有仓库的权限报错到自动化部署的最终跑通，这不仅是技术的胜利，更是探索精神的见证。
coverImage: https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3
author: Admin
featured: true
---

# 难忘的部署之旅：我的博客是如何上线 GitHub Pages 的

今天下午，我的个人博客 **Pennfly 创新实验室** 终于正式在互联网上安家了。

看着浏览器地址栏里那串属于我的 `github.io` 域名，内心涌起一阵难以言喻的激动。这不仅仅是一个网站的上线，更是一次从"本地自嗨"到"面向世界"的跨越。

回顾这短短几个小时的部署过程，真可谓是跌宕起伏，充满了戏剧性。

## 抉择：Cloudflare 还是 GitHub？

起初，我还在犹豫是部署到 Cloudflare Pages 还是 GitHub Pages。
Cloudflare 确实强大，但转念一想：我的代码本来就托管在 GitHub 上，如果能直接用 GitHub Pages，岂不是实现了**"代码即部署"**的完美闭环？

而且，配合 **GitHub Desktop** 这个神器，我可以在本地写完文章，点一下推送，云端就自动更新。这种**"所见即所得"**的流畅感，太吸引人了。

于是，我果断选择了 GitHub Pages。

## 挫折：意料之外的"红灯"

一切似乎都很顺利。我配置好了 `vite.config.ts`，写好了自动化部署脚本 (`deploy.yml`)，满怀信心地点击了 Push。

然而，现实给我泼了一盆冷水——构建失败了。❌

看着屏幕上那刺眼的红色报错，我才恍然大悟：原来我的仓库是 **Private (私有)** 的，而 GitHub Pages 的免费版只支持 **Public (公开)** 仓库。

那一刻，屏幕上提示的 *"Upgrade or make this repository public"* 显得格外扎眼。

## 转机：拥抱开源

面对这个"拦路虎"，我面临两个选择：要么退回到 Cloudflare（支持私有仓库），要么把仓库公开。

我选择了后者。

**"既然是博客，本来就是要给人看的，代码公开又何妨？"**

想通了这一点，我果断去设置里把仓库改成了 Public。这一步看似简单，却是我心态上的一次重要转变——从封闭走向开放，这不正是开源精神的写照吗？

## 成功：绿色的对勾 ✅

修改完设置，重新运行 GitHub Actions。

这一次，我紧盯着屏幕，看着进度条一点点走完。终于，那个期待已久的**绿色对勾**出现了！

当你看到 *"Your site is live"* 的提示时，那种成就感是任何语言都无法形容的。

## 现在的我

现在，我拥有了一套令我骄傲的现代化写作流：
1.  在本地用 **Typora** 沉浸式写作。
2.  在浏览器里实时预览，用我们开发的**"发布"**功能一键保存。
3.  打开 **GitHub Desktop**，看着绿色的新增文件，心满意足地点击 **Push**。
4.  几分钟后，全世界都能看到我的新文章。

这就是技术的魅力。它充满了挑战，但只要你敢于尝试，敢于解决问题，它终将回报你最甜美的果实。

Hello World, Hello GitHub Pages! 🌍
