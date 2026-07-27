require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();

app.use(express.json());

// サブディレクトリ（/s36）配下とルートの両方で静的ファイル・APIが動くように設定
const router = express.Router();

router.use(express.json());

// publicフォルダ
router.use(express.static(path.join(__dirname, 'public')));

// Viteでビルドしたファイルを公開
router.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// ==================== API ====================

router.post('/api/tasks', (req, res) => {
  const { title, status } = req.body;
  const newTask = { title, status };
  console.log(newTask);
  res.json(newTask);
});

router.get('/api/tasks', (req, res) => {
  res.json([
    {
      id: 1,
      title: 'レポートを提出する',
      status: 'todo'
    }
  ]);
});

router.get('/api/test', (req, res) => {
  res.json({
    message: 'APIが動いています',
    status: 'ok'
  });
});

router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'サーバーが動いています'
  });
});

router.get('/api/messages', async (req, res) => {
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

router.post('/api/messages', async (req, res) => {
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
router.use((req, res) => {
  res.sendFile(
    path.join(__dirname, '..', 'frontend', 'dist', 'index.html')
  );
});

// /s36 配下でも、ルート( / )でも両方対応できるようにルーターを割り当て
app.use('/s36', router);
app.use('/', router);

// ==================== Server ====================

const PORT = process.env.PORT || 3036;

app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});