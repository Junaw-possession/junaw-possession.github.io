


# Git常用命令总结

## 一、基础配置
```bash
# 设置全局用户名
git config --global user.name "你的用户名"

# 设置全局邮箱
git config --global user.email "你的邮箱@xxx.com"
```

## 二、仓库初始化与关联
```bash
# 初始化本地仓库
git init

# 关联远程仓库
git remote add origin 远程仓库地址
# 示例：
git remote add origin https://github.com/用户名/仓库名.git
# 或SSH方式：
git remote add origin git@github.com:用户名/仓库名.git

# 查看远程仓库关联
git remote -v

# 修改远程仓库地址
git remote set-url origin 新的远程地址

# 删除远程仓库关联
git remote remove origin
```

## 三、日常操作
```bash
# 添加文件到暂存区
git add .  # 添加所有文件
git add 文件名  # 添加指定文件

# 提交代码
git commit -m "提交信息"

# 推送到远程仓库
git push origin 分支名
# 首次推送并绑定分支
git push -u origin 分支名

# 拉取远程代码
git pull origin 分支名
```

## 四、分支管理
```bash
# 查看分支
git branch

# 创建并切换分支
git checkout -b 新分支名

# 切换分支
git checkout 分支名

# 合并分支
git merge 被合并的分支名

# 删除本地分支
git branch -d 分支名

# 删除远程分支
git push origin --delete 分支名
```

## 五、版本管理
```bash
# 创建标签
git tag -a v1.0.0 -m "版本1.0.0"

# 推送标签到远程
git push origin v1.0.0
```

## 六、SSH配置
```bash
# 生成SSH密钥
ssh-keygen -t ed25519 -C "你的邮箱@xxx.com"

# 查看公钥内容
# Windows
type ~/.ssh/id_ed25519.pub
# Mac/Linux
cat ~/.ssh/id_ed25519.pub
```

## 七、常见问题解决
```bash
# 解决远程仓库已存在的问题
git remote remove origin
git remote add origin 新的远程地址

# 解决分支无关联的问题
git push -u origin 分支名
```


        


          
# Git使用指南：从初次设置到多人协作

## 一、初次使用或新环境下的Git配置

