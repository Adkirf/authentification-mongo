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

const openingHours = {
  open: "08:00",
  close: "23:00",
};

export const DayContext = createContext();

const DayGrid = () => {
  const {
    tables,
    currentDate,
    fSetCurrentDate,
    currentReservation,
    fSetCurrentReservation,
    currentReservations,
    fSetDateLevel,
  } = useContext(DashboardContext);

  const [reservations, setReservations] = useState([]);
  const [possibleReservations, setPossibleReservations] = useState([]);
  const [indexSpan, setIndexSpan] = useState(1);
  const scrollRef = useRef(null);
  const helperRectangleRef = useRef(null);

  /* pixels 
60
100
80
180
60 
80
180 */

  useEffect(() => {
    setReservations(getReservationSlots());
  }, [currentDate, currentReservations, currentReservation]);

  const getTableSlots = () => {
    let slots = [];

    for (let index = 0; index < tables.length; index++) {
      let table = tables[index];
      slots.push({
        ...table,
      });
    }

    return slots;
  };

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

  const getReservationSlots = () => {
    const today = currentDate.toISOString().slice(0, 10); // Ensure currentDate is treated as UTC

    const reservationSlots = [];

    currentReservations.forEach((reservation) => {
      const reservationDate = reservation.start.toISOString().split("T")[0];

      if (reservationDate !== today) {
        return;
      }

      const openTime = new Date(`${today}T${openingHours.open}`);
      const startTime = reservation.start;
      const endTime = reservation.end;

      const startDiff = (startTime - openTime) / (1000 * 60);
      const endDiff = (endTime - openTime) / (1000 * 60);

      const startSlot = Math.round(startDiff / 30);
      const endSlot = Math.round(endDiff / 30);

      let overlapCount = 0;
      reservationSlots.forEach((existingSlot) => {
        const overlap = !(
          endSlot < existingSlot.start || startSlot > existingSlot.end
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

  const fSetPossibleReservations = (newPossibleReservations) => {
    const filtered = newPossibleReservations.filter(
      (reservation) => reservation
    );
    setPossibleReservations(filtered);
  };

  const fSetIndexSpan = (duration) => {
    let newIndexSpan = 0;
    for (let i = 0; i < duration; i += 0.5) {
      newIndexSpan++;
    }
    setIndexSpan(newIndexSpan);
  };

  const handleReservationSlotClick = (reservation) => {
    const timeSlots = getTimeSlots();
    const startTime = timeSlots[reservation.startSlot];
    const endTime = timeSlots[reservation.endSlot];

    const today = currentDate.toISOString().slice(0, 10);

    const start = new Date(`${today}T${startTime}`);
    const end = new Date(`${today}T${endTime}`);
    reservation = {
      ...reservation,
      start: start,
      end: end,
    };

    fSetCurrentReservation(reservation);
  };

  const dayValue = {
    scrollRef,
    helperRectangleRef,
    getTimeSlots,
    getReservationSlots,
    fSetPossibleReservations,
    getTableSlots,
    indexSpan,
    fSetIndexSpan,
  };

  return (
    <DayContext.Provider value={dayValue}>
      <div
        ref={scrollRef}
        className={`grid overflow-scroll relative top-0 z-10 pb-[50vh] `}
        style={{ overflowAnchor: "none" }}
      >
        <div
          ref={helperRectangleRef}
          className=" w-[35px] h-[20px] md:w-[100px] md:h-[80px] flex items-center bg-white z-30 row-start-1 col-start-1 sticky top-0 left-0"
        >
          <DurationPicker
            indexSpan={indexSpan}
            onSelect={fSetIndexSpan}
            isDropDown={true}
          />
        </div>

        {getTableSlots().map((table, index) => (
          <div
            key={index}
            style={{
              gridColumn: `${table.tableNumber + 2}/${table.tableNumber + 3}`,
            }}
            className={`row-start-1  bg-white w-[180px] py-2 px-2 sticky z-20 top-0 flex flex-col justify-center`}
          >
            <div className="flex justify-center">
              <span className="flex w-1/3" />
              <span className="flex w-1/3  font-base justify-center">
                {" "}
                Table{" "}
              </span>
              <span className="flex w-1/3 text-sm font-thin"> /Seats</span>
            </div>
            <div className="flex justify-center">
              <span className="flex w-1/3" />
              <span className="flex w-1/3 text-2xl font-bold justify-center">
                {" "}
                {table.tableNumber}{" "}
              </span>
              <span className="flex w-1/3 text-sm font-thin">
                {" "}
                /{table.seats}
              </span>
            </div>

            <span className="absolute z-30 bottom-0 left-0 w-[1px] bg-gray-100 h-[25px] " />
          </div>
        ))}
        <TimeSlots isBackground={false} />

        {[...reservations, ...possibleReservations].map(
          (reservation, index) => (
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
          )
        )}
        <div className="grid absolute top-0  z-0 ">
          <span className="w-[35px] h-[20px] md:w-[100px] md:h-[80px] bg-white z-20 row-start-1 col-start-1 sticky left-0" />

          {getTableSlots().map((table, index) => (
            <div
              key={index}
              style={{
                gridColumn: `${table.tableNumber + 2}/${table.tableNumber + 3}`,
              }}
              className={` row-start-1 col-span-1  bg-white w-[180px]  sticky -left-60 z-10 top-0 flex justify-start`}
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
    </DayContext.Provider>
  );
};

export default DayGrid;
