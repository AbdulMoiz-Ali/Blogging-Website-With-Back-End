import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String, // URL of the profile image stored in Cloudinary
    },
    description: {
        type: String,
    },
}, { timestamps: true });

export default mongoose.model('User', userSchema);