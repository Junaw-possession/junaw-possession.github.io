/**
 * admin.js
 * 后台管理系统JavaScript文件
 */

// 全局变量
let blogPosts = [];
let isLoggedIn = false;

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化
    init();
});

// 初始化函数
function init() {
    // 检查登录状态
    checkLoginStatus();

    // 绑定事件
    bindEvents();

    // 如果已登录，加载数据
    if (isLoggedIn) {
        loadBlogPosts();
        updateDashboard();
    }
}

// 检查登录状态
function checkLoginStatus() {
    const loginStatus = localStorage.getItem('adminLoggedIn');
    isLoggedIn = loginStatus === 'true';

    if (isLoggedIn) {
        showAdminPanel();
    } else {
        showLoginForm();
    }
}

// 显示登录表单
function showLoginForm() {
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('admin-container').style.display = 'none';
}

// 显示管理面板
function showAdminPanel() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('admin-container').style.display = 'flex';
}

// 绑定事件
function bindEvents() {
    // 登录表单提交
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // 退出登录
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // 侧边栏导航
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });

    // 添加博客按钮
    document.getElementById('add-blog-btn').addEventListener('click', openAddModal);

    // 博客表单提交
    document.getElementById('blog-form').addEventListener('submit', handleBlogSubmit);

    // 模态框关闭按钮
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
}

// 处理登录
function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // 简单验证（实际项目中应该使用更安全的验证方式）
    if (username === 'admin' && password === 'admin123') {
        isLoggedIn = true;
        localStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
        loadBlogPosts();
        updateDashboard();
    } else {
        alert('用户名或密码错误！');
    }
}

// 处理退出登录
function handleLogout() {
    isLoggedIn = false;
    localStorage.removeItem('adminLoggedIn');
    showLoginForm();
}

// 导航到指定页面
function navigateToPage(pageName) {
    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === pageName) {
            item.classList.add('active');
        }
    });

    // 显示对应页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        if (page.id === pageName + '-page') {
            page.classList.add('active');
        }
    });
}

// 加载博客文章
async function loadBlogPosts() {
    try {
        const response = await fetch('/.netlify/functions/get-blogs');
        if (!response.ok) {
            throw new Error('获取博客列表失败');
        }
        blogPosts = await response.json();
        renderBlogList();
    } catch (error) {
        console.error('加载博客文章失败:', error);
        alert('加载博客文章失败！');
    }
}

// 渲染博客列表
function renderBlogList() {
    const tbody = document.getElementById('blog-table-body');
    tbody.innerHTML = '';

    blogPosts.forEach(post => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.description}</td>
            <td class="action-buttons">
                <button class="btn btn-success" onclick="editBlog('${post.id}')">编辑</button>
                <button class="btn btn-danger" onclick="deleteBlog('${post.id}')">删除</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 更新仪表盘
function updateDashboard() {
    document.getElementById('total-blogs').textContent = blogPosts.length;

    // 获取最后更新时间（这里简化处理，实际应该从文件系统获取）
    const now = new Date();
    document.getElementById('last-update').textContent = now.toLocaleDateString('zh-CN');
}

// 打开添加博客模态框
function openAddModal() {
    document.getElementById('modal-title').textContent = '添加新文章';
    document.getElementById('blog-id').value = '';
    document.getElementById('blog-title').value = '';
    document.getElementById('blog-description').value = '';
    document.getElementById('blog-content').value = '';
    document.getElementById('edit-modal').style.display = 'block';
}

// 编辑博客
async function editBlog(id) {
    const post = blogPosts.find(p => p.id === id);
    if (!post) return;

    try {
        // 加载博客内容
        const response = await fetch(`/.netlify/functions/get-blog-content?filename=${post.url}`);
        if (!response.ok) {
            throw new Error('获取博客内容失败');
        }
        const content = await response.text();

        document.getElementById('modal-title').textContent = '编辑博客';
        document.getElementById('blog-id').value = post.id;
        document.getElementById('blog-title').value = post.title;
        document.getElementById('blog-description').value = post.description;
        document.getElementById('blog-content').value = content;
        document.getElementById('edit-modal').style.display = 'block';
    } catch (error) {
        console.error('加载博客内容失败:', error);
        alert('加载博客内容失败！');
    }
}

// 删除博客
async function deleteBlog(id) {
    if (!confirm('确定要删除这篇文章吗？')) return;

    try {
        // 从数组中移除
        blogPosts = blogPosts.filter(p => p.id !== id);

        // 更新博客列表到 GitHub
        const response = await fetch('/.netlify/functions/update-blogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                blogPosts: blogPosts,
                commitMessage: 'Delete blog post'
            }),
        });

        if (!response.ok) {
            throw new Error('删除博客失败');
        }

        // 更新显示
        renderBlogList();
        updateDashboard();

        // 提示用户
        alert('文章已成功删除！');
    } catch (error) {
        console.error('删除博客失败:', error);
        alert('删除博客失败：' + error.message);
    }
}

// 处理博客表单提交
async function handleBlogSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('blog-id').value;
    const title = document.getElementById('blog-title').value;
    const description = document.getElementById('blog-description').value;
    const content = document.getElementById('blog-content').value;

    try {
        if (id) {
            // 编辑现有文章
            const index = blogPosts.findIndex(p => p.id === id);
            if (index !== -1) {
                blogPosts[index].title = title;
                blogPosts[index].description = description;

                // 更新博客内容到 GitHub
                const contentResponse = await fetch('/.netlify/functions/update-blog-content', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        filename: blogPosts[index].url,
                        content: content,
                        commitMessage: `Update blog: ${title}`
                    }),
                });

                if (!contentResponse.ok) {
                    throw new Error('更新博客内容失败');
                }
            }
        } else {
            // 添加新文章
            const newId = String(Math.max(...blogPosts.map(p => parseInt(p.id))) + 1);
            const filename = `blog${newId}.md`;
            const newPost = {
                id: newId,
                title: title,
                description: description,
                url: filename
            };
            blogPosts.push(newPost);

            // 创建新博客文件
            const contentResponse = await fetch('/.netlify/functions/update-blog-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filename: filename,
                    content: content,
                    commitMessage: `Create new blog: ${title}`
                }),
            });

            if (!contentResponse.ok) {
                throw new Error('创建博客内容失败');
            }
        }

        // 更新博客列表到 GitHub
        const listResponse = await fetch('/.netlify/functions/update-blogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                blogPosts: blogPosts,
                commitMessage: 'Update blog posts list'
            }),
        });

        if (!listResponse.ok) {
            throw new Error('更新博客列表失败');
        }

        // 更新显示
        renderBlogList();
        updateDashboard();

        // 关闭模态框
        closeModal();

        // 提示用户
        alert('文章已成功保存到 GitHub！');
    } catch (error) {
        console.error('保存博客失败:', error);
        alert('保存博客失败：' + error.message);
    }
}

// 关闭模态框
function closeModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('edit-modal');
    if (event.target === modal) {
        closeModal();
    }
};
