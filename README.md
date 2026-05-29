# KnowledgeReview

轻量级知识点随机复习工具，类似 Anki + Obsidian Review。所有数据存储在浏览器 LocalStorage，无需后端。

## 技术栈

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Heroicons
- Context API + LocalStorage

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发（访问 http://localhost:5173/AmKnowlegdeReview/）
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## GitHub Pages 部署

1. 修改 `package.json` 中的 `homepage` 为你的 GitHub Pages 地址：

```json
"homepage": "https://ambrumf.github.io/AmKnowlegdeReview"
```

2. 构建并部署：

```bash
npm run build
npm run deploy
```

3. 在 GitHub 仓库 Settings → Pages 中，选择 `gh-pages` 分支作为发布源。

## 功能概览

| 页面 | 功能 |
|------|------|
| 首页 | 统计概览、快捷入口、最近新增 |
| 知识库 | 搜索、标签筛选、增删改查 |
| 今日复习 | 间隔重复算法、四级评分 |
| 随机知识 | 随机抽取、收藏/标签筛选 |
| 收藏夹 | 收藏知识点管理 |
| 统计 | 数据卡片、标签统计 |
| 设置 | 提醒间隔、导入/导出 JSON |

## 数据存储

- 知识点：`localStorage` → `knowledge-review-data`
- 设置：`localStorage` → `knowledge-review-settings`
- 首次启动自动创建 5 条 C# 示例知识点

## 项目结构

```
src/
├── components/     # UI 组件
├── pages/          # 页面
├── services/       # 业务逻辑
├── hooks/          # 自定义 Hooks
├── context/        # 全局状态
├── types/          # 类型定义
└── utils/          # 工具函数
```
