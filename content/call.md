---
title: call、apply、bind
date: 2026-09-07
intro: 八股
tags: [前端]
---

## 1. call / apply / bind 与 this

`call`、`apply`、`bind` 都是 `Function.prototype` 上的方法，因此普通函数可以直接调用它们。它们最核心的作用是：**显式指定普通函数执行时的 `this`**。

```JavaScript
function sayName() {
  console.log(this.name);
}

const user = { name: "Tom" };

sayName(); // 普通调用，this 由调用规则决定
sayName.call(user); // 输出: Tom
```

使用 `.call(user)` 相当于明确告诉 JavaScript：这一次执行 `sayName` 时，内部的 `this` 指向 `user`。

> **注意：** 这三个方法改变的仅仅是 `this` 的指向，**不会改变函数的作用域链**。普通变量的查找依然由词法作用域决定，只有通过 `this.xxx` 访问的属性才会受影响。

## 2. call：显式绑定并执行

```JavaScript
call` 的基本语法：`fn.call(thisArg, arg1, arg2, ...)
```

它主要做两件事：

1. 指定函数执行时的 `this`。
2. **立即执行**该函数，并**逐个传入参数**。

```JavaScript
function introduce(age, city) {
  console.log(this.name, age, city);
}

const user = { name: "Tom" };

introduce.call(user, 18, "Shanghai"); // 输出: Tom 18 Shanghai
```

## 3. apply：数组传参

`apply` 和 `call` 的功能完全相同，唯一的区别在于**参数的传递方式**。

`apply` 要求将参数放在一个数组（或类数组）中传入。

```JavaScript
// 使用 call：参数逐个传入
introduce.call(user, 18, "Shanghai");

// 使用 apply：参数以数组形式传入
introduce.apply(user, [18, "Shanghai"]);
```

在 ES6 扩展运算符（`...`）普及之前，`apply` 常用于将数组展开成函数参数（例如 `Math.max.apply(null, [1, 5, 3])`）。现在这种场景通常会被 `Math.max(...[1, 5, 3])` 替代。

## 4. bind：返回新函数

`bind` 和前两者最大的区别是：**它不会立即执行函数，而是返回一个新的绑定函数**。

```JavaScript
function sayName() {
  console.log(this.name);
}

const user = { name: "Tom" };
const boundSayName = sayName.bind(user); 

boundSayName(); // 稍后调用，输出: Tom
```

正因为 `bind` 是延迟执行的，它特别适合用于**回调函数、事件处理和定时器**等需要稍后执行的场景。

## 5. this 丢失与 bind

`bind` 在实际开发中最常见的作用就是解决 **“this 丢失”** 问题。

```JavaScript
const user = {
  name: "Tom",
  sayName() {
    console.log(this.name);
  }
};

const fn = user.sayName;
fn(); // 严格模式下 this 为 undefined，发生 this 丢失
```

在vue/react下正确书写

```js
const user = {
  name: "Tom",
  sayName() {
    console.log(this.name);
  }
};
const fn = () => {
  user.sayName(); 
};
fn(); // 成功输出: Tom
```

当我们将对象的方法提取出来单独传递时（例如传给 `setTimeout`），函数调用的上下文就变了：

```JavaScript
// 错误示范：1秒后执行时，this 已经不再指向 user
setTimeout(user.sayName, 1000); 

// 正确解法：提前生成一个 this 永久绑定为 user 的新函数
setTimeout(user.sayName.bind(user), 1000);
```

## 6. bind 的高阶用法：部分应用 

`bind` 不仅能绑定 `this`，还能**提前固定部分参数**。

```JavaScript
function multiply(a, b) {
  return a * b;
}

// 提前绑定 this 为 null，并将第一个参数 a 固定为 2
const double = multiply.bind(null, 2);

console.log(double(5));  // 相当于 multiply(2, 5) -> 输出 10
console.log(double(10)); // 相当于 multiply(2, 10) -> 输出 20
```

## 7. 深入原理：为什么能改变 this？（手写 call）

理解 `call` 原理最直观的思路，是从隐式绑定 `obj.fn()` 出发。如果我们想让 `this` 指向 `user`，可以临时把函数挂载到 `user` 对象上执行，执行完再删掉。

**简化版 `myCall` 实现：**

```JavaScript
Function.prototype.myCall = function (context, ...args) {
  context = context ?? globalThis; // 处理 null/undefined
  const target = Object(context);  // 确保是对象
  const key = Symbol();            // 避免属性名冲突

  target[key] = this;              // this 就是原函数
  const result = target[key](...args); // 核心：以对象方法的形式执行原函数！
  
  delete target[key];              // 用完即焚
  return result;
};
```

## 8. 手写 apply 与 bind

**手写 `myApply`：**

原理与 `call` 几乎一致，仅在处理参数展开时有细微区别。

```JavaScript
Function.prototype.myApply = function (context, args = []) {
  context = context ?? globalThis;
  const target = Object(context);
  const key = Symbol();

  target[key] = this;
  const result = target[key](...args); // 将数组参数展开传入
  delete target[key];
  
  return result;
};
```

**手写 `myBind`：**

`bind` 的核心思想是**闭包**：利用闭包保存原函数、`this` 上下文以及预设参数，返回一个新函数。在新函数真正执行时，再通过 `apply` 调用原函数。

```JavaScript
Function.prototype.myBind = function (context, ...presetArgs) {
  const fn = this; // 保存原函数

  return function (...args) {
    // 将预设参数和后续调用时传入的参数合并
    return fn.apply(context, [...presetArgs, ...args]);
  };
};
```

## 9. 箭头函数与 call / apply / bind

**划重点：箭头函数没有自己的 `this`，它使用的是定义位置外层环境中的 `this`。**

因此，`call`、`apply`、`bind` **无法**改变箭头函数的 `this` 指向。

```JavaScript
const foo = () => {
  console.log(this.name);
};

// 这里的 call 毫无作用，箭头函数依然穿透使用外层词法作用域的 this
foo.call({ name: "Tom" }); 
```

## 总结

### 核心对比表

| **方法**  | **是否立即执行** | **参数传入形式**              | **返回值**               |
| --------- | ---------------- | ----------------------------- | ------------------------ |
| **call**  | 是               | 参数逐个传入 (`a, b, c`)      | 原函数执行结果           |
| **apply** | 是               | 数组/类数组传入 (`[a, b, c]`) | 原函数执行结果           |
| **bind**  | 否               | 参数逐个传入 (`a, b, c`)      | **绑定了 this 的新函数** |

### 知识串联

- **`obj.fn()`**  -> 隐式绑定 `this`。
- **`fn.call(obj)` / `fn.apply(obj)`** -> 显式绑定 `this` 并立即执行。
- **`fn.bind(obj)`** -> 保存 `this`，返回新的绑定函数，稍后执行。
- **箭头函数** -> 没有自己的 `this`，不能通过这三个方法重新绑定内部 `this`。