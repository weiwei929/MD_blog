---
title: 欢迎使用 Markdown 博客
date: 2025-12-02
category: tech
tags: [Markdown, 指南]
description: 这是一篇自动导入的 Markdown 文章示例。
coverImage: https://images.unsplash.com/photo-1499750310159-5b600aaf0320?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80
featured: true
author: 管理员
---

# 欢迎使用

您现在看到的这篇文章是直接从 `src/posts/welcome.md` 文件加载的。

## 如何添加新文章？

1. 在 `src/posts` 目录下创建一个新的 `.md` 文件。
2. 在文件头部添加 **Frontmatter** 信息（如下所示）。
3. 编写您的 Markdown 内容。

### Frontmatter 格式

```yaml
---
title: 文章标题
date: YYYY-MM-DD
category: 分类ID (tech, tutorial, life, thoughts)
tags: [标签1, 标签2]
description: 文章简短描述
coverImage: 图片链接 (可以使用 /images/your-image.png)
featured: true/false
author: 作者名
---
```

## 关于图片和视频

如果您想在文章中插入图片或视频：

1. 将媒体文件放入 `public/images` 文件夹中。
2. 在 Markdown 中使用绝对路径引用：

```markdown
![示例图片](/images/example.png)
```

这样，您的媒体文件就能完美显示了！
