import Blog from "../models/blog.models.js";
import User from "../models/user.models.js";
import cloudinary from "./../middleware/cloudinary.js";  // Cloudinary config
import fs from "fs";  // File system module

// Function to upload image to Cloudinary and return the URL
const uploadImageToCloudinary = async (localPath) => {
    try {
        // Upload the image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(localPath, {
            resource_type: "image", // Ensure we upload only images
        });

        // Uncomment to delete the local file after upload
        // fs.unlinkSync(localPath);

        return uploadResult.url;  // Return the URL of the uploaded image
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        // Uncomment to delete the local file on error
        // fs.unlinkSync(localPath);
        return null;
    }
};

// Create a new blog
const createBlog = async (req, res) => {
    const { title, description } = req.body;

    try {
        // Check if file is uploaded
        if (req.file) {
            // Upload image to Cloudinary
            const imageUrl = await uploadImageToCloudinary(req.file.path);

            if (!imageUrl) {
                return res.status(500).json({ message: 'Error uploading image to Cloudinary' });
            }

            // Create a new blog post with Cloudinary image URL
            const blog = new Blog({
                title,
                description,
                image: imageUrl,  // Use Cloudinary URL instead of local file path
                user: req.user._id,  // Assuming user is authenticated and user ID is in req.user
            });

            await blog.save();
            res.status(201).json(blog);  // Return the created blog
        } else {
            res.status(400).json({ message: 'No image uploaded' });  // No image uploaded
        }
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Error creating blog' });
    }
};

// Get all blogs with user information populated
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('user'); // Populate 'user' field
        res.json(blogs);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Error fetching blogs' });
    }
};

// Get blogs of the logged-in user
const getUserBlogs = async (req, res) => {
    const userId = req.user._id; // Get user ID from authenticated request

    try {
        const blogs = await Blog.find({ user: userId }) // Find blogs by user ID
            .populate('user'); // Populate user details along with the blog
        res.json(blogs);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Error fetching user blogs' });
    }
};

// Update a blog
const updateBlog = async (req, res) => {
    const { blogId } = req.params;
    const { title, description } = req.body;

    try {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Update blog properties
        blog.title = title || blog.title;
        blog.description = description || blog.description;

        // Update image if a new file is uploaded
        if (req.file) {
            const imageUrl = await uploadImageToCloudinary(req.file.path);
            if (imageUrl) {
                blog.image = imageUrl;
            }
        }

        await blog.save();
        res.json(blog);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Error updating blog' });
    }
};

// Delete a blog
const deleteBlog = async (req, res) => {
    const { blogId } = req.params;

    try {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        await blog.remove();
        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Error deleting blog' });
    }
};

export { createBlog, getAllBlogs, getUserBlogs, updateBlog, deleteBlog };
