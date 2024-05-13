import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const HomeScreen = ({ reservations }) => {
  const router = useRouter();

  const [tutorialStep, setTutorialStep] = useState(0);

  return (
    <div className="flex flex-col mx-4 gap-8 w-full max-w-[500px] justify-center">
      <h1 className="text-gray-700 font-black text-4xl md:text-5xl leading-[125%]">
        <span className="text-blue-500">Welcome</span> to your Reservation Book!
      </h1>
      <h3 className="text-gray-700 font-semibold  text-xl ">
        You have{" "}
        <span className="text-blue-500 font-black">{reservations}</span>{" "}
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
        <h4 className="pt-4 font-semibold mb-0">Anna is Calling...</h4>
        <p className="pt-2 text-gray-700 font-base">
          She wants to book a table for 2 persons in 2 weeks.
        </p>

        <Accordion defaultExpanded className="bg-gray-200">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography>
              1. Go to the Month View and select the day in two weeks.
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              The Month View helps you to quickly navigate through your
              reservations. You can also use the Arrow Buttons to browse through
              the next or previos month, or you can go to a specific month using
              the MonthPicker between the arrows.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion className="bg-gray-200">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography>2. Select a Table and Time.</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              In the Reservation View you will see all tables and reservations
              of a specific day.You can use the Dutation Picker in the upper
              corner to see all possible reservation within a specific tame.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion className="bg-gray-200">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography>3. Open a Reservation Card. </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              By tapping on one of the Make Buttons you will open a Make
              Reservation Card. Depending on the Make Button you tap, the Make
              Reservation Card will have different information prefield.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion className="bg-gray-200">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography>4. Make the Reservation. </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Enter the name of Anna, and a phone number. You can also verify
              all other information. The find best table option will
              automatically check for the best tables.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default HomeScreen;
