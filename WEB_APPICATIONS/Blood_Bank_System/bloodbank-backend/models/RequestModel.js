import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    units: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    hospitalName: {
      type: String,
      required: true
    },
    urgency: {
      type: String,
      enum: ["Normal", "High", "Critical"],
      default: "Normal"
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Fulfilled", "Cancelled", "Unavailable"],
      default: "Pending"
    },
    rejectionReason: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);