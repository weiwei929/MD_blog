---
title: "Clawdbot VPS 部署实录：一次零到一的完美突围"
date: 2026-01-26
description: "Clawdbot 在 VPS 上的成功部署日志，集成了 GLM 和 Telegram。"
tags: [Clawdbot, VPS, Telegram, Success]
coverImage: /images/clawdbot-vps-success.png
---

# 2026-01-26｜Clawdbot 在 VPS 上的部署日志（一次很成功的突破）

> 这是一次对我意义很大的搭建：**从 0 到 1 把 Clawdbot 真正跑起来**，接入 GLM（zai provider），连通 Telegram，并且通过已有的 Caddy 反代让控制台走 HTTPS 访问。过程中踩了不少坑，但最终 **稳定跑通、能中文对话、还能按时定时巡检发报告**。我会很骄傲地说：**这次搭建非常成功，是一个重大的突破。**

---

## 目标与约束

- **目标 1**：在 VPS 上部署 [Clawdbot](https://github.com/clawdbot/clawdbot)，优先“先跑起来”，便于后续迭代。
- **目标 2**：模型使用 **GLM**（Clawdbot 内置 `zai` provider）。
- **目标 3**：接入 **Telegram Bot**，并通过私聊完成配对与对话。
- **目标 4**：控制台（Control UI / WebChat / Gateway）通过 **Caddy** 反代上 HTTPS，并使用 **token 鉴权**。
- **目标 5**：做成“运维小哥”——每天 **08:10 / 20:10（Asia/Shanghai）** 自动巡检并中文汇报。
- **约束**：尽量不破坏 VPS 现有服务（机器上已有 Caddy 在跑 Jellyfin/Filebrowser/Code-Server 等站点）。

---

## 最终架构（成功版）

### 核心组件

- **Clawdbot Gateway（Docker 容器）**
  - 提供 WebSocket Gateway（默认 `18789`）与 Control UI/静态资源入口
  - 负责 Telegram 机器人接入、模型调用、Cron 定时任务
- **Caddy（已有 Docker 化反代）**
  - 负责对外的 80/443
  - 为 `clawdbot.pf2008.com` 自动申请并续期 TLS 证书
  - 反代到 Clawdbot Gateway（同 Docker 网络）

### 安全策略（当时的关键取舍）

- **宿主机端口不直接暴露**：`18789/18790` 在宿主机只绑定到 `127.0.0.1`，外网只走 Caddy 的 443。
- **Control UI/Gateway 使用 token**：浏览器端通过 `?token=...` 或 Control UI 设置里粘贴 token。
- **Telegram 使用 pairing**：避免 allowlist 配错导致“能收到但无法使用”，也避免机器人被陌生人探测。

---

## 目录与关键文件（最终落地）

### 数据与配置（宿主机持久化）

- `/opt/clawdbot/env/clawdbot.env`：敏感环境变量（**不进 git**）
- `/opt/clawdbot/config/clawdbot.json`：网关/agent/telegram/cron 等配置
- `/opt/clawdbot/workspace/`：Clawdbot agent 工作区（身份、人设、心跳、文档等）

### 运行编排

- `/root/clawdbot/docker-compose.local.yml`：自定义 Compose（构建镜像、挂载卷、端口、启动命令）
- `/opt/media-server/caddy/Caddyfile`：新增 `clawdbot.pf2008.com` 站点反代

---

## 关键配置（脱敏示例）

### 1) 环境变量：`/opt/clawdbot/env/clawdbot.env`

```bash
TELEGRAM_BOT_TOKEN=xxxx:yyyyyyyyyyyyyyyyyyyyyyyyyyyy
TELEGRAM_ALLOW_FROM=409295620
ZAI_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxx
CLAWDBOT_GATEWAY_TOKEN=（强随机长 token）

# 网络与时区
NODE_OPTIONS=--dns-result-order=ipv4first
TZ=Asia/Shanghai
```

**注意**：
- `CLAWDBOT_GATEWAY_TOKEN` 一旦在聊天/截图里泄露，要**立刻旋转**并重建容器。
- `NODE_OPTIONS=--dns-result-order=ipv4first` 是为避免某些环境下 Telegram IPv6 解析带来的坑（表现为连接异常/超时）。
- `TZ=Asia/Shanghai` 让 cron 与日志时间更符合使用习惯。

### 2) 主配置：`/opt/clawdbot/config/clawdbot.json`

核心思路：
- 开启 `gateway.mode=local`
- Telegram：`dmPolicy=pairing`、禁用群聊
- 429 限流：`maxConcurrent=1` + 禁用 heartbeat（把周期性噪音降到最低）
- 设定 agent identity：名字 **聪明小虾 🦐**
- 开启 cron

（示意结构，字段以实际为准）

```json
{
  "gateway": { "mode": "local" },
  "agents": {
    "list": [
      {
        "id": "main",
        "default": true,
        "name": "聪明小虾",
        "identity": { "name": "聪明小虾", "emoji": "🦐" }
      }
    ],
    "defaults": {
      "model": { "primary": "zai/glm-4.7" },
      "maxConcurrent": 1,
      "heartbeat": { "every": "0m" },
      "userTimezone": "Asia/Shanghai",
      "timeFormat": "24"
    }
  },
  "cron": { "enabled": true, "maxConcurrentRuns": 1 },
  "channels": {
    "telegram": {
      "enabled": true,
      "dmPolicy": "pairing",
      "groupPolicy": "disabled"
    }
  }
}
```

### 3) 身份与定位：`/opt/clawdbot/workspace/IDENTITY.md`

这个文件非常关键：它决定了“聪明小虾”的人格与输出风格（结论优先、中文、偏运维执行）。

```md
- 名字：聪明小虾
- 身份/职责：VPS 运维小哥（偏工程化、偏执行）
- 语言：中文为主
- 风格：结论优先、简洁清晰；必要时给出可复制粘贴的命令；不输出废话
- 签名 Emoji：🦐
```

---

## 部署过程（按实际推进顺序记录）

### A. 选择 Docker 方案（先跑起来）

- 优点：可控、可迁移、与现有 Caddy/Docker 环境一致
- 缺点：默认容器里看不到宿主机的 Docker daemon（后面会提到）

### B. 编排网关容器（Compose）

关键点：
- 把配置与 workspace 用 volume 持久化（避免容器重建丢配置）
- 端口只对宿主机 loopback 发布，避免公网直接暴露
- 网关在容器内需要对外监听（供 Caddy 容器反代），因此启动时使用 `--bind lan`

（概念性要点）：
- `env_file: /opt/clawdbot/env/clawdbot.env`
- `volumes:`
  - `/opt/clawdbot/config -> /home/node/.clawdbot`
  - `/opt/clawdbot/workspace -> /home/node/clawd`
- `ports: 127.0.0.1:18789:18789`

### C. Telegram 配对（pairing）

典型现象：
- 机器人先发“access not configured / pairing code …”
- 需要在网关容器里执行：

```bash
docker exec -it clawdbot-clawdbot-gateway-1 sh -lc \
  'node dist/index.js pairing approve telegram <PAIR_CODE>'
```

成功后会看到类似 “Approved telegram sender <your_id>”。

### D. 接入 GLM（zai provider）

关键点：
- 使用 `ZAI_API_KEY`
- 模型指定为 `zai/glm-4.7`

### E. 反代上 HTTPS（Caddy）

新增站点：

- `clawdbot.pf2008.com` → `reverse_proxy clawdbot-gateway:18789`

最关键的一步不是 Caddy，而是 **DNS**：
- 初期 Caddy 日志报：`NXDOMAIN looking up A for clawdbot.pf2008.com`
- 解决：给域名增加正确的 **A 记录** 指向 VPS 公网 IP
- DNS 生效后，Caddy 自动签发证书，`curl` 返回 `HTTP/2 200` 即可确认

---

## 踩坑记录（以及我是怎么定位解决的）

### 1) 网关提示 “Missing config… set gateway.mode=local”

**原因**：最初配置文件格式/路径不符合网关预期（例如 json5/文件名不被读取），或缺少 `gateway.mode=local`。

**解决**：改为 `/opt/clawdbot/config/clawdbot.json`（标准 JSON）并写入：

```json
{ "gateway": { "mode": "local" } }
```

### 2) Caddy TLS 报错 / 浏览器 SSL internal error

**原因**：DNS 未配置导致证书无法签发（典型是 NXDOMAIN）。

**解决**：补齐 DNS A 记录 → 重载 Caddy → 等待自动签发成功。

### 3) Control UI 提示 “unauthorized: gateway token missing/mismatch”

**原因**：
- 没带 `?token=...` 访问
- 或 token 已旋转/环境变量没加载
- 或浏览器缓存了旧 token

**解决**：
- 使用 tokenized URL 或在 Control UI settings 粘贴 token
- 旋转 token 后重建容器
- 必要时清理浏览器缓存/站点数据

### 4) `.env` 被“改坏”：只剩一个新 token，其他三个变量变回 `CHANGE_ME`

**原因**：一次更新只替换了其中一行，但写入方式/操作失误导致其它行回退为模板占位符（典型表现：容器里环境变量 BAD）。

**解决**：
- 以宿主机文件为准，逐项确认 `/opt/clawdbot/env/clawdbot.env`
- 在容器里用脚本检查关键 env 是否 OK/BAD
- 重建容器让 env 生效

**经验**：任何涉及 secrets 的更新，都要做 “宿主机文件 + 容器内 env” 双重校验。

### 5) 模型 429：High concurrency usage

**原因**：并发过高或心跳/后台任务叠加导致短时间请求密集；外部 API 限流触发。

**解决**：
- `agents.defaults.maxConcurrent: 1`
- `agents.defaults.heartbeat.every: "0m"`（禁用心跳，减少周期调用）

### 6) “它只能在容器里，看不到宿主机 Docker”

**现象**：你问“宿主机上有哪些 docker 容器在跑”，它只能回答自己容器内进程。

**原因**：容器没有权限访问宿主机 docker socket（`/var/run/docker.sock`）。

**解决策略**（这次我们选择不改动）：保持现状，先把核心功能跑稳；下次再以最小权限方式开放宿主机 Docker 只读查看能力（见“优化升级”）。

---

## 里程碑：我最满意的三个“成功证据”

1) **Telegram 正常对话（中文）**  
它能清楚地说出：自己叫“聪明小虾 🦐”，是 VPS 运维小哥。

