---
title: 渲染与性能优化
date: 2026-09-14
intro: 八股
tags: [前端]
---


## 一、关键渲染路径 CRP

整个网页的呈现过程可以高度概括为三个阶段：

**网络请求资源 → 解析与计算 → 绘制呈现**

### 1. 导航

- **DNS 解析：** 将域名解析为服务器对应的 IP 地址。
- **建立连接：** HTTP/1.1、HTTP/2 通常建立 TCP 连接；HTTPS 还需要进行 TLS 握手。
- **发送 HTTP 请求：** 浏览器向服务器请求 HTML 文档。

### 2. 响应与解析

- **构建 DOM 树：** HTML 解析器将标签解析为 DOM Tree。
- **构建 CSSOM 树：** CSS 解析器将样式规则解析为 CSSOM。
- **脚本阻塞：** 遇到普通同步 `<script>` 时，HTML 解析会暂停，等待 JS 下载并执行，因为 JS 可能修改当前 DOM。`defer`、`async` 等脚本行为不同。
- **CSS 渲染阻塞：** CSS 通常不会阻塞 HTML 本身继续解析，但页面绘制需要等待关键样式确定。

### 3. 渲染

- **构建渲染树：** 根据 DOM 和 CSSOM 确定需要显示的节点和样式，`display: none` 等节点不会参与最终渲染。
- **布局 / 回流（Layout / Reflow）：** 计算元素的大小、位置等几何信息。
- **绘制 / 重绘（Paint / Repaint）：** 绘制文字、背景、边框、阴影等视觉内容。
- **合成（Composite）：** 将不同图层合并，最终输出到屏幕。

> **核心考点：回流与重绘**
>
> - **回流：** 元素尺寸、位置或结构变化，需要重新计算布局，通常开销较大。
> - **重绘：** 几何结构没有改变，只修改颜色、背景等外观，不需要重新布局。
> - **关系：** 回流通常会引起后续重绘，但重绘不一定触发回流。
> - **动画优化：** 相比频繁修改 `top`、`left`、`width`、`height`，通常优先使用 `transform`、`opacity`，可以减少 Layout / Paint 开销。

------

## 二、性能指标

目前核心 Web Vitals 是：

**LCP、INP、CLS**

| 指标    | 含义                      | 核心理解               | 推荐值  |
| ------- | ------------------------- | ---------------------- | ------- |
| **LCP** | Largest Contentful Paint  | 核心内容多久出现       | ≤ 2.5s  |
| **INP** | Interaction to Next Paint | 用户操作后多久看到反馈 | ≤ 200ms |
| **CLS** | Cumulative Layout Shift   | 页面是否发生意外跳动   | ≤ 0.1   |

- **LCP：** 衡量首屏最大内容元素的渲染时间，例如 Banner、大图、大标题。优化方向包括降低 TTFB、压缩图片、CDN、预加载关键资源、SSR / SSG。
- **INP：** 衡量用户点击、输入等交互后，到页面产生下一次视觉反馈的时间。主要受主线程阻塞、长任务、大量 JS 执行和 DOM 更新影响。
- **CLS：** 衡量页面布局是否发生非预期偏移。图片、广告、异步组件应提前预留尺寸，避免内容加载后突然跳动。

其他常见性能指标：

- **FCP：** First Contentful Paint，页面第一次出现文字、图片等内容，可以理解为“白屏什么时候结束”。
- **TTFB：** Time To First Byte，从请求发出到收到服务器第一个字节的时间，反映网络和服务端响应速度。
- **TBT：** Total Blocking Time，统计主线程被 Long Task 阻塞的总时间。通常执行时间超过 `50ms` 的任务会被视为 Long Task。

------

## 三、首屏加载优化

首屏性能优化本质上就是：

**资源更少、体积更小、传输更快、关键资源优先。**

