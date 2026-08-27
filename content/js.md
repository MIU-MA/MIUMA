---
title: js作用域
date: 2026-08-27
intro: 八股
tags: [前端]
---

## 1. 作用域

- **全局作用域**：程序中最外层的作用域。只要代码能通过作用域链访问到其中的绑定，就可以读取它；但模块和不同运行环境可能有独立的顶层作用域。浏览器中，顶层 `let`/`const` 也不会自动成为 `window` 的属性。
- **函数作用域：函数会形成自己的局部作用域，函数内部声明的局部变量通常不能从函数外部直接访问。函数的形参和函数体中的 `var` 声明也属于该函数作用域。
- **块级作用域（ES6+）**：`let`、`const`、`class` 等声明会受到代码块、模块等词法环境的限制。`var` 没有普通代码块作用域，会沿当前函数或全局作用域生效。

注意：并不是每一对普通的 `{}` 都会让所有变量产生一个可观察到的新作用域；重点是其中是否存在受块级环境约束的声明。

## 2. 词法作用域 vs 动态作用域

| 维度 | 词法作用域（Lexical / Static Scope） | 动态作用域（Dynamic Scope） |
| --- | --- | --- |
| 决定依据 | 函数在代码中的定义位置 | 函数运行时的调用栈 |
| 查找时机 | 由程序的词法结构确定 | 由运行时的调用关系确定 |
| JavaScript | 使用词法作用域 | 普通标识符查找不是动态作用域 |

### 经典代码

```js
var value = 1;

function foo() {
  console.log(value);
}

function bar() {
  var value = 2;
  foo(); // 在 bar 内部调用 foo
}

bar();
// 输出 1：foo 定义在全局作用域，因此从全局作用域查找 value。
// 如果是动态作用域，才可能沿调用栈找到 bar 中的 value，输出 2。
```

## 3. 作用域链与变量遮蔽

JavaScript 的标识符解析通常从当前词法环境开始，沿外层词法环境逐级查找，直到找到对应绑定或到达全局环境。这个由内向外的查找关系就是**作用域链**。

外层环境可能来自函数、代码块、`catch`、模块或全局环境，并不等同于简单地沿物理大括号查找。

1. **定义位置决定外层环境**：函数创建时会记录定义它时所在的词法环境。规范中常用 `[[Environment]]` 描述这一内部关联；一些教材也会使用 `[[Scope]]` 这一非标准化的说法。
2. **就近原则**：先查当前环境，再向外查找。
3. **变量遮蔽（Shadowing）**：某一层找到同名绑定后，查找立即停止，外层同名绑定被遮蔽。
4. **形参**：形参可以理解为函数调用时创建的局部绑定，但它不完全等同于函数体第一行的一条普通变量声明；例如参数默认值和参数解构有更复杂的初始化规则。
5. **查找失败**：如果所有相关环境都没有对应绑定，读取该标识符会抛出 `ReferenceError`。

## 4. 闭包：函数与词法环境的组合

当函数被返回、传递到外部，或在定义位置之外执行时，它仍然可以访问那个环境中的变量。

外部函数执行完毕，并不意味着其局部环境立即消失；只要闭包仍然引用它，该环境就可以继续存在。环境中的变量也不是被冻结的，仍然可以被读取和修改。

```js
function createCounter() {
  let count = 0;

  return () => ++count;
}

const counter = createCounter();

console.log(counter()); // 1
console.log(counter()); // 2
```

再看一个作用域查找例子：

```js
function createPrinter(count) {
  return function () {
    console.log(count);
  };
}

const printCount = createPrinter(50);
const count = 200;

function execute() {
  const count = 300;
  printCount(); // 50：调用现场的 count 不会改变闭包的词法环境
}

execute();
```

## 5. 普通函数的 `this` 与箭头函数

作用域决定普通标识符如何查找，而 `this` 是函数调用时获得的特殊绑定。普通函数的 `this` 主要由调用方式决定，因此具有动态绑定特征，但它不等同于动态作用域。

### 5.1 普通函数的 `this`

常见调用方式如下：

- `obj.method()`：非箭头方法调用中，`this` 通常是 `obj`。
- `fn()`：严格模式下 `this` 是 `undefined`；非严格模式下通常会指向全局对象。
- `fn.call(obj)`、`fn.apply(obj)`：显式指定 `this`。
- `new Fn()`：`this` 指向新创建的实例。

```js
"use strict";

function showThis() {
  console.log(this);
}

showThis(); // undefined
```

### 5.2 箭头函数的 `this`

箭头函数没有自己的 `this` 绑定，而是捕获定义时外层执行环境中的 `this`。之后即使换一种调用方式，也不会像普通函数那样重新绑定。箭头函数也没有自己的 `arguments`，不能作为构造函数使用。

