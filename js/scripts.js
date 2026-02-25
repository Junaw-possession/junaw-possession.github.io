// scripts.js

document.addEventListener("DOMContentLoaded", function() {
    // 监听搜索框输入
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        const query = searchInput.value.toLowerCase();
        filterBlogs(query);
    });
});

// 根据搜索查询过滤博客
function filterBlogs(query) {
    const articles = document.querySelectorAll('#blog-list article');
    articles.forEach(article => {
        const title = article.querySelector('h3').textContent.toLowerCase();
        const description = article.querySelector('p').textContent.toLowerCase();

        if (title.includes(query) || description.includes(query)) {
            article.style.display = 'block';
        } else {
            article.style.display = 'none';
        }
    });
}