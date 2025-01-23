require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.static('.'));

app.get('/api-key', (_req, res) => {
    res.json({ apiKey: process.env.API_KEY });
});

app.get('/', (_req, res) => {
    res.sendFile('index.html');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
