import React, { useState, useRef, useEffect, useContext } from "react";

import { DayContext } from "@/sections/DayGrid";
import { ErrorSharp } from "@mui/icons-material";
import { DashboardContext } from "@/pages/dashboard";

const TimeSlots = ({
  isBackground,
  mainSlots,
  setMainSlots,
  scrollRef,
  helperRectangleRef,
}) => {
  const timeSlotRef = useRef(null);

  const getSpaceHeight = () => {};

  const {
    currentDate,
    currentReservation,
    currentReservations,
    indexSpan,
    currentTimeSlotIndex,
    getTimeSlots,
    fSetIndexSpan,
    fSetCurrentTimeSlotIndex,
  } = useContext(DashboardContext);

  useEffect(() => {
    if (isBackground) {
      return;
    }
    setMainSlots();
  }, [
    currentTimeSlotIndex,
    indexSpan,
    currentDate,
    currentReservations,
    currentReservation,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      if (timeSlotRef.current && helperRectangleRef && scrollRef) {
        const timeSlotRect = timeSlotRef.current.getBoundingClientRect();
        if (scrollRef.scrollTop < timeSlotRect.height) {
          fSetCurrentTimeSlotIndex(0);
        } else if (
          timeSlotRect.top < helperRectangleRef &&
          timeSlotRect.bottom < helperRectangleRef
        ) {
          fSetCurrentTimeSlotIndex((prevIndex) => {
            const newIndex = Math.min(prevIndex + 1, getTimeSlots().length - 1);

            return newIndex;
          });
        } else if (
          timeSlotRect.top > helperRectangleRef &&
          timeSlotRect.bottom > helperRectangleRef
        ) {
          fSetCurrentTimeSlotIndex((prevIndex) => {
            const newIndex = Math.max(prevIndex - 1, 0);
            return newIndex;
          });
        }
      }
    };

    if (!isBackground && scrollRef) {
      handleScroll();
      scrollRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollRef) {
        scrollRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [currentTimeSlotIndex, indexSpan, scrollRef, helperRectangleRef]);

  const scrollToHelperHeight = () => {
    if (timeSlotRef.current && helperRectangleRef) {
      let scroll =
        timeSlotRef.current.getBoundingClientRect().top - helperRectangleRef;
      scrollRef.scrollTop +=
        scroll + timeSlotRef.current.getBoundingClientRect().height;
    }
  };

  useEffect(() => {
    if (scrollRef && helperRectangleRef) {
      scrollToHelperHeight();
    }
  }, [scrollRef, helperRectangleRef]);

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
              ? " w-[50px] md:w-[60px] h-full  min-h-[40px] md:min-h-[60px] bg-white col-start-1 z-10  sticky left-0"
              : " w-[50px] md:w-[60px] h-full min-h-[40px] md:min-h-[60px] flex flex-col items-end  bg-white col-start-1 z-20  sticky left-0"
          }
        >
          {isBackground ? (
            <span className="absolute  bg-gray-100  w-screen h-[1px] bg-translate-y-[0px]" />
          ) : (
            <span
              className={`mt-2 w-[25px]  h-[1px] ${
                currentTimeSlotIndex == index ||
                currentTimeSlotIndex + indexSpan == index
                  ? `${
                      mainSlots.length
                        ? "bg-blue-500 h-[3px]"
                        : "bg-gray-700 h-[3px]"
                    }`
                  : "bg-gray-200"
              }`}
            />
          )}
          <div className="flex w-full justify-center">{time}</div>
        </div>
      ))}
    </>
  );
};

export default TimeSlots;
