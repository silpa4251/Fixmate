const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        providerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Provider",
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        numberOfDays: {
            type: Number,
            required: true,
        },
        amount: {
            type: Number,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "completed", "cancelled"],
            default: "pending",
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
    }
);

bookingSchema.index({ providerId: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
