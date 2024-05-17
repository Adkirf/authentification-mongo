import MakeButton from "@/components/MakeButton";
import { DashboardContext } from "@/pages/dashboard";
import React, { useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";

import QuizIcon from "@mui/icons-material/Quiz";
const SideBar = () => {
  const { dateLevel, fSetDateLevel, toggleSidebar, isSidebarOpen } =
    useContext(DashboardContext);

  const sideBarRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sideBarRef.current &&
        !sideBarRef.current.contains(event.target) &&
        isSidebarOpen
      ) {
        toggleSidebar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={sideBarRef}
      className="h-full pl-4 pb-[12vh] justify-end border-r flex flex-col lg:flex-col-reverse gap-4 overflow-hidden"
    >
      <div className="flex justify-start py-16">
        <button
          onClick={() => router.push("/")}
          className="flex h-[40px] w-[130px] gap-2 text-gray-700 font-black"
        >
          <QuizIcon />
          <h4 className="text-gray-700 font-black ">TUTORIAL</h4>
        </button>
      </div>

      <div className="flex justify-center">
        <div className="h-[40px] w-[130px]">
          <MakeButton />
        </div>
      </div>
      <button
        onClick={() => fSetDateLevel("time")}
        className={`px-4 py-2 w-full rounded-lg transition-all duration-300 ease-in-out ${
          dateLevel === "time"
            ? "bg-blue-500 text-white text-left"
            : "text-center text-black border-y-2 border-l-2 translate-x-10"
        } rounded`}
      >
        Reservations
      </button>
      <button
        onClick={() => fSetDateLevel("day")}
        className={`px-4 py-2 w-full rounded-lg transition-all duration-300 ease-in-out ${
          dateLevel === "day"
            ? "bg-blue-500 text-white text-left"
            : "text-center text-black border-y-2 border-l-2 translate-x-10"
        } rounded`}
      >
        Day
      </button>
      <button
        onClick={() => fSetDateLevel("tables")}
        className={`px-4 py-2 w-full rounded-lg transition-all duration-300 ease-in-out ${
          dateLevel === "tables"
            ? "bg-blue-500 text-white text-left"
            : "text-center text-black border-y-2 border-l-2 translate-x-10"
        } rounded`}
      >
        Tables
      </button>
      <button
        onClick={() => {
          fSetDateLevel("month");
        }}
        className={`px-4 py-2 w-full rounded-lg transition-all duration-300 ease-in-out ${
          dateLevel === "month"
            ? "bg-blue-500 text-white text-left"
            : "text-center text-black border-y-2 border-l-2 translate-x-10"
        } rounded`}
      >
        Month
      </button>
    </div>
  );
};

export default SideBar;
