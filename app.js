const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('トップページです');
});

app.get('/about', (req, res) => {
  res.send('自己紹介ページです');
});

app.get('/time', (req, res) => {
  const now = new Date().toLocaleString('ja-JP');
  res.send('現在時刻：' + now);
});

app.get('/api/test',(req,res) => {
  res.json({ message: 'APIが動いています', status: 'ok' });
});

const messages = [];

app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.post('/api/messages', (req, res) => {
  const { username, text } = req.body;
   const newMessage = { id: messages.length + 1, username, text };
  messages.push(newMessage);
  res.json(newMessage);
});

app.listen(3000, () => {
  console.log('サーバーが起動しました: http://localhost:3000');
});