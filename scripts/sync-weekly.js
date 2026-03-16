#!/usr/bin/env node
/**
 * 同步每周复盘：从 .devlog/weekly 复制到 src/posts/weekly/
 * 自动解析周报格式并添加 YAML frontmatter
 *
 * 用法: node scripts/sync-weekly.js [源目录]
 * 默认源: ../../.devlog/weekly (相对于项目根目录)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const defaultSource = path.resolve(projectRoot, '../../../.devlog/weekly');
const targetDir = path.join(projectRoot, 'src/posts/weekly');

// 解析周报 blockquote 元数据（每行单独匹配，避免贪婪）
function parseWeeklyMeta(content) {
  const meta = { title: '周报', date: '', author: 'weiwei', mood: '' };
  const weekMatch = content.match(/\*\*周次\*\*:\s*([^\n]+)/);
  const dateMatch = content.match(/\*\*日期\*\*:\s*(\d{4}-\d{2}-\d{2})/);
  const authorMatch = content.match(/\*\*作者\*\*:\s*([^\n\s>]+)/);
  const moodMatch = content.match(/\*\*心情\*\*:\s*([^\n]+)/);
  if (weekMatch) meta.title = `周报 ${weekMatch[1].trim()}`;
  if (dateMatch) meta.date = dateMatch[1];
  if (authorMatch) meta.author = authorMatch[1].trim();
  if (moodMatch) meta.mood = moodMatch[1].trim();
  return meta;
}

// 生成简短描述（取正文前 80 字）
function extractDescription(content) {
  const sep = content.indexOf('\n---\n');
  const body = sep >= 0 ? content.slice(sep + 5) : content;
  const text = body.replace(/^#+.*$/gm, '').replace(/[>\-*`]/g, '').replace(/\n+/g, ' ').trim();
  return text.slice(0, 80) + (text.length > 80 ? '...' : '');
}

function syncWeekly(sourceDir) {
  if (!fs.existsSync(sourceDir)) {
    console.warn(`[sync-weekly] 源目录不存在: ${sourceDir}`);
    console.warn('  请确保 D:\\workspace\\.devlog\\weekly 存在，或指定正确路径');
    return 0;
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  let count = 0;
  const walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name.endsWith('.md')) {
        const raw = fs.readFileSync(full, 'utf-8');
        const meta = parseWeeklyMeta(raw);
        const desc = extractDescription(raw);
        const safe = (s) => (s || '').replace(/"/g, '\\"').replace(/\n/g, ' ').slice(0, 120);
        const tagList = ['周报', '复盘', meta.mood].filter(Boolean);
        const tagsYaml = JSON.stringify(tagList);
        const descClean = desc.replace(/---/g, ' ').replace(/"/g, "'").slice(0, 100);
        const frontmatter = `---
title: "${safe(meta.title)}"
date: ${meta.date || new Date().toISOString().slice(0, 10)}
category: weekly
tags: ${tagsYaml}
description: "${safe(descClean)}"
author: "${safe(meta.author)}"
---
`;
        const newContent = raw.startsWith('---') ? raw : frontmatter + raw;
        const dest = path.join(targetDir, e.name);
        fs.writeFileSync(dest, newContent, 'utf-8');
        count++;
        console.log(`  ✓ ${e.name}`);
      }
    }
  };
  walk(sourceDir);
  return count;
}

const source = process.argv[2] || defaultSource;
console.log(`[sync-weekly] 源: ${source}`);
console.log(`[sync-weekly] 目标: ${targetDir}`);
const n = syncWeekly(source);
console.log(`[sync-weekly] 已同步 ${n} 篇周报`);
