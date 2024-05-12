import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import CalendarGrid from "@/sections/CalendarGrid";
import MenuBar from "@/sections/MenuBar";
import SideBar from "@/sections/Sidebar";
import DayGrid from "@/sections/DayGrid";
import ReservationGrid from "@/sections/ReservationGrid";
import AlertList from "@/sections/AlertList";
import ReservationCard from "../components/ReservationCard";

import {
  getReservations,
  makeReservation,
  deleteReservation,
  changeReservation,
} from "../utils/utils.js";

export const DashboardContext = createContext();

const App = () => {
  const { data: session } = useSession();

  const [tables, setTables] = useState(session.data.tables);
  const [currentReservations, setCurrentReservations] = useState(
    session.data.reservations
  );

  const [currentReservation, setCurrentReservation] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateLevel, setDateLevel] = useState("month"); // month, day, time
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMakeReservationOpen, setIsMakeReservationOpen] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const getCurrentComponent = () => {
    switch (dateLevel) {
      case "month":
        return <CalendarGrid />;

      case "day":
        return <DayGrid />;

      case "time":
        return <ReservationGrid />;
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const tables = await getTables(new Date().getMonth());
        const reservations = await getReservations();
        fSetTables(tables);
        fSetCurrentReservations(reservations);
      } catch (e) {
        console.log("failed getching from cleint");
        console.log(e);
      }
    };

    init();

    fSetCurrentReservations(session.data.reservations);
    fSetTables(session.data.tables);
    fSetCurrentDate();
  }, [session]);

  const fSetTables = async (newTables) => {
    //When Fetching Data convert date objects
    // tables NEVER NULL!!!!

    if (!newTables || newTables.length === 0) {
      newTables = [];
      addAlert("error", "null tables loaded");
    }
    newTables.forEach((table) => {
      table.reservations.start = new Date(table.reservations.start);
      table.reservations.end = new Date(table.reservations.end);
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
    if (reservations.length === 0) {
      addAlert("warning", "no reservations this month");
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
        tempReservations = (await getReservations(newDate.getMonth())).data;
        fSetCurrentReservations(tempReservations);
      }
    } catch (e) {
      addAlert("warning", "no reservations this month");
      console.log(e);
    }

    setCurrentDate(newDate);
  };

  const fSetNextOrPrevDate = async (isNext, newDate) => {
    fSetCurrentReservation();
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
      }
    } catch (e) {
      addAlert("warning", "no reservations this month");
      console.log(e);
    }

    setCurrentDate(newDate);
    return;
  };

  const fSetDateLevel = (dateLevel) => {
    setDateLevel(dateLevel);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
        const response = await deleteReservation(reservation);
        await sleep(3000);
        await fSetCurrentDate(new Date(reservation.start));
        setCurrentReservations((currentReservations) =>
          currentReservations.filter(
            (currentReservation) => currentReservation._id != response.data._id
          )
        );
        if (currentReservation._id == reservation._id) {
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
        const response = await makeReservation(newReservation);
        const resReservation = response.data;
        resReservation.start = new Date(resReservation.start);
        resReservation.end = new Date(resReservation.end);
        await sleep(3000);
        if (isMakeReservationOpen) {
          toggleReservationCard();
        }
        fSetCurrentReservation(resReservation);
        fSetCurrentReservations([...currentReservations, resReservation]);

        addAlert(response.severity, response.message, newReservation);
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
        addAlert(e.severity, e.message, newReservation);
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
        addAlert("error", "unexpected error");
        throw e;
      }
    }

    //change reservation
    try {
      if (reservation._id && newReservation) {
        console.log(`changing Reservation: ${JSON.stringify(newReservation)}`);
        console.log(reservation._id);
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
        const resReservation = response.data;
        resReservation.start = new Date(resReservation.start);
        resReservation.end = new Date(resReservation.end);
        await sleep(3000);
        await fSetCurrentReservation(resReservation);
        fSetCurrentReservations([...updatedReservations]);
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
        addAlert(e.severity, e.message, newReservation);
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

  let lastId;
  const addAlert = (severity, message, reservation) => {
    if (reservation) {
      setAlerts((prevAlerts) => [
        ...prevAlerts.filter((prevAlert) => prevAlert.id != reservation._id),
        { severity, message, id: reservation._id },
      ]);
      return;
    }
    const id = new Date().getTime();
    if (id != lastId) {
      setAlerts((prevAlerts) => [...prevAlerts, { severity, message, id }]);
      lastId = id;
    }
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
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="relative flex flex-row h-screen w-screen">
        <div
          className={`absolute z-30 bg-white left-0 bottom-0 h-[100vh] w-[45%] md:static md:min-w-[20%] md:w-[20%] transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <SideBar />
        </div>
        <div className="flex flex-col justify-start md:justify-end overflow-auto w-full">
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
