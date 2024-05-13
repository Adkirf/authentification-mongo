// pages/api/tables.js

import Table from "@/models/Table";
import dbConnect from "../../utils/mydb";

export default async function handler(req, res) {
  const {
    method,
    body: { _id, name, peopleCount, start, end, log },
    query: { tableNumber },
  } = req;
  res.setHeader("Cache-Control", "no-store, max-age=0");

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        if (tableNumber) {
          const table = await Table.findOne({ tableNumber: tableNumber });

          if (!table) {
            res
              .status(404)
              .json({ severity: "error", message: "Table not found" });
          }

          return res.status(200).json({
            severity: "success",
            message: "succesfully retrieved table",
            data: table,
          });
        }

        //All information of tableDB will be in entire app
        //Keep tables lean, and shift most data on reservations.
        const tables = await Table.find({});
        return res.status(200).json({
          severity: "success",
          message: "successfully retrieved all tables",
          data: tables,
        });
      } catch (e) {
        console.log(e);
        return res.status(400).json({
          severity: "error",
          message: "error in get tables request",
        });
      }
      break;
    case "POST":
      try {
      } catch (e) {
        console.error(e);
        return res.status(400).json({
          severity: "error",
          message: "error in post reservations request",
        });
      }
      break;
    case "PUT":
      try {
        if (!tableNumber) {
          return res.status(400).json({
            severity: "error",
            message: "No table number submitted",
          });
        }
        if (_id && !name && !peopleCount && !start && !end) {
          const updatedTable = await Table.findOneAndUpdate(
            { tableNumber: tableNumber },
            {
              $pull: { reservations: { _id: _id } },
            },
            { new: true }
          );

          if (!updatedTable) {
            return res.status(400).json({
              severity: "error",
              message: "failed to delete reservation in table",
            });
          }
          return res.status(200).json(updatedTable);
        }
        if (!_id || !name || !peopleCount || !start || !end) {
          return res.status(400).json({
            severity: "error",
            message: "Invalid reservation submitted",
          });
        }
        const table = await Table.findOne({ tableNumber: tableNumber });

        if (!table) {
          return res.status(300).json({
            severity: "error",
            message: "No table with that table number found.",
          });
        }

        if (table.seats < peopleCount && !log) {
          return res.status(400).json({
            severity: "warning",
            message: "table hasnt enough seats",
          });
        }

        let intersectingReservations = table.reservations.filter(
          (reservation) => {
            const reservationStart = new Date(reservation.start).getTime();
            const reservationEnd = new Date(reservation.end).getTime();
            const newReservationStart = new Date(start).getTime();
            const newReservationEnd = new Date(end).getTime();
            return (
              reservationStart < newReservationEnd &&
              reservationEnd > newReservationStart &&
              reservation._id != _id
            );
          }
        );

        const newReservation = {
          _id: _id,
          name: name,
          peopleCount: peopleCount,
          start: start,
          end: end,
        };

        if (intersectingReservations.length && !log) {
          return res.status(400).json({
            severity: "warning",
            message: "Table isn't avaialble for selectd time",
          });
        }

        let updatedTable = await Table.findOneAndUpdate(
          {
            tableNumber: tableNumber,
            "reservations._id": newReservation._id,
          },
          {
            $set: {
              "reservations.$": newReservation,
            },
          },
          { new: true, runValidators: true }
        );
        if (!updatedTable) {
          updatedTable = await Table.findOneAndUpdate(
            { tableNumber: tableNumber },
            { $push: { reservations: newReservation } },
            { new: true, runValidators: true }
          );
          if (!updatedTable) {
            return res.status(400).json({
              severity: "error",
              message: "not able to update table reservations",
            });
          }
        }

        return res.status(200).json({ updatedTable });
      } catch (e) {
        console.log(e);
        res
          .status(400)
          .json({ severity: "error", message: "Error in put tables request" });
      }
      break;
    case "DELETE":
      try {
      } catch (e) {
        console.log(e);
        return res.status(400).json({
          severity: "error",
          message: "Error in deletes tables request",
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
