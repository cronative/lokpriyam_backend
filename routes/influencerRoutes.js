const express = require('express');
const router = express.Router();
const Influencer = require('../models/Influencer');
const User = require('../models/User');
const InfluencerProfile = require('../models/InfluencerProfile');

// Create an influencer profile
router.post('/create-profile', async (req, res) => {
    const { userId, username, bio, socialMediaLinks, categories, profilePicture, location, contactEmail, contactNumber, contentGenre } = req.body;
    try {
        // Ensure the user is an influencer
        const user = await User.findById(userId);
        if (!user || !user.isInfluencer) {
            return res.status(403).json({ message: 'Only influencers can create a profile' });
        }

        // Check if username is already taken
        const existingInfluencer = await Influencer.findOne({ username });
        if (existingInfluencer) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Create a new influencer profile
        const newInfluencerProfile = new Influencer({
            userId,
            username,
            bio,
            socialMediaLinks, // Updated to include Instagram profile details
            categories,
            profilePicture,
            location,
            contactEmail,
            contactNumber,
            contentGenre
        });

        await newInfluencerProfile.save();
        res.status(201).json({ message: 'Influencer profile created successfully', influencer: newInfluencerProfile });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// GET request to fetch influencer profile by userId
router.get('/profile/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the influencer profile by userId
        const influencerProfile = await Influencer.findOne({ userId }).populate('userId', 'username email');

        // If no influencer profile found
        if (!influencerProfile) {
            return res.status(404).json({ message: 'Influencer profile not found' });
        }

        // Return the influencer profile
        res.status(200).json(influencerProfile);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});



// GET request to list all influencers
router.get('/influencers', async (req, res) => {
    try {
        // Optional filters
        const { category, location, page = 1, limit = 10 } = req.query;
        const query = { isInfluencer: true };

        // Apply category filter if provided
        if (category) {
            query.categories = { $in: [category] };  // Assuming categories is an array in the schema
        }

        // Apply location filter if provided
        if (location) {
            query.location = location; // Assuming location is a field in the schema
        }

        // Pagination settings
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10)
        };

        // Find all influencers matching the filters
        const influencers = await User.find(query)
            .skip((options.page - 1) * options.limit)
            .limit(options.limit);

        //      // Fetch users who are influencers
        const users = await User.find(query)
            .skip((options.page - 1) * options.limit)
            .limit(options.limit);

        // Fetch influencer profiles and merge with user data
        const influencerProfiles = await Promise.all(users.map(async (user) => {
            const profile = await Influencer.findOne({ userId: user._id });
            return {
                ...user._doc, // Spread user data
                profile // Include the influencer profile if found
            };
        }));

        // Count total number of influencers (for pagination)
        const totalInfluencers = await User.countDocuments(query);

        // Success response with influencers and pagination info
        return res.status(200).json({
            status: 1,
            data: influencerProfiles,
            pagination: {
                total: totalInfluencers,
                page: options.page,
                limit: options.limit,
                totalPages: Math.ceil(totalInfluencers / options.limit)
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 0, message: 'Server error', error: error.message });
    }
});

module.exports = router;



module.exports = router;
