import React, { useEffect, useState, useContext, useRef } from "react";
import { DashboardContext } from "@/pages/dashboard";

import { formatDate } from "../utils/utils.js";
import MakeButton from "@/components/MakeButton.jsx";
import ReservationCard from "@/components/ReservationCard.jsx";

const openingHours = {
  open: "08:00",
  close: "23:00",
};

const ReservationForm = () => {
  const { currentDate, fSetCurrentDate, currentReservations } =
    useContext(DashboardContext);

  return (
    <div className="flex flex-col items-center h-full md:flex-col-reverse md:justify-end">
      <ReservationList />
      <HorizontalTimeSlots />
    </div>
  );
};

export default ReservationForm;

const ReservationList = () => {
  const { currentReservation, currentDate, currentReservations } =
    useContext(DashboardContext);

  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    setReservations([]);
    setReservations(findInterferingReservations());
  }, [currentReservation, currentDate, currentReservations]);

  const findInterferingReservations = () => {
    // Step 1: Filter for intersecting reservations
    let intersectingReservations = currentReservations.filter(
      (reservation) =>
        reservation.start.getTime() <= currentDate.getTime() &&
        reservation.end.getTime() >= currentDate.getTime()
    );

    if (currentReservation) {
      intersectingReservations = intersectingReservations.filter(
        (reservation) => reservation._id !== currentReservation._id
      );
      intersectingReservations.unshift(currentReservation);
    }
    return intersectingReservations;
  };

  if (reservations.length == 0) {
    return (
      <div className="h-full flex flex-col justify-center">
        <div className="h-[50px] w-[150px]">
          <MakeButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex overflow-x-scroll overflow-y-clip w-full h-full p-[20px] hide-scrollbar">
      <div className="flex flex-row gap-8 items-center">
        {reservations.map((reservation, index) => (
          <ReservationCard key={index} reservation={reservation} />
        ))}
        <div className="max-w-[300px] justify-center">
          <div className="h-[50px] w-[150px]">
            <MakeButton />
          </div>
        </div>
      </div>
    </div>
  );
};

const HorizontalTimeSlots = () => {
  const { currentDate, fSetCurrentDate, fSetCurrentReservation } =
    useContext(DashboardContext);

  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const timeSlotsContainerRef = useRef(null);

  useEffect(() => {
    const newSelectedSlot = getTimeSlots().find((slot) => {
      const [hours, minutes] = slot.split(":").map(Number);
      const slotDate = new Date(currentDate);
      slotDate.setHours(hours, minutes, 0, 0);

      const currentDatePlus30Mins = new Date(
        currentDate.getTime() + 30 * 60 * 1000
      );

      return slotDate >= currentDate && slotDate < currentDatePlus30Mins;
    });

    setSelectedTimeSlot(newSelectedSlot);
  }, [currentDate]);

  useEffect(() => {
    if (selectedTimeSlot && timeSlotsContainerRef.current) {
      const timeSlots = getTimeSlots();
      const selectedSlotIndex = timeSlots.findIndex(
        (slot) => slot === selectedTimeSlot
      );

      if (selectedSlotIndex >= 0) {
        const slotWidth = 75;
        const containerWidth = timeSlotsContainerRef.current.offsetWidth;

        const newScrollPosition =
          slotWidth * selectedSlotIndex - containerWidth / 2 + slotWidth / 2;

        timeSlotsContainerRef.current.scrollLeft = newScrollPosition;
      }
    }
  }, [selectedTimeSlot]);

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

  const getTimeSlotStyle = (timeSlot) => {
    const [hours, minutes] = timeSlot.split(":").map(Number);
    const slotDate = new Date(currentDate);
    slotDate.setHours(hours, minutes, 0, 0);

    const currentDatePlus30Mins = new Date(
      currentDate.getTime() + 30 * 60 * 1000
    );

    if (timeSlot == selectedTimeSlot) {
      return "  border-blue-500";
    } else {
      return " hover:bg-gray-100 hover:border hover:rounded ";
    }
  };

  const handleTimeSlotChange = (slot) => {
    fSetCurrentReservation();
    const [hours, minutes] = slot.split(":").map(Number);
    const newDate = new Date(currentDate);
    newDate.setHours(hours, minutes, 0, 0);
    fSetCurrentDate(newDate);
  };

  return (
    <div
      className="overflow-x-scroll overflow-y-hidden w-full hide-scrollbar"
      ref={timeSlotsContainerRef}
    >
      <div className="flex flex-row py-4">
        {getTimeSlots().map((slot, index) => (
          <div
            key={index}
            onClick={() => handleTimeSlotChange(slot)}
            className={`flex justify-center py-2 min-w-[75px] text-center border-b-2 cursor-pointer text-lg ${getTimeSlotStyle(
              slot
            )}`}
          >
            {slot}
          </div>
        ))}
      </div>
    </div>
  );
};
