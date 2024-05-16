import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const HomeScreen = () => {
  const router = useRouter();

  const { data: session } = useSession();

  const [reservations, setReservations] = useState(false);
  const [tables, setTables] = useState(false);
  const [tutorials, setTutorials] = useState();

  useEffect(() => {
    if (session) {
      console.log(session);
      setReservations(session.data.reservations);
      setTables(session.data.tables);
      setTutorials(session.data.tutorials);
    }
  }, [session]);

  useEffect(() => {
    console.log(tutorials);
  }, [tutorials]);

  return (
    <div className="flex flex-col mx-4 gap-8 w-full max-w-[500px] justify-center py-12">
      <h1 className="text-gray-700 font-black text-4xl md:text-5xl leading-[125%]">
        <span className="text-blue-500">Welcome</span> to your Reservation Book!
      </h1>
      <h3 className="text-gray-700 font-semibold  text-xl ">
        You have{" "}
        <span className="text-blue-500 font-black">
          {reservations ? reservations.length : "..."}
        </span>{" "}
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
      <div className="text-gray-700">
        <h4 className=" font-black ">TUTORIAL</h4>
        {tutorials &&
          tutorials.map((tutorial, index) => (
            <div key={index}>
              <Accordion className="bg-gray-200">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography>{tutorial.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{tutorial.description}</Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HomeScreen;
