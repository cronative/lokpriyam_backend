const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Influencer = require('../models/Influencer');

// POST request to add or remove an influencer from favorites
router.post('/favorites/:influencerId', async (req, res) => {
    const { influencerId } = req.params;
    const { userId } = req.body;  // Assuming userId is passed in the body

    try {
        // Find the user and influencer
        const user = await User.findById(userId);
        const influencer = await Influencer.findById(influencerId);

        if (!user || user.isInfluencer) {
            return res.status(400).json({ status: 0, message: 'Only normal users can mark favorites.' });
        }

        if (!influencer) {
            return res.status(404).json({ status: 0, message: 'Influencer not found.' });
        }

        // Check if influencer is already in favorites
        const isFavorite = user.favorites.includes(influencerId);

        if (isFavorite) {
            return res.status(400).json({ status: 0, message: 'Influencer is already in your favorites.' });
        }

        // Add to favorites
        user.favorites.push(influencerId);
        await user.save();
        return res.status(200).json({ status: 1, message: 'Influencer added to favorites.' });
    } catch (error) {
        return res.status(500).json({ status: 0, message: 'Server error', error: error.message });
    }
});

// DELETE request to remove an influencer from favorites
router.delete('/favorites/:influencerId', async (req, res) => {
    const { influencerId } = req.params;
    const { userId } = req.body;  // Assuming userId is passed in the body

    try {
        // Find the user
        const user = await User.findById(userId);
        const influencer = await Influencer.findById(influencerId);

        if (!user || user.isInfluencer) {
            return res.status(400).json({ status: 0, message: 'Only normal users can remove favorites.' });
        }

        if (!influencer) {
            return res.status(404).json({ status: 0, message: 'Influencer not found.' });
        }

        // Check if influencer is in the favorites list
        const isFavorite = user.favorites.includes(influencerId);

        if (!isFavorite) {
            return res.status(400).json({ status: 0, message: 'Influencer is not in your favorites.' });
        }

        // Remove from favorites
        user.favorites = user.favorites.filter(id => id.toString() !== influencerId);
        await user.save();

        return res.status(200).json({ status: 1, message: 'Influencer removed from favorites.' });
    } catch (error) {
        return res.status(500).json({ status: 0, message: 'Server error', error: error.message });
    }
});

// GET request to retrieve a user's favorite influencers
router.get('/favorites/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the user
        const user = await User.findById(userId).populate({
            path: 'favorites',
            model: 'Influencer'
        });

        if (!user || user.isInfluencer) {
            return res.status(400).json({ status: 0, message: 'Only normal users have favorite lists.' });
        }

        // Respond with the list of favorite influencers
        return res.status(200).json({
            status: 1,
            data: user.favorites
        });
    } catch (error) {
        return res.status(500).json({ status: 0, message: 'Server error', error: error.message });
    }
});

module.exports = router;
