const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const accidentRoutes = require('./routes/accidentRoutes');
//const vehicleRoutes = require('./routes/vehicleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const profileRoutes = require('./routes/profileRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoute');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/review', reviewRoutes);
app.use('/accident', accidentRoutes);
app.use('/accident', accidentRoutes);
app.use('/bookings', bookingRoutes);
app.use('/admin', adminRoutes);
app.use('/profile', profileRoutes);
app.listen(5000, () => console.log('Server running on port 5000'));




const connectDb = require('./config/database');


const customerRoutes = require('./routes/customerRoutes');


// Connect to MongoDB
connectDb();



// Middleware to parse JSON requests
app.use(express.json());

// Use routes
app.use('/cars', carRoutes);
app.use('/customers', customerRoutes);


// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});