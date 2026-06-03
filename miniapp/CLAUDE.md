# 微信小程序 · 婚礼请柬

> 杨亦富 ❤ 杨静静 | 2027.01.23 | 贵州铜仁松桃

## 项目结构

```
miniapp/
├── app.js              # 小程序入口
├── app.json            # 全局配置（页面路由、窗口样式）
├── app.wxss            # 全局样式
├── project.config.json # 微信开发者工具配置
├── sitemap.json        # 站点地图
├── images/             # 照片资源（WebP格式，12张）
└── pages/index/        # 主页面
    ├── index.wxml       # 页面结构
    ├── index.wxss       # 页面样式
    ├── index.js         # 页面逻辑
    └── index.json       # 页面配置
```

## 技术要点

- **包体积**: 1.3MB（限制2MB）
- **图片格式**: WebP（小程序基础库 3.3.4 支持）
- **CSS 兼容**: 不使用 `var()`、`column-count`、`:not()`、`filter`
- **按钮**: 所有 `<button>` 需加 `::after { border: none }` 消除默认样式

## 关键功能

| 功能 | 实现 |
|------|------|
| 加载屏 | CSS 动画 + `setTimeout` 1.5s 淡出 |
| 背景音乐 | `wx.createInnerAudioContext()` |
| 爱心粒子雨 | Canvas 2D |
| 倒计时 | `setInterval` 每秒更新 |
| 照片预览 | `wx.previewImage()` 原生 |
| 复制地址 | `wx.setClipboardData()` |
| 地图导航 | `wx.openLocation()` 原生 |
| 祝福墙 | `wx.setStorageSync()` 本地存储 |
| 分享 | `onShareAppMessage` + `onShareTimeline` |

## 音乐配置

当前音乐 URL 在 `pages/index/index.js` 第 43 行，可替换为你们的婚礼歌曲。
音乐域名需在小程序后台「开发管理 → 服务器域名 → request合法域名」加白。

## 照片更新

照片数组在 `pages/index/index.js` 的 `photos` 字段，格式：
```js
{ jpg: '/images/文件名.webp', caption: '照片标题' }
```
替换 `/images/` 目录下的文件后，更新此数组即可。

## 调试注意

- 中文路径可能导致 DevTools 文件监听异常，重启工具即可
- `project.config.json` 会被 DevTools 自动修改，不影响功能
- Git 分支切换后需重新编译

## 分支

- `miniapp` — 小程序版（当前）
- `main` — H5 网页生产版
- `dev` — H5 网页开发版
