---
title: "本地 AI 生态破局：集齐御三家与 Claude Desktop 极限部署指南"
date: 2026-04-27
description: "本周见证了本地 AI 生态的‘奇点时刻’。不仅集齐了 OpenAI、Anthropic 和 Google 御三家，更是依靠 Codex 协助，成功通过第三方 Gateway 部署了饱受报错困扰的 Claude Desktop。"
tags: [AI, 架构, 运维, 踩坑记录]
coverImage: /images/2026-04-27-gathering-three-majors.png
---

# 本地 AI 生态破局：集齐御三家与 Claude Desktop 极限部署指南

> **日期**: 2026-04-27
> **主题**: 本地多模型协同生态的建立与 Claude Desktop 第三方 API 部署排坑
> **状态**: 完成

随着大模型领域的“核弹级”爆发，云端算力的内卷已经延伸到了开发者的本地桌面。本周，我的本地工作流迎来了历史性的“奇点时刻”：通过开源工具与第三方 API 代理的配合，我们终于在一台物理机上集齐了国际大厂的“御三家”：**OpenAI (Codex)、Anthropic (Claude Desktop) 与 Google (Antigravity)**。

在这三者的协同下，由 Codex 掌控底层终端执行、由 Claude 负责深度逻辑与长文本解析、由 Antigravity 和 Cursor 负责代码重构，形成了完美的闭环生态。然而，集齐这套生态绝非一帆风顺，其中**最硬的骨头，当属使用第三方 API（MiniMax 3P Gateway）部署 Claude Desktop 的过程**。

本文将重点记录这段通过 Codex 协助排障，最终降伏 Claude Desktop 安装的踩坑历程。

## 1. 陷入泥潭：Claude CLI 的安装死局

我的目标非常明确：**不使用 Claude 官网的网页授权，而是通过第三方网关（Gateway）模式，接入 MiniMax 的 Anthropic 兼容 API**。

最初，我尝试使用 `claude cli` 协助触发 Desktop 的安装。然而，Windows 环境下的 MSIX 打包机制给了我迎头一击：安装过程最后出现黑框卡死，普通用户直接双击执行或使用 `Add-AppxPackage` 也会报错退出。

### 核心报错

系统抛出了经典的 `0x80073D02` 和 `0x80073D28` 错误：

> HRESULT: 0x80073D28
> 需要管理员权限才能安装打包服务

这说明由于 Claude 内部包含并注册了系统级服务（Packaged Service），系统拒绝了普通用户的无感更新。然而，由于 CLI 是以当前用户权限代触发的，导致陷入了“无法停止旧进程 -> 无法静默覆盖 -> 报错回滚”的死循环。

## 2. 破局之道：Codex 诊断与 PowerShell 强拆

在僵局下，我的突破口来自刚刚在本地跑通沙箱机制的 **Codex**。

通过 Codex 的分析和 Windows Sandbox 日志比对，我们明确了必须绕过 CLI 的“好心办坏事”。我们采取了最原始但最有效的暴力拆解方案：**完全停止相关进程，并使用管理员权限强行拉起安装。**

正确的安装姿势应当是打开管理员权限的 PowerShell，并执行以下命令：

```powershell
pwsh -NoProfile
# 强杀所有残留的 Claude 进程
Get-Process Claude -ErrorAction SilentlyContinue | Stop-Process -Force

# 强制关闭应用并无视版本号覆盖安装
Add-AppxPackage -Path "C:\Users\Admin\Downloads\Claude.msix" -ForceApplicationShutdown -ForceUpdateFromAnyVersion

# 验证安装状态
Get-AppxPackage -Name Claude | Select-Object Name,PackageFullName,Version,Status
```

当状态返回 `Ok` 时，那个困扰了数日的黑框问题终于灰飞烟灭。

## 3. 最后的高墙：修复 Legacy Model 的降级陷阱

安装成功只是第一步。当我成功配对了 Gateway 并在 `claude_desktop_config.json` 中写入 MiniMax 的 Key 时，发现新建的对话列表里模型全部退化成了 `Legacy`。

这是一个极为普遍的坑：**官方 Claude Desktop 对第三方 Gateway 模型的自动发现机制（Model Discovery）存在严重缺陷**。当它通过第三方网关拉取不到合法的官方模型列表时，就会直接 Fallback 到 Legacy 模式。

### 最终配置方案

为了彻底解决这个问题，必须在配置文件中通过环境变量强制指定模型映射。完整的配置如下（通过 `Developer -> Edit Config` 打开 `settings.json`）：

```json
{
  "disableDeploymentModeChooser": true,
  "inferenceProvider": "gateway",
  "inferenceGatewayBaseUrl": "https://api.minimax.io/anthropic",
  "inferenceGatewayApiKey": "你的_MiniMax_API_Key",
  "inferenceGatewayAuthScheme": "bearer",

  "env": {
    "ANTHROPIC_BASE_URL": "https://api.minimax.io/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "你的_MiniMax_API_Key",
    "ANTHROPIC_MODEL": "MiniMax-M2.7",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "MiniMax-M2.7",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "MiniMax-M2.7",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "MiniMax-M2.7",
    "ANTHROPIC_SMALL_FAST_MODEL": "MiniMax-M2.7"
  },

  "isClaudeCodeForDesktopEnabled": true,
  "isDesktopExtensionEnabled": true
}
```

保存此配置，并在应用中执行 `Help -> Troubleshooting -> Reset App Data` 后，桌面版终于稳稳地连上了 MiniMax-M2.7！

## 4. 隐秘的基石：Notion 本地集成与知识流转

集齐了强大的模型算力，如果没有可靠的记忆载体，AI 就只能是无根之水。在解决 Claude Desktop 的部署之余，本周的另一项核心突破，是**完成了本地环境与 Notion 知识库的底层打通**。

我们果断放弃了容易在复杂网络下被风控阻断的官方 Desktop Connector，转而在本地拉起了定制的 `notion_local` MCP 服务。通过 `start-notion-mcp.ps1` 脚本，将内部 Token 安全地交由 Codex 沙箱挂载。这意味着，本地的大模型终于可以直接向云端的 Notion 数据库进行结构化的读写。

配合同步确立的《左侧栏分层草案》与《线程管理规范》，我们将 AI 的对话空间严格划分为“配置、集成、项目”三大领域。本地的文件树与云端的知识库不再孤立，而是形成了一个完整的、能被大模型理解的“工作主控台”。

## 5. 结语：不可思议的协同

当 `Cowork 3P | Gateway` 的字样出现在 Claude Desktop 的底部，当底层的 Codex 沙箱静默地运行着系统巡检，当 Cursor (Opencode 代理) 顺滑地生成着代码，而 Notion MCP 正在后台有条不紊地同步架构文档时，我意识到，我们已经跨入了一个全新的工作流时代。

安装 Claude Desktop 的磨难，反而成了这套多智能体协同机制最好的试金石。我们不仅打破了客户端对官方接口的绑架，更是用 AI 排除了 AI 客户端部署过程中的故障。

本地 AI 基础设施的大一统，已然到来。
