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
          const jwtToken = parsedData.data.jwtToken;
          const username = parsedData.data.username;

          // 调试输出jwtToken和username
          console.log('登录成功！');
          console.log('jwtToken:', jwtToken);  // 输出jwtToken
          console.log('username:', username);  // 输出username

        
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
