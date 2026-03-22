# Netlify 环境变量快速配置指南

## 问题说明

如果你在 Netlify 环境变量中设置了 `GITHUB_BRANCH = MY_BRANCH`，但 GitHub 仓库中并没有这个分支，系统将无法正常工作。

## 解决方案

### 步骤 1: 查看你的 GitHub 仓库分支

1. 登录 GitHub
2. 进入你的仓库页面
3. 点击 "main" 或 "master" 下拉菜单
4. 查看所有可用分支

通常，仓库会有以下分支之一：
- `main`（默认）
- `master`（较旧的项目）

### 步骤 2: 在 Netlify 中更新 BRANCH 环境变量

#### 方式一：通过 Netlify Dashboard

1. 登录 Netlify
2. 选择你的站点
3. 进入 Site settings → Environment variables
4. 找到 `GITHUB_BRANCH` 变量
5. 将其值改为你仓库中实际存在的分支名称（如 `main` 或 `master`）
6. 保存更改

#### 方式二：通过 Netlify CLI

```bash
# 查看当前 GITHUB_BRANCH 值
netlify env:get GITHUB_BRANCH

# 更新 GITHUB_BRANCH 为正确的分支名称
netlify env:set GITHUB_BRANCH "main"
```

### 步骤 3: 验证配置

1. 在 Netlify Dashboard 中确认环境变量已更新
2. 访问你的后台管理系统（admin.html）
3. 尝试加载博客列表
4. 尝试添加、编辑或删除博客
5. 检查 GitHub 仓库，确认更改已同步

## 常见场景

### 场景 1: 你的仓库只有 main 分支

**配置**：
```
GITHUB_BRANCH = main
```

**说明**：这是最常见的情况，直接使用 `main` 分支即可。

### 场景 2: 你的仓库只有 master 分支

**配置**：
```
GITHUB_BRANCH = master
```

**说明**：较旧的项目可能使用 `master` 作为默认分支。

### 场景 3: 你想在特定分支上工作

**配置**：
```
GITHUB_BRANCH = your-branch-name
```

**前提条件**：
1. 该分支必须在 GitHub 仓库中存在
2. GitHub Token 有权限访问该分支

## 完整的环境变量配置示例

假设你的仓库使用 `main` 分支：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| GITHUB_TOKEN | ghp_xxxxxxxxxxxx | GitHub Personal Access Token |
| REPO_OWNER | junaw-possession | 你的 GitHub 用户名 |
| REPO_NAME | junaw-possession.github.io | 仓库名称 |
| GITHUB_BRANCH | main | 仓库分支名称 |
| CORRECT_PASSWORD | your_password | 后台管理密码 |

## 验证分支是否正确

### 方法一：通过 GitHub API

访问以下 URL（替换为你的信息）：
```
https://api.github.com/repos/你的用户名/仓库名/branches
```

示例：
```
https://api.github.com/repos/junaw-possession/junaw-possession.github.io/branches
```

你会看到所有分支的列表。

### 方法二：通过 Git 命令

```bash
# 克隆仓库
git clone https://github.com/你的用户名/仓库名.git

# 进入仓库目录
cd 仓库名

# 查看所有分支
git branch -a
```

## 故障排除

### 问题：仍然无法连接到 GitHub

**检查清单**：
- [ ] GITHUB_BRANCH 环境变量是否正确设置
- [ ] 分支是否存在于 GitHub 仓库中
- [ ] GitHub Token 是否有效
- [ ] GitHub Token 是否有 `repo` 权限
- [ ] REPO_OWNER 和 REPO_NAME 是否正确

### 问题：Netlify 环境变量未生效

**解决方案**：
1. 确认已保存环境变量
2. 重新部署站点
3. 清除浏览器缓存
4. 检查 Netlify Functions 日志

## 总结

1. **不要使用不存在的分支名称**
   - `BRANCH` 必须设置为 GitHub 仓库中实际存在的分支
   - 如果设置了不存在的分支，系统将无法工作

2. **推荐使用 main 或 master**
   - 大多数仓库使用 `main` 作为默认分支
   - 较旧的项目可能使用 `master`

3. **验证配置**
   - 确认分支存在
   - 测试后台管理系统功能
   - 检查 GitHub 仓库确认更改已同步

## 需要帮助？

如果遇到问题，请：
1. 查看 `DEPLOYMENT_GUIDE.md` 获取详细部署说明
2. 查看 `CONFIGURATION.md` 了解配置详情
3. 检查 Netlify Functions 日志
4. 在 GitHub Issues 中提问
