const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors'); // Adicione esta linha

const app = express();
const port = 3001;

app.use(cors()); // Adicione esta linha para habilitar o CORS
app.use(bodyParser.json());

const db = new sqlite3.Database('./books.db');

db.run(`CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  author TEXT,
  rating INTEGER
)`);

app.get('/books', (req, res) => {
  db.all('SELECT * FROM books', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/books', (req, res) => {
  const { title, author, rating } = req.body;
  if (!title || !author || !rating) {
    res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    return;
  }

  db.run('INSERT INTO books (title, author, rating) VALUES (?, ?, ?)', [title, author, rating], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Livro adicionado com sucesso.' });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
