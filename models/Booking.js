// models/Booking.js
import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    date: { type: Date, required: true },
    time: { type: String, required: true },
    email: { type: String, required: true },
    meetLink: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "cancelled", "blocked"],
      default: "active",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timeZone: { type: String, required: true },
    // For recurring availability settings
    isSlotAvailable: { type: Boolean, default: true },
    // For tracking reschedules
    rescheduledFrom: { type: Date },
    rescheduledReason: String,
  },
  {
    timestamps: true,
  }
);

// Create compound index for unique slots
bookingSchema.index({ date: 1, time: 1 }, { unique: true });

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;
