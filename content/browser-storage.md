---
title: Cookie、localStorage、sessionStorage 与 IndexedDB
date: 2026-10-11
intro: 八股
tags: [前端]
---

## 一、对比

四者都能在浏览器中保存数据，主要区别是**有效期、容量、隔离范围，以及是否自动随请求发送**。

| 对比项 | Cookie | localStorage | sessionStorage | IndexedDB |
| --- | --- | --- | --- | --- |
| 典型用途 | 登录会话 | 主题、偏好 | 临时表单 | 离线文章、附件 |
| 容量 | 单个通常约 4 KB | 常见约 5 MiB | 常见约 5 MiB | 较大，取决于浏览器配额 |
| 数据类型 | 字符串 | 字符串 | 字符串 | 对象、数组、Blob 等 |
| 有效期 | 过期属性或会话决定 | 无内置过期时间 | 标签页会话期间 | 无统一内置过期时间 |
| 随请求发送 | 符合条件时自动携带 | 不自动发送 | 不自动发送 | 不自动发送 |
| 隔离范围 | 域名、路径等规则 | 同源 | 同源 + 标签页 | 同源 |
| 数据操作 | 常用 API 同步 | 同步 | 同步 | 异步 |

**同源 = 协议、主机名、端口相同。** Cookie 不按端口隔离。表中容量只是常见情况，浏览器策略和设置可能不同。

------

## 二、Cookie

HTTP 本身不会记住上一次请求的用户。登录成功后，服务器可以通过 `Set-Cookie` 保存一个会话标识；浏览器在符合条件的后续请求中自动携带它，服务器据此识别用户。

Cookie 容量小，而且随请求发送会增加网络开销，因此适合会话标识或少量需要服务端读取的数据。

| 常见属性 | 作用 |
| --- | --- |
| `Max-Age` / `Expires` | 设置存活秒数或过期时间；同时设置时 Max-Age 优先 |
| `Domain` / `Path` | 控制发送的域名和路径范围 |
| `HttpOnly` | 禁止客户端 JS 读写，由服务端设置 |
| `Secure` | 通常只通过 HTTPS 发送 |
| `SameSite` | 限制跨站请求携带 Cookie；None 需配合 Secure |

未设置过期属性的 Cookie 属于会话 Cookie；浏览器的会话恢复功能可能让它在重启后继续存在。前端通过 `document.cookie` 操作可访问的 Cookie，删除时需要匹配名称、路径和原先设置的域名。

属性说明见 [MDN：Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)。

------

## 三、localStorage 与 sessionStorage

两者统称 **Web Storage**，都按键值对保存字符串。API 相同：`setItem` 保存或修改，`getItem` 读取，`removeItem` 删除。对象或数组需要先转成 JSON，读取后再解析。

```js
localStorage.setItem("theme", "dark");
localStorage.getItem("theme"); // "dark"，不存在时返回 null
localStorage.removeItem("theme");
```

**localStorage 适合长期保留的偏好。** 同源标签页通常共享数据，刷新或关闭浏览器后通常仍然保留，例如主题、语言和阅读设置。它没有内置过期机制，需要自己记录过期时间并清理。

**sessionStorage 适合当前标签页的临时状态。** 刷新页面通常不会丢失，关闭标签页通常清理，例如分步表单、临时筛选条件。不同标签页通常独立；若新标签页保留 `opener`，可能复制初始数据，但之后不会持续共享。

两者都不会自动把数据发送给服务器，而且读写是同步的。大量操作可能阻塞主线程；存储空间不足、访问受限或 JSON 内容无效时，应处理失败情况。

------

## 四、IndexedDB

IndexedDB 是浏览器内置的数据库，适合离线文章、大量草稿、图片和文件等数据。它支持对象、数组和 Blob，通常比 Web Storage 容量大，数据读写采用异步方式。

**对象仓库**用来存放一类记录，类似数据库的表；**索引**便于按某个字段查找；**事务**让一组相关操作一起提交或回滚。

基本流程是打开数据库、创建仓库，再通过事务增删改查。数据库版本升级时可以调整仓库和索引。需要注意，单次请求成功不代表整个事务已经提交。

IndexedDB 没有统一的内置过期机制，也不会自动跨设备同步。它的容量仍受浏览器配额限制，适合复杂本地数据；只保存一个主题设置时，localStorage 更直接。

更多用法见 [MDN：IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)。

------

## 总结

**会话用 Cookie，长期偏好用 localStorage，标签页临时状态用 sessionStorage，大量离线数据用 IndexedDB。**
