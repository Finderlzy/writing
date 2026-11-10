---
createdDate: 2026-11-09
---
## 模块化管理 js 文件
---
通过 `export` 和 `import` 实现。

每一个 js 文件单独 `import` 所需要的依赖，然后对外 `export` 可以提供的东西。放在一个项目里就是，每个 js 都各自 `import` 各自的依赖，然后全部提供一个初始化方法，并 `export` 出去。最后通过一个 `main.js` 导入我们自己写的 js 文件，并使用它们提供的初始化方法。在`index.html` 里面只需要引用 `main.js` 就可以了。


## node.js
---
众所周知，js 是只能运行在浏览器的代码。如果想要它运行在浏览器之外，我们的电脑之中，就需要 node.js 提供环境。node.js 和 js 文件之间的关系，就好比 python 和 .py 文件、Excel 和 .xlsx 文件之间的关系。


## npm
---
可以理解为**项目的管家**，可以做下面两件事情：
1. 帮忙安装东西。这个也是最常用的，`npm install ...` 。
2. 简化命令。比如，`npm run dev` ，这个命令就是被简化的。通过修改 `package.json` 里面的 `scripts` 的内容实现：
```json
"scripts": {
	"dev": "vite",
	"build": "vite build",
	"preview": "vite preview"
}
```


## vite
---
1. 热更新
2. 构建源代码
3. 翻译 Vue