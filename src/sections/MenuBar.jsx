import { DashboardContext } from "@/pages/dashboard";
import React, { useContext, useState } from "react";

import { filterClosestTime } from "@/utils/utils";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { MonthPicker } from "@/components/Picker";

const MenuBar = () => {
  const {
    currentReservation,
    fSetCurrentReservation,
    currentReservations,
    currentDate,
    fSetCurrentDate,
    fSetNextOrPrevDate,
    dateLevel,
    fSetDateLevel,
    toggleSidebar,
    isSidebarOpen,
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
      let closestReservation = filterClosestTime(
        currentDate,
        currentReservation,
        currentReservations,
        false
      );

      if (closestReservation) {
        fSetCurrentReservation(closestReservation);
        return;
      }

      newDate = closestReservation
        ? closestReservation.start
        : new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      fSetNextOrPrevDate(false, newDate);
      return;
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
      let closestReservation = filterClosestTime(
        currentDate,
        currentReservation,
        currentReservations,
        true
      );

      if (closestReservation) {
        fSetCurrentReservation(closestReservation);
        return;
      }
      newDate = closestReservation
        ? closestReservation.start
        : new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      fSetNextOrPrevDate(true, newDate);
      return;
    }
    fSetCurrentDate(newDate);
  };

  return (
    <div className="flex h-full flex-grow items-center justify-between md:justify-center md:gap-4 px-4 py-2 shadow bg-gray-800 p-4">
      <button onClick={() => toggleSidebar()} className="md:hidden">
        {isSidebarOpen ? (
          <CloseIcon className="text-gray-100" />
        ) : (
          <MenuIcon className="text-gray-100" />
        )}
      </button>
      <button onClick={handlePrevios} className="p-2 bg-gray-100 rounded ml-16">
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
      <MonthPicker />

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
