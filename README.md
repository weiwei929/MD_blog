# Pennfly Innovation Lab Blog (Flying X studio)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Vite](https://img.shields.io/badge/Vite-4.4-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-cyan)

A modern, elegant, and feature-rich static blog built with React, TypeScript, and Tailwind CSS. Designed for **Pennfly Innovation Lab (Flying X studio)**.

## ✨ Features

- **🎨 Elegant UI**: "Elegant Grey" (Zinc) theme with flat design and smooth animations.
- **📝 Markdown First**: "File-as-Article" workflow. Just drop `.md` files into `src/posts` to publish.
- **⚡ Blazing Fast**: Powered by Vite for instant server start and HMR.
- **📱 Responsive**: Fully responsive design that looks great on mobile, tablet, and desktop.
- **🔍 Smart Search**: Real-time search for articles, tags, and keywords.
- **🏷️ Category & Tags**: Organize content with color-coded categories and tags.
- **🖼️ Image Optimization**: Automatic fallback for broken images and lazy loading.
- **🤝 Contact Hub**: Integrated modal for social media links (Email, X, GitHub, Discord, Telegram, Notion, etc.).
- **📄 Multi-page Layout**: Clean routing structure for Home, Articles, and About pages.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

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

## ✍️ How to Write Posts

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

## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown**: [react-markdown](https://github.com/remarkjs/react-markdown) + [front-matter](https://github.com/jxson/front-matter)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

© 2025 **Flying X studio**. All rights reserved.
