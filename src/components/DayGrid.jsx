import { DashboardContext } from "@/pages/dashboard";
import React, { useContext } from "react";

const openingHours = {
  open: "08:00",
  close: "23:00",
};

const DayGrid = () => {
  const { currentReservations, currentDate } = useContext(DashboardContext);

  const getTimeSlots = () => {
    const slots = [];
    const openHour = parseInt(openingHours.open.split(":")[0], 10);
    const closeHour = parseInt(openingHours.close.split(":")[0], 10);

    for (let hour = openHour; hour <= closeHour; hour++) {
      slots.push(`${hour % 24 < 10 ? "0" : ""}${hour % 24}:00`);
      if (hour !== 23) {
        slots.push(`${hour % 24 < 10 ? "0" : ""}${hour % 24}:30`);
      }
    }
    return slots;
  };

  const getReservationSlots = () => {
    const today = currentDate.toISOString().slice(0, 10); // Ensure currentDate is treated as UTC

    const reservationSlots = [];

    currentReservations.forEach((reservation) => {
      const reservationDate = new Date(reservation.start)
        .toISOString()
        .split("T")[0];

      if (reservationDate !== today) {
        return;
      }

      const openTime = new Date(`${today}T${openingHours.open}:00.000Z`);
      const startTime = new Date(reservation.start);
      const endTime = new Date(reservation.end);

      const startDiff = (startTime - openTime) / (1000 * 60);
      const endDiff = (endTime - openTime) / (1000 * 60);

      const startSlots = Math.round(startDiff / 30) + 1;
      const endSlots = Math.round(endDiff / 30) + 1;

      let overlapCount = 0;
      reservationSlots.forEach((existingSlot) => {
        const overlap = !(
          endSlots < existingSlot.start || startSlots > existingSlot.end
        );
        if (overlap) {
          overlapCount += 1;
        }
      });

      reservationSlots.push({
        ...reservation,
        start: startSlots,
        end: endSlots,
        span: overlapCount + 2,
      });
    });

    return reservationSlots;
  };

  return (
    <div className="grid overflow-scroll relative ">
      {getTimeSlots().map((slot, index) => (
        <div key={index} className="col-start-1 py-2 sticky left-0">
          {slot}
          <span className="absolute flex w-screen border-b-2  bottom-0 left-0" />
        </div>
      ))}
      {getReservationSlots().map((slot, index) => (
        <div
          style={{
            gridRow: `${slot.start} / ${slot.end}`,
            gridColumnStart: `${slot.span}`,
          }}
          key={index}
          className="row-span-1 relative z-10 p-[4px]"
        >
          <div className="flex w-full h-full bg-gray-100 text-center border rounded shadow hover:bg-blue-100">
            {`table: ${slot.tableNumber} person: ${slot.persons}`}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DayGrid;
