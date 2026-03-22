# Netlify Functions 部署指南

## 概述

本指南将帮助你通过 Netlify Functions 作为中转站，使用 GitHub API 实现在网站后台管理修改内容后同步推送到 GitHub 远程仓库。

## 前置要求

1. 一个 GitHub 账户
2. 一个 Netlify 账户
3. 你的博客项目仓库

## 步骤 1: 创建 GitHub Personal Access Token

1. 登录 GitHub
2. 点击右上角头像 → Settings
3. 左侧菜单选择 Developer settings
4. 选择 Personal access tokens → Tokens (classic)
5. 点击 Generate new token (classic)
6. 设置 token 名称（如：Netlify Blog CMS）
7. 选择权限（至少需要以下权限）：
   - `repo` (完整仓库访问权限)
   - `workflow` (如果需要触发 GitHub Actions)
8. 点击 Generate token
9. **重要**：复制并保存生成的 token，它只显示一次！

## 步骤 2: 配置 Netlify 环境变量

### 方式一：通过 Netlify Dashboard

1. 登录 Netlify
2. 选择你的站点
3. 进入 Site settings → Environment variables
4. 添加以下环境变量：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| GITHUB_TOKEN | GitHub Personal Access Token | ghp_xxxxxxxxxxxx |
| REPO_OWNER | GitHub 用户名/组织名 | junaw-possession |
| REPO_NAME | 仓库名称 | junaw-possession.github.io |
| GITHUB_BRANCH | 分支名称（可选） | main |
| CORRECT_PASSWORD | 后台管理密码 | your_secure_password |

### 方式二：通过 Netlify CLI

1. 安装 Netlify CLI：
```bash
npm install -g netlify-cli
```

2. 登录 Netlify：
```bash
netlify login
```

3. 设置环境变量：
```bash
netlify env:set GITHUB_TOKEN "your_github_token"
netlify env:set REPO_OWNER "your_username"
netlify env:set REPO_NAME "your_repo_name"
netlify env:set GITHUB_BRANCH "main"
netlify env:set CORRECT_PASSWORD "your_password"
```

## 步骤 3: 部署到 Netlify

### 方式一：通过 Git 集成部署

1. 将你的项目推送到 GitHub
2. 在 Netlify 创建新站点
3. 选择 "Import from an existing project"
4. 选择你的 GitHub 仓库
5. 配置构建设置：
   - Build command: （留空，因为是静态站点）
   - Publish directory: `.` （根目录）
6. 点击 Deploy site

### 方式二：通过 Netlify CLI 部署

1. 在项目根目录初始化 Netlify：
```bash
netlify init
```

2. 按照提示完成配置
3. 部署：
```bash
netlify deploy --prod
```

## 步骤 4: 验证部署

1. 访问你的 Netlify 站点 URL
2. 导航到 `admin.html`
3. 使用配置的密码登录
4. 尝试添加、编辑或删除博客文章
5. 检查 GitHub 仓库，确认更改已同步

## 步骤 5: 配置自定义域名（可选）

1. 在 Netlify 站点设置中选择 Domain management
2. 添加自定义域名
3. 按照提示配置 DNS 记录

## 安全建议

1. **保护管理页面**：
   - 使用强密码
   - 考虑添加 IP 白名单
   - 定期更换密码

2. **GitHub Token 安全**：
   - 定期轮换 token
   - 限制 token 权限
   - 不要将 token 提交到代码仓库

3. **启用 HTTPS**：
   - Netlify 自动提供免费 SSL 证书
   - 确保所有请求都使用 HTTPS

## 故障排除

### 问题 1: Functions 返回 500 错误

**解决方案**：
- 检查 Netlify 环境变量是否正确配置
- 查看 Netlify Functions 日志
- 验证 GitHub Token 是否有效

### 问题 2: 无法连接到 GitHub API

**解决方案**：
- 检查网络连接
- 验证 GitHub Token 权限
- 确认仓库名称和所有者名称正确

### 问题 3: 登录失败

**解决方案**：
- 检查 CORRECT_PASSWORD 环境变量
- 清除浏览器缓存和 localStorage
- 查看 Netlify Functions 日志

## 功能说明

### 已实现的功能

1. **博客列表管理**
   - 获取博客列表
   - 更新博客列表
   - 删除博客文章

2. **博客内容管理**
   - 获取博客内容
   - 创建新博客
   - 更新现有博客

3. **用户认证**
   - 密码验证
   - 会话管理

### API 端点

| 端点 | 方法 | 描述 |
|------|------|------|
| /.netlify/functions/get-blogs | GET | 获取博客列表 |
| /.netlify/functions/get-blog-content | GET | 获取博客内容 |
| /.netlify/functions/update-blogs | POST | 更新博客列表 |
| /.netlify/functions/update-blog-content | POST | 更新博客内容 |
| /.netlify/functions/verify-password | POST | 验证密码 |

## 维护和更新

### 更新 Functions

1. 修改 `functions` 目录下的文件
2. 提交到 Git
3. Netlify 会自动重新部署

### 监控日志

1. 在 Netlify Dashboard 选择 Functions
2. 查看实时日志和历史日志
3. 设置错误通知

## 扩展功能建议

1. 添加图片上传功能
2. 实现文章分类和标签
3. 添加评论系统
4. 集成分析工具
5. 实现多用户支持

## 联系支持

如有问题，请通过以下方式联系：
- GitHub Issues
- Netlify Support
- 项目文档

## 许可证

MIT License
