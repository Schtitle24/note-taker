const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// HTML routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes
app.get('/api/notes', (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf8');
    const notes = JSON.parse(data);
    res.json(notes);
    console.info(`${req.method} request received to get notes`);
  } catch (error) {
    console.error('Error reading notes:', error);
    res.status(500).json({ error: 'Error reading notes' });
  }
});

app.post('/api/notes', (req, res) => {
  try {
    const newNote = {
      id: uuidv4(),
      title: req.body.title,
      text: req.body.text,
    };

    const data = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf8');
    console.log(data)
    const notes = JSON.parse(data);

    console.log('New note:', newNote);
    console.log('Notes after push:', notes);

    notes.push(newNote);

    fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes));

    res.json(notes);
    console.info(`${req.method} request received to save a note`);
  } catch (error) {
    console.error('Error saving note:', error);
    res.status(500).json({ error: 'Error saving note' });
  }
});

app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});