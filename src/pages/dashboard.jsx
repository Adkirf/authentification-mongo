import React, { useEffect, useState } from "react";

import CalendarGrid from "@/components/CalendarGrid";
import MenuBar from "@/components/MenuBar";
import SideBar from "@/components/Sidebar";
import DayGrid from "@/components/DayGrid";
import ReservationForm from "@/components/ReservationForm";

const reservations = [
  {
    email: "something",
    name: "A name",
    tableNumber: 1,
    peopleCount: 20,
    start: "2024-04-08T10:00:00.000+00:00",
    end: "2024-04-08T12:00:00.000+00:00",
  },
  {
    tableNumber: 2,
    email: "something",
    name: "B name",
    peopleCount: 1,
    start: "2024-04-08T19:30:00.000+00:00",
    end: "2024-04-08T19:30:00.000+00:00",
  },
  {
    tableNumber: 3,
    email: "something",
    name: "C name",
    peopleCount: 4,
    start: "2024-04-08T16:30:00.000+00:00",
    end: "2024-04-08T17:30:00.000+00:00",
    status: "checked",
  },
  {
    email: "something",
    name: "E name",
    tableNumber: 1,
    peopleCount: 20,
    start: "2024-04-08T10:00:00.000+00:00",
    end: "2024-04-08T11:00:00.000+00:00",
  },
  {
    email: "something",
    name: "A name",
    tableNumber: 1,
    peopleCount: 20,
    start: "2024-04-08T10:30:00.000+00:00",
    end: "2024-04-08T12:00:00.000+00:00",
  },
  {
    tableNumber: 2,
    email: "something",
    name: "B name",
    peopleCount: 1,
    start: "2024-04-12T19:30:00.000+00:00",
    end: "2024-04-12T19:30:00.000+00:00",
  },
  {
    tableNumber: 3,
    email: "something",
    name: "C name",
    peopleCount: 4,
    start: "2024-05-08T16:30:00.000+00:00",
    end: "2024-05-08T17:30:00.000+00:00",
    status: "checked",
  },
];

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentReservations, setCurrentReservations] = useState(reservations);
  const [dateLevel, setDateLevel] = useState("month"); // month, day, time

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getCurrentComponent = () => {
    switch (dateLevel) {
      case "month":
        return (
          <CalendarGrid
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            setDateLevel={setDateLevel}
          />
        );

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
    sortReservationsByStartDate();
  }, [reservations]);

  const sortReservationsByStartDate = () => {
    const ordered = currentReservations.sort((a, b) => {
      const startDateA = new Date(a.start);
      const startDateB = new Date(b.start);

      if (startDateA < startDateB) {
        return -1;
      } else if (startDateA > startDateB) {
        return 1;
      } else {
        return 0;
      }
    });

    setCurrentReservations(ordered);
  };

  return (
    <div className="relative flex flex-row h-screen w-screen">
      <div
        className={`absolute z-30 bg-white left-0 bottom-0 h-[100vh] w-[45%] md:static md:min-w-[20%] md:w-[20%] transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <SideBar
          dateLevel={dateLevel}
          setDateLevel={setDateLevel}
          toggleSidebar={toggleSidebar}
        />
      </div>
      <div className="flex flex-col justify-end overflow-auto flex-grow md:flex-col-reverse ">
        <div className="flex flex-col py-8 px-2 h-full justify-center">
          {getCurrentComponent()}
        </div>
        <MenuBar
          currentReservations={currentReservations}
          setCurrentReservations={setCurrentReservations}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          dateLevel={dateLevel}
          setDateLevel={setDateLevel}
          toggleSidebar={toggleSidebar}
        />
      </div>
    </div>
  );
};

export default App;
