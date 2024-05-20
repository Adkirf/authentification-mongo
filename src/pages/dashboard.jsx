import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import CalendarGrid from "@/sections/CalendarGrid";
import MenuBar from "@/sections/MenuBar";
import SideBar from "@/sections/Sidebar";
import DayGrid from "@/sections/DayGrid";
import ReservationGrid from "@/sections/ReservationGrid";
import AlertList from "@/sections/AlertList";
import ReservationCard from "../components/ReservationCard";
import TableGrid from "@/sections/TableGrid";

import {
  getReservations,
  getTables,
  makeReservation,
  deleteReservation,
  changeReservation,
  logAlert,
} from "../utils/utils.js";

export const DashboardContext = createContext();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const openingHours = {
  open: "08:00",
  close: "23:00",
};

const App = () => {
  const { data: session } = useSession();

  const [tables, setTables] = useState(session.data.tables);
  const [currentReservations, setCurrentReservations] = useState(
    session.data.reservations
  );

  const [currentReservation, setCurrentReservation] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateLevel, setDateLevel] = useState("month"); // month, tables day, time
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMakeReservationOpen, setIsMakeReservationOpen] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const [indexSpan, setIndexSpan] = useState(2);
  const [currentTimeSlotIndex, setCurrentTimeSlotIndex] = useState(0);

  const getCurrentComponent = () => {
    switch (dateLevel) {
      case "month":
        return <CalendarGrid />;
      case "day":
        return <DayGrid />;
      case "time":
        return <ReservationGrid />;
      case "tables":
        return <TableGrid />;
    }
  };

  useEffect(() => {
    fSetCurrentReservations(session.data.reservations);
    fSetTables(session.data.tables);
    fSetCurrentDate(new Date());
  }, [session]);

  //Former Day context

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
  const fSetIndexSpan = (duration, index) => {
    let newIndexSpan = 0;
    if (duration && !index) {
      for (let i = 0; i < duration; i += 0.5) {
        newIndexSpan++;
      }
    }
    if (!duration && index) {
      newIndexSpan = index;
    }
    setIndexSpan(newIndexSpan);
  };

  const fSetCurrentTimeSlotIndex = (newTimeSlotIndex, increase, decrease) => {
    if (increase) {
      setCurrentTimeSlotIndex((prevIndex) => {
        const newIndex = Math.min(prevIndex + 1, getTimeSlots().length - 1);

        return newIndex;
      });
      return;
    }

    if (decrease) {
      setCurrentTimeSlotIndex((prevIndex) => {
        const newIndex = Math.max(prevIndex - 1, 0);
        return newIndex;
      });
      return;
    }
    setCurrentTimeSlotIndex(newTimeSlotIndex);
  };

  const getIndexToTime = () => {
    const openHour = parseInt(openingHours.open.split(":")[0], 10);

    const totalMinutes = currentTimeSlotIndex * 30;
    const hours = Math.floor(totalMinutes / 60) + openHour;
    const minutes = totalMinutes % 60;

    const durationInTotalMinutes = indexSpan * 30;
    const durationInHours = Math.floor(durationInTotalMinutes / 60) + hours;
    const durationInMinutes = (durationInTotalMinutes % 60) + minutes;

    const currentStartDate = new Date(currentDate);
    currentStartDate.setHours(hours);
    currentStartDate.setMinutes(minutes);

    const currentEndDate = new Date(currentStartDate);
    currentEndDate.setHours(durationInHours);
    currentEndDate.setMinutes(durationInMinutes);

    return { start: currentStartDate, end: currentEndDate };
  };

  const setTimeToIndex = (start) => {
    if (currentReservation) {
      start = currentReservation.start;
    }
    const openHour = parseInt(openingHours.open.split(":")[0], 10);
    const openMinute = parseInt(openingHours.open.split(":")[1], 10);

    const openTimeInMinutes = openHour * 60 + openMinute;
    const currentTimeInMinutes = start.getHours() * 60 + start.getMinutes();

    const totalMinutesElapsed = currentTimeInMinutes - openTimeInMinutes;
    const index = Math.floor(totalMinutesElapsed / 30);
    console.log(index);
    setCurrentTimeSlotIndex(index ? index : 0);
  };

  //Former Dashbaord context

  const fSetTables = async (newTables) => {
    //When Fetching Data convert date objects
    // tables NEVER NULL!!!!

    if (!newTables || newTables.length === 0) {
      newTables = [];
      addAlert("error", "null tables loaded");
    }
    newTables.forEach((table) => {
      table.reservations.forEach((reservation) => {
        reservation.start = new Date(reservation.start);
        reservation.end = new Date(reservation.end);
      });
    });

    const ordered = newTables.sort((a, b) => {
      if (a.tableNumber > b.tableNumber) {
        return 1;
      } else if (a.tableNumber < b.tableNumber) {
        return -1;
      } else {
        addAlert("error", "two tables with same tableNumber found");
        return 0;
      }
    });

    setTables(ordered);
  };

  const fSetCurrentReservations = (reservations) => {
    //When Fetching Data convert date objects
    // Reservations NEVER NULL!!!!
    if (!reservations) {
      reservations = [];
      addAlert("error", "null reservation loaded");
    }

    reservations.forEach((reservation) => {
      reservation.start = new Date(reservation.start);
      reservation.end = new Date(reservation.end);
    });
    const ordered = reservations.sort((a, b) => {
      if (a.start < b.start) {
        return -1;
      } else if (a.start > b.start) {
        return 1;
      } else {
        return 0;
      }
    });
    fSetCurrentReservation(ordered[0]);
    setCurrentReservations(ordered);
  };

  const fSetCurrentReservation = async (reservation) => {
    setCurrentReservation(reservation);
    if (reservation) {
      setCurrentDate(reservation.start);
    }
  };

  const fSetCurrentDate = async (newDate) => {
    if (!newDate) {
      newDate = new Date();
    }
    try {
      let tempReservations = currentReservations;

      if (newDate.getTime() === currentDate.getTime()) {
        return;
      }
      if (newDate.getMonth() !== currentDate.getMonth()) {
        addAlert(
          "info",
          `loading reservations of ${months[newDate.getMonth()]}`
        );
        tempReservations = (await getReservations(newDate.getMonth())).data;
        addAlert(
          "info",
          `${tempReservations.length} reservations in ${
            months[newDate.getMonth()]
          }`
        );
        fSetCurrentReservations(tempReservations);
      }
    } catch (e) {
      addAlert("warning", "no reservations this month");
      console.log(e);
    }

    setCurrentDate(newDate);
  };

  const fSetNextOrPrevDate = async (isNext, newDate) => {
    try {
      if (newDate.getMonth() !== currentDate.getMonth()) {
        let tempReservations = (await getReservations(newDate.getMonth())).data;
        fSetCurrentReservations(tempReservations);

        if (tempReservations.length) {
          fSetCurrentReservation(
            isNext
              ? tempReservations[0]
              : tempReservations[tempReservations.length - 1]
          );
          return;
        }
        setCurrentDate(newDate);
      }
      if (newDate.getMonth() === currentDate.getMonth()) {
        fSetCurrentReservation(currentReservations[0]);
        if (!currentReservations[0].length) {
          setCurrentDate(newDate);
        }
        return;
      }
    } catch (e) {
      addAlert("warning", "no reservations this month");
      console.log(e);
    }
  };

  const fSetDateLevel = (dateLevel) => {
    setDateLevel(dateLevel);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleReservationCard = () => {
    setIsMakeReservationOpen((prev) => !prev);
  };

  const updateReservation = async (reservation, newReservation) => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    //delete reservation
    try {
      if (!newReservation && reservation._id) {
        console.log(`delete Reservation: ${reservation}`);
        addAlert("info", "deleting resevation", reservation);
        const [response] = await Promise.all([
          deleteReservation(reservation),
          sleep(3000),
        ]);
        await fSetCurrentDate(new Date(reservation.start));
        await setCurrentReservations((currentReservations) =>
          currentReservations.filter(
            (currentReservation) => currentReservation._id != response.data._id
          )
        );
        if (currentReservation && currentReservation._id == reservation._id) {
          fSetCurrentReservation();
        }
        addAlert(response.severity, response.message, response.data);
        return;
      }
    } catch (e) {
      console.log(e);
      addAlert(e.severity, e.message, reservation);
      throw e;
    }

    //make reservation
    try {
      if (!reservation && newReservation) {
        console.log(
          `making new Reservation: ${JSON.stringify(newReservation)}`
        );
        addAlert("info", "making new resevation", {
          _id: 1,
          name: newReservation.name,
        });
        const response = await makeReservation(newReservation);
        const resReservation = response.data;
        resReservation.start = new Date(resReservation.start);
        resReservation.end = new Date(resReservation.end);
        await sleep(3000);
        if (isMakeReservationOpen) {
          toggleReservationCard();
        }
        await fSetCurrentReservations([...currentReservations, resReservation]);
        fSetCurrentReservation(resReservation);

        addAlert(response.severity, response.message, {
          _id: 1,
          name: newReservation.name,
        });
        return;
      }
    } catch (e) {
      console.log(e);
      if (isMakeReservationOpen) {
        toggleReservationCard();
      }

      if (e.severity === "warning") {
        if (e.data) {
          await fSetCurrentReservations(e.data);
        }

        const updated = {
          ...newReservation,
          status: "warning",
          errorMessage: e.message + ". Do you want to make it make anyway?",
        };

        await fSetCurrentReservation(updated);
        addAlert(e.severity, e.message, { _id: 1, name: newReservation.name });
        return;
      }
      if (e.severity === "error") {
        const updated = {
          ...newReservation,
          status: "error",
          errorMessage: e.message,
        };

        await fSetCurrentReservation(updated);
        addAlert(e.severity, e.message, newReservation);
        return;
      } else {
        addAlert("error", "unexpected error", { _id: 1 });
        throw e;
      }
    }

    //change reservation
    try {
      if (reservation._id && newReservation) {
        console.log(`changing Reservation: ${JSON.stringify(newReservation)}`);
        addAlert("info", "changing resevation", reservation);
        const response = await changeReservation(
          reservation._id,
          newReservation
        );
        const updatedReservations = currentReservations.map(
          (currentReservation) => {
            if (currentReservation._id == response.data._id) {
              return { ...response.data };
            }
            return currentReservation;
          }
        );
        console.log(updatedReservations);
        const resReservation = response.data;
        resReservation.start = new Date(resReservation.start);
        resReservation.end = new Date(resReservation.end);
        await sleep(3000);
        await fSetCurrentReservations([...updatedReservations]);
        await fSetCurrentReservation(resReservation);
        addAlert(response.severity, response.message, newReservation);
        return;
      }
    } catch (e) {
      console.log(e);

      if (e.severity === "warning") {
        const updated = {
          ...newReservation,
          id_: reservation._id,
          status: "warning",
          errorMessage: e.message + ". Do you want to make it make anyway?",
        };
        if (e.data) {
          await fSetCurrentReservations(e.data);
        }
        await fSetCurrentReservation(updated);
        addAlert(e.severity, e.message, reservation);
        return;
      }
      if (e.severity === "error") {
        const updated = {
          ...newReservation,
          id_: reservation._id,
          status: "error",
          errorMessage: e.message,
        };

        await fSetCurrentReservation(updated);
        addAlert(e.severity, e.message, newReservation);
      } else {
        addAlert("error", "unexpected error");
        throw e;
      }
    }
  };

  const addAlert = (severity, message, reservation) => {
    if (severity != "success" && severity != "info")
      logAlert(
        { severity, message, reservation },
        reservation ? reservation.name : "UI problem"
      );
    if (reservation) {
      setAlerts((prevAlerts) => [
        ...prevAlerts.filter((prevAlert) => prevAlert.id != reservation._id),
        { severity, message, id: reservation._id },
      ]);
      return;
    }
    setAlerts((prevAlerts) => [
      ...prevAlerts.filter((prevAlert) => prevAlert.id !== 0),
      { severity, message, id: 0 },
    ]);
  };

  const removeAlert = (alertId) => {
    setAlerts((currentAlerts) =>
      currentAlerts.filter((alert) => alert.id !== alertId)
    );
  };

  const contextValue = {
    tables,
    fSetTables,
    currentReservations,
    fSetCurrentReservations,
    currentReservation,
    fSetCurrentReservation,
    currentDate,
    fSetCurrentDate,
    fSetNextOrPrevDate,
    dateLevel,
    fSetDateLevel,
    isSidebarOpen,
    toggleSidebar,
    isMakeReservationOpen,
    toggleReservationCard,
    updateReservation,
    alerts,
    addAlert,
    removeAlert,
    indexSpan,
    currentTimeSlotIndex,
    getTimeSlots,
    fSetIndexSpan,
    fSetCurrentTimeSlotIndex,
    getIndexToTime,
    setTimeToIndex,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="relative flex flex-row h-screen w-screen">
        <div
          className={`absolute z-30 bg-white left-0 bottom-0 h-[100vh] w-[65%] md:static md:min-w-[20%] md:w-[20%] transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <SideBar />
        </div>
        <div className="flex flex-col justify-start md:justify-end overflow-clip w-full">
          <div className="flex flex-col h-[90vh] py-8 px-2 justify-center">
            {getCurrentComponent()}
          </div>
          <div className="fixed h-[10vh] w-full md:w-[80%] flex flex-row z-[1000] bottom-0 md:top-0">
            <MenuBar />
          </div>
        </div>
      </div>
      {isMakeReservationOpen && <ReservationCard />}

      <AlertList />
    </DashboardContext.Provider>
  );
};

App.auth = true;

export default App;
