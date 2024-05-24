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

const TableGrid = () => {
  const {
    tables,
    currentDate,
    fSetCurrentDate,
    currentReservation,
    fSetCurrentReservation,
    currentReservations,
    toggleReservationCard,
    fSetDateLevel,
    indexSpan,
    currentTimeSlotIndex,
    getTimeSlots,
    fSetIndexSpan,
    fSetCurrentTimeSlotIndex,
    getIndexToTime,
  } = useContext(DashboardContext);

  const [tableSeats, setTableSeats] = useState([]);
  const [tableSlots, setTableSlots] = useState([]);
  const [possibleTables, setPossibleTables] = useState([]);

  const scrollRef = useRef(null);
  const helperRectangleRef = useRef(null);
  const [scrollRefState, setScrollRefState] = useState(null);
  const [helperRectangleRefState, setHelperRectangleRefState] = useState(null);

  useEffect(() => {
    console.log("innitng tables");
    const initTableSeats = [];
    tables.map((table) => {
      if (initTableSeats.includes(table.seats)) {
        return;
      }
      initTableSeats.push(table.seats);
    });

    const rowHelper = [];

    const initTableSlots = tables.map((table) => {
      rowHelper.push(table);
      const rowIndex = rowHelper.filter(
        (tableHelper) => tableHelper.seats == table.seats
      ).length;
      return {
        ...table,
        col: initTableSeats.indexOf(table.seats) + 1,
        row: rowIndex + 1,
      };
    });

    console.log(initTableSeats);

    setTableSeats(initTableSeats);
    setTableSlots(initTableSlots);
    fSetPossibleTables(initTableSlots);
  }, []);

  useEffect(() => {
    const initTableSeats = [];
    tables.map((table) => {
      if (initTableSeats.includes(table.seats)) {
        return;
      }
      initTableSeats.push(table.seats);
    });

    const rowHelper = [];

    const initTableSlots = tables.map((table) => {
      rowHelper.push(table);
      const rowIndex = rowHelper.filter(
        (tableHelper) => tableHelper.seats == table.seats
      ).length;
      return {
        ...table,
        col: initTableSeats.indexOf(table.seats) + 1,
        row: rowIndex + 1,
      };
    });

    setTableSeats(initTableSeats);
    setTableSlots(initTableSlots);
    fSetPossibleTables(initTableSlots);
  }, [currentDate, currentReservations, currentReservation]);

  useEffect(() => {
    if (scrollRef) {
      setScrollRefState(scrollRef);
    }
    if (helperRectangleRef) {
      setHelperRectangleRefState(helperRectangleRef);
    }
  }, [scrollRef, helperRectangleRef]);

  useEffect(() => {
    if (!tableSlots.length) {
      return;
    }
    fSetPossibleTables();
  }, [currentTimeSlotIndex, indexSpan]);

  const getTableSlots = () => {
    return tableSlots.map((table, index) => (
      <div
        onClick={() => {
          handleTableSlotClick(table);
        }}
        key={index}
        style={{ gridColumnStart: table.col, gridRowStart: table.row }}
        className={`p-4  bg-${
          possibleTables.includes(table) ? "blue-300" : "gray-100"
        } 
        col-span-1 text-center md:text-xl border rounded shadow md:hover:bg-blue-100`}
      >
        {table.tableNumber}
      </div>
    ));
  };

  const fSetPossibleTables = (newTableSlots) => {
    if (!newTableSlots) {
      newTableSlots = tableSlots;
    }
    if (currentReservations.length === 0) {
      setPossibleTables(newTableSlots);
      return;
    }

    const date = getIndexToTime();

    let availableTables = [];

    newTableSlots.forEach((table) => {
      const isIntersecting = table.reservations.some((tableReservation) => {
        if (
          tableReservation.start.getMonth() !== date.start.getMonth() ||
          tableReservation.start.getDate() !== date.start.getDate()
        ) {
          return false;
        }

        const tableReservationStart = tableReservation.start.getTime();
        const tableReservationEnd = tableReservation.end.getTime();
        const currentStart = date.start.getTime();
        const currentEnd = date.end.getTime();

        return (
          currentStart < tableReservationEnd &&
          currentEnd > tableReservationStart
        );
      });

      if (!isIntersecting) {
        availableTables.push(table);
      }
    });
    console.log(availableTables);
    setPossibleTables(availableTables);
  };

  useEffect(() => {
    console.log("possible tables");
    console.log(possibleTables);
  }, [possibleTables]);

  const handleTableSlotClick = (table) => {
    const date = getIndexToTime();
    if (possibleTables.includes(table)) {
      const reservation = {
        tableNumber: table.tableNumber,
        peopleCount: table.seats,
        start: date.start,
        end: date.end,
        status: "unchecked",
      };
      fSetCurrentReservation(reservation);
      toggleReservationCard();
      return;
    }
    const intersectingSubReservation = table.reservations.find(
      (reservation) => {
        const tableReservationStart = reservation.start.getTime();
        const tableReservationEnd = reservation.end.getTime();
        const currentStart = date.start.getTime();
        const currentEnd = date.end.getTime();

        return (
          currentStart < tableReservationEnd &&
          currentEnd > tableReservationStart
        );
      }
    );
    const intersectingReservation = currentReservations.find(
      (reservation) => reservation._id == intersectingSubReservation._id
    );

    fSetCurrentReservation(intersectingReservation);
    fSetDateLevel("day");
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-shrink justify-center h-[15vh]">
        <div className="flex flex-col gap-2">
          <div className="flex flex-shrink gap-2">
            <div
              className={`p-4 text-center md:text-xl border rounded shadow bg-blue-300`}
            ></div>
            <div className="flex items-center">Available Table</div>
          </div>
          <div className="flex flex-shrink gap-2">
            <div
              className={`p-4 text-center md:text-xl border rounded shadow bg-gray-100`}
            ></div>
            <div className="flex items-center">Not Available</div>
          </div>
        </div>
      </div>
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-[80px]">
          <div className="z-[21] w-full">
            <DurationPicker
              indexSpan={indexSpan}
              onSelect={fSetIndexSpan}
              isDropDown={true}
            />
          </div>
          <div
            ref={scrollRef}
            className="scroll-smooth h-[400px] flex items-center flex-col flex-shrink hide-scrollbar overflow-y-scroll"
          >
            <span className="block min-h-[200px]" />
            <TimeSlots
              mainSlots={possibleTables}
              scrollRef={scrollRefState ? scrollRefState.current : null}
              helperRectangleRef={
                helperRectangleRefState
                  ? helperRectangleRefState.current.getBoundingClientRect().top
                  : null
              }
            />
            <span className="block min-h-[200px]" />
          </div>
        </div>
        <div className="flex flex-grow overflow-x-scroll">
          <div className="grid auto-rows-min md:auto-rows-max md:w-full gap-1">
            {tableSeats &&
              tableSeats.map((seatsNumber, index) => (
                <div
                  key={seatsNumber}
                  className={` row-start-1  p-2 text-center border-b-2`}
                >
                  Seats <br />
                  {seatsNumber}
                </div>
              ))}
            {getTableSlots()}
          </div>
        </div>
        <div
          ref={helperRectangleRef}
          className="h-[80px] fixed bottom-1/2 z-50 translate-y-1/2"
        />
      </div>
    </div>
  );
};

export default TableGrid;