- **路由懒加载 / Code Splitting：** 首屏只加载当前页面需要的代码，例如 `import()`。
- **Tree-shaking：** 删除没有被使用的代码，减少最终 Bundle 体积。
- **资源压缩：** JS / CSS 使用 Minify，HTTP 使用 Gzip / Brotli，图片优先使用 WebP / AVIF。
- **浏览器缓存：** JS、CSS、图片等静态资源合理使用强缓存，避免重复下载；缓存需要验证时使用 ETag / Last-Modified 进行协商缓存。
- **CDN：** 静态资源部署到边缘节点，减少网络传输距离。
- **Preload：** 对首屏确定需要的关键资源使用 `<link rel="preload">` 提高请求优先级。
- **图片优化：** 首屏关键图片优先加载，非首屏图片使用 `loading="lazy"`；图片提前声明宽高或 `aspect-ratio`，同时降低 CLS。
- **SSR / SSG：** 减少 SPA 首屏必须等待大量 JavaScript 执行后才能看到内容的问题。
- **骨架屏：** 接口返回前展示占位结构，改善感知体验，同时应提前固定尺寸避免 CLS。

例如首屏 LCP 图片可以：

```html
<img src="/hero.webp" fetchpriority="high">
```

首屏关键图片一般不要使用：

```html
loading="lazy"
```

否则可能让 LCP 资源加载得更晚。

------

## 四、HTTP 浏览器缓存

浏览器缓存主要分为：

**强缓存和协商缓存。**

### 强缓存

通过：

```http
Cache-Control: max-age=31536000
```

告诉浏览器在有效期内直接使用本地资源，不需要询问服务器。

适合 JS、CSS、图片、字体等静态资源。

### 协商缓存

缓存需要重新验证时，浏览器向服务器询问资源是否发生变化。

常见方式：

```http
ETag
If-None-Match
```

以及：

```http
Last-Modified
If-Modified-Since
```

如果资源没变：

```http
304 Not Modified
```

继续使用本地缓存。

如果资源变化：

```http
200 OK
```

服务器返回新内容。

需要特别区分：

```http
Cache-Control: no-cache
```

表示：

**可以缓存，但使用前必须重新验证。**

而：

```http
Cache-Control: no-store
```

才表示：

**完全不保存缓存。**

### 常见部署策略

JS、CSS、图片等静态资源通常带内容 Hash：

```text
app.a1b2c3.js
style.83fd91.css
```

并配置：

```http
Cache-Control: max-age=31536000, immutable
```

内容变化后 Hash 改变，文件名变化，浏览器会自动请求新文件。

入口 `index.html` 通常使用：

```http
Cache-Control: no-cache
```

保证每次访问时能够及时拿到引用最新静态资源的 HTML。

------

## 五、CSR、SSR 与 SSG

### CSR（客户端渲染）

CSR（Client Side Rendering）主要由浏览器执行 JavaScript 后生成页面。

```text
HTML
↓
下载 JS
↓
执行 JS
↓
请求数据
↓
渲染页面
```

优点是前后端分离、页面切换流畅；缺点是首屏依赖 JavaScript，Bundle 较大时容易出现白屏，SEO 成本也更高。

### SSR（服务端渲染）

SSR（Server Side Rendering）是在每次请求时由服务器生成 HTML。

```text
请求
↓
服务器获取数据
↓
生成 HTML
↓
返回浏览器
```

优点是首屏内容更早出现、SEO 更友好、数据实时性高；缺点是增加服务器压力，服务端接口较慢时也会增加 TTFB。

SSR 返回的 HTML 想恢复完整交互能力，还需要进行：

**Hydration（水合）**

```text
HTML 已经显示
↓
下载 JS
↓
执行 JS
↓
绑定事件
↓
恢复交互
```

所以 SSR 能改善内容展示速度，但不代表交互一定快。如果客户端 JS 很重，INP 仍然可能较差。

### SSG（静态站点生成）

SSG（Static Site Generation）在构建阶段提前生成静态 HTML。

```text
Build
↓
index.html
about.html
post.html
```

部署后可以直接从 CDN 返回。

