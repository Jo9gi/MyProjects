import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    inventoryType: {
      type: String,
      required: true,
      enum: ["IN", "OUT"]
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    quantity: {
      type: Number,
      required: true
    },
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("Inventory", inventorySchema);
