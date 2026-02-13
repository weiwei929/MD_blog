---
title: "Personal TV Station: Oracle ARM 上的私人广播塔"
date: 2026-02-13
description: "深度解析如何利用 Oracle ARM 24G 内存与 PikPak 无限空间，构建一个 24/7 永不消逝的私人电台。从 SRS 推流到 Rclone VFS 调优的技术全解。"
tags: [Streaming, Oracle, ARM, FFMPEG, SRS, SelfHosted]
coverImage: /images/lifevideo-neo.png
---

# Personal TV Station: Oracle ARM 上的私人广播塔

> **摘要**：在算法推荐和“猜你喜欢”泛滥的今天，我决定反其道而行之。利用闲置的 Oracle ARM 4核 24G 服务器，搭建了一个属于自己的 24/7 线性播出电视台。这不仅是一次技术折腾，更是一场关于“数字主权”与“慢媒体”的文艺复兴。

---

## 1. 缘起：为什么我们需要一个电视台？

在这个流媒体点播（VOD）统治世界的时代，我们似乎拥有了无限的选择权。打开 Netflix、YouTube 或 Bilibili，数以亿计的视频等待我们点击。然而，这种“无限选择”往往带来了“决策瘫痪”。

你是否也有过这样的经历：端着饭碗在电视机前，花 30 分钟不停地刷着封面图，最后饭都凉了，却还是不知道该看什么，最终沮丧地关掉屏幕刷起了短视频？

**“点播”赋予了我们选择的自由，却剥夺了我们“不选择”的自由。**

有时，我们需要的仅仅是**“陪伴”**。是一个永远在线的声音，是一个不需要动脑子去挑选的画面，是一种“我知道它在那里”的安全感。这就是传统电视台（Linear TV）的魅力。

于是，我决定利用手头闲置的 **Oracle Cloud Always Free (ARM)** 实例，打造一个 **Personal TV Station (PTS)**。它不为取悦算法，只为取悦我自己。

---

## 2. 架构美学：存算分离的极致压榨

Oracle 的 ARM 实例（Ampere A1）拥有 **4 OCPU** 和惊人的 **24GB 内存**，但硬盘只有区区 **100GB**（还要分给系统盘）。如果想打造一个拥有海量片库的电视台，传统的“下载-存储-推流”模式显然走不通。

因此，我设计了**“存算分离” (Storage-Compute Separation)** 的架构：

*   **计算 (Compute)**：由 Oracle ARM 承担。负责高负载的流媒体协议封装 (SRS) 和 视频流推送 (FFmpeg)。
*   **存储 (Storage)**：
    *   **L1 (Local)**：本地 100G NVMe。存放最近热播的精选内容和系统镜像。
    *   **L2 (Remote)**：异地大盘鸡 VPS (1TB)。通过 **WebDAV** 挂载，存放常看的电影和剧集。
    *   **L3 (Cloud)**：PikPak 网盘 (无限空间)。通过 **Rclone** 挂载，作为无限的冷数据仓库。

### 架构图

```mermaid
graph TD
    User[用户设备 (Phone/TV/Pad)] -->|HTTP-FLV/HLS| SRS[Oracle ARM: SRS Server]
    SRS -->|RTMP Loopback| FFMPEG[FFmpeg Pusher]
    
    subgraph Storage Layer
        FFMPEG -->|Direct Read| Local[L1: 本地 100G NVMe]
        FFMPEG -->|WebDAV Mount| Remote[L2: 大盘鸡 1TB]
        FFMPEG -->|Rclone VFS| Cloud[L3: PikPak Cloud]
    end
    
    subgraph Optimization
        RAM[24GB RAM] -.->|VFS Cache| Cloud
        RAM -.->|GOP Cache| SRS
    end
```

这个架构的核心在于：**用 Oracle 巨大的内存，去换取云存储的高延迟。**

---

## 3. 核心技术栈：当 ARM 遇上流媒体

### 3.1服务端：SRS (Simple Realtime Server)

在流媒体服务器的选择上，我毫不犹豫地放弃了臃肿的 Nginx-RTMP，选择了国产之光 **SRS 5.0**。

SRS 5.0 对 Docker 的支持极佳，且在 ARM 架构下运行稳定。最重要的配置在于**低延迟**与**秒开**的平衡：

