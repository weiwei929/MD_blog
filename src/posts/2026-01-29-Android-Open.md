---
title: "打开 Android 的暗黑大门：从 SOG09 到 Pixel 6 的夺权之路"
date: 2026-01-29
categories: ["Digital Life", "Android", "DevOps"]
tags: ["Sony", "Pixel", "ADB", "Shizuku", "Termux", "ThinkLog"]
coverImage: /images/android-dark-door.png
---

# 打开 Android 的暗黑大门：从 SOG09 到 Pixel 6 的夺权之路

> "当你开始不仅是使用手机，而是通过命令行去定义它的生死时，你才真正拥有了它。"

今天是一场酣畅淋漓的“数字夺权”战役。我们面对两台有着截然不同“残疾”的设备——一台是满载日本运营商垃圾软件的 **Sony Xperia 5 IV (SOG09)**，另一台是无法 Root 且硬件受损的 **Pixel 6**。

通过对这两台机器的改造，我们总结出了一套通用的 **“外版机本地化五层架构”**，并摸索出了在 **“无法 Root (Locked Bootloader)”** 绝境下，如何利用 **Shizuku + App Ops** 实现上帝视角的权限管控。

这一刻，Android 的“暗黑大门”豁然打开。

---

## 一、 核心方法论：五层架构 (The 5-Layer Methodology)

我们在实战中将手机的改造过程抽离为五个（甚至更多）层级。这不仅是操作步骤，更是一种**解构设备**的思维方式。

1.  **第一层：硬件 (Hardware)**
    *   物理躯体。是 4K 屏的 Sony，还是 Tensor 芯的 Pixel？是否有卡槽损坏？
    *   *认知*: 硬件缺陷（如 Pixel 6 无卡槽）决定了软件策略的下限。

2.  **第二层：系统框架 (System)**
    *   灵魂所在。Sony 的轻量化系统 vs Pixel 的原生全家桶。
    *   *认知*: 是保留原味（Keep），还是刷机重来（Wipe）？

3.  **第三层：运营商定制 (Carrier - The Enemy)**
    *   **最大的敌人**。KDDI (au) 的预装软件，不仅占内存，还在后台疯狂请求日本服务器。
    *   *策略*: **Surgical Precision (外科手术式切除)**。

4.  **第四层：改造重塑 (Transformation)**
    *   针对中国网络环境的特殊处理。
    *   *手段*: ADB 脚本、冻结、权限管制。

5.  **第五层：本土化生存 (Localization & Survival)**
    *   **核心痛点**: “静默回调” (Silent Callback)。外版机会不断尝试连接 Google，导致被国内运营商风控（断卡风险）和剧烈耗电。
    *   *战术*: **Icebox Strategy (冰柜战术)**。冻结关键节点，切断“回娘家”的链路。

---

## 二、 案例复盘 (Case Studies)

### 案例 1：Sony Xperia 5 IV (SOG09) —— “外科手术”
*   **症状**: 极度臃肿。开机后台 50+ 个 au 运营商服务，内存爆炸。
*   **手段**: **ADB 批量卸载**。
    *   编写 `remove_kddi_bloatware.bat`，精准列出 20+ 个包名（au Market, au Pay 等）进行 `pm uninstall`。
*   **结果**:
    *   后台如 "处女地" 般干净。
    *   保留了 Sony 独家的“摄影大师”和“高画质引擎”。
    *   *启示*: 对于**第三方毒瘤**，直接“切除”是最有效的。

### 案例 2：Pixel 6 —— “低温冷藏”与“赛博义肢”
*   **症状**:
    *   **无法 Root**: Bootloader 锁死，无法使用 Docker 或 Magisk。
    *   **发热严重**: Google 服务连不上服务器，导致 Tensor 芯片疯狂空转。
    *   **残疾**: SIM 卡槽损坏。