### 1. 前提准备
- **安装Git**：在终端执行 `git --version` 验证安装状态，未安装可参考[Git官网教程](https://git-scm.com/downloads)。
- **创建远程仓库**：在GitHub/Gitee等平台创建空仓库（建议暂不初始化README或许可证文件，避免后续冲突）。
- **配置Git身份**（首次使用必须执行）：
  ```bash
  # 设置全局用户名
  git config --global user.name "你的用户名"
  # 设置全局邮箱
  git config --global user.email "你的邮箱@xxx.com"
  ```

### 2. 本地仓库关联远程仓库的两种场景

#### 场景1：本地已有项目，关联新远程仓库
1. **进入项目目录**：
   ```bash
   cd /你的本地项目路径  # 例如：cd ~/projects/my_code
   ```
2. **初始化Git仓库**（若未初始化）：
   ```bash
   git init  # 创建.git隐藏目录，标记为Git仓库
   ```
3. **添加远程仓库地址**（核心步骤）：
   ```bash
   # origin为远程仓库别名（可自定义，默认使用origin）
   git remote add origin https://github.com/你的用户名/仓库名.git
   # 示例：git remote add origin https://github.com/zhangsan/fea-project.git
   ```
   - 远程仓库地址获取：在GitHub/Gitee仓库页面点击「Code」，复制HTTPS或SSH地址（推荐SSH，无需每次输入密码）。
4. **验证远程连接**：
   ```bash
   git remote -v  # 查看已关联的远程仓库，输出类似以下内容则表示成功：
   # origin  https://github.com/xxx/xxx.git  (fetch)
   # origin  https://github.com/xxx/xxx.git  (push)
   ```

#### 场景2：克隆已存在的远程仓库
若远程仓库已存在，直接克隆会自动建立关联，无需手动添加：
```bash
# 克隆远程仓库到本地，会创建与仓库同名的目录
git clone https://github.com/你的用户名/仓库名.git
# 进入克隆后的目录
cd 仓库名
# 验证连接（已自动关联origin）
git remote -v
```

### 3. SSH连接配置（推荐，免重复验证）
HTTPS方式每次操作需输入账号密码，SSH方式更便捷，配置步骤如下：
1. **生成SSH密钥**（首次操作）：
   ```bash
   ssh-keygen -t ed25519 -C "你的邮箱@xxx.com"
   # 按回车默认保存路径（~/.ssh/id_ed25519），可选择设置密码（或直接回车跳过）
   ```
2. **复制公钥到远程平台**：
   ```bash
   # 查看公钥内容（Windows使用type，Mac/Linux使用cat）
   cat ~/.ssh/id_ed25519.pub
   # 复制输出的全部内容（以ssh-ed25519开头，邮箱结尾）
   ```
   - 操作步骤：打开GitHub/Gitee → 个人设置 → SSH and GPG keys → New SSH key → 粘贴公钥，命名后保存。
3. **使用SSH地址关联远程仓库**：
   ```bash
   # 替换为SSH地址（格式：git@github.com:用户名/仓库名.git）
   git remote add origin git@github.com:你的用户名/仓库名.git
   ```

### 4. 常用操作验证
1. **首次推送本地代码到远程**：
   ```bash
   # 添加所有文件到暂存区
   git add .
   # 提交代码（必须执行，否则无法推送）
   git commit -m "初始化项目：添加有限元分析代码"
   # 推送（main是分支名，远程默认主分支可能是main或master）
   git push -u origin main  # -u表示绑定本地main分支到远程origin/main，后续可直接执行git push
   ```
2. **拉取远程代码**：
   ```bash
   git pull origin main  # 拉取远程main分支的最新代码到本地
   ```
3. **修改/删除远程仓库关联**：
   ```bash
   # 修改远程仓库地址（例如从HTTPS改为SSH）
   git remote set-url origin git@github.com:你的用户名/仓库名.git
   # 删除已关联的远程仓库
   git remote remove origin
   ```

### 5. 常见问题解决
- **推送提示「fatal: remote origin already exists」**：
  - 原因：已关联过origin远程仓库
  - 解决方案：先删除再重新添加
    ```bash
    git remote remove origin
    git remote add origin 新的远程地址
    ```
- **SSH连接提示「Permission denied」**：
  - 检查公钥是否复制完整、是否绑定到正确账号、本地私钥路径是否正确
- **推送提示「分支无关联」**：
  - 执行 `git push -u origin main` 绑定分支即可

### 6. 初次使用总结
- **核心步骤**：配置Git身份 → 关联远程仓库（`git remote add`） → 验证连接（`git remote -v`） → 推送/拉取代码
- **连接方式**：HTTPS（操作简单，需输入密码）、SSH（推荐，免重复验证）
- **关键命令**：
  - 关联远程：`git remote add origin 远程地址`
  - 验证连接：`git remote -v`
  - 首次推送：`git push -u origin main`
  - 拉取代码：`git pull origin main`

## 二、多人协作场景操作指南

### 1. 克隆远程仓库主分支
```bash
git clone git@gitee.com:你的账号/fem.git
cd fem
```

### 2. 创建并切换分支
```bash
git checkout -b 新分支名  # 创建并切换到新分支
```
若仅需切换分支（无需创建）：
```bash
git checkout 分支名
```

### 3. 分支开发
```bash
mkdir 新文件夹名  # 创建新文件夹进行开发
cd 新文件夹名
# 进行代码开发...
```

### 4. 提交代码
```bash
git add .  # 添加所有修改到暂存区
git commit -m "提交描述"  # 提交代码并添加注释
```

### 5. 推送分支到远程
```bash
git push origin 新分支名  # 将本地分支推送到远程仓库
```

### 6. 合并分支到主分支
```bash
git checkout main  # 切换到主分支（根据实际分支名调整，如master）
git pull origin main  # 拉取远程主分支最新代码，避免冲突
git merge 新分支名  # 合并新分支代码到主分支
git push origin main  # 推送合并后的主分支到远程仓库
```

### 7. 清理分支
- **删除本地分支**：
  ```bash
  git branch -d 新分支名
  ```
- **删除远程分支**：
  ```bash
  git push origin --delete 新分支名
  ```

### 8. 版本标签管理
```bash
git tag -a v1.0.0 -m "版本1.0.0"  # 创建带注释的标签
git push origin v1.0.0  # 推送标签到远程仓库
```

### 9. 协作流程总结
- **分支管理**：每个功能或修复创建独立分支，避免直接修改主分支
- **代码提交**：保持提交信息清晰，便于后续追溯
- **合并流程**：合并前先拉取最新代码，减少冲突概率
- **版本控制**：通过标签管理重要版本，便于回滚和发布
- **分支清理**：功能完成后及时删除临时分支，保持仓库整洁


        