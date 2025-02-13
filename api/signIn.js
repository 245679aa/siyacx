import https from 'https';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // 登录请求数据
    const postData = JSON.stringify({
      username,
      password
    });

    // 登录请求配置
    const loginOptions = {
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

    const loginRequest = https.request(loginOptions, (response) => {
      let data = '';

      // A chunk of data has been received.
      response.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received.
      response.on('end', () => {
        const parsedData = JSON.parse(data);

        if (parsedData.success && parsedData.data.jwtToken) {
          const jwtToken = parsedData.data.jwtToken;
          const username = parsedData.data.username;

          // 调试输出jwtToken和username
          console.log('登录成功！');
          console.log('jwtToken:', jwtToken);  // 输出jwtToken
          console.log('username:', username);  // 输出username

          // 获取用户主页数据
          const homepageData = JSON.stringify({
            optimization: 1,
            username: username
          });

          // 获取用户主页请求配置
          const homepageOptions = {
            hostname: 'api.siya.ai',
            port: 443,
            path: '/siya/user/homepage',
            method: 'POST',
            headers: {
              'User-Agent': 'okhttp/4.9.0',
              'Connection': 'close',
              'Accept-Encoding': 'gzip',
              'Authorization': jwtToken,  // 使用jwtToken
              'X-Exchange-Info': 'version=1.2.91&source=android&appname=siya&language=zh-TW&timeZone=Asia/Shanghai&platform=company',
              'Content-Type': 'application/json; charset=UTF-8'
            }
          };

          const homepageRequest = https.request(homepageOptions, (homepageResponse) => {
            let homepageDataReceived = '';

            homepageResponse.on('data', (chunk) => {
              homepageDataReceived += chunk;
            });

            homepageResponse.on('end', () => {
              const homepageResult = JSON.parse(homepageDataReceived);

              // 直接返回主页数据
              res.status(200).json({
                success: true,
                message: '获取用户主页数据成功',
                data: homepageResult
              });
            });
          });

          homepageRequest.on('error', (error) => {
            res.status(500).json({ error: '请求主页数据失败', details: error.message });
          });

          homepageRequest.write(homepageData);
          homepageRequest.end();
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
    loginRequest.on('error', (error) => {
      res.status(500).json({ error: '请求登录失败', details: error.message });
    });

    // Send the login request body
    loginRequest.write(postData);
    loginRequest.end();
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
