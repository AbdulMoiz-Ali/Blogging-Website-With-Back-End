import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import { createblog } from "./../controllers/blog.controllers.js";

const router = express.Router();

// Blog post creation route
router.post("/create", upload.single("image"), createblog);


export default router;
