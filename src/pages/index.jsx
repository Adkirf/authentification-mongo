import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import AutoStoriesIcon from "@mui/icons-material/AutoStories";

const Home = () => {
  const { data: session } = useSession();
  const router = useRouter();
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
    <div className="flex h-screen w-screen items-center justify-center md:px-0">
      {isPWA ? (
        <div className="flex flex-col mx-4 gap-8 w-full max-w-[500px] justify-center">
          <h1 className="text-gray-700 font-black text-4xl md:text-5xl leading-[125%]	 ">
            <span className="text-blue-500">Welcome</span> to your Reservation
            Book!
          </h1>
          <h3 className="text-gray-700 font-semibold  text-xl ">
            You have{" "}
            <span className="text-blue-500 font-black">
              {reservations !== false ? reservations.length : "..."}{" "}
            </span>
            reservations.
          </h3>

          <div className="flex w-full h-full justify-center items-center">
            <div>
              <button
                onClick={() => router.push("/dashboard")}
                className="flex bg-white py-4 gap-4 flex-grow rounded-lg  hover:shadow-lg h-full items-center px-4  text-blue-500 font-bold text-lg leading-6 border  shadow-lg hover:bg-blue-100 "
              >
                <AutoStoriesIcon />
                <div className="flex flex-grow justify-center items-centen text-gray-700">
                  Open Book
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-gray-200 p-4">
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
