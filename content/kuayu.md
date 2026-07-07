---
title: 跨域 (Cross-Origin) 
date: 2026-07-07 
intro: 前后端联调
tags: 前端
---

# 跨域问题与同源策略

在前后端分离开发（比如用 Nuxt/Vue 连 Spring Boot）时，只要**协议**（http/https）、**域名**、**端口**有任何一个不同，就会触发浏览器的同源策略。

核心现象：前端请求确实发出去了，后端也正常执行并返回了数据，但是**浏览器出于安全考虑把数据扣留了**，不让前端脚本拿到，并且在控制台抛出跨域报错。

*注：跨域拦截看的是“域名”，跟服务器底层限制“IP”黑白名单完全是两码事。*

### 思路

解决跨域本质上就是发放“白名单通行证”或者“绕过浏览器限制”。本地联调最常用代理，线上部署用 Nginx 或 CORS。

- **本地开发 (Proxy)：** 搞个同源的本地服务器做跳板，前端发给跳板，跳板发给真实后端（服务器之间没跨域限制）。
- **线上部署 (Nginx)：** 页面和 Nginx 保持同源，Nginx 根据路径拦截 API 请求并悄悄转发给后端。
- **官方解法 (CORS)：** 让后端在响应头里直接声明，允许我们这个前端域名来拿数据。



```JavaScript
// 1. 本地开发：Nuxt 4 / Vite 配置代理
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 真实的接口
        changeOrigin: true
      }
    }
  }
}
```



```Nginx
# 2. 线上部署：Nginx 反向代理
server {
    listen 80;
    server_name www.yourblog.com;

    # 网页静态资源
    location / {
        root /www/wwwroot/your-project/dist;
        index index.html;
    }

    # 接口转发
    location /api/ {
        proxy_pass http://127.0.0.1:8080; 
    }
}
```



```JavaScript
// 3. 后端配合：Node.js 全局配置 CORS
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    credentials: true,
  });
```

学了又忘，忘了又学，我完蛋了