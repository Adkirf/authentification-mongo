import { DashboardContext } from "@/pages/dashboard";
import React, { useContext, useState } from "react";

import { filterClosestTime } from "@/utils/utils";

import MenuIcon from "@mui/icons-material/Menu";

const MenuBar = () => {
  const {
    currentReservations,
    currentDate,
    fSetCurrentDate,
    dateLevel,
    fSetDateLevel,
    toggleSidebar,
  } = useContext(DashboardContext);

  const handlePrevios = () => {
    let newDate = new Date(currentDate);
    if (dateLevel === "month") {
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    if (dateLevel === "day") {
      newDate.setDate(currentDate.getDate() - 1);
    }
    if (dateLevel === "time") {
      const closestReservation = filterClosestTime(
        currentDate,
        currentReservations,
        false
      );
      newDate = closestReservation
        ? closestReservation.start
        : new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    }
    fSetCurrentDate(newDate);
  };

  const handleNext = () => {
    let newDate = new Date(currentDate);
    if (dateLevel === "month") {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    if (dateLevel === "day") {
      newDate.setDate(currentDate.getDate() + 1);
    }
    if (dateLevel === "time") {
      const closestReservation = filterClosestTime(
        currentDate,
        currentReservations,
        true
      );
      newDate = closestReservation
        ? closestReservation.start
        : new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    }
    fSetCurrentDate(newDate);
  };

  return (
    <div className="flex w-full items-center justify-between px-4 py-2 shadow bg-gray-800 p-4">
      <button onClick={() => toggleSidebar()} className="md:hidden">
        <MenuIcon />
      </button>
      <div className="flex flex-row gap-4">
        <MonthPickerButton
          currentDate={currentDate}
          fSetCurrentDate={fSetCurrentDate}
          dateLevel={dateLevel}
          fSetDateLevel={fSetDateLevel}
        />
      </div>
      <button onClick={handlePrevios} className="p-2 bg-gray-100 rounded">
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
      <button onClick={handleNext} className="p-2 bg-gray-100 rounded">
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
  fSetCurrentDate,
  dateLevel,
  fSetDateLevel,
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
      fSetCurrentDate(new Date());
    } else {
      const newMonth = new Date(currentDate.getFullYear(), monthIndex);
      fSetCurrentDate(newMonth);
    }
    fSetDateLevel("month");
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
        <ul className="absolute left-0 w-full max-h-40 overflow-auto bg-white shadow-md mt-1 z-10 bottom-full md:bottom-auto">
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
