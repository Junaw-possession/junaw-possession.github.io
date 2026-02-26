/**
 * scripts.js
 * 网站核心脚本文件
 * 包含页面初始化、模板加载和搜索功能
 */

/**
 * 页面DOM加载完成后执行的初始化函数
 * 加载头部和页脚模板，并设置搜索功能
 */
document.addEventListener("DOMContentLoaded", function() {
    /**
     * 加载头部模板
     * 从partials/header.html获取头部内容并插入到页面中
     */
    fetch('partials/header.html')
        .then(response => response.text())
        .then(data => {
            // 获取头部占位符元素
            const headerPlaceholder = document.getElementById('header-placeholder');
            // 如果占位符存在，插入头部内容
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;
            }
        });

    /**
     * 加载页脚模板
     * 从partials/footer.html获取页脚内容并插入到页面中
     */
    fetch('partials/footer.html')
        .then(response => response.text())
        .then(data => {
            // 获取页脚占位符元素
            const footerPlaceholder = document.getElementById('footer-placeholder');
            // 如果占位符存在，插入页脚内容
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = data;
            }
        });

    /**
     * 监听搜索框输入事件
     * 当用户在搜索框中输入内容时，触发过滤功能
     */
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        // 获取搜索输入值并转换为小写
        const query = searchInput.value.toLowerCase();
        // 调用过滤函数，根据查询词过滤博客
        filterBlogs(query);
    });
});

/**
 * 根据搜索查询过滤博客文章
 * @param {string} query - 搜索查询词
 */
function filterBlogs(query) {
    /**
     * 获取博客列表中的所有文章元素
     * 使用querySelectorAll选择所有id为blog-list下的article元素
     */
    const articles = document.querySelectorAll('#blog-list article');
    
    /**
     * 遍历每篇文章
     * 检查文章标题和描述是否包含查询词
     */
    articles.forEach(article => {
        /**
         * 获取文章标题并转换为小写
         * 用于不区分大小写的搜索匹配
         */
        const title = article.querySelector('h3').textContent.toLowerCase();
        
        /**
         * 获取文章描述并转换为小写
         * 用于不区分大小写的搜索匹配
         */
        const description = article.querySelector('p').textContent.toLowerCase();

        /**
         * 判断标题或描述是否包含查询词
         * 如果包含，显示文章；否则，隐藏文章
         */
        if (title.includes(query) || description.includes(query)) {
            // 如果匹配，显示文章
            article.style.display = 'block';
        } else {
            // 如果不匹配，隐藏文章
            article.style.display = 'none';
        }
    });
}