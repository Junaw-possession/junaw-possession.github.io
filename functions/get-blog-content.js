// functions/get-blog-content.js
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

    // 从查询参数中获取博客文件名
    const { filename } = event.queryStringParameters;
    if (!filename) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '缺少文件名参数' }),
      };
    }

    // 获取博客内容文件
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${repoOwner}/${repoName}/contents/data/blogs/${filename}?ref=${branch}`,
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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: content,
    };
  } catch (error) {
    console.error('获取博客内容失败:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '获取博客内容失败', message: error.message }),
    };
  }
};
