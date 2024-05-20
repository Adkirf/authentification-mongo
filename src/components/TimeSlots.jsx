import React, { useState, useRef, useEffect, useContext } from "react";

import { DayContext } from "@/sections/DayGrid";
import { ErrorSharp } from "@mui/icons-material";
import { DashboardContext } from "@/pages/dashboard";

const TimeSlots = ({
  isBackground,
  isHorizontal,
  mainSlots,
  setMainSlots,
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

  const handleScroll = () => {
    if (timeSlotRef.current && helperRectangleRef && scrollRef) {
      const timeSlotRect = timeSlotRef.current.getBoundingClientRect();
      if (isHorizontal) {
        if (scrollRef.scrollLeft < timeSlotRect.width) {
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

      if (scrollRef.scrollTop < timeSlotRect.height) {
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
  useEffect(() => {
    console.log("new");
    console.log(currentReservation);
    if (!isBackground && scrollRef) {
      handleScroll();
      scrollRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollRef) {
        scrollRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [
    currentReservation,
    currentTimeSlotIndex,
    indexSpan,
    scrollRef,
    helperRectangleRef,
  ]);

  const scrollToHelper = () => {
    if (timeSlotRef.current && helperRectangleRef) {
      scrollRef.style.scrollBehavior = "smooth";
      scrollRef.removeEventListener("scroll", handleScroll);
      if (isHorizontal) {
        let scrollTarget =
          timeSlotRef.current.getBoundingClientRect().left -
          helperRectangleRef +
          timeSlotRef.current.getBoundingClientRect().width;

        scrollRef.scrollLeft += scrollTarget;
      } else {
        let scrollTarget =
          timeSlotRef.current.getBoundingClientRect().top - helperRectangleRef;

        if (currentTimeSlotIndex === 0) {
          scrollTarget = 0;
        }

        scrollRef.scrollTop = scrollTarget;
      }
      setTimeout(() => {
        scrollRef.addEventListener("scroll", handleScroll);
      }, 1500);
    }
  };

  useEffect(() => {
    if (scrollRef && helperRectangleRef) {
      scrollToHelper();
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
