import mongoose from "mongoose";

const { Schema } = mongoose;

const alertSchema = new Schema(
  {
    severity: {
      type: String,
    },
    message: {
      type: String,
    },
    reservationName: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Alert || mongoose.model("Alert", alertSchema);
