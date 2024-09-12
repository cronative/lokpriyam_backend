const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Load environment variables
require('dotenv').config();

function handleValidationError(error) {
    var message = '';

    // Loop through each error in the Mongoose ValidationError object
    for (let field in error.errors) {
        if (error.errors[field].path === 'name') {
            message = 'Name is required';
        } else
        if (error.errors[field].path === 'isInfluencer') {
            message = 'User type (influencer or normal) is required';
        } else
        if (error.errors[field].path === 'email') {
            message = 'Valid email is required';
        } else
        if (error.errors[field].path === 'phone') {
            message = 'Phone number is required';
        } else
        if (error.errors[field].path === 'password') {
            message = 'Password is required';
        }
    }

    return message;
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

        var json = {
            status :1,
            token:token,
            user: newUser
        }
        res.status(200).json(json);
    } catch (error) {
        const errors = handleValidationError(error);
        var json = {
            status :0,
            message :''
        }
        return res.status(400).json(json);
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
        var json = {
            status :1,
            token:token,
            user: newUser
        }
        res.status(200).json(json);
    } catch (error) {
        
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
