const mongoose = require("mongoose");

const providerSchema = mongoose.Schema(
    {
        name: {
            type: String,
            
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
        },
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpires: {
            type: Date 
        },
        image: {
            type: String,
            // type: [
            //     {
            //         originalImageUrl: { type: String },
            //         imageThumbnailUrl: { type: String },
            //     },
            // ],
            // default: [],
        },
        phone: {
            type: String,
        },
        address: {
            type: [
              {
                place: { type: String, required: true },
                district: { type: String, required: true },
                state: { type: String, required: true },
                pincode: { type: String, required: true },
                coordinates: {
                  type: { type: String, enum: ["Point"], required: true },
                  coordinates: { type: [Number], required: true },
                },
              },
            ],
            default: [],
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
        charge: {
            type: Number,
        },
        availability: {
            type: Boolean,
            default: true,
        },
        rating: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rating",
            },
        ],
        isBlocked: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

providerSchema.index({ "address.coordinates": "2dsphere"});

module.exports = mongoose.model("Provider", providerSchema);
