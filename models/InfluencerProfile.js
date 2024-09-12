const mongoose = require('mongoose');

// Influencer profile schema
const influencerProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bio: {
        type: String
    },
    socialMediaLinks: {
        youtube: [{
            channelName: { type: String },
            link: { type: String },
            description: { type: String },
            contentTypes: [String]
        }],
        instagram: [{
            profileName: { type: String },
            link: { type: String },
            description: { type: String },
            contentTypes: [String]
        }]
    },
    categories: [String],  // Categories or genres
    profilePicture: {
        type: String
    },
    location: {
        type: String
    },
    contactEmail: {
        type: String
    },
    contactNumber: {
        type: String
    },
    contentGenre: {
        type: String
    }
});

const InfluencerProfile = mongoose.model('InfluencerProfile', influencerProfileSchema);
module.exports = InfluencerProfile;
