import cloudinary from "./../middleware/cloudinary.js";
import Blog from "../models/blog.models.js";
import fs from "fs";

const uploadImageToCloudinary = async (localPath) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(localPath, {
            resource_type: "image", // Upload only images
        });
        // Delete the local file after uploading
        // fs.unlinkSync(localPath);
        return uploadResult.url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        // fs.unlinkSync(localPath);
        return null;
    }
};

const createblog = async (req, res) => {
    try {
        const { title, content, author, tags, category } = req.body;

        // Ensure that tags is an array, whether it's passed as a string or an array
        const tagArray = Array.isArray(tags) ? tags : tags ? tags.split(",") : [];

        // Extract uploaded image URL from Cloudinary
        const image = req.file ? req.file.path : null;

        // Create a new blog post
        const newBlog = await Blog.create({
            title,
            content,
            author,
            tags: tagArray, // Use the tag array
            category,
            image, // Add image URL to the blog
        });

        res.status(201).json({
            success: true,
            message: "Blog post created successfully!",
            blog: newBlog,
        });
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create blog post",
        });
    }
}


export { createblog, uploadImageToCloudinary }