// functions/update-blogs.js
const https = require('https');

exports.handler = async (event) => {
  // 只允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: '方法不允许' }),
    };
  }

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

    // 解析请求体
    const { blogPosts, commitMessage } = JSON.parse(event.body);

    if (!blogPosts || !Array.isArray(blogPosts)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '无效的博客数据' }),
      };
    }

    // 首先获取当前文件的 SHA 值
    const getFileOptions = {
      hostname: 'api.github.com',
      path: `/repos/${repoOwner}/${repoName}/contents/data/blog-posts.json?ref=${branch}`,
      method: 'GET',
      headers: {
        'Authorization': `token ${githubToken}`,
        'User-Agent': 'Netlify-Function',
      },
    };

    const currentFile = await new Promise((resolve, reject) => {
      const req = https.request(getFileOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`获取文件失败: ${res.statusCode}`));
          }
        });
      });
      req.on('error', reject);
      req.end();
    });

    // 准备更新文件
    const content = Buffer.from(JSON.stringify(blogPosts, null, 2)).toString('base64');
    const updateOptions = {
      hostname: 'api.github.com',
      path: `/repos/${repoOwner}/${repoName}/contents/data/blog-posts.json`,
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubToken}`,
        'User-Agent': 'Netlify-Function',
        'Content-Type': 'application/json',
      },
    };

    const updateData = {
      message: commitMessage || 'Update blog posts',
      content: content,
      sha: currentFile.sha,
      branch: branch,
    };

    const updateResponse = await new Promise((resolve, reject) => {
      const req = https.request(updateOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200 || res.statusCode === 201) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`更新文件失败: ${res.statusCode}`));
          }
        });
      });
      req.on('error', reject);
      req.write(JSON.stringify(updateData));
      req.end();
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: '博客列表更新成功',
        data: updateResponse
      }),
    };
  } catch (error) {
    console.error('更新博客列表失败:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: '更新博客列表失败',
        message: error.message
      }),
    };
  }
};