| 维度          | CSR       | SSR          | SSG              |
| ------------- | --------- | ------------ | ---------------- |
| HTML 生成位置 | 浏览器    | 请求时服务器 | 构建阶段         |
| 首屏          | 较依赖 JS | 较快         | 很快             |
| SEO           | 一般      | 好           | 好               |
| 数据实时性    | 高        | 高           | 取决于更新策略   |
| 服务器压力    | 低        | 较高         | 很低             |
| 场景          | 后台系统  | 电商、资讯   | 官网、博客、文档 |

------

## 六、SEO 核心策略

- **SSR / SSG：** 搜索引擎虽然具备执行 JavaScript 的能力，但直接返回完整 HTML 通常更有利于抓取和索引。
- **Title / Description：** `Title` 描述页面核心主题，`Description` 提供页面摘要并可能影响搜索结果点击率。`meta keywords` 已经不是现代 SEO 的重点。
- **HTML 语义化：** 使用 `<header>`、`<nav>`、`<main>`、`<article>`、`<section>` 等标签表达页面结构。
- **标题层级：** 保持 `h1 → h2 → h3` 结构清晰，不需要死记“页面绝对只能有一个 h1”，重点是语义合理。
- **图片 alt：** 帮助搜索引擎和无障碍工具理解图片内容。
- **Sitemap.xml：** 告诉搜索引擎网站中有哪些值得抓取的页面。
- **robots.txt：** 控制爬虫是否允许抓取 URL，不是安全机制。真正敏感页面仍然需要鉴权和权限控制。
- **noindex：** 如果希望页面不要进入搜索索引，可以使用：

```html
<meta name="robots" content="noindex">
```

------

## 七、Tree-shaking

Tree-shaking 的核心作用是：

**在构建阶段删除没有被使用的代码。**

ES Module 的 `import / export` 具有静态结构：

```js
import { add } from './math.js';
```

构建工具可以在代码运行前分析模块依赖关系。

大致过程：

```text
源代码
↓
解析 AST
↓
构建模块依赖图
↓
分析 import / export
↓
标记 unused code
↓
Minifier 删除
```

------

## 八、运行时性能优化

首屏优化解决的是：

**页面多久出来。**

运行时优化解决的是：

**页面出来以后会不会卡。**

浏览器主线程需要同时处理：

```text
JavaScript
Style
Layout
Paint
用户交互
```

如果 JavaScript 长时间占用主线程，点击、滚动和输入就无法及时响应。

常见优化方式：

- **拆分 Long Task：** 避免一个任务长时间占用主线程。
- **Web Worker：** 将图片处理、数据计算、文件解析等纯计算任务放到 Worker Thread。
- **防抖 Debounce：** 事件连续触发时不断重新计时，只有停止触发一段时间后才执行一次。适合搜索框输入、表单校验。
- **节流 Throttle：** 无论事件触发多频繁，都限制在固定时间内最多执行一次。适合滚动监听、窗口 resize、mousemove。
- **requestAnimationFrame：** 动画相关 DOM 更新尽量和浏览器下一帧绘制同步。
- **虚拟列表：** 上万条数据只渲染当前视口附近的 DOM，减少 Layout、Paint 和内存开销。
- **减少无效更新：** Vue / React 中避免无意义的组件重新渲染和大范围 DOM 更新。

------

## 九、性能分析工具

性能优化应该遵循：

**先测量 → 找瓶颈 → 再优化**

- **Network：** 看请求数量、资源大小、缓存、Waterfall、TTFB、资源加载顺序。
- **Performance：** 看 Main Thread、Long Task、JavaScript、Style、Layout、Paint 等运行过程。
- **Lighthouse：** 适合本地和实验室环境快速发现 LCP、CLS、TBT、FCP 等问题。
- **PageSpeed Insights / CrUX：** 更关注真实用户环境中的 Field Data。

所以性能分析最好结合：

**Lab Data + Field Data**

而不是只看 Lighthouse 分数。

