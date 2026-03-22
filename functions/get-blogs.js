// functions/get-blogs.js
const https = require('https');

exports.handler = async (event) => {
  try {
    // 从环境变量中获取 GitHub 配置
    const githubToken = process.env.GITHUB_TOKEN;
    const repoOwner = process.env.REPO_OWNER;
    const repoName = process.env.REPO_NAME;
    const branch = process.env.GITHUB_BRANCH || 'main';

    if (!githubToken || !repoOwner || !repoName) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: '缺少必要的 GitHub 配置' }),
      };
    }

    // 获取 blog-posts.json 文件
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${repoOwner}/${repoName}/contents/data/blog-posts.json?ref=${branch}`,
      method: 'GET',
      headers: {
        'Authorization': `token ${githubToken}`,
        'User-Agent': 'Netlify-Function',
      },
    };

    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`GitHub API 请求失败: ${res.statusCode}`));
          }
        });
      });
      req.on('error', reject);
      req.end();
    });

    // 解码 base64 内容
    const content = Buffer.from(response.content, 'base64').toString('utf-8');
    const blogPosts = JSON.parse(content);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogPosts),
    };
  } catch (error) {
    console.error('获取博客列表失败:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '获取博客列表失败', message: error.message }),
    };
  }
};