```nginx
# srs.conf 核心配置片段
vhost __defaultVhost__ {
    # 开启 GOP 缓存，这是实现"秒开"的关键
    # 播放器连接时，SRS 会瞬间发送前一个关键帧组，让画面立刻出现
    gop_cache       on;
    
    # 降低队列长度，减少直播延迟
    queue_length    10;
    
    # HTTP-FLV 配置
    http_remux {
        enabled     on;
        mount       [vhost]/[app]/[stream].flv;
    }
}
```

### 3.2 存储挂载：Rclone VFS 的调优魔法

这是整个项目最困难，也最精彩的部分。

直接挂载网盘推流，最怕的就是**网络抖动**。一旦网盘读取慢了 1 秒，FFmpeg 就会断流，直播就会卡顿。

这时候，Oracle 的 **24GB 内存**派上了大用场。我们通过 Rclone 的 VFS (Virtual File System) 功能，在内存中开辟一个巨大的缓冲区。

```bash
# Rclone 挂载命令精华
rclone mount pikpak:/ /mnt/media/pikpak \
--allow-other \
--vfs-cache-mode full \        # 开启完整缓存模式
--vfs-read-chunk-size 128M \   # 每次预读 128M，减少请求次数
--vfs-read-chunk-size-limit 2G \ #这很重要！
--buffer-size 1G \             # 关键：在内存中预留 1GB 的缓冲区！
--dir-cache-time 12h
```

**`--buffer-size 1G`** 是神来之笔。这意味着，即使云端连接断开，FFmpeg 依然可以从内存中读取未来 1GB（约 10-20 分钟）的视频数据。这足以抵消任何网络波动，让 Cloud 直播像播放本地文件一样丝般顺滑。

### 3.3 推流端：FFmpeg 的“无缝切换”

如何实现像电视台那样，一个节目播完，自动播下一个，中间不黑屏、不断流？

我编写了一个 `playlist_gen.sh` 脚本，配合 FFmpeg 的 `concat` 协议：

```bash
#!/bin/bash
# 自动生成播放列表
find /mnt/media/pikpak/Movies -name "*.mp4" | sort -R > /tmp/playlist.txt
sed -i "s/^/file '/;s/$/'/" /tmp/playlist.txt

# 启动 FFmpeg 推流（无限循环模式）
ffmpeg -re -f concat -safe 0 -i /tmp/playlist.txt \
-c copy \ # 关键：不转码！直接复制流，CPU 占用极低
-f flv rtmp://localhost/live/movie
```

这里使用了 **`-c copy`** 模式。因为我的片源大部分已经是 H.264 编码，直接推流可以将 CPU 占用控制在 5% 以内。如果遇到编码不兼容的视频（如 H.265），我们可以利用 Oracle ARM 的多核性能进行实时转码，或者在上传前统一进行预处理。

---

## 4. 体验与感悟：慢媒体的回归

经过一周的调试，我的 Personal TV Station 终于上线了。

我在 iPad 上打开 DPlayer，画面瞬间加载出来。此刻播放的是一部 90 年代的老港片。我不需要去想这部电影叫什么，也不需要去拖动进度条。我只需要把 iPad 架在厨房边，一边切菜，一边听着熟悉的粤语对白。

**这种感觉很奇妙。**

在一个算法试图比你更懂你的世界里，拥有一个**“完全由自己掌控，却又充满随机性”**的频道，是一种奢侈的自由。

*   **精选频道**：播放我精挑细选的 Top 100 电影，那是我的精神避难所。
*   **家庭频道**：播放家庭录像和旅行 Vlog，那是属于我们的小温馨。
*   **睡眠频道**：播放白噪音和深海画面，那是属于深夜的宁静。

这也是 **Self-Hosted** 的终极意义：不是为了省钱（其实 VPS 和时间成本更贵），而是为了夺回对数字生活的**定义权**。

---

## 5. 写在最后：One More Thing

你可能会问：这和在 NAS 上用 Plex/Emby 随机播放有什么区别？

区别在于**“仪式感”**。

Plex 是私人的点播影院，你依然需要“去播放”。而 Personal TV Station 是悬浮在公网上的广播塔。它不依赖于你的家庭网络，它 24 小时都在那里，向着虚空发射信号。

无论我在世界的哪个角落，只要有网络，接入这个流，我就能回到那个熟悉的、由我亲手构建的数字时空中。

这就是我的 **Oracle ARM 广播塔**。即使没有观众，它也会一直播下去。因为这是独属于我的，永不消逝的电波。

> **下期预告**：我们将探讨如何结合 LLM (Large Language Model)，让 AI 成为电视台的“导播”，根据我的实时心情自动编排节目单，甚至实时生成解说词。敬请期待！
