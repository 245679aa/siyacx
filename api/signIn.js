import https from 'https';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    const postData = JSON.stringify({
      username,
      password
    });

    const options = {
      hostname: 'api3.siya.ai',
      port: 443,
      path: '/siya/user/signIn',
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Content-Type': 'application/json',
        'sec-ch-ua-platform': '"Windows"',
        'sec-ch-ua': '"Microsoft Edge";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'X-Exchange-Info': 'language=en&source=web&version=2.0.0&appname=siya&timeZone=Asia/Shanghai',
        'sec-ch-ua-mobile': '?0',
        'Origin': 'https://www.siya.ai',
        'Sec-Fetch-Site': 'same-site',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': 'https://www.siya.ai/',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6'
      }
    };

    const request = https.request(options, (response) => {
      let data = '';

      // A chunk of data has been received.
      response.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received.
      response.on('end', () => {
        const parsedData = JSON.parse(data);

        if (parsedData.success && parsedData.data.jwtToken) {
          // 登录成功，返回jwtToken
          res.status(200).json({
            success: true,
            jwtToken: parsedData.data.jwtToken,
            message: '登录成功'
          });
        } else {
          // 登录失败
          res.status(400).json({
            success: false,
            message: '登录失败，请检查用户名和密码'
          });
        }
      });
    });

    // Handle request errors
    request.on('error', (error) => {
      res.status(500).json({ error: '请求失败', details: error.message });
    });

    // Send the request body
    request.write(postData);
    request.end();
  } else {
    // 如果请求方法不是 POST，返回 405 Method Not Allowed
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
