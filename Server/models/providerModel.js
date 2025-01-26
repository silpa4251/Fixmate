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
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpires: {
            type: Date 
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
        },
        certifications: {
            type: [String],
            default: [],
        },
        services: {
            // {
            // type: mongoose.Schema.Types.ObjectId,
            // ref: "Service",
            // },
            type: [String],
            default: [],
        },
        availability: {
            type: Boolean,
            default: true,
        },
        location: {
            type: { type: String, enum: ["Point"] },
            coordinates: { type: [Number] }, 
        },
        reviews: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
            },
        ],
    },
    {
        timestamps: true,
    }
);

providerSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Provider", providerSchema);
