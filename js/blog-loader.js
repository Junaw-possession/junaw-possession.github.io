// blog-loader.js

window.loadBlogs = async function (query = '') {
    const listEl = document.getElementById('blog-list');
    const navEl = document.getElementById('blog-nav');
    if (!listEl) return;
    listEl.innerHTML = '正在加载...';
    if (navEl) {
        navEl.innerHTML = '加载中...';
    }

    try {
        const res = await fetch('data/blog-posts.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('无法加载 blog-posts.json');
        const posts = await res.json();

        if (!Array.isArray(posts)) throw new Error('blog-posts.json 格式错误（应为数组）');

        listEl.innerHTML = '';
        for (let i = 0; i < posts.length; i++) {
            const p = posts[i];

            // 解析可能的文件路径，若只是文件名则定位到 data/blogs/ 下
            let filePath = p.file || p.path || p.filename || p.url || (p.slug ? `data/blogs/${p.slug}.md` : null) || p;
            if (typeof filePath === 'string') {
                filePath = filePath.trim();
                // 如果是相对文件名且没有路径，补全到 data/blogs/
                if (/^[^\/\\]+\.md$/i.test(filePath)) {
                    filePath = `data/blogs/${filePath}`;
                }
                // 如果是相对的 blogs/ 或 data/blogs/ 以外的情况，尽量保持原样
            } else {
                continue;
            }

            // 加载 markdown 内容
            let md = '';
            try {
                const mdRes = await fetch(filePath, { cache: 'no-store' });
                if (mdRes.ok) md = await mdRes.text();
            } catch (e) {
                md = '';
            }

            // 将 markdown 转为 HTML（若未加载 marked，保留原文）
            let html = '';
            try {
                if (window.marked) {
                    // 兼容不同版本的marked库
                    if (typeof window.marked.parse === 'function') {
                        html = window.marked.parse(md);
                    } else if (typeof window.marked === 'function') {
                        html = window.marked(md);
                    } else {
                        html = md.replace(/\n/g, '<br>');
                    }
                } else {
                    html = md.replace(/\n/g, '<br>');
                }
            } catch (e) {
                console.error('Markdown解析错误:', e);
                html = md;
            }

            // 生成目录
            let tocHtml = '';
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
            
            if (headings.length > 1) { // 至少有两个标题才生成目录
                tocHtml = '<div class="blog-toc"><h4>目录</h4><ul>';
                
                headings.forEach((heading, index) => {
                    // 为标题生成唯一ID
                    const id = heading.id || `heading-${index}`;
                    heading.id = id;
                    
                    // 获取标题级别
                    const level = parseInt(heading.tagName.charAt(1));
                    
                    // 根据级别添加缩进
                    const indent = (level - 1) * 10;
                    
                    // 添加到目录
                    tocHtml += `<li style="margin-left: ${indent}px;"><a href="#${id}">${heading.textContent.trim()}</a></li>`;
                });
                
                tocHtml += '</ul></div>';
            }

            // 将目录添加到HTML开头
            html = tocHtml + html;

            // 提取纯文本用于搜索和摘要
            const temp = document.createElement('div');
            temp.innerHTML = html;
            const text = (temp.textContent || temp.innerText || '').trim();

            // 搜索过滤（按标题或正文匹配）
            const q = (query || '').trim().toLowerCase();
            if (q) {
                const title = (p.title || '').toLowerCase();
                if (!(title.includes(q) || text.toLowerCase().includes(q))) continue;
            }

            // 构建摘要（最多 300 字符），若没有 md 使用 description
            const sourceText = text || (p.description || '');
            const excerptText = sourceText.length > 300 ? sourceText.slice(0, 300).trim() + '…' : sourceText;

            // 创建摘要HTML
            const excerptHtml = `<p>${excerptText}</p>`;

            // DOM
            const article = document.createElement('article');
            article.className = 'post';

            const titleEl = document.createElement('h3');
            titleEl.textContent = p.title || `文章 ${i + 1}`;
            article.appendChild(titleEl);

            if (p.date) {
                const meta = document.createElement('div');
                meta.className = 'post-meta';
                meta.textContent = p.date;
                article.appendChild(meta);
            }

            const contentWrap = document.createElement('div');
            contentWrap.className = 'post-content';
            
            // 创建摘要容器
            const excerptWrap = document.createElement('div');
            excerptWrap.className = 'post-excerpt';
            excerptWrap.innerHTML = excerptHtml;
            
            // 创建完整内容容器
            const fullContentWrap = document.createElement('div');
            fullContentWrap.className = 'post-full-content';
            fullContentWrap.innerHTML = html;
            fullContentWrap.style.display = 'none'; // 默认隐藏
            
            // 创建展开/折叠按钮
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'post-toggle-btn';
            toggleBtn.textContent = '更多内容';
            toggleBtn.onclick = function() {
                if (fullContentWrap.style.display === 'none') {
                    // 展开
                    excerptWrap.style.display = 'none';
                    fullContentWrap.style.display = 'block';
                    toggleBtn.textContent = '折叠';
                } else {
                    // 折叠
                    fullContentWrap.style.display = 'none';
                    excerptWrap.style.display = 'block';
                    toggleBtn.textContent = '更多内容';
                }
            };
            
            // 组装内容
            contentWrap.appendChild(excerptWrap);
            contentWrap.appendChild(fullContentWrap);
            contentWrap.appendChild(toggleBtn);
            
            article.appendChild(contentWrap);

            article.id = `post-${p.id || i}`; // 添加唯一ID
            listEl.appendChild(article);
        }

        // 生成左侧目录
        if (navEl) {
            try {
                let navHtml = '<ul>';
                for (let i = 0; i < posts.length; i++) {
                    const p = posts[i];
                    if (!p) continue;
                    
                    // 搜索过滤
                    const q = (query || '').trim().toLowerCase();
                    if (q) {
                        const title = (p.title || '').toLowerCase();
                        if (!title.includes(q)) continue;
                    }
                    
                    const postId = `post-${p.id || i}`;
                    navHtml += `<li><a href="#${postId}">${p.title || `文章 ${i + 1}`}</a></li>`;
                }
                navHtml += '</ul>';
                navEl.innerHTML = navHtml;
            } catch (e) {
                console.error('生成目录失败:', e);
                navEl.innerHTML = '目录加载失败';
            }
        }
    } catch (e) {
        console.error('加载博客文章失败:', e);
        listEl.innerHTML = '加载失败';
        if (navEl) {
            navEl.innerHTML = '目录加载失败';
        }
    }
};

document.addEventListener("DOMContentLoaded", function() {
    // 加载博客文章数据
    window.loadBlogs();
});