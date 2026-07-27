require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();

app.use(express.json());

// publicフォルダ
app.use(express.static(path.join(__dirname, 'public')));

// Viteでビルドしたファイルを公開
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// ==================== API ====================

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

app.get('/api/test', (req, res) => {
  res.json({
    message: 'APIが動いています',
    status: 'ok'
  });
});

app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'サーバーが動いています'
  });
});

app.get('/api/messages', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM messages ORDER BY created_at ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'データ取得エラー' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { username, text } = req.body;

    const result = await pool.query(
      'INSERT INTO messages (username, text) VALUES ($1, $2) RETURNING *',
      [username, text]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'データ登録エラー' });
  }
});

// ==================== React(Vite) ====================

// API以外のアクセスはすべてReactへ渡す
app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, '..', 'frontend', 'dist', 'index.html')
  );
});

// ==================== Server ====================

const PORT = process.env.PORT || 3036;

app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});