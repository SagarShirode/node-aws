const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');

const app = express();
const port = 3030;

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// AWS SDK configuration
const s3 = new AWS.S3({
  accessKeyId: 'Your access Key ID',
  secretAccessKey: 'Your secret access key',
  region: 'S3 Bucket region',
});

// Endpoint to render the file upload form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Endpoint to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const params = {
    Bucket: 'Bucket name',
    Key: file.originalname,
    Body: file.buffer,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    // Optionally, you can delete the local file after uploading to S3
    // fs.unlinkSync(file.path);

    res.send(`File uploaded successfully. S3 URL: ${data.Location}`);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

