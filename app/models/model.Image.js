import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
    imageMetaData: {
        type: Object,
        required: [true, "image meta data is required"],
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false,
    }
}, { timestamps: true })
export default mongoose.models.Image || mongoose.model('Image', ImageSchema);
