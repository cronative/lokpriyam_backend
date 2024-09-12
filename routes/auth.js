const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Load environment variables
require('dotenv').config();

function handleValidationError(error) {
    const errors = {};

    // Loop through each error in the Mongoose ValidationError object
    for (let field in error.errors) {
        if (error.errors[field].path === 'name') {
            errors.name = 'Name is required';
        }
        if (error.errors[field].path === 'isInfluencer') {
            errors.isInfluencer = 'User type (influencer or normal) is required';
        }
        if (error.errors[field].path === 'email') {
            errors.email = 'Valid email is required';
        }
        if (error.errors[field].path === 'phone') {
            errors.phone = 'Phone number is required';
        }
        if (error.errors[field].path === 'password') {
            errors.password = 'Password is required';
        }
    }

    return errors;
}

// Signup route
router.post('/signup', async (req, res) => {
    const { name, email, phone, password, isInfluencer } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            isInfluencer
        });

        await newUser.save();

        // Create a JWT token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, user: newUser });
    } catch (error) {
        const errors = handleValidationError(error);
        return res.status(400).json({ status: 0, message: 'Validation error', errors });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
