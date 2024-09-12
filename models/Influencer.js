const mongoose = require('mongoose');

// Define the Influencer schema
const influencerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String,
        required: true
    },
    socialMediaLinks: {
        youtube: [{
            channelName: { type: String, required: true },
            link: { type: String, required: true },
            description: { type: String },
            contentTypes: [String] // Array of content types (e.g., "Vlogs", "Tutorials")
        }],
        instagram: [{
            profileName: { type: String, required: true }, // Instagram username
            link: { type: String, required: true },
            description: { type: String }, // Short description about the Instagram profile
            contentTypes: [String] // Content types (e.g., "Fashion", "Photography")
        }],
        tiktok: { type: String } // Single TikTok link (optional)
    },
    categories: [String], // List of categories/genres
    profilePicture: {
        type: String // URL for profile picture
    },
    location: {
        type: String
    },
    contactEmail: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String, // Contact number for business or direct communication
        required: true
    },
    contentGenre: {
        type: String, // Genre of content (e.g., "Travel", "Fashion", "Tech")
        required: true
    }
});

const Influencer = mongoose.model('Influencer', influencerSchema);
module.exports = Influencer;
