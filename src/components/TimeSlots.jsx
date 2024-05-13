import React, { useState, useRef, useEffect, useContext } from "react";

import { DayContext } from "@/sections/DayGrid";
import { ErrorSharp } from "@mui/icons-material";
import { DashboardContext } from "@/pages/dashboard";

const TimeSlots = ({ isBackground }) => {
  const [currentTimeSlotIndex, setCurrentTimeSlotIndex] = useState(0);
  const timeSlotRef = useRef(null);

  const { currentReservation, currentReservations } =
    useContext(DashboardContext);

  const {
    scrollRef,
    helperRectangleRef,
    getTimeSlots,
    getReservationSlots,
    getTableSlots,
    fSetPossibleReservations,
    indexSpan,
  } = useContext(DayContext);

  useEffect(() => {
    if (isBackground) {
      return;
    }
    const tables = getTableSlots();
    const reservations = getReservationSlots();

    if (reservations === 0) {
      const allTables = tables.map((table) => {
        const currentTimeSlots = [];

        for (let i = 0; i <= indexSpan; i++) {
          currentTimeSlots.push(currentTimeSlotIndex + i);
        }

        return {
          tableNumber: table.tableNumber,
          peopleCount: table.seats,
          startSlot: currentTimeSlots[0],
          endSlot: currentTimeSlots[currentTimeSlots.length - 1],
        };
      });
      fSetPossibleReservations(allTables);
      return;
    }
    const possibleReservations = tables.map((table) => {
      // Initialize the time slots for this table
      const currentTimeSlots = [];
      for (let i = 0; i <= indexSpan; i++) {
        currentTimeSlots.push(currentTimeSlotIndex + i);
      }

      // Apply existing reservations to nullify conflicting slots
      const tableReservations = reservations.filter(
        (reservation) => reservation.tableNumber === table.tableNumber
      );
      tableReservations.forEach((reservation) => {
        for (let i = 0; i < currentTimeSlots.length; i++) {
          if (
            reservation.startSlot <= currentTimeSlots[i] &&
            reservation.endSlot > currentTimeSlots[i]
          ) {
            currentTimeSlots[i] = null; // Nullify this slot
          }
        }
      });

      // Collect blocks of available slots
      const result = [];
      let startSlot = null; // Start of a new available block
      currentTimeSlots.forEach((slot, index) => {
        if (slot !== null) {
          if (startSlot === null) {
            startSlot = slot; // Start a new block
          }
          // Check if it's the last slot in the array or next slot is null
          if (
            index === currentTimeSlots.length - 1 ||
            currentTimeSlots[index + 1] === null
          ) {
            if (startSlot !== null) {
              result.push({
                tableNumber: table.tableNumber,
                peopleCount: table.seats,
                startSlot: startSlot,
                endSlot: currentTimeSlots[index + 1] === null ? slot + 1 : slot,
              });
              startSlot = null; // Close this block
            }
          }
        } else {
          if (startSlot !== null) {
            // End the current block at the previous slot
            result.push({
              tableNumber: table.tableNumber,
              peopleCount: table.seats,
              startSlot: startSlot,
              endSlot: currentTimeSlots[index - 1],
            });
            startSlot = null; // Reset the start slot
          }
        }
      });

      // Debug logs for specific table numbers
      if (table.tableNumber === 0) {
        console.log("Current Time Slots:", currentTimeSlots);
        console.log("Possible Reservations:", result);
      }

      return result.filter((res) => res.startSlot != res.endSlot);
    });

    fSetPossibleReservations(possibleReservations.flat());
  }, [
    currentTimeSlotIndex,
    indexSpan,
    currentReservations,
    currentReservation,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        timeSlotRef.current &&
        helperRectangleRef.current &&
        scrollRef.current
      ) {
        const timeSlotRect = timeSlotRef.current.getBoundingClientRect();
        const helperRect =
          helperRectangleRef.current.getBoundingClientRect().bottom + 60;

        if (scrollRef.current.scrollTop === 0) {
          setCurrentTimeSlotIndex(0);
        } else if (
          timeSlotRect.top < helperRect &&
          timeSlotRect.bottom < helperRect
        ) {
          setCurrentTimeSlotIndex((prevIndex) => {
            const newIndex = Math.min(prevIndex + 1, getTimeSlots().length - 1);

            return newIndex;
          });
        } else if (
          timeSlotRect.top > helperRect &&
          timeSlotRect.bottom > helperRect
        ) {
          setCurrentTimeSlotIndex((prevIndex) => {
            const newIndex = Math.max(prevIndex - 1, 0);
            return newIndex;
          });
        }
      }
    };
    if (scrollRef.current) {
      handleScroll();
      scrollRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [currentTimeSlotIndex, indexSpan]);

  return (
    <>
      {getTimeSlots().map((time, index) => (
        <div
          ref={
            index === currentTimeSlotIndex && !isBackground ? timeSlotRef : null
          }
          key={index}
          className={
            isBackground
              ? "w-[60px] h-full min-h-[60px] bg-white col-start-1 z-10  sticky left-0"
              : "w-[60px] h-full min-h-[60px] flex flex-col items-end  bg-white col-start-1 z-20 py-0 sticky left-0"
          }
        >
          {isBackground ? (
            <span className="absolute  bg-gray-100  w-screen h-[1px] bg-translate-y-[0px]" />
          ) : (
            <span
              className={`w-[25px] bg-${
                index === currentTimeSlotIndex ||
                index === currentTimeSlotIndex + indexSpan
                  ? "blue-500 h-[3px] w-full"
                  : "gray-100 h-[1px]"
              } `}
            />
          )}
          <div className="flex w-full justify-center">{time}</div>
        </div>
      ))}
    </>
  );
};

export default TimeSlots;
