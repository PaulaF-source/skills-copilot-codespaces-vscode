// Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(bodyParser.json());

// Read comments.json
const comments = require('./comments.json');

// GET /comments
app.get('/comments', (req, res) => {
  res.json(comments);
});

// POST /comments
app.post('/comments', (req, res) => {
  comments.push(req.body);
  fs.writeFile('./comments.json', JSON.stringify(comments), (err) => {
    if (err) {
      res.status(500).send('Could not write to file');
    } else {
      res.json(req.body);
    }
  });
});

// PUT /comments/:id
app.put('/comments/:id', (req, res) => {
  const comment = comments.find(comment => comment.id == req.params.id);
  if (comment) {
    Object.assign(comment, req.body);
    fs.writeFile('./comments.json', JSON.stringify(comments), (err) => {
      if (err) {
        res.status(500).send('Could not write to file');
      } else {
        res.json(comment);
      }
    });
  } else {
    res.status(404).send('Comment not found');
  }
});

// DELETE /comments/:id
app.delete('/comments/:id', (req, res) => {
  const commentIndex = comments.findIndex(comment => comment.id == req.params.id);
  if (commentIndex !== -1) {
    comments.splice(commentIndex, 1);
    fs.writeFile('./comments.json', JSON.stringify(comments), (err) => {
      if (err) {
        res.status(500).send('Could not write to file');
      } else {
        res.status(204).send();
      }
    });
  } else {
    res.status(404).send('Comment not found');
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});