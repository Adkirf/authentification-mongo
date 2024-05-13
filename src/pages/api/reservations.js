// pages/api/reservations.js

import dbConnect from "../../utils/mydb";
import Reservation from "../../models/Reservation";
import Table from "../../models/Table";

const baseURL = process.env.BASEURL || "http://localhost:3000/";

let dumyReservations = [
  {
    id: 0,
    contact: "alex@example.com",
    name: "Alex",
    tableNumber: 1,
    findBestTable: true,
    peopleCount: 4,
    start: "2024-01-10T18:00:00.000+00:00",
    end: "2024-01-10T20:00:00.000+00:00",
    status: "checked",
  },
  ,
  {
    id: 1,
    contact: "john@example.com",
    name: "John",
    tableNumber: 1,
    findBestTable: true,
    peopleCount: 2,
    start: "2024-02-14T18:00:00.000+00:00",
    end: "2024-02-14T20:00:00.000+00:00",
    status: "checked",
  },
  {
    id: 2,
    contact: "susan@example.com",
    name: "Susan",
    tableNumber: 2,
    findBestTable: true,
    peopleCount: 4,
    start: "2024-02-22T17:30:00.000+00:00",
    end: "2024-02-22T19:30:00.000+00:00",
    status: "unchecked",
  },
  {
    id: 3,
    contact: "mike@example.com",
    name: "Mike",
    tableNumber: 3,
    findBestTable: true,
    peopleCount: 6,
    start: "2024-02-29T20:00:00.000+00:00",
    end: "2024-02-29T22:00:00.000+00:00",
    status: "checked",
  },
  ,
  {
    id: 4,
    contact: "alice@example.com",
    name: "Alice",
    tableNumber: 1,
    findBestTable: true,
    peopleCount: 3,
    start: "2024-03-10T19:00:00.000+00:00",
    end: "2024-03-10T21:00:00.000+00:00",
    status: "checked",
  },
  {
    id: 5,
    contact: "bob@example.com",
    name: "Bob",
    tableNumber: 2,
    findBestTable: true,
    peopleCount: 2,
    start: "2024-03-18T18:30:00.000+00:00",
    end: "2024-03-18T20:30:00.000+00:00",
    status: "confirmed",
  },
  {
    id: 6,
    contact: "emma@example.com",
    name: "Emma",
    tableNumber: 3,
    findBestTable: true,
    peopleCount: 5,
    start: "2024-03-25T20:00:00.000+00:00",
    end: "2024-03-25T22:00:00.000+00:00",
    status: "unchecked",
  },
  ,
  {
    id: 7,
    contact: "peter@gmail.com",
    name: "Peter",
    tableNumber: 1,
    findBestTable: true,
    peopleCount: 20,
    start: "2024-04-01T10:00:00.000+00:00",
    end: "2024-04-01T12:00:00.000+00:00",
    status: "checked",
  },
  {
    id: 8,
    tableNumber: 2,
    findBestTable: true,
    contact: "ulf@gmail.com",
    name: "Ulf",
    peopleCount: 1,
    start: "2024-04-08T19:30:00.000+00:00",
    end: "2024-04-08T19:30:00.000+00:00",
    status: "checked",
  },
  {
    id: 9,
    tableNumber: 0,
    findBestTable: true,
    contact: "sat@gmail.com",
    name: "Sat",
    peopleCount: 2,
    start: "2024-04-28T16:30:00.000+00:00",
    end: "2024-04-28T17:30:00.000+00:00",
    status: "unchecked",
  },
  {
    id: 10,
    tableNumber: 3,
    findBestTable: true,
    contact: "sat@gmail.com",
    name: "Sat 2",
    peopleCount: 2,
    start: "2024-04-28T16:30:00.000+00:00",
    end: "2024-04-28T17:30:00.000+00:00",
    status: "unchecked",
  },
  {
    id: 11,
    contact: "david@example.com",
    name: "David",
    tableNumber: 1,
    findBestTable: true,
    peopleCount: 4,
    start: "2024-05-05T19:30:00.000+00:00",
    end: "2024-05-05T21:30:00.000+00:00",
    status: "unchecked",
  },
  {
    id: 12,
    contact: "emily@example.com",
    name: "Emily",
    tableNumber: 2,
    findBestTable: true,
    peopleCount: 3,
    start: "2024-05-15T18:00:00.000+00:00",
    end: "2024-05-15T20:00:00.000+00:00",
    status: "unchecked",
  },
  {
    id: 13,
    contact: "george@example.com",
    name: "George",
    tableNumber: 3,
    findBestTable: true,
    peopleCount: 6,
    start: "2024-05-25T17:00:00.000+00:00",
    end: "2024-05-25T19:00:00.000+00:00",
    status: "unchecked",
  },
  ,
  {
    id: 14,
    contact: "olivia@example.com",
    name: "Olivia",
    tableNumber: 1,
    findBestTable: true,
    peopleCount: 2,
    start: "2024-06-10T18:00:00.000+00:00",
    end: "2024-06-10T20:00:00.000+00:00",
    status: "unchecked",
  },
  {
    id: 15,
    contact: "harry@example.com",
    name: "Harry",
    tableNumber: 2,
    findBestTable: true,
    peopleCount: 4,
    start: "2024-06-18T17:30:00.000+00:00",
    end: "2024-06-18T19:30:00.000+00:00",
    status: "unchecked",
  },
  {
    id: 16,
    contact: "emma@example.com",
    name: "Emma",
    tableNumber: 3,
    findBestTable: true,
    peopleCount: 6,
    start: "2024-06-25T20:00:00.000+00:00",
    end: "2024-06-25T22:00:00.000+00:00",
    status: "unchecked",
  },
  ,
  {
    id: 17,
    contact: "james@example.com",
    name: "James",
    tableNumber: 1,
    findBestTable: true,
    peopleCount: 3,
    start: "2024-07-05T19:00:00.000+00:00",
    end: "2024-07-05T21:00:00.000+00:00",
    status: "checked",
  },
  {
    id: 18,
    contact: "sophia@example.com",
    name: "Sophia",
    tableNumber: 2,
    findBestTable: true,
    peopleCount: 2,
    start: "2024-07-15T18:30:00.000+00:00",
    end: "2024-07-15T20:30:00.000+00:00",
    status: "checked",
  },
  {
    id: 19,
    contact: "william@example.com",
    name: "William",
    tableNumber: 3,
    findBestTable: true,
    peopleCount: 5,
    start: "2024-07-25T20:00:00.000+00:00",
    end: "2024-07-25T22:00:00.000+00:00",
    status: "checked",
  },
  ,
];

