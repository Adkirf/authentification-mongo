import React from "react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarGrid = ({ currentDate, setCurrentDate, setDateLevel }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const startDayOfWeek = new Date(year, month, 1).getDay();

  const emptyStartDays = Array.from({ length: startDayOfWeek }).map((_, i) => (
    <div key={`empty-start-${i}`} className="py-4 px-2 text-center"></div>
  ));

  const monthDays = Array.from({ length: daysInMonth }).map((_, i) => (
    <div
      onClick={() => {
        setDateLevel("day");
        setCurrentDate(new Date(year, month, i + 1));
      }}
      key={i}
      className="py-4 px-2 bg-gray-100 text-center border rounded shadow hover:bg-blue-100"
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
