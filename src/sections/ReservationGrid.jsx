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
    getTimeToIndex,
  } = useContext(DashboardContext);

  const scrollRef = useRef(null);
  const helperRectangleRef = useRef(null);
  const [scrollRefState, setScrollRefState] = useState(null);
  const [helperRectangleRefState, setHelperRectangleRefState] = useState(null);

  const [reservationRef, setReservationRef] = useState(null);
  const reservationsScrollRef = useRef(null);

  const [intersectingReservations, setIntersectingReservations] = useState([]);

  useEffect(() => {
    if (reservationRef?.current && reservationsScrollRef?.current) {
      reservationsScrollRef.current.style.scrollBehavior = "smooth";

      const scrollToCenter = () => {
        // Always get the latest bounding rectangles
        const targetRect = reservationRef.current.getBoundingClientRect();
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
  }, [reservationRef, reservationsScrollRef, intersectingReservations]);

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

  useEffect(() => {
    fSetIntersectingReservations();
  }, [currentReservation, currentTimeSlotIndex, currentReservations]);

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
      return (
        <div
          ref={reservationsScrollRef}
          className="flex overflow-x-scroll scroll-smooth overflow-y-clip w-full h-full p-[20px] hide-scrollbar"
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

  const fSetIntersectingReservations = async () => {
    const date = getIndexToTime();

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
        className="scroll-smooth flex flex-row gap-[15px] overflow-x-scroll overflow-y-hidden w-full hide-scrollbar "
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
