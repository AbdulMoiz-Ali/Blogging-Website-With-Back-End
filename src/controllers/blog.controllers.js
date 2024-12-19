import mongoose from "mongoose";
import Blog from "../models/blog.models.js";  // Import the blog model
import cloudinary from "../middleware/cloudinary.js"

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

// Add new blog with image
const addBlog = async (req, res) => {
    const { title, description } = req.body;

    // Check if an image is uploaded
    if (!req.file) {
        return res.status(400).json({ error: "Blog should have an image" });
    }

    try {
        // Upload image to Cloudinary
        const imageUrl = await uploadImageToCloudinary(req.file.path);

        if (!imageUrl) {
            return res.status(500).json({ message: 'Error uploading image to Cloudinary' });
        }
        // Create new blog post
        const blog = await Blog.create({
            title,
            description,
            image: imageUrl,
        });

        // Respond with the created blog post
        res.status(200).json({
            success: true,
            message: "Blog added successfully",
            blog,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error adding blog" });
    }
};

// Get all blogs
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({});
        if (!blogs) {
            return res.status(404).json({ success: false, message: "No blogs found" });
        }
        res.json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching blogs" });
    }
};

// Get a single blog by ID
const getBlogWithId = async (req, res) => {
    const { id } = req.params;

    // Validate the provided ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Not a valid blog ID" });
    }

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: `No blog with ID: ${id}` });
        }
        res.status(200).json({ message: "Blog found", blog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching blog" });
    }
};

// Update a blog post
const updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    // Validate the blog ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Not a valid blog ID" });
    }

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: `No blog with ID: ${id}` });
        }

        // Update the blog fields
        blog.title = title || blog.title;
        blog.description = description || blog.description;

        // If a new image is uploaded, update the image URL
        if (req.file) {
            const imageUrl = await uploadImageToCloudinary(req.file.path);
            if (imageUrl) {
                blog.image = imageUrl;
            }
        }

        // Save the updated blog
        await blog.save();
        res.status(200).json({ message: "Blog updated successfully", blog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating blog" });
    }
};

// Delete a blog
const deleteBlog = async (req, res) => {
    const { id } = req.params;

    // Validate the blog ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Not a valid blog ID" });
    }

    try {
        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
            return res.status(404).json({ message: `No blog with ID: ${id}` });
        }
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting blog" });
    }
};

export { addBlog, getAllBlogs, getBlogWithId, updateBlog, deleteBlog };