2) **健康检查正常**  
`health.ok=true`，Telegram `probe.ok=true` 能识别机器人账号。

3) **定时巡检已设置**  
Cron jobs 已创建并指向我的 Telegram 私聊：
- 08:10 晨检
- 20:10 晚检
- 时区 Asia/Shanghai

---

## 后续可优化/升级清单（我未来想做的）

### 1) 让“聪明小虾”看到宿主机 Docker（谨慎）

方案：把宿主机的 `/var/run/docker.sock` 以 **只读** 挂载到 Clawdbot 容器，并限制工具/命令，做到“只查不改”。

风险提示：docker.sock 本质上接近 root 权限接口，必须做好最小权限与审计。

### 2) 运维巡检报告更“专业化”

- 固化巡检指标：
  - CPU/Load/IOWait
  - 内存/Swap
  - 磁盘 inode / top 占用目录
  - 关键端口监听
  - Docker 容器重启次数/异常退出
- 加入“异常阈值”与“建议动作”模板（结论更像运维日报）

### 3) 监控与告警

- 对接 Prometheus + Grafana 或轻量级 node exporter
- 当磁盘/负载/容器重启超过阈值时，立即 Telegram 告警（不等 08:10/20:10）

### 4) 可靠性与可维护性

- 自动更新策略：镜像更新/回滚流程（含 changelog）
- 日志轮转：控制 gateway 日志大小与保留周期
- 配置备份：`/opt/clawdbot/config` 与 `/opt/clawdbot/workspace` 定期备份

### 5) 远程访问体验

如果长期通过 Caddy 反代访问：
- 根据需要设置 `gateway.trustedProxies`（消除“Proxy headers detected from untrusted address”警告）
- 更严格的访问控制（例如再加一层 Basic Auth / IP allowlist / Tailscale）

---

## 结语：这次真的很成功

从最初的“能不能跑”到最终的“**能稳定跑、能中文对话、能 HTTPS 访问、还能按时巡检汇报**”，这次搭建对我来说是一次非常实在的突破。

我最骄傲的不是“没遇到问题”，而是——**遇到问题能定位、能复盘、能把系统跑稳**。  
下一步就是持续迭代：让“聪明小虾”从“能用”变成“好用、可靠、安全、可进化”。