let dumyTables = [
  {
    tableNumber: 0,
    seats: 2,
    reservations: [
      {
        id: 9,
        start: "2024-04-28T16:30:00.000+00:00",
        end: "2024-04-28T17:30:00.000+00:00",
      },
    ],
  },
  {
    tableNumber: 1,
    seats: 4,
    reservations: [],
  },
  {
    tableNumber: 2,
    seats: 4,
    reservations: [],
  },
  {
    tableNumber: 3,
    seats: 2,
    reservations: [
      {
        id: 10,
        start: "2024-04-28T16:30:00.000+00:00",
        end: "2024-04-28T17:30:00.000+00:00",
      },
    ],
  },
  {
    tableNumber: 4,
    seats: 6,
    reservations: [],
  },
  {
    tableNumber: 5,
    seats: 6,
    reservations: [],
  },
  {
    tableNumber: 6,
    seats: 8,
    reservations: [],
  },
];

export default async function handler(req, res) {
  const {
    method,
    body: {
      name,
      contact,
      peopleCount,
      findBestTable,
      tableNumber,
      start,
      end,
      status,
      comment,
      log,
    },
    query: { _id, month },
  } = req;

  await dbConnect();

  res.setHeader("Cache-Control", "no-store, max-age=0");
  switch (method) {
    case "GET":
      try {
        if (_id) {
          const reservation = await Reservation.findOne({ _id: id });

          if (!reservation) {
            return res.status(404).json({
              severity: "error",
              message: "No reservation with this id found",
            });
          }

          return res.status(200).json({
            severity: "success",
            message: "succesfully retrieved reservation",
            data: reservation,
          });
        } else if (month) {
          if (month > 11 || month < 0) {
            res
              .status(400)
              .json({ severity: "error", message: "month invalid" });
            return;
          }
          const thisYear = new Date().getFullYear();
          const nextMonth = parseInt(month) + parseInt(1);

          const firstDayOfMonth = new Date(thisYear, month, 1);
          const lastDayOfMonth = new Date(thisYear, nextMonth, 0);

          const reservations = await Reservation.find({
            start: {
              $gte: firstDayOfMonth,
              $lte: lastDayOfMonth,
            },
          }).sort({ start: 1 });

          return res.status(200).json({
            severity: "success",
            message: "successfuly retrieved monhtly reservation",
            data: reservations,
          });
        } else {
          // only reservation of the current Month
          //const reservations = await Reservation.find({});
          /* const reservations = dumyReservations.filter(
            (reservation) =>
              new Date(reservation.start).getMonth() ===
              new Date(start).getMonth()
          ); */

          const now = new Date();
          const firstDayOfMonth = new Date(
            now.getFullYear(),
            parseInt(now.getMonth()),
            1
          );
          const lastDayOfMonth = new Date(
            now.getFullYear(),
            parseInt(now.getMonth()) + parseInt(1),
            0
          );

          const reservations = await Reservation.find({
            start: {
              $gte: firstDayOfMonth,
              $lte: lastDayOfMonth,
            },
          }).sort({ start: 1 });

          if (reservations.length == 0) {
            return res.status(400).json({
              severity: "warning",
              message: "No reservations for this month",
              data: [],
            });
          }

          return res.status(200).json({
            severity: "success",
            message: "successfuly retrieved all reservation",
            data: reservations,
          });
        }
      } catch (e) {
        console.log(e);
        return res.status(400).json({
          severity: "error",
          message: "error in get reservations request",
        });
      }
      break;
    case "POST":
      try {
        const id = `${tableNumber}_${new Date().getTime()}`;

        let reservation = {
          _id: id,
          name: name,
          contact: contact,
          peopleCount: peopleCount,
          findBestTable: findBestTable,
          tableNumber: tableNumber,
          start: start,
          end: end,
          status: status === "checked" ? "checked" : "unchecked",
          comment: comment,
        };

        let subReservation = {
          _id: id,
          name: name,
          peopleCount: peopleCount,
          start: start,
          end: end,
        };

        if (log) {
          reservation = { ...reservation, log: log };
          subReservation = { ...subReservation, log: log };
        }

        const tableResponse = await fetch(
          `${baseURL}api/tables?tableNumber=${tableNumber}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...subReservation,
            }),
          }
        );

        const data = await tableResponse.json();

        if (!tableResponse.ok) {
          const now = new Date();
          const firstDayOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
          );
          const lastDayOfMonth = new Date(
            now.getFullYear(),
            parseInt(now.getMonth()) + parseInt(1),
            0
          );

          const reservations = await Reservation.find({
            start: {
              $gte: firstDayOfMonth,
              $lte: lastDayOfMonth,
            },
          }).sort({ start: 1 });

          return res.status(400).json({
            severity: data.severity,
            message: data.message,
            data: reservations,
          });
        }

        const newReservation = await Reservation.create(reservation);

        if (log) {
          return res.status(201).json({
            severity: "warning",
            message: "Reservation was forced succesfully",
            data: newReservation,
          });
        }

        return res.status(201).json({
          severity: "success",
          message: "successfully made new reservation",
          data: newReservation,
        });
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
        if (!_id) {
          return res.status(400).json({
            severity: "error",
            message: "Invalid reservation id",
          });
        }
        let changeReservation = {
          name: name,
          contact: contact,
          peopleCount: peopleCount,
          findBestTable: findBestTable,
          tableNumber: tableNumber,
          start: start,
          end: end,
          status: status,
          comment: comment,
        };
        let subReservation = {
          _id: _id,
          name: name,
          peopleCount: peopleCount,
          start: start,
          end: end,
        };

        if (log) {
          changeReservation = { ...changeReservation, log: log };
          subReservation = { ...subReservation, log: log };
        }

        let changeTable = await Table.findOne({ tableNumber: tableNumber });

        if (!changeTable) {
          return res.status(400).json({
            severity: "error",
            message: "Invalid new table number",
          });
        }

        const tableResponse = await fetch(
          `${baseURL}api/tables?tableNumber=${tableNumber}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...subReservation,
            }),
          }
        );
        const data = await tableResponse.json();

        if (!tableResponse.ok) {
          const now = new Date();
          const firstDayOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
          );
          const lastDayOfMonth = new Date(
            now.getFullYear(),
            parseInt(now.getMonth()) + parseInt(1),
            0
          );

          const reservations = await Reservation.find({
            start: {
              $gte: firstDayOfMonth,
              $lte: lastDayOfMonth,
            },
          }).sort({ start: 1 });

          return res.status(400).json({
            severity: data.severity,
            message: data.message,
            data: reservations,
          });
        }
        const updatedReservation = await Reservation.findOneAndUpdate(
          { _id: _id, status: { $ne: "checked" } }, // Condition to check status is not "checked"
          changeReservation,
          { new: true }
        );

        if (!updatedReservation) {
          const isPreviosUpdatedReservation = await Reservation.findOne(
            { _id: _id } // Condition to check status is not "checked"
          );

          if (!isPreviosUpdatedReservation) {
            const now = new Date();
            const firstDayOfMonth = new Date(
              now.getFullYear(),
              now.getMonth(),
              1
            );
            const lastDayOfMonth = new Date(
              now.getFullYear(),
              parseInt(now.getMonth()) + parseInt(1),
              0
            );

            const reservations = await Reservation.find({
              start: {
                $gte: firstDayOfMonth,
                $lte: lastDayOfMonth,
              },
            }).sort({ start: 1 });

            return res.status(400).json({
              severity: "error",
              message:
                "The reservation to change is invalid. Refresh the page.",
            });
          }
          return res.status(200).json({
            severity: "error",
            message: "reservation was checked-in by someone else.",
            data: isPreviosUpdatedReservation,
          });
        }

        if (log) {
          return res.status(400).json({
            severity: "warning",
            message: "Reservation was forced succesfully",
            data: updatedReservation,
          });
        }

        return res.status(200).json({
          severity: "success",
          message: "reservation changed successfully",
          data: updatedReservation,
        });
      } catch (e) {
        console.log(e);
        return res.status(400).json({
          severity: "error",
          message: "Error in put reservations request",
        });
      }
      break;
    case "DELETE":
      try {
        if (!_id) {
          return res.status(400).json({
            severity: "error",
            message: "Invalid reservation id",
          });
        }

        const tableResponse = await fetch(
          `${baseURL}api/tables?tableNumber=${tableNumber}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              _id: _id,
            }),
          }
        );
        const data = await tableResponse.json();

        if (!tableResponse.ok) {
          return res
            .status(400)
            .json({ severity: data.severity, message: data.message });
        }

        const deletedReservation = await Reservation.findByIdAndDelete(_id);

        if (!deletedReservation) {
          return res.status(400).json({
            severity: "error",
            message: "No reservation to delete found",
          });
        }

        return res.status(200).json({
          severity: "success",
          message: "reservation deleted successfully",
          data: deletedReservation,
        });
      } catch (e) {
        console.log(e);
        return res
          .status(400)
          .json({ severity: "error", message: "Error in reservation DELETE" });
      }
      break;
    default:
      return res
        .status(405)
        .json({ severity: "error", message: `Method ${method} not allowed` });
      break;
  }
}
