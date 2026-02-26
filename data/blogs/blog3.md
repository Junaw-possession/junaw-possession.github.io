# Windows操作系统下使用Cmake编译c/c++程序流程
以下是Windows系统中基于CMake + MinGW64编译C/C++程序的完整流程，步骤清晰且可直接落地执行：

## 1. 下载依赖工具
### 1.1 下载CMake
- 下载地址：[CMake官方下载页](https://cmake.org/download/)
- 建议选择Windows x64 Installer版本，安装时勾选“Add CMake to the system PATH for all users”（将CMake加入系统环境变量）。

### 1.2 下载MinGW64
- 推荐下载地址：[MinGW-w64官方分发版](https://sourceforge.net/projects/mingw-w64/files/)
- 选择适配Windows x64的版本（如`x86_64-posix-seh`），下载后解压到非中文、无空格的路径（例如`D:\mingw64`），并将其`bin`目录（如`D:\mingw64\bin`）添加到系统环境变量。

## 2. 项目文件存放格式（规范示例）
建议采用CMake标准项目结构，避免路径含中文/空格，示例如下：
```
你的项目根目录/
├── CMakeLists.txt  # 核心配置文件，必须有
├── src/            # 源代码目录
│   └── main.cpp    # 你的C/C++源代码文件
└── build/          # 编译输出目录（手动创建，空文件夹即可）
```

## 3. 编译执行步骤
### 3.1 打开build文件夹的终端
- 进入项目根目录下的`build`文件夹，按住`Shift`键 + 右键空白处，选择“在此处打开命令窗口”或“在此处打开PowerShell窗口”。

### 3.2 生成MinGW Makefile
在终端中执行以下指令，生成适配MinGW的编译配置文件：
```bash
cmake -G "MinGW Makefiles" ..
```
- 说明：`-G "MinGW Makefiles"` 指定生成MinGW兼容的Makefile，`..` 表示向上一级目录（项目根目录）读取`CMakeLists.txt`。

### 3.3 编译项目
执行编译指令，CMake会根据Makefile编译源码生成可执行文件：
```bash
mingw32-make
```
- 若编译无报错，`build`文件夹下会生成`.exe`可执行文件。

### 3.4 运行生成的.exe文件
在终端中直接输入`.exe`文件名称（或完整路径）执行：
```bash
# 示例：若生成的文件为main.exe
main.exe
```

### 3.5 清理编译文件
若需要删除编译生成的临时文件和可执行文件，执行：
```bash
mingw32-make clean-all
```
- 若`clean-all`无效，可尝试`mingw32-make clean`（需确保CMakeLists.txt中配置了清理规则）。

### 总结
1. 核心前提：CMake和MinGW64需正确配置环境变量，路径避免中文/空格；
2. 关键步骤：先通过`cmake -G "MinGW Makefiles" ..`生成Makefile，再用`mingw32-make`编译；
3. 辅助操作：运行`.exe`直接执行，清理文件用`mingw32-make clean/clean-all`。