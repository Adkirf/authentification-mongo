import mongoose from "mongoose";

const { Schema } = mongoose;

const subReservationSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: {
      type: String,
      required: true,
    },
    peopleCount: {
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
  },
  { _id: false }
);

const tableSchema = new Schema(
  {
    tableNumber: {
      type: Number,
      unique: true,
      required: true,
    },
    seats: {
      type: Number,
      required: false,
    },
    reservations: {
      type: [subReservationSchema],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Table || mongoose.model("Table", tableSchema);
