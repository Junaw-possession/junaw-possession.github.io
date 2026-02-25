# 个人博客项目

这是一个使用GitHub Pages搭建的个人博客项目，支持Markdown解析、内容折叠、搜索功能等特性。

## 项目结构

```
myblog/
├── css/
│   └── styles.css          # 样式文件
├── data/
│   ├── blog-posts.json     # 博客文章配置文件
│   └── blogs/
│       └── blog1.md        # Markdown格式的博客文章
├── js/
│   ├── blog-loader.js      # 博客加载和解析逻辑
│   ├── markdown.js         # 空文件（已使用CDN替代）
│   └── scripts.js          # 前端脚本（搜索功能）
├── partials/
│   ├── footer.html         # 页脚模板
│   └── header.html         # 头部模板
├── about.html              # 关于页面
├── index.html              # 首页
└── README.md               # 项目说明文件
```

## 文件作用说明

### 根目录文件
- **index.html**：博客首页，包含布局结构和主要内容
- **about.html**：关于页面（当前为空）
- **README.md**：项目说明文件

### CSS目录
- **styles.css**：包含所有样式定义，如布局、博客列表、按钮样式等

### Data目录
- **blog-posts.json**：博客文章配置文件，包含文章标题、描述和文件路径
- **blogs/blog1.md**：Markdown格式的博客文章内容

### JS目录
- **blog-loader.js**：负责加载博客文章、解析Markdown、生成HTML并添加到页面
- **markdown.js**：空文件，原计划用于Markdown解析，现已使用CDN替代
- **scripts.js**：包含搜索功能和其他前端交互逻辑

### Partials目录
- **header.html**：头部导航模板
- **footer.html**：页脚模板

## 主要功能

1. **Markdown解析**：使用marked库解析Markdown格式的博客文章
2. **内容折叠**：博客文章默认显示摘要，点击"更多内容"按钮展开完整内容
3. **搜索功能**：支持按标题和内容搜索博客文章
4. **响应式布局**：左侧作者信息固定，右侧博客内容可滚动
5. **GitHub Pages部署**：通过GitHub Pages自动部署网站

## 如何使用

### 1. 添加新博客文章

1. 在 `data/blogs/` 目录下创建新的Markdown文件（如 `blog2.md`）
2. 在 `data/blog-posts.json` 文件中添加新文章的配置：

```json
[
    {
        "id": "1",
        "title": "博客文章 1",
        "description": "这是我的第一篇博客文章的简介。",
        "url": "blog1.md"
    },
    {
        "id": "2",
        "title": "博客文章 2",
        "description": "这是我的第二篇博客文章的简介。",
        "url": "blog2.md"
    }
]
```

### 2. 修改样式

编辑 `css/styles.css` 文件来自定义博客的外观。

### 3. 部署到GitHub Pages

1. 确保代码已提交到GitHub仓库
2. 在GitHub仓库的Settings页面中启用GitHub Pages
3. 选择 `main` 分支和根目录作为部署源
4. 等待几分钟，GitHub会自动部署你的博客

## 技术栈

- **前端**：HTML5, CSS3, JavaScript
- **Markdown解析**：marked.js（通过CDN引入）
- **部署**：GitHub Pages
- **版本控制**：Git

## 浏览器兼容性

支持所有现代浏览器，包括Chrome、Firefox、Safari和Edge。

## 许可证

MIT License