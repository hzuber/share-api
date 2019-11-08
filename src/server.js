require('dotenv').config();
const { PORT } = process.env.PORT || 8000;
const express = require('express');
const app = express();

app.get('/api/*', (req, res) => {
    res.json({ ok: true })
})

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost: ${PORT}`)
})

module.exports = {app}