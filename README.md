# Pennfly Innovation Lab Blog (Flying X studio)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Vite](https://img.shields.io/badge/Vite-4.4-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-cyan)

[English](#english) | [中文](#chinese)

---

<a name="english"></a>
## 🇬🇧 English

A modern, elegant, and feature-rich static blog built with React, TypeScript, and Tailwind CSS. Designed for **Pennfly Innovation Lab (Flying X studio)**.

### ✨ Features

- **🎨 Elegant UI**: "Elegant Grey" (Zinc) theme with flat design and smooth animations.
- **📝 Markdown First**: "File-as-Article" workflow. Just drop `.md` files into `src/posts` to publish.
- **⚡ Blazing Fast**: Powered by Vite for instant server start and HMR.
- **📱 Responsive**: Fully responsive design that looks great on mobile, tablet, and desktop.
- **🔍 Smart Search**: Real-time search for articles, tags, and keywords.
- **🏷️ Category & Tags**: Organize content with color-coded categories and tags.
- **🖼️ Image Optimization**: Automatic fallback for broken images and lazy loading.
- **🤝 Contact Hub**: Integrated modal for social media links (Email, X, GitHub, Discord, Telegram, Notion, etc.).
- **📄 Multi-page Layout**: Clean routing structure for Home, Articles, and About pages.

### 🚀 Getting Started

#### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

#### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/weiwei929/MD_blog.git
    cd MD_blog
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open your browser and visit `http://localhost:5173`.

### ✍️ How to Write Posts

1.  Create a new `.md` file in `src/posts/`.
2.  Add Frontmatter at the top of the file:

    ```yaml
    ---
    title: Your Article Title
    date: 2023-12-02
    category: tech
    tags: [React, Tutorial]
    description: A brief summary of your article.
    coverImage: https://example.com/image.jpg
    ---
    ```

3.  Write your content below the Frontmatter. It will automatically appear on the blog!

---

<a name="chinese"></a>
## 🇨🇳 中文

一个基于 React, TypeScript 和 Tailwind CSS 构建的现代、优雅且功能丰富的静态博客系统。专为 **Pennfly 创新实验室 (Flying X studio)** 设计。

### ✨ 主要特性

- **🎨 雅致 UI**: 采用“雅致灰” (Zinc) 主题，扁平化设计与流畅的动画效果。
- **📝 Markdown 优先**: “文件即文章”的工作流。只需将 `.md` 文件放入 `src/posts` 即可发布。
- **⚡ 极速体验**: 基于 Vite 构建，秒级启动和热更新。
- **📱 响应式设计**: 完美适配手机、平板和桌面端设备。
- **🔍 智能搜索**: 支持对文章标题、标签和内容的实时搜索。
- **🏷️ 分类与标签**: 通过颜色编码的分类和标签系统高效组织内容。
- **🖼️ 图片优化**: 自动处理图片加载失败，提供优雅的占位图。
- **🤝 联系中心**: 集成化的联系方式模态框 (Email, X, GitHub, Discord, Telegram, Notion 等)。
- **📄 多页布局**: 清晰的首页、文章页和关于页路由结构。

### 🚀 快速开始

#### 环境要求

- Node.js (v16 或更高版本)
- npm 或 yarn

#### 安装步骤

1.  克隆仓库：
    ```bash
    git clone https://github.com/weiwei929/MD_blog.git
    cd MD_blog
    ```

2.  安装依赖：
    ```bash
    npm install
    ```

3.  启动开发服务器：
    ```bash
    npm run dev
    ```

4.  打开浏览器访问 `http://localhost:5173`。

### ✍️ 如何写文章

1.  在 `src/posts/` 目录下创建一个新的 `.md` 文件。
2.  在文件顶部添加 Frontmatter 元数据：

    ```yaml
    ---
    title: 你的文章标题
    date: 2023-12-02
    category: tech
    tags: [React, 教程]
    description: 文章的简短描述。
    coverImage: https://example.com/image.jpg
    ---
    ```

3.  在下方编写正文内容。保存后，文章将自动出现在博客中！

### 📅 每周复盘

博客支持从 `D:\workspace\.devlog\weekly` 同步每周复盘到「每周复盘」栏目：

```bash
npm run sync:weekly
```

构建时会自动执行同步。若源目录不存在（如 CI 环境），将跳过同步，已提交的周报仍会正常展示。

### 📦 个人项目库（规划中）

技术方案文档见 [docs/PROJECT_LIBRARY_PLAN.md](docs/PROJECT_LIBRARY_PLAN.md)，择机实施。

## 🛠️ 技术栈 (Tech Stack)

- **Framework**: [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown**: [react-markdown](https://github.com/remarkjs/react-markdown) + [front-matter](https://github.com/jxson/front-matter)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)

## 📄 许可证 (License)

本项目采用 MIT 许可证 - 详情请见 [LICENSE](LICENSE) 文件。

---

© 2025 **Flying X studio**. All rights reserved.
