import React, { useEffect, useState, useContext, useRef } from "react";
import { DashboardContext } from "@/pages/dashboard";

import { formatDate } from "../utils/utils.js";
import MakeButton from "@/components/MakeButton.jsx";
import ReservationCard from "@/components/ReservationCard.jsx";
import TimeSlots from "@/components/TimeSlots.jsx";

const openingHours = {
  open: "08:00",
  close: "23:00",
};

const ReservationGrid = () => {
  const {
    currentDate,
    fSetCurrentDate,
    currentReservations,
    currentReservation,
    currentTimeSlotIndex,
    indexSpan,
    fSetIndexSpan,
    getIndexToTime,
  } = useContext(DashboardContext);

  const scrollRef = useRef(null);
  const helperRectangleRef = useRef(null);
  const [scrollRefState, setScrollRefState] = useState(null);
  const [helperRectangleRefState, setHelperRectangleRefState] = useState(null);

  const [reservationRef, setReservationRef] = useState(null);
  const reservationsScrollRef = useRef(null);

  const [intersectingReservations, setIntersectingReservations] = useState([]);

  useEffect;

  useEffect(() => {
    if (reservationRef && reservationRef.current && reservationsScrollRef) {
      reservationsScrollRef.current.style.scrollBehavior = "smooth";
      const scrollToCenter = () => {
        const targetRect = reservationRef.current
          ? reservationRef.current.getBoundingClientRect()
          : null;
        if (!targetRect) return;
        const containerRect =
          reservationsScrollRef.current.getBoundingClientRect();

        const scrollTarget =
          targetRect.left +
          targetRect.width / 2 -
          (containerRect.left + containerRect.width / 2);

        reservationsScrollRef.current.scrollLeft += scrollTarget;
      };

      let animationFrame;
      const scrollTimeout = setTimeout(() => {
        animationFrame = requestAnimationFrame(scrollToCenter);
      }, 100);

      return () => {
        clearTimeout(scrollTimeout);
        cancelAnimationFrame(animationFrame);
      };
    }
  }, [reservationRef, reservationsScrollRef]);

  useEffect(() => {
    if (scrollRef) {
      setScrollRefState(scrollRef);
    }
    if (helperRectangleRef) {
      setHelperRectangleRefState(helperRectangleRef);
    }
  }, [scrollRef, helperRectangleRef]);

  const originalIndexSpan = indexSpan;
  useEffect(() => {
    fSetIndexSpan(0);
    return () => {
      fSetIndexSpan(false, originalIndexSpan);
    };
  }, []);

  const getInterSectingReservationSlots = () => {
    const result = [];
    intersectingReservations.map((reservation, index) => {
      result.push(
        <ReservationCard
          key={index}
          reservation={reservation}
          setRef={
            currentReservation
              ? currentReservation._id == reservation._id
                ? setReservationRef
                : null
              : null
          }
        />
      );
    });
    if (result.length) {
      result.push(
        <div key={"indexButton"} className="max-w-[300px] justify-center">
          <div className="h-[50px] w-[150px]">
            <MakeButton />
          </div>
        </div>
      );
      console.log(intersectingReservations);
      return (
        <div
          ref={reservationsScrollRef}
          className="flex overflow-x-scroll overflow-y-clip w-full h-full p-[20px] hide-scrollbar"
        >
          <div className="flex flex-row gap-8 items-center">{result}</div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col justify-center">
        <div className="h-[50px] w-[150px]">
          <MakeButton />
        </div>
      </div>
    );
  };

  const fSetIntersectingReservations = () => {
    const date = currentReservation ? currentReservation : getIndexToTime();

    const intersectingReservations = currentReservations.filter(
      (reservation) =>
        reservation.start.getTime() <= date.start.getTime() &&
        reservation.end.getTime() >= date.start.getTime()
    );

    setIntersectingReservations(intersectingReservations);
  };

  return (
    <div className="flex flex-col items-center h-full md:flex-col-reverse md:justify-end">
      {getInterSectingReservationSlots()}
      <div
        className="flex flex-row gap-[15px] overflow-x-scroll overflow-y-hidden w-full hide-scrollbar "
        ref={scrollRef}
      >
        <div
          ref={helperRectangleRef}
          className="absolute w-[50px] md:w-[60px] left-[50%] -translate-x-1/2 z-50"
        />
        <span className="block min-w-[40vw]" />
        <TimeSlots
          isHorizontal={true}
          mainSlots={intersectingReservations}
          setMainSlots={fSetIntersectingReservations}
          scrollRef={scrollRefState ? scrollRefState.current : null}
          helperRectangleRef={
            helperRectangleRefState
              ? helperRectangleRefState.current.getBoundingClientRect().right
              : null
          }
        />
        <span className="block min-w-[40vw]" />
      </div>
    </div>
  );
};

export default ReservationGrid;

const ReservationList = () => {
  const { currentReservation, currentDate, currentReservations } =
    useContext(DashboardContext);

  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    setReservations([]);
    setReservations(findInterferingReservations());
  }, [currentReservation, currentDate, currentReservations]);

  const findInterferingReservations = () => {
    let intersectingReservations = currentReservations.filter(
      (reservation) =>
        reservation.start.getTime() <= currentDate.getTime() &&
        reservation.end.getTime() >= currentDate.getTime()
    );

    //Replace with scroll
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
