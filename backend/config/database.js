
const neo4j = require('neo4j-driver');
require('dotenv').config(); // Load environment variables
const NEO4J_URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
const NEO4J_USER = process.env.NEO4J_USER || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || 'your_password_here';

// Create Neo4j Driver Instance
const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));

const connectDB = async () => {
  try {
    const session = driver.session();
    await session.run('RETURN "Neo4j Connected"');
    console.log(' Connected to Neo4j Database');
    session.close();
  } catch (error) {
    console.error(' Neo4j Connection Failed:', error);
    process.exit(1);
  }
};



// config/db.js

const mongoose = require('mongoose');
const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental_service', {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Stop the app if unable to connect
  }
};



const redis = require('redis');

const createRedisClient = () => {
  const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
  });

  redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });

  redisClient.on('error', (err) => {
    console.error('Redis error:', err);
  });

  return redisClient;
};

module.exports = { driver, connectDB, connectMongo, createRedisClient };
