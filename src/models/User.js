import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    portfolio: {
        type: [{ name: String, link: String, description: String }], // Array of objects with name and link
    },
    skills: [{ type: [String] }],
    profilePicture: { type: String }, // URL to profile picture
    socialMedia: {
        type: [{ platform: String, username: String, link: String }], // Array of objects (social media accounts) with platform, username, and link
    },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);