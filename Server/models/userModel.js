const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
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
        phone: {
            type: String,
        },
        image: {
            type: [
                {
                    originalImageUrl: { type: String },
                    imageThumbUrl: { type: String },
                },
            ],
            default: [], 
        },
        address: {
            type: [
                {
                    street: { type: String },
                    city: { type: String },
                    state: { type: String },
                    pinCode: { type: String },
                }
            ],
            default: [],
        },
        role: {
            type: String,
            default: "user",
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
