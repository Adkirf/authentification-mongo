import React, { useState, useRef, useEffect, useContext } from "react";

import { DayContext } from "@/sections/DayGrid";
import { ErrorSharp } from "@mui/icons-material";
import { DashboardContext } from "@/pages/dashboard";

const TimeSlots = ({
  isBackground,
  isHorizontal,
  mainSlots,
  scrollRef,
  helperRectangleRef,
}) => {
  const timeSlotRef = useRef(null);

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

  let pauseScroll = false;
  useEffect(() => {
    const handleScroll = () => {
      if (pauseScroll) return;
      if (timeSlotRef.current && helperRectangleRef && scrollRef) {
        const timeSlotRect = timeSlotRef.current.getBoundingClientRect();
        if (isHorizontal) {
          if (
            scrollRef.scrollLeft < timeSlotRect.width &&
            !currentTimeSlotIndex
          ) {
            fSetCurrentTimeSlotIndex(0);
          } else if (
            timeSlotRect.left + 15 < helperRectangleRef &&
            timeSlotRect.right + 15 < helperRectangleRef
          ) {
            fSetCurrentTimeSlotIndex(0, true, false);
          } else if (
            timeSlotRect.left > helperRectangleRef &&
            timeSlotRect.right > helperRectangleRef
          ) {
            fSetCurrentTimeSlotIndex(0, false, true);
          }
          return;
        }

        if (
          scrollRef.scrollTop < timeSlotRect.height &&
          !currentTimeSlotIndex
        ) {
          fSetCurrentTimeSlotIndex(0);
        } else if (
          timeSlotRect.top < helperRectangleRef &&
          timeSlotRect.bottom < helperRectangleRef
        ) {
          fSetCurrentTimeSlotIndex(0, true, false);
        } else if (
          timeSlotRect.top > helperRectangleRef &&
          timeSlotRect.bottom > helperRectangleRef
        ) {
          fSetCurrentTimeSlotIndex(0, false, true);
        }
      }
    };

    const scrollToHelper = () => {
      if (timeSlotRef.current && helperRectangleRef) {
        pauseScroll = true;
        if (isHorizontal) {
          let scrollTarget =
            timeSlotRef.current.getBoundingClientRect().left -
            helperRectangleRef +
            timeSlotRef.current.getBoundingClientRect().width;

          scrollRef.scrollLeft += scrollTarget;
        } else {
          let scrollTarget =
            timeSlotRef.current.getBoundingClientRect().top -
            helperRectangleRef;

          if (currentTimeSlotIndex === 0) {
            scrollTarget = 0;
          }

          scrollRef.scrollTop = scrollTarget;
        }

        setTimeout(() => {
          pauseScroll = false;
        }, 1500);
      }
    };

    if (scrollRef && helperRectangleRef) {
      scrollRef.removeEventListener("scroll", handleScroll);
      scrollToHelper();
      scrollRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollRef) {
        scrollRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [currentReservation, scrollRef, helperRectangleRef]);

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
              ? " w-[50px] md:w-[60px] h-full  min-h-[40px] md:min-h-[60px] bg-white col-start-1 z-10  "
              : ` w-[50px] md:w-[60px] h-full min-h-[40px] md:min-h-[60px] flex flex-col items-end  bg-white col-start-1 z-20 ${
                  isHorizontal ? "" : "sticky left-0"
                } `
          }
        >
          {isBackground ? (
            <span className="absolute  bg-gray-100  w-full h-[1px] bg-translate-y-[0px]" />
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
