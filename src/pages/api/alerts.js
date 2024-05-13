// pages/api/tables.js

import Alert from "@/models/Alert";
import dbConnect from "../../utils/mydb";

export default async function handler(req, res) {
  const {
    method,
    body: { severity, message, reservationName },
  } = req;
  res.setHeader("Cache-Control", "no-store, max-age=0");

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const newAlert = { severity, message, reservationName };
        await Alert.create(newAlert);
        res.status(200).json();
      } catch (e) {
        console.error(e);
        return res.status(400).json({
          severity: "error",
          message: "error in post alert request",
        });
      }
      break;
    default:
      res
        .status(405)
        .json({ severity: "error", message: `Method ${method} not allowed` });
      break;
  }
}
