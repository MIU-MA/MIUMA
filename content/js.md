---
title: js作用域
date: 2026-08-27
intro: 八股
tags: [前端]
---
## 1. 作用域

- **全局作用域（Global Scope）：** 最外层的默认作用域，生命周期伴随整个页面/进程，在任意地方均可读写。
- **函数作用域（Function Scope）：** 每一个函数在被定义时形成独立的作用域，内部声明的变量对外不可见。
- **块级作用域（Block Scope，ES6+）：** 由任意花括号 `{}` 结合 `let` 或 `const` 形成。`var` 会穿透代码块，而 `let`/`const` 会被严格锁在块内。

## 2. 词法作用域 vs 动态作用域

| **维度**     | **词法作用域 (Lexical Scope / 静态作用域)** | **动态作用域 (Dynamic Scope)**     |
| ------------ | ------------------------------------------- | ---------------------------------- |
| **决定时机** | 代码编写 / 编译词法分析阶段                 | 代码运行阶段 (Runtime)             |
| **查找依据** | 函数在代码中的**物理声明位置（出生地）**    | 函数执行时的**调用栈（调用现场）** |

### 经典代码剖析

```JavaScript
var value = 1;

function foo() {
  console.log(value);
}

function bar() {
  var value = 2;
  foo(); // 在 bar 内部调用 foo
}

bar(); 
// 输出: 1 (JavaScript 词法作用域，foo 直接在全局找)
// 假设是动态作用域: 会输出 2 (foo 回退到调用栈的 bar 里面找)
```

## 3. 作用域链与就近原则

JavaScript 的变量查找严格遵循**就近原则（由内向外查找）**，这一链条被称为**作用域链**。

1. **认准出生地**：函数在声明阶段，其内部属性 `[[Scope]]` 就已经静态绑定了它声明时所处的外部词法环境。

   **由内向外爬楼梯**：

   - **第 1 站**：当前执行代码的自身局部作用域。
   - **第 2 站**：包裹当前函数的直接父级作用域（物理外层大括号）。
   - **第 N 站**：沿嵌套结构逐层外退，直至全局作用域。
   - **终点站**：若全局作用域仍未找到，抛出 `ReferenceError`。

2. **变量遮蔽 (Variable Shadowing)**：一旦在某一层找到了同名变量，查找**立即终止**，外层的同名变量被“遮蔽”。

3. **形参本质**：函数的形参等价于在该函数第一行用局部变量声明该参数。

4. **终点站（全局）**：到达全局仍未找到，抛出 `ReferenceError`。

## 4. 闭包 ：词法作用域的终极形态

- **本质：** 函数脱离“出生地”执行时，依然携带着它出生时的词法作用域引用。
- **机制：** 因为变量查找只认“出生地”，所以即使父函数已执行完毕，返回的子函数（闭包）依然能顺藤摸瓜访问到被封存的外部变量。

```javascript
function createCounter(count) {
  return function() {
    console.log(count); // 顺着出生地词法链锁定 createCounter 的局部环境
  };
}

var myCounter = createCounter(50);
var count = 200; // 全局变量，被闭包内部的变量遮蔽拦截

function execute() {
  var count = 300; // 调用现场的变量，被词法作用域规则彻底无视
  myCounter();     // 始终输出 50
}
execute();
```

## 5. 回调函数与异步控制流 

### 5.1 回调与词法作用域的完美配合

回调函数之所以能正常工作，完全依赖于**词法作用域**。即使它被传到了十万八千里外的地方执行，它依然只认自己的“出生地”。



```JavaScript
let userName = "Alpaca";

function fetchRemoteData(callback) {
  // 模拟异步请求
  setTimeout(() => {
    let userName = "Server_Admin";
    callback(); // 执行回调
  }, 1000);
}

// 传入回调函数
fetchRemoteData(function() {
  // 即使在 fetchRemoteData 内部执行，依然打印 "Alpaca"
  // 因为它顺着词法作用域，在自己的出生地（全局）找到了变量
  console.log("当前用户是:", userName); 
});
```

### 5.2 异步时间线与“回调地狱”

回调本身没有错，问题出在**异步的时序控制**上。当我们需要“等 A 查完查 B，等 B 查完查 C”时，只能把“下一步”一层层嵌套进回调函数里。

```JavaScript
// 早期噩梦：嵌套地狱 (Pyramid of Doom)
getUser(function(user) {
  getOrders(user.id, function(orders) {
    getProduct(orders[0].id, function(product) {
      console.log("终于拿到商品了！", product);
    });
  });
});
```

### 5.3 现代的救赎：Promise 与 async/await

现代 JavaScript 没有改变词法作用域，也没有改变底层的异步本质，而是引入了新的**语法工具**来扁平化控制流。

**Promise**

```JavaScript
getUser()
  .then(user => getOrders(user.id))
  .then(orders => getProduct(orders[0].id))
  .then(product => console.log("拿到商品了！", product))
  .catch(err => console.log("任何一步报错都会集中在这里处理", err));
```

**手写Promise**

```javascript
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined; 
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    }
    
    const reject = (reason) => { 
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    }
    
    try {
      executor(resolve, reject);
    } catch (err) { 
      reject(err) 
    }
  }

  then(onFulfilled, onRejected) {
    //防止then传的不是函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
    //返回新promise
    return new MyPromise((resolve, reject) => {
      const handle = (callback, value) => {
        setTimeout(() => {
          try {
            let x = callback(value);
            resolve(x);
          } catch (err) {
            reject(err);
          }
        }, 0)
      }
      
      if (this.state === 'fulfilled') {
        handle(onFulfilled, this.value);
      } 
      else if (this.state === 'rejected') {
        handle(onRejected, this.reason);
      } 
      else if (this.state === 'pending') {
        this.onFulfilledCallbacks.push(() => {
          handle(onFulfilled, this.value);
        });
        this.onRejectedCallbacks.push(() => {
          handle(onRejected, this.reason);
        });
      }
    });
  }
}
```

**async/await**

`async/await` 是 Promise 的语法糖，它允许引擎在 `await` 处暂停执行，直到结果返回。

```JavaScript
async function fetchAllData() {
  try {
    // 代码仿佛在这里“停住”了，没有了回调函数的影子
    const user = await getUser();
    const orders = await getOrders(user.id);
    const product = await getProduct(orders[0].id);
    
    console.log("拿到商品了！", product);
  } catch (err) {
    console.log("可以用原生的 try-catch 处理异步错误", err);
  }
}
```

**手写promise**



## 6. 普通 `this` 的动态性 vs 箭头函数的词法化

### 普通函数的 `this`

不遵循词法作用域，在执行时动态确定：谁调用，就指向谁（裸调用指向全局/window，方法调用指向对象自身）。

### 箭头函数的 `this`

为了解决嵌套函数（包括回调函数）中 `this` 丢失的问题，ES6 引入了箭头函数。

- **核心特性：** 箭头函数内部**没有自己的 `this`**。
- **机制：** 它把 `this` 退化成了一个普通的外部变量，**直接沿词法作用域链向外层查找**。

```JavaScript
const obj = {
  name: "Alpaca",
  test() {
    // ❌ 传统回调的灾难：普通函数的 this 在异步回调中变成了 window
    setTimeout(function() { console.log(this.name); }, 100); // undefined
    
    // ✅ 现代写法：箭头函数没有 this，顺藤摸瓜找到了 test 环境下的 obj
    setTimeout(() => { console.log(this.name); }, 100); // "Alpaca"
  }
};
```
好好学习好好学习