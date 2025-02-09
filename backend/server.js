
const express = require('express');
const { connectDB, driver, connectMongo, createRedisClient } = require('./config/database.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

(async () => {
    try {
        await connectDB();
        await connectMongo();
        const redisClient = createRedisClient(); // Create the Redis client instance
        await redisClient.connect();
        //console.log('Redis Connected');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error(' Failed to start server:', error);
        process.exit(1);
    }
})();

// Graceful shutdown handler
const gracefulShutdown = async () => {
    console.log('Shutting down server...');

    try {
        await driver.close();
        console.log(' Neo4j connection closed.');
    } catch (err) {
        console.error(' Error closing Neo4j:', err);
    }

    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
    } catch (err) {
        console.error(' Error closing MongoDB:', err);
    }

    try {
        await redisClient.quit();
        console.log(' Redis connection closed.');
    } catch (err) {
        console.error(' Error closing Redis:', err);
    }

    process.exit(0);
};

// Handle termination signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(' Internal Server Error:', err);
    res.status(500).json({ message: 'Something went wrong!' });
});


