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
        // serviceId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Service",
        //     required: true,
        // },
        date: {
            type: Date,
        },
        slot: {
            type: String,
        },
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
            default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Booking", bookingSchema);
