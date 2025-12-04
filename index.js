const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Files will be saved in 'uploads' folder
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let lastJson = null;
let lastFiles = [];

app.post('/upload', upload.array('attachments'), (req, res) => {
  // JSON should be sent as a field named 'orderJson'
  lastJson = JSON.parse(req.body.orderJson);
  lastFiles = req.files;
  res.json({ message: 'JSON and files received', files: lastFiles });
});

app.get('/download', (req, res) => {
  if (lastJson) {
    res.json(lastJson);
  } else {
    res.status(404).json({ error: 'No JSON uploaded yet.' });
  }
});

// Optionally, add a route to download files
app.get('/file/:filename', (req, res) => {
  res.sendFile(__dirname + '/uploads/' + req.params.filename);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});