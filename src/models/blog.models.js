import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BlogSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
        tags: [String],
        category: { type: String, required: true },
        image: { type: String },
        likes: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        isPublished: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model("Blog", BlogSchema);
