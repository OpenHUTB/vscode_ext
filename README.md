# Visual Studio Code 的 HUTB 模拟器 API 扩展

为 Carla 自动驾驶模拟器 API、AirSim 无人机模拟器 API、Mujoco 模拟器 API 提供智能代码补全、文档和 IntelliSense 支持。

## 特性

### 智能代码补全

- Carla 类、方法和属性的上下文感知补全
- 输入类名时自动显示相关方法和属性
- 完成项目中的富文本的预览

![Code Completion](images/completion.gif)


### 方法签名帮助

- 键入方法调用时的实时参数信息
- 参数类型和默认值
- 每个参数的文档


### 悬停文档
- 有关类、方法和属性的悬停的详细文档
- 显示方法签名和返回类型
- 显示属性的访问信息（读/写）

### 智能上下文检测
- 仅显示基于上下文的相关完成内容
- 开始新语句时的类建议
- 仅针对当前正在输入的类提供方法和属性建议

## 要求

- Visual Studio Code version 1.94.0 或更高版本
- VS Code 的 Python 扩展
- 在您的环境中安装 Carla Python API（可选）

## 安装

1. 通过 VS Code 安装扩展：
   - 打开 VS Code
   - 前往左侧工具栏中的扩展 (Ctrl+Shift+X)
   - 搜索 "hutb"
   - 点击安装(Install)

2. 或者，下载 VSIX 文件并手动安装：
   ```bash
   code --install-extension hutb-0.0.4.vsix
   ```

## 使用

编辑 Python 文件时，该扩展程序会自动激活。以下是主要功能的使用方法：

1. **类名补全**
   - 开始输入 Carla 类名
   - 按 Ctrl+Space 查看可用的类
   
2. **方法和属性补全**
   - 输入一个类名，后跟一个点（例如， `Actor.`）
   - 完成将自动显示可用的方法和属性
   
3. **签名帮助**
   - 在方法名称后输入一个左括号
   - 签名帮助将显示参数信息
   - 使用逗号浏览参数

## 示例

```python
# 该扩展将提供补全和文档
world = client.get_world()  # 显示 World 类的方法
actor = world.spawn_actor()  # 显示 spawn_actor 参数
```

## 已知的问题

- 目前不支持方法重载
- 某些复杂类型提示可能无法正确解析
- 某些 Carla API 方法的文档可能不完整

## 故障排除

如果您遇到任何问题：

1. 确保安装了最新版本的 VS Code
2. 检查 Python 扩展是否已安装并配置
3. 验证您的 hutb Python API 是否已正确安装
4. 如果没有出现补全，请尝试重新加载 VS Code

## 贡献

1. Fork 该仓库

``` bash
   git clone  https://github.com/OpenHUTB/vscode_ext
```

2. 创建一个特性分支
3. 提交(commit)你的修改
4. 推送(push) 到特性分支
5. 创建拉取请求(Pull Request)

## 发布到市场

1.下载并安装 [node 20](https://nodejs.org/en/download) ；并安装`vsce`
```shell
npm i -g vsce
```

2.打包成`vsix`：
```shell
vsce package
```

3.打开`extension.js`，然后按 F5(Run->Start Debugging)，会打开一个新的VScode，新建python脚本，以测试效果。

4.登录：
```shell
vsce login OpenHUTB
```
输入 Token 。

5.发布
```shell
vsce publish
```

等待几分钟就可以在 [扩展的链接](https://marketplace.visualstudio.com/items?itemName=OpenHUTB.hutbapi) 、[Hub的链接](https://marketplace.visualstudio.com/manage/publishers/OpenHUTB/extensions/hutbapi/hub) 中看到插件


6.（其他）取消发布

访问 [管理页面](https://marketplace.visualstudio.com/manage/) ，右键所需要删除的扩展进行删除。

## 发行说明

### 0.0.1 - 初始版本
- Carla API 类的补全完成
- 方法和属性建议
- 签名帮助
- 悬停文档
- 上下文感知补全

## 计划的功能

- 支持方法重载
- 改进的类型提示解析
- 与 hutb 文档集成
- 常见 Carla 操作的快速操作
- Code snippets for common patterns

## 许可证

此扩展遵循 MIT 许可证。详情请参阅 [LICENSE 文件](./LICENSE) 。

## 致谢

- Carla 仿真器团队提供的出色文档
- VS Code 扩展开发社区
- [carlaApiExtension](https://github.com/OpenHUTB/vscode_ext)
- [发布方法](https://juejin.cn/post/7402800227810852900) 。

## 支持

对于错误报告和功能请求，请使用 GitHub 问题跟踪器：

[https://github.com/OpenHUTB/vscode_ext/issues](https://github.com/OpenHUTB/vscode_ext/issues)

---

**开始享受使用 hutb API 扩展吧！**
