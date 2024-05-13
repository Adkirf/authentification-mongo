import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import HomeScreen from "@/sections/HomeScreen";

const Home = () => {
  const { data: session } = useSession();

  const [reservations, setReservations] = useState(false);

  const [isPWA, setIsPWA] = React.useState(false);

  useEffect(() => {
    setIsPWA(
      window.navigator.standalone ||
        window.matchMedia("(display-mode: standalone)").matches ||
        !window.matchMedia("(hover: none)").matches
    );
  }, []);

  useEffect(() => {
    setReservations(session.data.reservations);
  }, [session]);

  return (
    <div className="flex  w-screen items-center justify-center md:px-0">
      {isPWA ? (
        <HomeScreen reservations={reservations ? reservations.length : "..."} />
      ) : (
        <div className="w-full h-screen bg-gray-200 p-4">
          <div className="flex flex-col gap-4 w-full max-w-[500px] justify-center items-center mt-8">
            <div className="w-[100px] h-[100px]">
              <img className="rounded-xl" src="/assets/addIcon2.png" />
            </div>
            <h3 className="text-xl font-bold text-gray-700">
              Add to Home Screen
            </h3>
            <p>You need to add this website to your home screen.</p>

            <div className="border border-gray-400 rounded-xl p-4 mt-8">
              <p>1. In your browser, tap the share button.</p>
              <img src="/assets/share.png" />
            </div>
            <div className="border border-gray-400 rounded-xl p-4">
              <p>2. Add to your Home Screen.</p>
              <img src="/assets/addtohomescreen.png" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Home.auth = true;

export default Home;
