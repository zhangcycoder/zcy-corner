# Personal Portal

ZCY 的个人技术空间，用于沉淀技术实践、交互实验、可复用模块与职业经历。
项目基于 React、TypeScript、Vite 和 MDX 构建。

## Routes

| 路径 | 内容 |
| --- | --- |
| `/` | 首页与精选、最近更新内容 |
| `/vault` | 技术藏宝阁，可按藏品类型筛选 |
| `/vault/:slug` | 藏品详情、技术文章或交互演示 |
| `/resume` | 个人履历与打印版简历 |
| `/projects/:id` | 旧项目链接兼容入口，重定向到对应藏品 |

## Gallery & Paper

站点使用两套互补的内容场景：

- **Gallery** 用深色画廊承载首页、藏宝阁、项目和交互实验，强调探索与作品预览。
- **Paper** 用浅色纸张承载技术备忘和个人履历，强调连续阅读与打印体验。

`SiteShell` 会根据当前路由和藏品类型自动选择场景，页面共用同一套站点导航与页脚。

## Content Authoring

每件藏品位于 `src/content/vault/<slug>/`，由两个文件组成：

- `meta.json`：标题、摘要、类型、标签、时间、发布状态、封面和可选资源链接；
- `index.mdx`：详情正文，可使用 Markdown 与已支持的 MDX 内容。

目录名必须与 `meta.json` 的 `slug` 一致，中文标题和摘要为必填项。将 `status`
设为 `published` 后内容才会进入公开列表；`featured` 控制是否进入首页精选。
封面资源放在 `public/covers/`，并在 `cover` 中使用以 `/covers/` 开头的公开路径。

如需嵌入交互演示，还需在 `src/demos/registry.ts` 注册组件，并让 `demoKey`
与 `meta.json` 中的值一致。

## Local Development

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

## Deployment

- 线上地址：https://amazing-chebakia-758e0e.netlify.app/
- Netlify 控制台：https://app.netlify.com/teams/zhangcycoder/builds/69b29d688107470008b305de
- GitHub 仓库：https://github.com/zhangcycoder/zcy-corner
- 生产分支：`dev_1`
- Base directory：`personal-portal`
- Build command：`npm run build`
- Publish directory：`dist`

Netlify 凭据仅保存在本地且不纳入版本控制；仓库不会公开登录邮箱或账号凭据。
