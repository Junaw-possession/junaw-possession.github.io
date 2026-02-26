// functions/verify-password.js
exports.handler = async (event) => {
  try {
    const { password } = JSON.parse(event.body);
    const correctPassword = process.env.CORRECT_PASSWORD;
    
    if (password === correctPassword) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: '服务器错误' }),
    };
  }
};