```js
const obj = {
  name: "Alpaca",

  test() {
    setTimeout(function () {
      // 普通函数的 this 不是 obj；具体值取决于严格模式和运行环境。
      console.log(this?.name); // 通常不是 Alpaca
    }, 100);

    setTimeout(() => {
      // 箭头函数捕获 test 方法调用时的 this，也就是 obj。
      console.log(this.name); // Alpaca
    }, 100);
  }
};

obj.test();
```

## 6. 函数作为值传递：回调与词法作用域

JavaScript 中函数可以作为值传递。词法作用域解释了：回调函数执行时，为什么仍然能够访问它定义位置附近的变量；而回调机制本身还依赖调用方保存函数，并在适当时机调用它。

```js
let userName = "Alpaca";

function fetchRemoteData(callback) {
  setTimeout(() => {
    let userName = "Server_Admin";
    callback();
  }, 1000);
}

fetchRemoteData(function () {
  // 回调定义在全局环境，因此这里读取的是全局 userName。
  console.log("当前用户是:", userName); // Alpaca
});
```

## 7. 异步执行模型：调用栈、任务与事件循环

词法作用域描述代码的**空间规则**：变量到哪里查找。异步执行模型描述代码的**时间规则**：回调什么时候获得执行机会。

可以用下面的简化模型理解浏览器或 Node.js 中的异步代码：

1. 同步代码进入调用栈并立即执行。
2. 定时器、网络请求等由宿主环境负责等待和处理。
3. 条件满足后，宿主把对应的回调放入任务队列或微任务队列。
4. 当前调用栈清空后，事件循环安排队列中的回调执行。

Promise 的 `.then` 回调属于微任务；`setTimeout` 回调属于任务（常被称为宏任务）。微任务通常会在下一项任务开始前清空，因此两者执行顺序可能不同：

```js
Promise.resolve().then(() => console.log("promise"));
setTimeout(() => console.log("timer"), 0);

// promise
// timer
```

## 8. 从回调地狱到 Promise 与 async/await

当多个异步步骤存在先后依赖，并用嵌套回调表达后续流程时，控制流和错误处理会逐渐向右缩进，形成回调地狱。事件循环解释这些回调何时获得执行机会，但不是回调地狱的直接原因。

```js
getUser(function (user) {
  getOrders(user.id, function (orders) {
    getProduct(orders[0].id, function (product) {
      console.log("终于拿到商品了！", product);
    });
  });
});
```

Promise 将异步操作的未来结果对象化，使后续操作可以链式组合，并集中处理错误：

```js
getUser()
  .then(user => getOrders(user.id))
  .then(orders => getProduct(orders[0].id))
  .then(product => console.log("拿到商品了！", product))
  .catch(err => console.log("任何一步报错都会集中在这里处理", err));
```

`async/await` 建立在 Promise 之上，提供更接近同步代码的控制流写法。`await` 会暂停当前 `async` 函数的后续执行，而不会阻塞整个 JavaScript 线程。

```js
async function fetchAllData() {
  try {
    const user = await getUser();
    const orders = await getOrders(user.id);
    const product = await getProduct(orders[0].id);

    console.log("拿到商品了！", product);
  } catch (err) {
    console.log("可以用 try...catch 处理异步错误", err);
  }
}
```

## 9. 手写 Promise

```js
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
      if (this.state !== "pending") return;

      this.state = "fulfilled";
      this.value = value;
      this.onFulfilledCallbacks.forEach(fn => fn());
    };

    const reject = reason => {
      if (this.state !== "pending") return;

      this.state = "rejected";
      this.reason = reason;
      this.onRejectedCallbacks.forEach(fn => fn());
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;
    onRejected = typeof onRejected === "function"
      ? onRejected
      : reason => { throw reason; };

    return new MyPromise((resolve, reject) => {
      const handle = (callback, value) => {
        // 为了简化演示，这里用 setTimeout 模拟异步执行。
        // 原生 Promise 使用 Promise Job/微任务机制，不能简单等同于定时器任务。
        setTimeout(() => {
          try {
            resolve(callback(value));
          } catch (error) {
            reject(error);
          }
        }, 0);
      };

      if (this.state === "fulfilled") {
        handle(onFulfilled, this.value);
      } else if (this.state === "rejected") {
        handle(onRejected, this.reason);
      } else {
        this.onFulfilledCallbacks.push(() => handle(onFulfilled, this.value));
        this.onRejectedCallbacks.push(() => handle(onRejected, this.reason));
      }
    });
  }
}
```

好好学习
