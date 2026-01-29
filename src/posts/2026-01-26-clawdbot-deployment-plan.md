---
title: "Clawdbot 部署作战图：Aliyun 与 Debian 13 的实战演练"
date: 2026-01-26
description: "Clawdbot 在阿里云 VPS 上的性能可行性分析与部署步骤。"
tags: [Clawdbot, Aliyun, VPS, Deployment]
coverImage: /images/clawdbot-deployment.png
---

# Clawdbot Deployment Plan (Aliyun / Debian 13)

> **目标**: 在 Aliyun 新加坡 VPS (Debian 13) 上部署 Clawdbot，作为个人 AI Agent 控制中心。

## 🔬 性能可行性分析 (Feasibility)

**结论: Aliyun 新加坡机型 (现有配置) 完全足以胜任 Clawdbot 控制中心的角色。**

| 指标 | Clawdbot Gateway 需求 | Aliyun VPS 现状 | 评价 |
| :--- | :--- | :--- | :--- |
| **CPU** | 1 vCPU | 1 vCPU (轻负载) | ✅ **匹配** (Gateway 仅做逻辑转发) |
| **RAM** | 512MB - 1GB | > 1GB | ✅ **充裕** (Node.js 运行时占用极低) |
| **网络** | 访问 AI API 顺畅 | 新加坡优化线路 | ✅ **完美** (这是最大的优势) |
| **硬盘** | ~500MB | 20GB+ SSD | ✅ **无压力** (主要存少量 Markdown 文本) |

> **关键决策**: 我们采用 **Mode A (Control Center)** 方案，即 VPS 仅运行 Gateway 负责调度和连接，实际的 AI 推理 (Thinking) 通过外部 API (OpenAI/Anthropic) 完成。**坚决不在 VPS 上运行本地大模型 (Local LLM)**。

## 📋 环境准备 Checklist

### 1. 系统环境检查
- [ ] 确认系统版本: `cat /etc/debian_version` (预期: 13.x / Trixie)
- [ ] 确认 CPU 架构: `uname -m` (预期: x86_64 or aarch64)

### 2. Node.js 22 环境安装 (关键)
Clawdbot 需要 **Node.js 22** 或更高版本。Debian 默认源可能较旧，推荐使用 `fnm` 或 `nvm` 管理，或者直接用 NodeSource 源。

**推荐方案 (fnm - Fast Node Manager):**
```bash
# 1. 安装 fnm
curl -fsSL https://fnm.vercel.app/install | bash

# 2. 激活 fnm (根据提示添加到 .bashrc 或 .zshrc)
source ~/.bashrc

# 3. 安装 Node 22
fnm install 22
fnm use 22
fnm default 22

# 4. 验证
node -v # 应显示 v22.x.x
npm -v
```

---

## 🦞 Clawdbot 部署流程

### Step 1: 安装 Clawdbot CLI
```bash
# 全局安装
npm install -g clawdbot@latest

# 验证安装
clawdbot --version
```

### Step 2: 初始化与守护进程 (Daemon)
Clawdbot 需要一个后台守护进程 (Gateway) 来保持在线。

```bash
# 使用 onboard 向导 (推荐)
# 它会自动探测系统并尝试安装 systemd service
clawdbot onboard --install-daemon
```
*注意: 如果遇到权限问题，可能需要 `sudo` 或手动配置 systemd。*

**如果需要手动启动 Gateway (调试用):**
```bash
clawdbot gateway --verbose
```

### Step 3: 连接 Telegram (主要通道)
这是你与 Agent 交互的界面。

1.  **准备 Bot Token**: 在 Telegram 找 @BotFather 创建一个新 Bot，获取 Token。
2.  **配置 Clawdbot**:
    ```bash
    # 配置 Telegram 通道
    clawdbot config set channels.telegram.enabled true
    clawdbot config set channels.telegram.token "YOUR_TELEGRAM_BOT_TOKEN"
    
    # 重启 Gateway 以生效
    clawdbot gateway restart
    ```
3.  **连接与配对**:
    - 在 Telegram 中向你的 Bot 发送 `/start`。
    - 如果配置了安全策略 (默认是 `pairing`)，Bot 会回复一个配对码。
    - 在 VPS 上运行: `clawdbot pairing approve telegram <code_from_chat>`
    - 成功！现在你可以通过 Telegram 对话了。

---

## 🛠️ 常用命令速查

| 动作 | 命令 | 说明 |
| :--- | :--- | :--- |
| **检查状态** | `clawdbot doctor` | 诊断环境和配置问题 |
| **发送消息** | `clawdbot message send --to <user> "Hello"` | 主动发消息 |
| **让 Agent 思考** | `clawdbot agent --message "Check server"` | 触发 Agent 逻辑 |
| **查看日志** | `journalctl -u clawdbot-gateway -f` | 如果是 systemd 托管 |

## 🧩 Next Steps: Skill 开发

Once Telegram is connected, the next step is to give it "something to do".
We will create a `server-status` Skill.

1.  Create directory: `mkdir -p ~/.clawdbot/skills/server-status`
2.  Create `skill.yaml` (definition and logic)
    - *Details provided in next phase*

## ⚠️ 避坑指南 (Troubleshooting)

### 1. 内存不足与 tmpfs 陷阱 (OOM Killer)

**现象**:
- `npm install` 过程中出现 `Killed`。
- 或者报错 `No space left on device` (但硬盘明明还有空)。
- 机器假死，SSH 无响应，必须重启。

**原因**:
- 低内存 VPS (如 512MB) 的 `/tmp` 通常是 **tmpfs** (内存盘)，大小只有内存的一半 (约 200MB)。
- **Clawdbot 安装包** 解压后加上依赖，轻松突破 200MB，导致内存瞬间爆满或 `/tmp` 写满。

