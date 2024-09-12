const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const User = require('../models/User');

// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');  // Folder to store images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // Unique file name
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // Limit file size to 5MB
    fileFilter: function (req, file, cb) {
        // Only accept image files
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    }
}).single('profilePicture');  // 'profilePicture' is the key for the file upload

// POST request to upload profile image
router.post('/uploadProfileImage/:userId', (req, res) => {
    const { userId } = req.params;

    // Use Multer to handle file upload
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ status: 0, message: err.message });
        }

        // If no file is provided
        if (!req.file) {
            return res.status(400).json({ status: 0, message: 'No file uploaded.' });
        }

        try {
            // Find the user by userId
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ status: 0, message: 'User not found.' });
            }

            // Update the user's profile picture
            user.profilePicture = req.file.path;  // Save the file path in the user's profile
            await user.save();

            // Respond with success
            return res.status(200).json({ status: 1, message: 'Profile picture uploaded successfully.', path: req.file.path });
        } catch (error) {
            return res.status(500).json({ status: 0, message: 'Server error', error: error.message });
        }
    });
});

module.exports = router;
