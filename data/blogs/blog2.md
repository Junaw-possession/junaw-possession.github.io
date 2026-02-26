# VSCode配置虚拟环境

## 环境准备

### 1. 下载Miniconda
访问[Miniconda官网](https://docs.conda.io/en/latest/miniconda.html)下载适合你系统的版本并安装。

### 2. 下载VSCode
访问[VSCode官网](https://code.visualstudio.com/)下载并安装最新版本。

## 配置步骤

### 3. 打开命令提示符
- 按下 `Win + R` 组合键
- 输入 `cmd` 并回车

### 4. 激活Conda基础环境

#### Windows系统
```bash
C:\Users\admin\miniconda3\Scripts\activate.bat
```

#### Linux系统
```bash
source ~/miniconda3/bin/activate
```

执行完成后，终端会显示 `(base)` 前缀，表示已进入基础环境。

### 5. 初始化Conda
在激活的环境中执行：
```bash
conda init
```

### 6. 配置PowerShell执行策略
- 以管理员身份打开PowerShell
- 执行以下命令：
```powershell
Set-ExecutionPolicy RemoteSigned
```

### 7. 接受安装通道协议
```bash
conda tos accept --override-channels --channel `https://repo.anaconda.com/pkgs/main` --channel `https://repo.anaconda.com/pkgs/r` --channel `https://repo.anaconda.com/pkgs/msys2`
```

### 8. 添加镜像源（可选）
为了提高下载速度，可以添加清华镜像源：
```bash
conda config --add channels `https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/`
conda config --add channels `https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r/`
conda config --add channels `https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2/`
conda config --add channels `https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/`
```

### 9. 创建虚拟环境
创建一个名为 `w` 的虚拟环境，使用Python 3.9版本：
```bash
conda create -n w python=3.9 -y
```

### 10. 重置镜像源（可选）
如果需要删除之前添加的镜像源并恢复默认设置：
```bash
conda config --remove-key channels
```

### 11. 添加官方源
```bash
conda config --add channels conda-forge
conda config --add channels defaults
```

### 12. 删除虚拟环境
如果需要删除名为 `fenicsx-env` 的虚拟环境：
```bash
conda remove -n fenicsx-env --all -y
```

## 运行程序

### Windows系统
```bash
python test.py
```

### Linux/macOS系统
```bash
python3 test.py
```

## 总结
通过以上步骤，你可以在VSCode中成功配置和管理Python虚拟环境，为不同的项目创建独立的开发环境，避免依赖冲突。