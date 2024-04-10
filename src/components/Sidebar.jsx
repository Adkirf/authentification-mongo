import { DashboardContext } from "@/pages/dashboard";
import React, { useContext } from "react";

const SideBar = () => {
  const { dateLevel, fSetDateLevel, toggleSidebar } =
    useContext(DashboardContext);

  return (
    <div className="h-full pl-4 pb-[10vh] justify-end border-r flex flex-col lg:flex-col-reverse">
      <button
        onClick={() => fSetDateLevel("time")}
        className={`px-4 py-2 mb-2 w-full rounded-s-lg  ${
          dateLevel === "time"
            ? "text-center bg-blue-500 text-white"
            : "text-left text-black border-y-2 border-l-2"
        } rounded`}
      >
        Reservations
      </button>
      <button
        onClick={() => fSetDateLevel("day")}
        className={`px-4 py-2 mb-2 w-full rounded-s-lg   ${
          dateLevel === "day"
            ? "text-center bg-blue-500 text-white"
            : "text-left text-black border-y-2 border-l-2"
        } rounded`}
      >
        Day
      </button>
      <button
        onClick={() => {
          fSetDateLevel("month");
        }}
        className={`px-12 py-2  mb-2 w-full rounded-s-lg ${
          dateLevel === "month"
            ? "text-center bg-blue-500 text-white"
            : "text-left text-black border-y-2 border-l-2"
        } rounded`}
      >
        Month
      </button>
      <button onClick={toggleSidebar} className="md:hidden pl-4">
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
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    </div>
  );
};

export default SideBar;
