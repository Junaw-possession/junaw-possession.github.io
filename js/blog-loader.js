/**
 * blog-loader.js
 * 博客加载器脚本
 * 负责加载、解析和显示博客文章
 */

/**
 * 加载博客文章
 * @param {string} query - 搜索查询词（可选）
 * @returns {Promise<void>}
 */
window.loadBlogs = async function (query = '') {
    /**
     * 获取博客列表容器和导航容器元素
     */
    const listEl = document.getElementById('blog-list');
    const navEl = document.getElementById('blog-nav');
    
    /**
     * 检查博客列表容器是否存在
     * 如果不存在，直接返回
     */
    if (!listEl) return;
    
    /**
     * 设置加载状态
     * 在加载过程中显示"正在加载..."提示
     */
    listEl.innerHTML = '正在加载...';
    if (navEl) {
        navEl.innerHTML = '加载中...';
    }

    try {
        /**
         * 加载博客文章配置文件
         * 使用fetch API获取data/blog-posts.json文件
         * 设置cache: 'no-store'确保每次都获取最新内容
         */
        const res = await fetch('data/blog-posts.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('无法加载 blog-posts.json');
        const posts = await res.json();

        /**
         * 验证博客文章数据格式
         * 确保posts是一个数组
         */
        if (!Array.isArray(posts)) throw new Error('blog-posts.json 格式错误（应为数组）');

        /**
         * 清空博客列表容器
         * 准备添加新的博客文章
         */
        listEl.innerHTML = '';
        
        /**
         * 遍历博客文章
         * 处理每篇文章的数据和内容
         */
        for (let i = 0; i < posts.length; i++) {
            const p = posts[i];

            /**
             * 解析博客文章文件路径
             * 支持多种路径配置方式
             * 如果只是文件名，则定位到 data/blogs/ 目录下
             */
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

            /**
             * 加载 Markdown 内容
             * 使用fetch API获取Markdown文件内容
             */
            let md = '';
            try {
                const mdRes = await fetch(filePath, { cache: 'no-store' });
                if (mdRes.ok) md = await mdRes.text();
            } catch (e) {
                md = '';
            }

            /**
             * 将 Markdown 转换为 HTML
             * 兼容不同版本的marked库
             * 如果没有加载marked库，则简单替换换行符为<br>
             */
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

            /**
             * 生成文章目录
             * 提取文章中的标题，生成带有缩进的目录结构
             * 只有当文章包含多个标题时才生成目录
             */
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

            /**
             * 将目录添加到HTML开头
             */
            html = tocHtml + html;

            /**
             * 提取纯文本用于搜索和摘要
             * 创建临时div元素，设置innerHTML为html，然后获取textContent
             */
            const temp = document.createElement('div');
            temp.innerHTML = html;
            const text = (temp.textContent || temp.innerText || '').trim();

            /**
             * 搜索过滤
             * 按标题或正文匹配搜索查询词
             * 如果不匹配，跳过当前文章
             */
            const q = (query || '').trim().toLowerCase();
            if (q) {
                const title = (p.title || '').toLowerCase();
                if (!(title.includes(q) || text.toLowerCase().includes(q))) continue;
            }

            /**
             * 构建摘要
             * 最多显示300个字符，超过则添加省略号
             * 如果没有文本内容，则使用文章描述
             */
            const sourceText = text || (p.description || '');
            const excerptText = sourceText.length > 300 ? sourceText.slice(0, 300).trim() + '…' : sourceText;

            /**
             * 创建摘要HTML
             */
            const excerptHtml = `<p>${excerptText}</p>`;

            /**
             * 创建文章DOM元素
             * 构建完整的文章结构，包括标题、日期、摘要、完整内容和展开/折叠按钮
             */
            const article = document.createElement('article');
            article.className = 'post';

            /**
             * 创建文章标题元素
             */
            const titleEl = document.createElement('h3');
            titleEl.textContent = p.title || `文章 ${i + 1}`;
            article.appendChild(titleEl);

            /**
             * 添加文章日期（如果有）
             */
            if (p.date) {
                const meta = document.createElement('div');
                meta.className = 'post-meta';
                meta.textContent = p.date;
                article.appendChild(meta);
            }

            /**
             * 创建内容容器
             */
            const contentWrap = document.createElement('div');
            contentWrap.className = 'post-content';
            
            /**
             * 创建摘要容器
             */
            const excerptWrap = document.createElement('div');
            excerptWrap.className = 'post-excerpt';
            excerptWrap.innerHTML = excerptHtml;
            
            /**
             * 创建完整内容容器
             * 默认隐藏，点击展开按钮后显示
             */
            const fullContentWrap = document.createElement('div');
            fullContentWrap.className = 'post-full-content';
            fullContentWrap.innerHTML = html;
            fullContentWrap.style.display = 'none'; // 默认隐藏
            
            /**
             * 创建展开/折叠按钮
             * 点击按钮可以切换摘要和完整内容的显示状态
             */
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
            
            /**
             * 组装内容
             * 将摘要容器、完整内容容器和展开/折叠按钮添加到内容容器中
             */
            contentWrap.appendChild(excerptWrap);
            contentWrap.appendChild(fullContentWrap);
            contentWrap.appendChild(toggleBtn);
            
            /**
             * 将内容容器添加到文章元素中
             */
            article.appendChild(contentWrap);

            /**
             * 添加唯一ID
             * 用于左侧目录的锚点链接
             */
            article.id = `post-${p.id || i}`;
            
            /**
             * 将文章元素添加到博客列表容器中
             */
            listEl.appendChild(article);
        }

        /**
         * 生成左侧目录
         * 为每篇文章创建一个链接，点击可以跳转到对应文章
         */
        if (navEl) {
            try {
                let navHtml = '<ul>';
                for (let i = 0; i < posts.length; i++) {
                    const p = posts[i];
                    if (!p) continue;
                    
                    /**
                     * 搜索过滤
                     * 按标题匹配搜索查询词
                     * 如果不匹配，跳过当前文章
                     */
                    const q = (query || '').trim().toLowerCase();
                    if (q) {
                        const title = (p.title || '').toLowerCase();
                        if (!title.includes(q)) continue;
                    }
                    
                    /**
                     * 创建目录项
                     * 为每篇文章创建一个链接，链接到对应文章的ID
                     */
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
        /**
         * 处理错误
         * 显示错误信息并在控制台输出错误详情
         */
        console.error('加载博客文章失败:', e);
        listEl.innerHTML = '加载失败';
        if (navEl) {
            navEl.innerHTML = '目录加载失败';
        }
    }
};

/**
 * 页面DOM加载完成后执行
 * 调用loadBlogs函数加载博客文章数据
 */
document.addEventListener("DOMContentLoaded", function() {
    // 加载博客文章数据
    window.loadBlogs();
});