**终极解决方案**:

1.  **强制使用硬盘做临时目录**:
    ```bash
    mkdir -p /root/npm_tmp
    export TMPDIR=/root/npm_tmp
    ```
2.  **激进使用 Swap**:
    ```bash
    # 确认 swap 存在
    free -h
    # 强制内核积极换页
    sysctl -w vm.swappiness=100
    ```
3.  **限制 npm 并发**:
    ```bash
    # 串行安装，不校验审计
    npm install -g clawdbot@latest --omit=dev --foreground-scripts --no-audit
    ```
4.  **(推荐) 换用 pnpm**:
    pnpm 对硬盘和内存更友好，是低配小鸡的救星。
    ```bash
    pnpm add -g clawdbot@latest
    ```

---

## 🛑 部署中止 (Aborted) - 2026-01-26

### 🔴 遇到的问题 (Pitfall Record)
> **状态**: 放弃部署 (Aborted)
> **原因**: 持续的不稳定 (Persistent Instability) 和资源限制 (Resource Limitations)

尽管 Aliyun VPS 理论上可以运行，但在实际尝试中遭遇了以下严重问题，导致无法构建稳定的环境：

1.  **资源瓶颈**: Node.js 现代运行时 (v22+) 配合 Clawdbot 及其依赖链，在低配 VPS (特别是 512MB/1GB 内存且无 Swap 优化的情况下) 表现极差，频繁触发 OOM Killer 杀死安装进程或守护进程。
2.  **构建失败**: `npm install -g clawdbot` 过程中多次因为内存耗尽而失败，即使调整了 `TMPDIR` 和并发参数，稳定性依然堪忧。
3.  **维护成本**: 为了维持这个"勉强能跑"的环境，需要花费大量精力在系统微调上，违背了"Control Center"应当稳定可靠的初衷。

### 🗑️ 卸载与清理指南 (Cleanup Guide)

为了恢复 VPS 的清洁状态，请执行以下操作：

**1. 停止并禁用服务 (Systemd)**
```bash
# 停止服务
systemctl stop clawdbot-gateway

# 禁用开机自启
systemctl disable clawdbot-gateway

# 删除 service 文件 (如果存在)
rm /etc/systemd/system/clawdbot-gateway.service
rm /etc/systemd/system/clawdbot-agent.service # 如果有

# 重载 systemd
systemctl daemon-reload
```

**2. 停止进程 (PM2)**
如果使用了 PM2 管理：
```bash
pm2 delete clawdbot
pm2 save
pm2 kill # 如果不再运行其他 Node 应用
```

**3. 删除全局包**
```bash
# 如果用 npm 安装
npm uninstall -g clawdbot

# 如果用 pnpm
pnpm remove -g clawdbot
```

**4. 删除配置与数据 (关键)**
Clawdbot 的所有配置默认在 home 目录下的 `.clawdbot`。
```bash
rm -rf ~/.clawdbot
```

**5. 卸载 Node.js / fnm (可选)**
如果这台机器不再需要 Node环境：
```bash
# 卸载 fnm 及其管理的 Node 版本
rm -rf ~/.fnm
# 记得清理 .bashrc 中的相关行
```

## 6 教训总结

通过这段日志，我们不仅验证了资源不足的猜测，还看到了更深层的**"现场惨状"**。

这个卸载过程的报错，其实是**"安装过程被系统暴力杀死 (Kill)"**留下的尸检报告。

🕵️‍♂️ 详细尸检报告 (Post-Mortem Analysis)
1. systemctl 报错: "Unit not loaded / does not exist"

系统说: "我根本不知道这玩意儿的存在。"

解读: 这说明 clawdbot onboard 命令里的自动化脚本根本没跑完，甚至可能根本没跑。通常安装包会在最后一步注册 systemd 服务，但因为前面的步骤就挂了，所以服务文件从未被创建。
结论: 这是一个**"胎死腹中"**的安装。
2. pm2 / pnpm 报错: "command not found"

解读: 这是一个纯净环境，你没有额外安装这些工具。这很好，排除了干扰项，问题纯粹就在于 npm 和 Node 本身。
3. npm uninstall 报错: "ENOTEMPTY: directory not empty" (核心证据 🔍)

npm 说: "我想删目录，但里面或者是乱的，或者被锁住了，我搞不定。"

解读: 这是最典型的 OOM (内存溢出) 后遗症。

当你之前尝试安装时，npm 正在解压成千上万个小文件到磁盘。
突然，内存爆了，Linux 内核触发 OOM Killer，直接给 npm 进程来了个"断头台" (SIGKILL)。
进程瞬间消失，来不及做任何清理工作（关闭文件句柄、删除临时文件、更新索引）。
结果就是：文件系统里留下了**"写了一半的文件"和"损坏的目录结构"**。现在的 npm 试图去操作这个损坏的目录时，就报错了。
💡 最终结论
这不仅是"安装失败"，而是**"安装崩溃"**。

Aliyun 1C1G 在运行现代 Node.js 工具链（尤其是像 Clawdbot 这种依赖复杂的 Agent 框架）时，连最基本的IO 解压和链接步骤都撑不住。这不是你的操作问题，纯粹是物理定律的限制 —— 现在的 AI Agent 框架虽然叫"轻量级"，但 Node 22 运行时的基础开销加上 npm 的笨重，对于 512MB/1G 内存的小机简直是降维打击。

这一页确实该翻过去了。 你的决策非常及时，继续折腾下去只会把系统环境搞得更乱。我们现在的主线任务回归到 Agent Skills 的概念学习上，等待未来的硬件就位。