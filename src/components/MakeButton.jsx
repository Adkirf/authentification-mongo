import { useContext, useState } from "react";
import { DashboardContext } from "@/pages/dashboard";

const MakeButton = () => {
  const { dateLevel, toggleReservationCard } = useContext(DashboardContext);

  return (
    <div className="flex w-full h-full justify-center items-center">
      <button
        onClick={toggleReservationCard}
        className="flex bg-white flex-grow rounded-lg  hover:shadow-lg h-full items-center p-2 text-blue-500 font-bold text-lg leading-6 border  shadow-lg hover:bg-blue-100 "
        aria-label="Create event"
      >
        <img src="./assets/addIcon.svg" className="w-5 h-5" />
        <div className=" flex flex-grow justify-center items-center">Make</div>
      </button>
    </div>
  );
};

export default MakeButton;
