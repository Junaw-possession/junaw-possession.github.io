// scripts.js

document.addEventListener("DOMContentLoaded", function() {
    // 加载头部模板
    fetch('partials/header.html')
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;
            }
        });

    // 加载页脚模板
    fetch('partials/footer.html')
        .then(response => response.text())
        .then(data => {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = data;
            }
        });

    // 监听搜索框输入
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        const query = searchInput.value.toLowerCase();
        filterBlogs(query);
    });
});

// 根据搜索查询过滤博客
/**
 * 根据查询词过滤博客文章列表
 * @param {string} query - 搜索查询词
 */
function filterBlogs(query) {
    // 获取博客列表中的所有文章元素
    const articles = document.querySelectorAll('#blog-list article');
    // 遍历每篇文章
    articles.forEach(article => {
        // 获取文章标题并转换为小写
        const title = article.querySelector('h3').textContent.toLowerCase();
        // 获取文章描述并转换为小写
        const description = article.querySelector('p').textContent.toLowerCase();

        // 判断标题或描述是否包含查询词
        if (title.includes(query) || description.includes(query)) {
            // 如果匹配，显示文章
            article.style.display = 'block';
        } else {
            // 如果不匹配，隐藏文章
            article.style.display = 'none';
        }
    });
}