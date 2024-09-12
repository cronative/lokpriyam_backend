const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isInfluencer: {
        type: Boolean,
        default: false,
        required: true
    },
    influencerProfile: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the influencer profile
        ref: 'Influencer' // This refers to the InfluencerProfile model
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId, // Array of influencer IDs
        ref: 'Influencer'
    }]
});

// Export the user model
const User = mongoose.model('User', userSchema);
module.exports = User;
