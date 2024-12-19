import express from "express";
import { createBlog, deleteBlog, getAllBlogs, getUserBlogs, updateBlog } from "../controllers/blog.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import authenticate from "../middleware/authenticate.middleware.js";
// import { createblog } from "./../controllers/blog.controllers.js";

const router = express.Router();

// Blog post creation route
// router.post("/create", upload.single("image"), createblog);
// Blog Routes
router.get('/blog', getAllBlogs);  // All blogs
router.get('/user-blogs', authenticate, getUserBlogs);  // User's own blogs
router.post('/createblog', upload.single('image'), createBlog);  // Create a blog
router.put('/update-blog/:blogId', authenticate, upload.single('image'), updateBlog);  // Update blog
router.delete('/delete-blog/:blogId', authenticate, deleteBlog);  // Delete blog



export default router;