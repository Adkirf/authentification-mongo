import { DashboardContext } from "@/pages/dashboard";
import React, { useContext, useEffect, useState } from "react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarGrid = () => {
  const { currentDate, fSetCurrentDate, fSetDateLevel, currentReservations } =
    useContext(DashboardContext);

  const [daysInMonth, setDaysInMonth] = useState(new Date().getDate());
  const [startDayOfWeek, setStartDayOfWeek] = useState(new Date().getDay());

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    console.log(currentDate.getFullYear());
    console.log(currentDate.getMonth());
    console.log(currentDate.getDay());
    console.log(currentDate);

    setDaysInMonth(new Date(year, month + 1, 0).getDate());
    setStartDayOfWeek(new Date(year, month, 1).getDay());
  }, [currentDate]);

  const emptyStartDays = Array.from({ length: startDayOfWeek }).map((_, i) => (
    <div key={`empty-start-${i}`} className="py-4 px-2 text-center"></div>
  ));

  const monthDays = Array.from({ length: daysInMonth }).map((_, i) => (
    <div
      onClick={() => {
        fSetDateLevel("day");
        fSetCurrentDate(
          new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1)
        );
      }}
      key={i}
      className={`py-4 px-2 ${
        currentDate.getDate() == i + 1 ? "bg-blue-300" : "bg-gray-100"
      } text-center border rounded shadow md:hover:bg-blue-100`}
    >
      {i + 1}
    </div>
  ));

  return (
    <div className="flex flex-col">
      {/* Days of the week header */}
      <div className="grid grid-cols-7">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-2 text-center border-b-2">
            {day}
          </div>
        ))}
      </div>
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 p-2">
        {emptyStartDays}
        {monthDays}
      </div>
    </div>
  );
};

export default CalendarGrid;
