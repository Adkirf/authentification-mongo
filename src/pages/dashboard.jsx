import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import CalendarGrid from "@/components/CalendarGrid";
import MenuBar from "@/components/MenuBar";
import SideBar from "@/components/Sidebar";
import DayGrid from "@/components/DayGrid";
import ReservationForm from "@/components/ReservationForm";
import AlertList from "@/components/AlertList";

export const DashboardContext = createContext();
const dumy = [
  [
    {
      email: "alex@example.com",
      name: "Alex",
      tableNumber: 1,
      peopleCount: 4,
      start: "2024-01-10T18:00:00.000+00:00",
      end: "2024-01-10T20:00:00.000+00:00",
      status: "confirmed",
    },
  ],
  [
    {
      email: "john@example.com",
      name: "John",
      tableNumber: 1,
      peopleCount: 2,
      start: "2024-02-14T18:00:00.000+00:00",
      end: "2024-02-14T20:00:00.000+00:00",
      status: "confirmed",
    },
    {
      email: "susan@example.com",
      name: "Susan",
      tableNumber: 2,
      peopleCount: 4,
      start: "2024-02-22T17:30:00.000+00:00",
      end: "2024-02-22T19:30:00.000+00:00",
      status: "confirmed",
    },
    {
      email: "mike@example.com",
      name: "Mike",
      tableNumber: 3,
      peopleCount: 6,
      start: "2024-02-29T20:00:00.000+00:00",
      end: "2024-02-29T22:00:00.000+00:00",
      status: "pending",
    },
  ],
  [
    {
      email: "alice@example.com",
      name: "Alice",
      tableNumber: 1,
      peopleCount: 3,
      start: "2024-03-10T19:00:00.000+00:00",
      end: "2024-03-10T21:00:00.000+00:00",
      status: "confirmed",
    },
    {
      email: "bob@example.com",
      name: "Bob",
      tableNumber: 2,
      peopleCount: 2,
      start: "2024-03-18T18:30:00.000+00:00",
      end: "2024-03-18T20:30:00.000+00:00",
      status: "confirmed",
    },
    {
      email: "emma@example.com",
      name: "Emma",
      tableNumber: 3,
      peopleCount: 5,
      start: "2024-03-25T20:00:00.000+00:00",
      end: "2024-03-25T22:00:00.000+00:00",
      status: "confirmed",
    },
  ],
  [
    {
      email: "peter@gmail.com",
      name: "Peter",
      tableNumber: 1,
      peopleCount: 20,
      start: "2024-04-01T10:00:00.000+00:00",
      end: "2024-04-01T12:00:00.000+00:00",
      status: "checked",
    },
    {
      tableNumber: 2,
      email: "ulf@gmail.com",
      name: "Ulf",
      peopleCount: 1,
      start: "2024-04-08T19:30:00.000+00:00",
      end: "2024-04-08T19:30:00.000+00:00",
      status: "checked",
    },
    {
      tableNumber: 3,
      email: "sat@gmail.com",
      name: "Sat",
      peopleCount: 4,
      start: "2024-04-28T16:30:00.000+00:00",
      end: "2024-04-28T17:30:00.000+00:00",
    },
  ],
  [
    {
      email: "david@example.com",
      name: "David",
      tableNumber: 1,
      peopleCount: 4,
      start: "2024-05-05T19:30:00.000+00:00",
      end: "2024-05-05T21:30:00.000+00:00",
      status: "confirmed",
    },
    {
      email: "emily@example.com",
      name: "Emily",
      tableNumber: 2,
      peopleCount: 3,
      start: "2024-05-15T18:00:00.000+00:00",
      end: "2024-05-15T20:00:00.000+00:00",
      status: "confirmed",
    },
    {
      email: "george@example.com",
      name: "George",
      tableNumber: 3,
      peopleCount: 6,
      start: "2024-05-25T17:00:00.000+00:00",
      end: "2024-05-25T19:00:00.000+00:00",
      status: "confirmed",
    },
  ],
  [
    {
      email: "olivia@example.com",
      name: "Olivia",
      tableNumber: 1,
      peopleCount: 2,
      start: "2024-06-10T18:00:00.000+00:00",
      end: "2024-06-10T20:00:00.000+00:00",
      status: "confirmed",
    },
    {
      email: "harry@example.com",
      name: "Harry",
      tableNumber: 2,
      peopleCount: 4,
      start: "2024-06-18T17:30:00.000+00:00",
      end: "2024-06-18T19:30:00.000+00:00",
      status: "confirmed",
    },
    {
      email: "emma@example.com",
      name: "Emma",
      tableNumber: 3,
      peopleCount: 6,
      start: "2024-06-25T20:00:00.000+00:00",
      end: "2024-06-25T22:00:00.000+00:00",
      status: "confirmed",
    },
  ],
  [
    {
      email: "james@example.com",
      name: "James",
      tableNumber: 1,
      peopleCount: 3,
      start: "2024-07-05T19:00:00.000+00:00",
      end: "2024-07-05T21:00:00.000+00:00",
      status: "confirmed",
    },
    {
      email: "sophia@example.com",
      name: "Sophia",
      tableNumber: 2,
      peopleCount: 2,
      start: "2024-07-15T18:30:00.000+00:00",
      end: "2024-07-15T20:30:00.000+00:00",
      status: "confirmed",
    },
    {
      email: "william@example.com",
      name: "William",
      tableNumber: 3,
      peopleCount: 5,
      start: "2024-07-25T20:00:00.000+00:00",
      end: "2024-07-25T22:00:00.000+00:00",
      status: "confirmed",
    },
  ],
];

