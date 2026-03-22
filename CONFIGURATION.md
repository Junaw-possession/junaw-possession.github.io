# Netlify 环境变量配置说明

## 环境变量说明

本项目的 Netlify Functions 使用以下环境变量：

| 变量名 | 说明 | 默认值 | 示例值 |
|--------|------|--------|--------|
| GITHUB_TOKEN | GitHub Personal Access Token | 无 | ghp_xxxxxxxxxxxx |
| REPO_OWNER | GitHub 用户名/组织名 | 无 | junaw-possession |
| REPO_NAME | 仓库名称 | 无 | junaw-possession.github.io |
| GITHUB_BRANCH | 分支名称 | main | MY_BRANCH |
| CORRECT_PASSWORD | 后台管理密码 | 无 | your_secure_password |

## 关于 GITHUB_BRANCH 变量

### 默认行为
- 如果未设置 `GITHUB_BRANCH` 环境变量，系统默认使用 `main` 分支
- 代码中的实现：`const branch = process.env.GITHUB_BRANCH || 'main';`

### 自定义分支
- 你可以将 `GITHUB_BRANCH` 设置为任何有效的分支名称，如 `MY_BRANCH`
- 系统会自动使用你指定的分支进行所有 GitHub API 操作

### 当前配置
- 你的 `GITHUB_BRANCH` 已设置为 `MY_BRANCH`
- 所有博客操作（读取、创建、更新、删除）都会在 `MY_BRANCH` 分支上进行

## 代码实现

所有 Functions 文件都使用了以下代码模式来获取分支名称：

```javascript
const branch = process.env.BRANCH || 'main';
```

这意味着：
1. 如果设置了 `BRANCH` 环境变量，使用该值
2. 如果未设置，默认使用 `main`

## 验证配置

### 方法一：通过 Netlify Dashboard
1. 登录 Netlify
2. 选择你的站点
3. 进入 Site settings → Environment variables
4. 确认 `BRANCH` 的值为 `MY_BRANCH`

### 方法二：通过 Netlify CLI
```bash
netlify env:get GITHUB_BRANCH
```

应该显示：`MY_BRANCH`

## 影响范围

设置 `BRANCH = MY_BRANCH` 会影响以下操作：

1. **获取博客列表**
   - 从 `MY_BRANCH` 分支读取 `data/blog-posts.json`

2. **获取博客内容**
   - 从 `MY_BRANCH` 分支读取 `data/blogs/*.md`

3. **更新博客列表**
   - 将更新提交到 `MY_BRANCH` 分支

4. **更新博客内容**
   - 将更新提交到 `MY_BRANCH` 分支

5. **删除博客**
   - 从 `MY_BRANCH` 分支删除

## 注意事项

1. **分支存在性**
   - 确保 `MY_BRANCH` 分支在 GitHub 仓库中存在
   - 如果不存在，需要先创建该分支

2. **分支权限**
   - 确保 GitHub Token 有权限访问和修改 `MY_BRANCH` 分支

3. **部署设置**
   - Netlify 的部署分支设置可以与 `BRANCH` 环境变量不同
   - 例如：
     - Netlify 部署分支：`main`
     - GitHub API 操作分支：`MY_BRANCH`

4. **工作流建议**
   - 使用 `MY_BRANCH` 作为内容编辑分支
   - 通过 Pull Request 合并到 `main` 分支
   - `main` 分支用于生产部署

## 修改分支名称

如果需要修改分支名称，只需：

1. 在 Netlify Dashboard 中更新 `GITHUB_BRANCH` 环境变量
2. 或使用 Netlify CLI：
```bash
netlify env:set GITHUB_BRANCH "new-branch-name"
```

3. 重新部署站点（Netlify 会自动检测环境变量变化）

## 故障排除

### 问题：无法找到分支
**解决方案**：
- 确认分支在 GitHub 仓库中存在
- 检查分支名称拼写是否正确
- 验证 GitHub Token 权限

### 问题：权限错误
**解决方案**：
- 检查 GitHub Token 是否有 `repo` 权限
- 确认 Token 未过期
- 验证仓库所有者和名称是否正确

## 总结

将 `GITHUB_BRANCH` 设置为 `MY_BRANCH` 是完全可行的，不需要修改任何代码。系统会自动使用你指定的分支进行所有 GitHub API 操作。只需确保：
1. 分支在 GitHub 仓库中存在
2. GitHub Token 有相应权限
3. 环境变量配置正确
