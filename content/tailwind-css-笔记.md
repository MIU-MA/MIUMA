---
title: Tailwind css 笔记
date: 2026-05-14
intro: 前端
---


### 背景

初级

```html
<div class="bg-grid-600/60">
    bg background
    grid 表示颜色
    -600 颜色深浅
    /60 60%的透明度
</div>
```

进阶

```html
<div class="bg-gradient-to-r from-blue-500/30 to-purple-500/30 
            backdrop-blur-md /*毛玻璃效果*/
            border border-white/20 /*高光边框*/
            rounded-xl /*圆角*/">
  带反光的渐变毛玻璃卡片
</div>
```


### 布局

| **缩写**                    | **解释**                                      |
| --------------------------- | --------------------------------------------- |
| **`flex` / `grid`**         | `display: flex;` / `display: grid;`           |
| **`inline-flex` **          | 让多个小容器并排                              |
| **`flex-col` / `flex-row`** | `flex-direction: column / row;`               |
| **`justify-`**              | 主轴对齐：`justify-center`, `justify-between` |
| **`items-`**                | 交叉轴对齐：`items-center`, `items-start`     |
| **`gap-`**                  | 子元素间隙：`gap-4` (相隔 16px)               |
| **`grid-cols-\*`**          | 定义网格列数：`grid-cols-3` (均分 3 列)       |



### 文字

| **缩写**        | **代表属性**        | **常用示例**                                     |
| --------------- | ------------------- | ------------------------------------------------ |
| **`text-`**     | 字号大小 / 字体颜色 | `text-lg` (18px), `text-gray-500`                |
| **`font-`**     | 字体粗细 / 字体族   | `font-bold` (加粗), `font-sans` (无衬线)         |
| **`leading-`**  | 行高                | `leading-tight` (紧凑), `leading-relaxed` (宽松) |
| **`tracking-`** | (字间距)            | `tracking-wide` (加宽字间距)                     |
| **`text-`**     | 对齐                | `text-center` (居中), `text-right`               |



### 交互

状态修饰符 (触发器)

 **`hover:`** 悬停状态 (如 `hover:bg-blue-600`)。
 **`active:`** 点击未松开的激活状态 (如 `active:scale-95` 点击微缩效果)。
 **`focus:`** 聚焦状态 (如 `focus:ring-2` 输入框外发光)。
 **`group-hover:`** 悬停在父卡片上，改变子元素样式（需给父级加 `group` 类）。

只要改变元素的宽、高、颜色或位置，防止元素“瞬间闪现生硬突变”：

| **缩写**         | **作用解析**                                                 |
| ---------------- | ------------------------------------------------------------ |
| `transition-all` | 动画总开关。让元素的所有属性变化都拥有平滑过渡过程。也可简写为 `transition` (仅包含颜色、透明度等常用属性)。 |
| `duration-300`   | 动画要播多久。数字代表毫秒，如 `duration-1000` 就是花 1 秒钟变完，`duration-300` 是 0.3 秒。 |
| `ease-linear`    | 运动节奏。`linear` 代表匀速运动；默认不写或写 `ease-in-out` 代表两头慢中间快。 |

> [!NOTE]
>常用
>
>**头像**
>```html
><img src="..." class="size-12 rounded-full object-cover" />
>```
>**进度条**
>```html
><div class="w-full bg-gray-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
>  <div class="h-full bg-rose-400 rounded-full" 
>       style="width: 44.3%">
>  </div>
></div>
>```