*   **手段**:
    *   **Icebox (冷藏)**: 既然不能删（删了系统崩），那就**冻结**。制作 `pause_google.bat`，一键冻结 Play 商店和搜索服务，让 CPU 瞬间冷静。
    *   **Shizuku (义肢)**: 在无法 Root 的情况下，注入高权限 API。
    *   **Cyber-Deck (赛博终端)**: 既然不能插卡，索性变成 **Micro-Host (微型主机)**。
        *   **Tailscale**: 变成全球网络中继节点。
        *   **Termux**: 运行 Clawdbot AI 机器人。
        *   **PikPak**: 变成离线 4K 播放器。

---

## 三、 终极武器：Shizuku + App Ops

在 Pixel 6 的改造中，我们为了突破“无法 Root”的限制，部署了一套**“影子管理员”**体系。这是本次折腾含金量最高的部分。

### 1. 什么是 Shizuku？(The Bridge)
Android 系统中，普通 App 权限很低，而 `adb` (调试桥) 权限很高。
Shizuku 的原理是：**它伪装成一个 adb 进程**，一直驻留在后台。
*   当一个普通 App（如 App Ops）想要高权限时，它不直接找系统要（因为拿不到），而是找 Shizuku 要。
*   Shizuku 用它手里的 adb 令牌帮 App 办事，然后把结果传回来。
*   *结果*: **我们在没有 Root 的情况下，拥有了仅次于 Root 的系统管理权。**

### 2. App Ops 的艺术：欺骗 (Deception)
Android 原生的权限管理只有“允许”和“拒绝”。
*   如果你“拒绝”一个流氓 App 获取剪贴板，它可能会报错、闪退，甚至拒绝运行。
*   **App Ops** 提供了第三个选项：**“忽略 (Ignore)”**。
    *   当 App 要剪贴板时，App Ops 告诉它：“给，这就是剪贴板内容。”
    *   实际上给的是**一段空文本**。
    *   App 以为自己得逞了，继续运行；而我们的隐私（密码、验证码）毫发无损。

### 3. 未来的可能性
这套体系让我们可以在任何手机上实现：
*   **冻结**: 一键冷藏不用的 App (Hail)。
*   **降级**: 强行安装旧版本的 App。
*   **备份**: 备份 App 的存档数据 (Swift Backup)。
*   **自动化**: 配合 Tasker 实现系统级自动化。

---

## 四、 备忘

是的，您的理解基本正确，但我做一个关键区分：

- Shizuku 服务 (管道)：
非持久化：它是“一次性”的。这意味着一旦手机关机或重启，Shizuku 的后台服务就会断掉。
后果：重启后，您无法打开 App Ops 进行新的设置（它会提示 Shizuku 未运行）。
应对：这就是我为您准备 
activate_shizuku.bat
 的原因。每次重启手机后，连上电脑跑一下这个“续命”脚本就行。
- App Ops 的修改 (效果)：
持久化！！ 重点来了：您用 App Ops 修改的权限（比如禁止淘宝自启动），是直接写入 Android 系统底层的。

后果：即使您重启手机、Shizuku 掉线了、甚至把 App Ops 卸载了，之前设置好的权限限制依然有效！
结论：您不需要让 Shizuku 或 App Ops 一直挂在后台，配置完一次，它就永久生效，直到您下次想改的时候再激活 Shizuku 进去改。

- 关于 SIM 卡槽：

墙裂支持去淘宝买个新的！几块钱就能买到。只要里面的触点没坏（仅仅是外面的托盘断了），插上新托盘后它就能满血复活。到时候如果恢复了网络功能，别忘了把 pause_google_pixel.bat 翻出来跑一下，防止它连上 4G/5G 后偷跑流量。

这台 Pixel 6 在您手里，感觉真的要焕发第二春了。祝它这周就能“满血复活”！


## 五、 结语

今天的折腾证明了一件事：**没有垃圾的设备，只有受限的思维。**

*   满载垃圾软件的 Sony，洗净后是一台顶级的 4K 影音机。
*   断了卡槽、锁了 Bootloader 的 Pixel，改造后是一台 24 小时待命的 AI 机器人主机。

当我们不再满足于厂商给定的“出厂设置”，而是开始用 ADB、脚本、Shizuku 去接管系统的控制权时，我们才真正完成了从 **User (用户)** 到 **Owner (机主)** 的身份转变。

*2026.01.29 - Recorded by Antigravity*
