import axios from 'axios';

export default async function handler(req, res) {
  // 检查请求方法是否为 POST
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      // 请求外部 API
      const response = await axios.post('https://api3.siya.ai/siya/user/signIn', {
        username,
        password
      }, {
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
      });

      // 将外部 API 返回的结果返回给客户端
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: '请求失败', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
