---
title: cf1099 耻辱补题(数模好累)
date: 2026-05-22
intro: 算法
---
~~我果然永远讨厌数学~~

# [Problem - C - Codeforces](https://codeforces.com/contest/2231/problem/C)

给定一个长度为 $n$ 的正整数序列，每次可以对序列中的元素进行操作：

- 偶数除以 2

- 奇数加 1

  求将所有数字变成完全相等的最少操作次数。（$\sum n \le 10^5, a_i \le 10^9$）

### 思路

最终数一定可以由$a[0]$演化，无论$a[0]$ 有多大（最大 $10^9$），它最多演化 40 步左右就会跌入 1 和 2 的循环
暴力统计 操作过程中每个数 x 出现次数 cnt

如果cnt=n,那么这个x就是合法的

因此我们只需要用两个map，一个负责存储出现的次数，另一个存步数

```c++
void solve() {
    int n;
    cin >> n;
    map<int, int> cnt;       // 记录某个数字被多少个初始数字经过了
    map<int, int> sum_steps; // 记录这几个初始数字到达这里花费的总步数
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        int step = 0;
        bool s1= false;
        bool s2 = false;
        while (true) {
            if (x == 1) {
                if (s1) break;
                s1 = true;
            }
            if (x == 2) {
                if (s2) break;
                s2 = true;
            }

            // 核心逻辑：记录次数和步数
            cnt[x]++;
            sum_steps[x] += step;

            // 演化到下一个状态
            if (x % 2 == 0) x /= 2;
            else x += 1;

            step++;
        }
    }

    int ans = 2e18;

    // 遍历所有的相交点
    for (auto& v : cnt) {
        int val = v.first;
        int c = v.second;

        // 如果这个数字被所有 n 个人都经过了，说明它是一个合法的统一目标
        if (c == n) {
            ans = min(ans, sum_steps[val]);
        }
    }

    cout << ans << "\n";
}

```
太强的思路了（（（
