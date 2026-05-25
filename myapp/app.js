require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

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

app.post('/api/tasks', (req, res) => {
  const { title, status } = req.body;

  const newTask = { title, status };

  console.log(newTask);

  res.json(newTask);
});

app.get('/api/tasks', (req, res) => {
  res.json([
    {
      id: 1,
      title: 'レポートを提出する',
      status: 'todo'
    }
  ]);
});

app.get('/api/test',(req,res) => {
  res.json({ message: 'APIが動いています', status: 'ok' });
});

app.get('/status', (req, res) => {
  res.json({ status: 'ok', messages: 'サーバーが動いています' });
});

const messages = [];

app.get('/api/messages', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM messages ORDER BY created_at ASC'
  );
  res.json(result.rows);
});


app.post('/api/messages', async (req, res) => {
  const { username, text } = req.body;
  const result = await pool.query(
    'INSERT INTO messages (username, text) VALUES ($1, $2) RETURNING *',
    [username, text]
  );
  res.json(result.rows[0]);
}); 

app.listen(3000, () => {
  console.log('サーバーが起動しました: http://localhost:3000');
});