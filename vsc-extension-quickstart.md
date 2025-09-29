# 欢迎使用 VS Code 扩展

## 文件夹中的内容

* 此文件夹包含扩展所需的所有文件。
* `package.json` - 这是您声明扩展和命令的清单文件。
  * 示例插件注册了一个命令，并定义了其标题和命令名称。有了这些信息，VS Code 就可以在命令面板中显示该命令。目前还不需要加载插件。
* `extension.js` - 这是您将提供命令实现的主文件。
  * 该文件导出一个函数 `activate`，该函数在扩展程序首次激活时（在本例中是通过执行命令）被调用。在 `activate` 函数内部，我们调用了 `registerCommand`。 
  * 我们将包含命令实现的函数作为第二个参数传递给 `registerCommand`。

## 立即启动并运行

* 按 `F5` 打开一个已加载扩展程序的新窗口。
* 通过按下（`Ctrl+Shift+P` 或 Mac 上的 `Cmd+Shift+P`）并输入 `Hello World`，从命令面板运行命令。
* 在 `extension.js` 内的代码中设置断点来调试您的扩展。
* 在调试控制台中查找扩展的输出。

## 做出改变

* 更改 `extension.js` 中的代码后，您可以从调试工具栏重新启动扩展。
* 您还可以使用扩展程序重新加载（在 Mac 上按 `Ctrl+R` 或 `Cmd+R`）VS Code 窗口来加载您的更改。

## 探索 API

* 当您打开文件 `node_modules/@types/vscode/index.d.ts` 时，您可以打开我们的全套 API。

## 运行测试

* 安装 [Extension Test Runner](https://marketplace.visualstudio.com/items?itemName=ms-vscode.extension-test-runner)
* 从活动栏打开测试视图并单击“运行测试(Run Test)”按钮，或使用热键 `Ctrl/Cmd + ; A` 
* 在测试结果(Test Results)视图中查看测试结果的输出。
* 对 `test/extension.test.js` 进行更改或在 `test` 文件夹中创建新的测试文件。
  * 提供的测试运行器将只考虑与名称模式 `**.test.js` 匹配的文件。
  * 您可以在 `test` 文件夹内创建文件夹，以任何您想要的方式构建测试。

## 更进一步

 * [遵循 UX 指南](https://code.visualstudio.com/api/ux-guidelines/overview) 来创建与 VS Code 的本机界面和模式无缝集成的扩展。
 * 在 VS Code 扩展市场上 [发布您的扩展](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) 。
 * 通过设置 [持续集成](https://code.visualstudio.com/api/working-with-extensions/continuous-integration) 来实现自动化构建。
 * 集成到 [报告问题](https://code.visualstudio.com/api/get-started/wrapping-up#issue-reporting) 流程以获取用户报告的问题和功能请求。
