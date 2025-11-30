# 将 vscode 及其依赖项打包为一个独立的可执行文件
# 所有下载的文件均放到 build 目录中

import requests


# 参考：https://code.visualstudio.com/docs/supporting/faq#_previous-release-versions
# 注意区分可执行文件和zip包
url = 'https://update.code.visualstudio.com/1.76.2/win32-x64-archive/stable'

# 清除代理，否则会出错：Unable to connect to proxy
session = requests.Session()
session.trust_env = False

vsc_file = session.get(url)

# 如果不存在 build 目录，则创建它
import os

if not os.path.exists('build'):
    os.makedirs('build')

open('build/vsc.zip', 'wb').write(vsc_file.content)