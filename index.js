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

    // Warning: This is not the proper way to query multiple collection.
    // After learning more about mongodb. use aggregate, lookup, pipeline, match, group
    app.get('/available', async (req, res) => {
      const date = req.query.date;

      // step 1: Get all services
      const services = await serviceCollection.find().toArray();

      // stet 2: Get the booking of that day, output: [{}, {}, {}, {}, {}, {}]
      const query = { date: date };
      const bookings = await bookingCollection.find(query).toArray();

      // step 3: for each service (Protita service er jonno booking ta kujbo)
      services.forEach((service) => {
        // step 4: find bookings for that service. output: [{}, {}, {}, {}]
        const serviceBookings = bookings.filter(
          (books) => books.treatment === service.name
        );
        // step 5: select slots for the service Bookings: ['', '', '', '']
        const bookedSlots = serviceBookings.map((book) => book.slot);
        // step 6: select those slots that are not in bookedSlots
        const available = service.slots.filter(
          (slot) => !bookedSlots.includes(slot)
        );
        //step 7: set available to slots to make it easier
        service.slots = available;
      });

      res.send(services);
    });

    /**
     * API Naming Convention
     * app.get('/booking') // get all bookings in this collection. or get more than one or by filter
     * app.get('/booking/:id') // get a specific booking
     * app.post('/booking') // add a new booking
     * app.patch('/booking/:id) //
     * app.delete('/booking/:id) //
     */

    app.get('/booking', async (req, res) => {
      const patient = req.query.patient;
      const query = { patient: patient };
      const bookings = await bookingCollection.find(query).toArray();
      res.send(bookings);
    });

    app.post('/booking', async (req, res) => {
      const booking = req.body;
      const query = {
        treatment: booking.treatment,
        date: booking.date,
        patient: booking.patient,
      };
      const exists = await bookingCollection.findOne(query);
      if (exists) {
        return res.send({ success: false, booking: exists });
      }
      const result = await bookingCollection.insertOne(booking);
      return res.send({ success: true, result });
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
