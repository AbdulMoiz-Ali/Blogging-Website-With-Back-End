import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./src/db/index.js";
import blogRoutes from "./src/routes/blog.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route for the root endpoint
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Routes
app.use("/api/blog", blogRoutes);

// Database Connection and Server Start
connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`⚙️  Server is running at port: ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error("MONGO DB connection failed !!!", err);
    });
