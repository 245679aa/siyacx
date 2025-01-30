import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      const response = await axios.post('https://api3.siya.ai/siya/user/signIn', {
        username,
        password
      }, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Content-Type': 'application/json'
        }
      });

      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: '请求失败', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
