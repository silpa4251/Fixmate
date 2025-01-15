const mongoose = require("mongoose");

const providerSchema = mongoose.Schema(
    {
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
        image: {
            type: [
                {
                    originalImageUrl: { type: String },
                    imageThumbnailUrl: { type: String },
                },
            ],
            default: [],
        },
        phone: {
            type: String,
        },
        address: {
            type: String,
            required: true,
        },
        certifications: {
            type: [String],
            default: [],
        },
        services: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
        },
        availability: {
            type: Boolean,
            default: true,
        },
        reviews: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Provider", providerSchema);
