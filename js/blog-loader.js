// blog-loader.js

window.loadBlogs = async function (query = '') {
    const listEl = document.getElementById('blog-list');
    if (!listEl) return;
    listEl.innerHTML = '正在加载...';

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
            contentWrap.innerHTML = html;
            article.appendChild(contentWrap);

            listEl.appendChild(article);
        }
    } catch (e) {
        console.error('加载博客文章失败:', e);
        listEl.innerHTML = '加载失败';
    }
};

document.addEventListener("DOMContentLoaded", function() {
    // 加载博客文章数据
    window.loadBlogs();
});