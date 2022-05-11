const express = require('express');
// Connects Client And Server
const cors = require('cors');
// Requiring Env
require('dotenv').config();
// Mongodb
const { MongoClient, ServerApiVersion } = require('mongodb');
// Server Port
const port = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors());
// Parse JSON
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5vfga.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// console.log(uri);

async function run() {
  try {
    await client.connect();
    console.log('Mongodb Connected');
    const serviceCollection = client
      .db('dental_clinics')
      .collection('services');

    // Get all
    app.get('/service', async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Dental Clients Server Running..');
});

app.listen(port, () => {
  console.log('Dental Clients Server Running..');
});
