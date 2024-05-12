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
      const currentTimeSlots = [];

      for (let i = 0; i <= indexSpan; i++) {
        currentTimeSlots.push(currentTimeSlotIndex + i);
      }
      const maxTimeSlot = currentTimeSlots[currentTimeSlots.length - 1];

      const tableReservations = reservations.filter(
        (tableReservation) => tableReservation.tableNumber == table.tableNumber
      );

      tableReservations.forEach((tableReservation) => {
        currentTimeSlots.forEach((timeSlot, index) => {
          if (
            tableReservation.startSlot <= timeSlot &&
            tableReservation.endSlot > timeSlot
          ) {
            currentTimeSlots[index + 1] = null;
          }
        });
      });

      let startSlot = currentTimeSlots[0];

      const res = currentTimeSlots.map((slot, index) => {
        if ((slot || slot == 0) && !currentTimeSlots[index + 1]) {
          if (startSlot == slot) {
            return;
          }

          return {
            tableNumber: table.tableNumber,
            peopleCount: table.seats,
            startSlot: startSlot,
            endSlot: slot,
          };
        }
        if (!(slot || slot == 0) && currentTimeSlots[index + 1]) {
          startSlot = currentTimeSlots[index + 1] - 1;
        }
      });

      const filtered = res.filter((res) => res);

      return filtered;
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
