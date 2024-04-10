import React, { useEffect, useState, useContext, useRef } from "react";
import { DashboardContext } from "@/pages/dashboard";

import { formatDate } from "../utils/utils.js";

const openingHours = {
  open: "08:00",
  close: "23:00",
};

const ReservationForm = () => {
  const { currentDate, fSetCurrentDate, currentReservations } =
    useContext(DashboardContext);

  console.log(currentDate);
  console.log(currentReservations);

  return (
    <div className="flex flex-col items-center md:flex-col-reverse">
      <ReservationList />
      <HorizontalTimeSlots />
    </div>
  );
};

export default ReservationForm;

const ReservationCard = ({ reservation }) => {
  const { currentReservations, currentDate, updateReservation } =
    useContext(DashboardContext);

  const [status, setStatus] = useState("make"); // make, change, check-in, checked

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [peopleCount, setPeopleCount] = useState(2);
  const [start, setStart] = useState(formatDate(currentDate));
  const [end, setEnd] = useState(formatDate(currentDate));
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setStart(formatDate(currentDate));

    if (reservation) {
      setEmail(reservation.email);
      setName(reservation.name);
      setPeopleCount(reservation.peopleCount);
      setStart(reservation.start);
      setEnd(reservation.end);
      if (reservation.status == "checked") {
        setStatus("checked");
        return;
      }
      const fifteenMinutesFromNow = new Date().getTime() + 15 * 60000;

      if (new Date(start).getTime() <= fifteenMinutesFromNow) {
        setStatus("check-in");
        return;
      }
      setStatus("change");
    }
  }, [currentReservations, currentDate]);

  const getHeader = () => {
    switch (status) {
      case "make":
        return "Make";

      case "change":
        return "Change";

      case "check-in":
        return "Check-In";

      case "checked":
        "";
    }
  };

  const getBorder = () => {
    switch (status) {
      case "make":
        return "";

      case "change":
        return "bg-white rounded-lg border";

      case "check-in":
        return "shadow-md bg-white rounded-lg border-blue-500";

      case "checked":
        return "shadow-md bg-white rounded-lg border border-blue-500";
    }
  };

  const getButton = () => {
    switch (status) {
      case "make":
        return (
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Make Reservation
          </button>
        );

      case "change":
        return (
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Change Reservation
          </button>
        );

      case "check-in":
        return (
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Check In
          </button>
        );

      case "checked":
        return (
          <button
            disabled={true}
            className="w-full py-2 px-4 bg-gray-500 text-white rounded-md border-blue-500 focus:outline-none "
          >
            table 4
          </button>
        );
    }
  };

  const validateInputs = () => {
    if (!email || !name || peopleCount < 1 || !dateTime) {
      setErrorMessage("Please fill in all fields.");
      return false;
    }
    setErrorMessage("");
    return true;
  };
  const handlePeopleCountChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setPeopleCount(value);
    } else {
      setPeopleCount("");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateInputs()) {
      const newReservation = {
        name: name,
        email: email,
        peopleCount: peopleCount,
        start: new Date(start).toISOString,
        end: new Date(end).toISOString,
        status: status === "check-in" ? "checked" : "",
      };

      try {
        updateReservation(currentReservation, newReservation);

        setEmail("");
        setName("");
        setPeopleCount(1);
        setDateTime("");
      } catch (error) {
        console.error("Error submitting reservation:", error);
        setErrorMessage("Error submitting reservation. Please try again.");
      }
    }
  };

  return (
    <div className={`min-w-[300px] mt-8 p-6 ${getBorder()}`}>
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-4">
          <span className="text-blue-500">{getHeader()}</span> A Rerservation
        </h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">
            Email:
          </label>
          <input
            disabled={status === "checked"}
            type="email"
            id="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">
            Name:
          </label>
          <input
            disabled={status === "checked"}
            type="text"
            id="name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="peopleCount" className="block text-gray-700">
            Number of People:
          </label>
          <input
            disabled={status === "checked"}
            type="number"
            id="peopleCount"
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            value={peopleCount === "" ? "" : peopleCount}
            onChange={handlePeopleCountChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dateTime" className="block text-gray-700">
            Date & Time:
          </label>
          <input
            disabled={status === "checked"}
            type="datetime-local"
            id="dateTime"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            value={start}
            onChange={(e) => setDateTime(e.target.value)}
            required
          />
        </div>
        {getButton()}
      </form>
    </div>
  );
};

const ReservationList = () => {
  const { currentDate, currentReservations } = useContext(DashboardContext);

  const findInterferingReservations = () => {
    const intersectingReservations = currentReservations.filter(
      (reservation) => {
        if (
          new Date(reservation.start).getTime() <= currentDate.getTime() &&
          new Date(reservation.end).getTime() >= currentDate.getTime()
        ) {
          return reservation;
        }
      }
    );

    return intersectingReservations;
  };

  if (findInterferingReservations().length == 0) {
    return <ReservationCard reservation={null} />;
  }

  return (
    <div className="overflow-x-scroll w-full p-[20px]">
      <div className="flex flex-row gap-8 ">
        {findInterferingReservations().map((reservation, index) => (
          <ReservationCard key={index} reservation={reservation} />
        ))}
      </div>
    </div>
  );
};

const HorizontalTimeSlots = () => {
  const { currentDate, fSetCurrentDate } = useContext(DashboardContext);

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
    const [hours, minutes] = slot.split(":").map(Number);
    const newDate = new Date(currentDate);
    newDate.setHours(hours, minutes, 0, 0);
    console.log(`handleTimeSLotsChange ${newDate}`);
    fSetCurrentDate(newDate);
  };

  return (
    <div className="overflow-x-scroll w-full" ref={timeSlotsContainerRef}>
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
