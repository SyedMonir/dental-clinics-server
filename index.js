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
    const bookingCollection = client.db('dental_clinics').collection('booking');

    // Get all
    app.get('/service', async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    /**
     * API Naming Convention
     * app.get('/booking') // get all bookings in this collection. or get more than one or by filter
     * app.get('/booking/:id') // get a specific booking
     * app.post('/booking') // add a new booking
     * app.patch('/booking/:id) //
     * app.delete('/booking/:id) //
     */

    app.post('/booking', async (req, res) => {
      const booking = req.body;
      const query = {
        treatment: booking.treatment,
        date: booking.date,
        patient: booking.patient,
      };
      const result = await bookingCollection.insertOne(booking);
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
