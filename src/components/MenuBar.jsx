import React, { useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";

const MenuBar = ({
  currentReservations,
  setCurrentReservations,
  currentDate,
  setCurrentDate,
  dateLevel,
  setDateLevel,
  toggleSidebar,
}) => {
  const handlePrevios = () => {
    if (dateLevel === "month") {
      const newMonth = new Date(currentDate);
      newMonth.setMonth(currentDate.getMonth() - 1);
      setCurrentDate(newMonth);
      return;
    }
    if (dateLevel === "day") {
      const newDay = new Date(currentDate);
      newDay.setDate(currentDate.getDate() - 1);
      setCurrentDate(newDay);
      return;
    }
    if (dateLevel === "time") {
      const newOrder = [...currentReservations];
      if (newOrder.length > 0) {
        const lastItem = newOrder.pop();
        newOrder.unshift(lastItem);
      }
      setCurrentReservations(newOrder);
      setCurrentDate(new Date(newOrder[0].start));
    }
  };

  const handleNext = () => {
    if (dateLevel === "month") {
      const newMonth = new Date(currentDate);
      newMonth.setMonth(currentDate.getMonth() + 1);
      setCurrentDate(newMonth);
      return;
    }
    if (dateLevel === "day") {
      const newDay = new Date(currentDate);
      newDay.setDate(currentDate.getDate() + 1);
      setCurrentDate(newDay);
      return;
    }
    if (dateLevel === "time") {
      const newOrder = [...currentReservations];
      if (newOrder.length > 0) {
        const firstItem = newOrder.shift();
        newOrder.push(firstItem);
      }
      setCurrentReservations(newOrder);
      setCurrentDate(new Date(newOrder[0].start));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="flex w-full items-center justify-between px-4 py-2 shadow bg-gray-800 p-4">
      <button onClick={() => toggleSidebar()} className="">
        <MenuIcon />
      </button>

      <div className="flex flex-row gap-4">
        <MonthPickerButton
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          dateLevel={dateLevel}
          setDateLevel={setDateLevel}
        />
      </div>
      <button onClick={handlePrevios} className="p-2 hover:bg-gray-100 rounded">
        {/* SVG or icon for the left arrow */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button onClick={handleNext} className="p-2 hover:bg-gray-100 rounded">
        {/* SVG or icon for the right arrow */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default MenuBar;

const MonthPickerButton = ({
  currentDate,
  setCurrentDate,
  dateLevel,
  setDateLevel,
}) => {
  const [isOpen, setIsOpen] = useState(false);

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

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectMonth = (monthIndex) => {
    if (monthIndex === -1) {
      setCurrentDate(new Date());
    } else {
      const newMonth = new Date(currentDate.getFullYear(), monthIndex);
      setCurrentDate(newMonth);
    }
    setDateLevel("month");
    setIsOpen(false);
  };

  const buttonLabel = () => {
    const year = currentDate.getFullYear();
    const month = months[currentDate.getMonth()];
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");

    switch (dateLevel) {
      case "month":
        return `${month} ${year}`;
      case "day":
        return `${day} ${month}`;
      case "time":
        return `${hours}:${minutes} on ${day} ${month}`;
      default:
        return "Select Date";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        {buttonLabel()}
      </button>
      {isOpen && (
        <ul className="absolute left-0 w-full max-h-40 overflow-auto bg-white shadow-md mt-1 z-10 bottom-full md:top-full">
          <li
            className={`px-4 py-2 hover:bg-blue-100 cursor-pointer`}
            onClick={() => selectMonth(-1)}
          >
            Today
          </li>
          {months.map((month, index) => (
            <li
              key={index}
              className={`px-4 py-2 hover:bg-blue-100 cursor-pointer ${
                currentDate.getMonth() === index ? "bg-blue-200" : ""
              }`}
              onClick={() => selectMonth(index)}
            >
              {month}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
