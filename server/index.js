const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Nunflix server is running!');
});

app.get('/api/video/:id', (req, res) => {
  res.json({
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});