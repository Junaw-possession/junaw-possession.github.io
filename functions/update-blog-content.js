// functions/update-blog-content.js
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
    const { filename, content, commitMessage } = JSON.parse(event.body);

    if (!filename || !content) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '缺少必要的参数' }),
      };
    }

    // 首先尝试获取当前文件的 SHA 值（文件可能不存在）
    const getFileOptions = {
      hostname: 'api.github.com',
      path: `/repos/${repoOwner}/${repoName}/contents/data/blogs/${filename}?ref=${branch}`,
      method: 'GET',
      headers: {
        'Authorization': `token ${githubToken}`,
        'User-Agent': 'Netlify-Function',
      },
    };

    let sha = null;
    try {
      const currentFile = await new Promise((resolve, reject) => {
        const req = https.request(getFileOptions, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            if (res.statusCode === 200) {
              resolve(JSON.parse(data));
            } else if (res.statusCode === 404) {
              resolve(null); // 文件不存在
            } else {
              reject(new Error(`获取文件失败: ${res.statusCode}`));
            }
          });
        });
        req.on('error', reject);
        req.end();
      });

      if (currentFile) {
        sha = currentFile.sha;
      }
    } catch (error) {
      console.error('获取文件信息失败:', error);
    }

    // 准备更新/创建文件
    const contentBase64 = Buffer.from(content).toString('base64');
    const updateOptions = {
      hostname: 'api.github.com',
      path: `/repos/${repoOwner}/${repoName}/contents/data/blogs/${filename}`,
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubToken}`,
        'User-Agent': 'Netlify-Function',
        'Content-Type': 'application/json',
      },
    };

    const updateData = {
      message: commitMessage || `Update blog: ${filename}`,
      content: contentBase64,
      branch: branch,
    };

    // 如果文件存在，添加 SHA
    if (sha) {
      updateData.sha = sha;
    }

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
        message: '博客内容更新成功',
        data: updateResponse 
      }),
    };
  } catch (error) {
    console.error('更新博客内容失败:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: '更新博客内容失败', 
        message: error.message 
      }),
    };
  }
};
