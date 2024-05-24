import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  createContext,
} from "react";
import ReservationCard from "@/components/ReservationCard";
import TimeSlots from "@/components/TimeSlots";
import { DashboardContext } from "@/pages/dashboard";
import { DurationPicker } from "@/components/Picker";

export const DayContext = createContext();

const openingHours = {
  open: "08:00",
  close: "23:00",
};

const DayGrid = () => {
  const {
    tables,
    currentDate,
    fSetCurrentDate,
    currentReservation,
    fSetCurrentReservation,
    currentReservations,
    fSetDateLevel,
    indexSpan,
    currentTimeSlotIndex,
    getTimeSlots,
    fSetIndexSpan,
    fSetCurrentTimeSlotIndex,
  } = useContext(DashboardContext);

  const [reservations, setReservations] = useState([]);
  const [possibleReservations, setPossibleReservations] = useState([]);

  const scrollRef = useRef(null);
  const helperRectangleRef = useRef(null);
  const tableScrollRef = useRef(null);
  const [scrollRefState, setScrollRefState] = useState(null);
  const [helperRectangleRefState, setHelperRectangleRefState] = useState(null);

  useEffect(() => {
    if (scrollRef) {
      setScrollRefState(scrollRef);
    }
    if (helperRectangleRef) {
      setHelperRectangleRefState(helperRectangleRef);
    }

    let timeoutId;

    if (
      scrollRef &&
      helperRectangleRef &&
      currentReservation &&
      tableScrollRef.current
    ) {
      scrollRef.current.style.scrollBehavior = "smooth";
      /* timeoutId = setTimeout(() => {
        const scrollTarget =
          tableScrollRef.current.getBoundingClientRect().left -
          tableScrollRef.current.getBoundingClientRect().width;

        scrollRef.current.scrollLeft = scrollTarget;
      }, 1500); */
    }

    // Cleanup function to clear the timeout
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [scrollRef, helperRectangleRef, tableScrollRef]);

  useEffect(() => {
    fSetPossibleReservations();
  }, [
    currentTimeSlotIndex,
    indexSpan,
    currentDate,
    currentReservations,
    currentReservation,
  ]);

  const getReservationSlots = () => {
    const openHour = parseInt(openingHours.open.split(":")[0], 10);

    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);

    const reservationSlots = [];
    currentReservations.forEach((reservation) => {
      const reservationDay = new Date(reservation.start);
      reservationDay.setHours(0, 0, 0, 0);

      // If the reservation is not for today, skip it
      if (reservationDay.getTime() !== today.getTime()) {
        return;
      }

      const openTime = new Date(today);
      openTime.setHours(openHour, 0, 0, 0);

      const startTime = reservation.start;
      const endTime = reservation.end;

      const startDiff = (startTime - openTime) / (1000 * 60);
      const endDiff = (endTime - openTime) / (1000 * 60);

      const startSlot = Math.round(startDiff / 30);
      const endSlot = Math.round(endDiff / 30);

      let overlapCount = 0;
      reservationSlots.forEach((existingSlot) => {
        const overlap = !(
          endSlot < existingSlot.startSlot || startSlot > existingSlot.endSlot
        );
        if (overlap) {
          overlapCount += 1;
        }
      });

      reservationSlots.push({
        ...reservation,
        startSlot: startSlot,
        endSlot: endSlot,
      });
    });

    return reservationSlots;
  };

  const fSetPossibleReservations = () => {
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
    let possibleReservations = tables.map((table) => {
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
      return result.filter((res) => res.endSlot - res.startSlot == indexSpan);
    });

    possibleReservations = possibleReservations.flat();

    const filtered = possibleReservations.filter((reservation) => reservation);
    setReservations(reservations);
    setPossibleReservations(filtered);
  };

  const handleReservationSlotClick = (reservation) => {
    const timeSlots = getTimeSlots();
    const [startHour, startMinute] = timeSlots[reservation.startSlot]
      .split(":")
      .map(Number);
    const [endHour, endMinute] = timeSlots[reservation.endSlot]
      .split(":")
      .map(Number);

    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);

    const start = new Date(today);
    start.setHours(startHour, startMinute, 0, 0);

    const end = new Date(today);
    end.setHours(endHour, endMinute, 0, 0);

    reservation = {
      ...reservation,
      start: start,
      end: end,
      startSlot: null,
      endSlot: null,
    };

    // fSetCurrentTimeSlotIndex(reservation.startSlot);

    fSetCurrentReservation(reservation);
  };

  return (
    <div
      ref={scrollRef}
      className={`scroll-smooth grid grid-cols-[50px] md:grid-cols-[60px]  overflow-auto relative top-0 z-10 pb-[50vh] `}
      style={{ overflowAnchor: "none" }}
    >
      <div
        ref={helperRectangleRef}
        className="w-[100px] h-[80px]flex items-center bg-white z-30 row-start-1 col-start-1 sticky top-0 left-0"
      >
        <DurationPicker
          indexSpan={indexSpan}
          onSelect={fSetIndexSpan}
          isDropDown={true}
        />
      </div>

      {tables &&
        tables.map((table, index) => (
          <div
            ref={
              currentReservation
                ? currentReservation.tableNumber == table.tableNumber
                  ? tableScrollRef
                  : null
                : null
            }
            key={index}
            style={{
              gridColumn: `${table.tableNumber + 2}/${table.tableNumber + 3}`,
            }}
            className={`row-start-1  bg-white w-full md:w-[180px] py-2 px-2 sticky z-20 top-0 flex flex-col justify-center`}
          >
            <div className="flex justify-center">
              {/* <span className="flex w-1/3" /> */}
              <span className="flex w-1/3  font-base justify-center">
                {" "}
                Table{" "}
              </span>
              {/* <span className="flex w-1/3 text-sm font-thin"> /Seats</span> */}
            </div>
            <div className="flex justify-center">
              {/* <span className="flex w-1/3" /> */}
              <span className="flex w-1/3 text-2xl font-bold justify-center">
                {" "}
                {table.tableNumber}{" "}
              </span>
              {/*  <span className="flex w-1/3 text-sm font-thin">
                {" "}
                /{table.seats}
              </span> */}
            </div>

            <span className="absolute z-30 bottom-0 left-0 w-[1px] bg-gray-100 h-[25px] " />
          </div>
        ))}

      <TimeSlots
        isBackground={false}
        mainSlots={possibleReservations}
        setMainSlots={fSetPossibleReservations}
        scrollRef={scrollRefState ? scrollRefState.current : null}
        helperRectangleRef={
          helperRectangleRefState
            ? helperRectangleRefState.current.getBoundingClientRect().bottom +
              60
            : null
        }
      />

      {[...reservations, ...possibleReservations].map((reservation, index) => (
        <div
          style={{
            gridRow: `${reservation.startSlot + 2} / ${
              reservation.endSlot + 2
            }`,
            gridColumn: `${reservation.tableNumber + 2}/${
              reservation.tableNumber + 3
            }`,
          }}
          key={index}
          className="row-span-1 relative z-10  p-2 flex flex-col"
          onClick={() => {
            handleReservationSlotClick(reservation);
          }}
        >
          <ReservationCard reservation={reservation} />
        </div>
      ))}
      <div className="grid absolute top-0  z-0 ">
        <span className="w-[50px] md:w-[60px] h-[80px] bg-white z-20 row-start-1 col-start-1 sticky left-0" />

        {tables &&
          tables.map((table, index) => (
            <div
              key={index}
              style={{
                gridColumn: `${table.tableNumber + 2}/${table.tableNumber + 3}`,
              }}
              className={` row-start-1 col-span-1  bg-white w-full md:w-[180px]  sticky -left-60 z-10 top-0 flex justify-start`}
            >
              <span className="absolute h-[200vh] w-[1px] bg-gray-100" />
            </div>
          ))}

        <TimeSlots isBackground={true} />
        {[...reservations, ...possibleReservations].map(
          (reservation, index) => (
            <div
              onClick={() => {}}
              style={{
                gridRow: `${reservation.startSlot + 2} / ${
                  reservation.endSlot + 2
                }`,
                gridColumn: `${reservation.tableNumber + 2}/${
                  reservation.tableNumber + 3
                }`,
              }}
              key={index}
              className="row-span-1 invisible flex relative z-10  p-2 flex-col hover:shadow-lg hover:bg-red-100"
            >
              <ReservationCard reservation={reservation} />
            </div>
          )
        )}
      </div>
    </div>
  );
};
export default DayGrid;
