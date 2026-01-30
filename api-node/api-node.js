

const express = require('express');
const app = express();

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(3000, () => {
    console.log('API runningon port 3000');
});