const App = () => {
  const { data: session, status } = useSession();

  const [currentReservations, setCurrentReservations] = useState(
    session.data.reservationsApril
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateLevel, setDateLevel] = useState("month"); // month, day, time
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const getCurrentComponent = () => {
    switch (dateLevel) {
      case "month":
        return <CalendarGrid />;

      case "day":
        return (
          <DayGrid
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            setDateLevel={setDateLevel}
          />
        );

      case "time":
        return (
          <ReservationForm
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            currentReservations={currentReservations}
          />
        );
    }
  };

  useEffect(() => {
    setCurrentReservations(session.data.reservationsApril);
  }, [session]);

  useEffect(() => {
    sortReservationsByStartDate();
  }, [currentReservations]);

  const sortReservationsByStartDate = () => {
    //When Fetching Data convert date objects
    try {
      currentReservations.forEach((reservation) => {
        reservation.start = new Date(reservation.start);
        reservation.end = new Date(reservation.end);
      });
      const ordered = currentReservations.sort((a, b) => {
        if (a.start < b.start) {
          return -1;
        } else if (a.start > b.start) {
          return 1;
        } else {
          return 0;
        }
      });
      setCurrentReservations(ordered);
    } catch (e) {
      addAlert("warning", "No Reservation found");
      console.log(e);
      setCurrentReservations([]);
    }
  };

  const fSetCurrentDate = (newDate) => {
    if (newDate.getTime() === currentDate.getTime()) {
      return;
    }
    if (newDate.getMonth() !== currentDate.getMonth()) {
      console.log(newDate.getMonth());
      //When Fetching Data convert date objects
      setCurrentReservations(dumy[newDate.getMonth()]);
    }

    if (dateLevel === "time") {
      console.log(`set date ${newDate}`);

      if (
        currentReservations.length > 0 &&
        newDate.getMonth() !== currentDate.getMonth()
      ) {
        //When Fetching and date object are directly coverted
        newDate =
          currentDate.getTime() > newDate.getTime()
            ? new Date(
                dumy[newDate.getMonth()][currentReservations.length - 1].start
              )
            : new Date([dumy[newDate.getMonth()][0].start]);
      }
    }

    setCurrentDate(newDate);
  };

  const fSetDateLevel = (dateLevel) => {
    setDateLevel(dateLevel);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const updateReservation = (reservation, newReservation) => {
    if (!newReservation) {
      console.log(`delete Reservation: ${reservation}`);
    }

    if (!newReservation.name) {
      console.log(`change Reservation: ${newReservation}`);
    }
    if (!reservation) {
      console.log(`make Reservation: ${newReservation}`);
    }

    console.log("update Reservation failed.");
  };

  const addAlert = (severity, message) => {
    setAlerts((prevAlerts) => [...prevAlerts, { severity, message }]);
  };

  const removeAlert = (index) => {
    setAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
  };

  const contextValue = {
    currentDate,
    fSetCurrentDate,
    currentReservations,
    dateLevel,
    fSetDateLevel,
    isSidebarOpen,
    toggleSidebar,
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
        <div className="flex flex-col justify-end overflow-auto flex-grow md:flex-col-reverse ">
          <div className="flex flex-col py-8 px-2 h-full justify-center">
            {getCurrentComponent()}
          </div>
          <MenuBar />
        </div>
      </div>
      <AlertList />
    </DashboardContext.Provider>
  );
};

App.auth = true;

export default App;
