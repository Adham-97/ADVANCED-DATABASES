const Customer = require('../models/customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../database/redisClient'); // Redis Client

// Register a new customer
exports.registerCustomer = async (req, res) => {
  try {
    const { customer_id, name, email, password, ...otherDetails } = req.body;

    // Check if email or customer_id already exists
    const existingCustomer = await Customer.findOne({ $or: [{ email }, { customer_id }] });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new customer
    const newCustomer = new Customer({
      customer_id,
      name,
      contact_details: { email },
      password: hashedPassword,
      ...otherDetails,
    });

    await newCustomer.save();

    // Invalidate Redis cache for customers
    redisClient.del('customers:all');

    res.status(201).json({ message: 'Customer registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login customer
exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ "contact_details.email": email });

    if (!customer || !(await bcrypt.compare(password, customer.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: customer.customer_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get customer profile with Redis caching
exports.getProfile = async (req, res) => {
  const { customer_id } = req.params;

  try {
    redisClient.get(`customer:${customer_id}`, async (err, cachedData) => {
      if (err) {
        console.error('Redis Error:', err);
        return res.status(500).json({ message: 'Redis error' });
      }

      if (cachedData) {
        console.log('Serving from Redis cache');
        return res.status(200).json(JSON.parse(cachedData));
      }

      const customer = await Customer.findOne({ customer_id });

      if (!customer) return res.status(404).json({ message: 'Profile not found' });

      redisClient.setex(`customer:${customer_id}`, 3600, JSON.stringify(customer)); // Cache for 1 hour

      res.json(customer);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all customers with Redis caching
exports.getAllCustomers = async (req, res) => {
  try {
    redisClient.get('customers:all', async (err, cachedData) => {
      if (err) {
        console.error('Redis Error:', err);
        return res.status(500).json({ message: 'Redis error' });
      }

      if (cachedData) {
        console.log('Serving from Redis cache');
        return res.status(200).json(JSON.parse(cachedData));
      }

      const customers = await Customer.find();

      if (customers.length > 0) {
        redisClient.setex('customers:all', 3600, JSON.stringify(customers)); // Cache for 1 hour
      }

      res.json(customers);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update customer profile and invalidate cache
exports.updateCustomer = async (req, res) => {
  const { customer_id } = req.params;
  const updateData = req.body;

  try {
    const updatedCustomer = await Customer.findOneAndUpdate({ customer_id }, updateData, { new: true });

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Invalidate Redis cache
    redisClient.del('customers:all');
    redisClient.del(`customer:${customer_id}`);

    res.json(updatedCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete customer and invalidate cache
exports.deleteCustomer = async (req, res) => {
  const { customer_id } = req.params;

  try {
    const deletedCustomer = await Customer.findOneAndDelete({ customer_id });

    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Invalidate Redis cache
    redisClient.del('customers:all');
    redisClient.del(`customer:${customer_id}`);

    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
