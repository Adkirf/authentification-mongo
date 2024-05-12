import mongoose from "mongoose";

const { Schema } = mongoose;

const reservationSchema = new Schema(
  {
    _id: { type: String, required: true, unqiue: true },
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    peopleCount: {
      type: Number,
      required: true,
    },
    findBestTable: {
      type: Boolean,
      required: true,
    },
    tableNumber: {
      type: Number,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
    },
    log: {
      type: String,
    },
  },
  { timestamps: true },
  { _id: false }
);

export default mongoose.models.Reservation ||
  mongoose.model("Reservation", reservationSchema);
