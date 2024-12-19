// import cloudinary from "./../middleware/cloudinary.js";
// import Blog from "../models/blog.models.js";
// import fs from "fs";

// const uploadImageToCloudinary = async (localPath) => {
//     try {
//         const uploadResult = await cloudinary.uploader.upload(localPath, {
//             resource_type: "image", // Upload only images
//         });
//         // Delete the local file after uploading
//         // fs.unlinkSync(localPath);
//         return uploadResult.url;
//     } catch (error) {
//         console.error("Cloudinary Upload Error:", error);
//         // fs.unlinkSync(localPath);
//         return null;
//     }
// };

// const createblog = async (req, res) => {
//     try {
//         const { title, content, author, tags, category } = req.body;

//         // Ensure that tags is an array, whether it's passed as a string or an array
//         const tagArray = Array.isArray(tags) ? tags : tags ? tags.split(",") : [];

//         // Extract uploaded image URL from Cloudinary
//         const image = req.file ? req.file.path : null;

//         // Create a new blog post
//         const newBlog = await Blog.create({
//             title,
//             content,
//             author,
//             tags: tagArray, // Use the tag array
//             category,
//             image, // Add image URL to the blog
//         });

//         res.status(201).json({
//             success: true,
//             message: "Blog post created successfully!",
//             blog: newBlog,
//         });
//     } catch (error) {
//         console.error("Error creating blog:", error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to create blog post",
//         });
//     }
// }


// export { createblog, uploadImageToCloudinary }



import Blog from "../models/blog.models.js"
import User from "../models/user.models.js"
const createBlog = async (req, res) => {
    const { title, description } = req.body;
    const { uid } = req.user;  // Extracted from JWT token in middleware

    try {
        const blog = new Blog({
            title,
            description,
            userId: uid,
            image: req.file?.path, // Image path from multer middleware
        });

        await blog.save();
        res.status(201).json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Error creating blog' });
    }
};

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('userId');
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching blogs' });
    }
};

const getUserBlogs = async (req, res) => {
    const { uid } = req.user;
    try {
        const blogs = await Blog.find({ userId: uid });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user blogs' });
    }
};

const updateBlog = async (req, res) => {
    const { blogId } = req.params;
    const { title, description } = req.body;

    try {
        const blog = await Blog.findById(blogId);
        if (blog.userId.toString() !== req.user.uid) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        blog.title = title || blog.title;
        blog.description = description || blog.description;
        if (req.file) {
            blog.image = req.file.path;
        }

        await blog.save();
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Error updating blog' });
    }
};

const deleteBlog = async (req, res) => {
    const { blogId } = req.params;

    try {
        const blog = await Blog.findById(blogId);
        if (blog.userId.toString() !== req.user.uid) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await blog.remove();
        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting blog' });
    }
};

module.exports = { createBlog, getAllBlogs, getUserBlogs, updateBlog, deleteBlog };