const express = require('express');
// Connects Client And Server
const cors = require('cors');
// Requiring Env
require('dotenv').config();
// Server Port
const port = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors());
// Parse JSON
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Dental Clients Server Running..');
});

app.listen(port, () => {
  console.log('Dental Clients Server Running..');
});
