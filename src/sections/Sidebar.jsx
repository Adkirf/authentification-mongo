import MakeButton from "@/components/MakeButton";
import { DashboardContext } from "@/pages/dashboard";
import React, { useContext } from "react";

const SideBar = () => {
  const { dateLevel, fSetDateLevel } = useContext(DashboardContext);

  return (
    <div className="h-full pl-4 pb-[12vh] justify-end border-r flex flex-col lg:flex-col-reverse gap-4 overflow-hidden">
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
