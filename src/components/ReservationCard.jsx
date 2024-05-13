import React, { useEffect, useState, useContext, createContext } from "react";
import { DashboardContext } from "@/pages/dashboard";
import { DayContext } from "@/sections/DayGrid";

import { formatDate, createNewDateWithEndTime } from "../utils/utils.js";
import ReservationMenu from "./ReservationMenu.jsx";
import {
  NameInput,
  ContactInput,
  PeopleCountInput,
  TableNumberInput,
  StartInput,
  EndInput,
  CommentInput,
} from "./ReservationInputs.jsx";

import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import MakeButton from "./MakeButton.jsx";

export const ReservationContext = createContext();

const ReservationCard = ({ reservation }) => {
  const {
    currentReservation,
    currentReservations,
    dateLevel,
    fSetDateLevel,
    currentDate,
    updateReservation,
    addAlert,
  } = useContext(DashboardContext);

  const [status, setStatus] = useState("make"); // make, change, check-in, checked, delete, loading, warning, error
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [peopleCount, setPeopleCount] = useState(2);
  const [findBestTable, setFindBestTable] = useState(true);
  const [tableNumber, setTableNumber] = useState(null);
  const [start, setStart] = useState(currentDate);
  const [end, setEnd] = useState(new Date(currentDate.getTime() + 60 * 60000));
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [border, setBorder] = useState("border-gray-100");
  const [log, setLog] = useState("");

  useEffect(() => {
    if (currentReservation && !currentReservation.name) {
      setPeopleCount(currentReservation.peopleCount);
      setTableNumber(currentReservation.tableNumber);
      setStart(currentReservation.start);
      setEnd(currentReservation.end);
    }

    if (reservation) {
      if (dateLevel === "day" && !reservation.start) {
        return;
      }

      try {
        setName(reservation.name ? reservation.name : "");
        setContact(reservation.contact ? reservation.contact : "");
        setPeopleCount(reservation.peopleCount ? reservation.peopleCount : 0);
        setFindBestTable(
          reservation.findBestTable === null ||
            reservation.findBestTable === undefined
            ? true
            : reservation.findBestTable
        );
        setTableNumber(
          reservation.tableNumber || reservation.tableNumber == 0
            ? reservation.tableNumber
            : ""
        );
        setStart(reservation.start ? reservation.start : currentDate);
        setEnd(reservation.end ? reservation.end : currentDate);
        setErrorMessage(
          reservation.errorMessage ? reservation.errorMessage : ""
        );
        setStatus(reservation.status ? reservation.status : "make");
        setComment(reservation.comment ? reservation.comment : "");
        setLog(reservation.log ? "This reservation was forced" : "");

        if (reservation.status == "unchecked") {
          setStatus("change");
          const fifteenMinutesFromNow = new Date().getTime() + 15 * 60000;

          if (reservation.start.getTime() <= fifteenMinutesFromNow) {
            setStatus("check-in");
          }
        }
      } catch (e) {
        console.log(e);
        addAlert("error", "Reservation not valid", reservation);
      }
    }

    const getBorderColor = () => {
      setBorder("border-gray-100");
      if (dateLevel != "time") {
        return;
      }
      if (!currentReservation || !reservation) {
        return;
      }

      if (currentReservation._id != reservation._id) {
        return;
      }

      setBorder("border-blue-500");
      if (log) {
        setBorder("border-yellow-500");
      }
      switch (status) {
        case "warning":
          setBorder("border-yellow-500");
          return;
        case "error":
          setBorder("border-red-500");
          return;
      }
    };

    getBorderColor();
  }, [
    reservation,
    currentDate,
    currentReservation,
    currentReservations,
    status,
    log,
  ]);

  const getCard = () => {
    if (dateLevel === "day" && reservation) {
      if (reservation.name) {
        return <DayCard />;
      }
      return <MakeButton />;
    }
    switch (status) {
      case "make":
        return <MakeCard />;
      case "change":
        return <ChangeCard />;
      case "check-in":
        return <CheckInCard />;
      case "checked":
        return <CheckedCard />;
      case "delete":
        return <DeleteCard />;
      case "warning":
        return <WarningCard />;
      case "error":
        return <WarningCard />;
    }
  };

  const fSetStatus = (newStatus) => {
    if (!newStatus) {
      addAlert("warning", "failed changing the status of reservation");
      return;
    }
    if (reservation) {
      reservation.status = newStatus;
    }
    setStatus(newStatus);
  };

  const checkStatus = (newStatus) => {
    if (newStatus === "unchecked") {
      const fifteenMinutesFromNow = new Date().getTime() + 15 * 60000;

      if (new Date(start).getTime() <= fifteenMinutesFromNow) {
        fSetStatus("check-in");
        return;
      }
      fSetStatus("change");
      return;
    }
    fSetStatus(newStatus);
  };

  const fSetName = (newName) => {
    setName(newName);
  };

  const fSetContact = (newContact) => {
    setContact(newContact);
  };

  const fSetPeopleCount = (e, count) => {
    if (count) {
      setPeopleCount(count);
    }
    if (e) {
      const value = parseInt(e.target.value);
      if (!isNaN(value)) {
        setPeopleCount(value);
      } else {
        setPeopleCount("");
      }
    }
  };

  const toggleFindBestTable = () => {
    setFindBestTable(!findBestTable);
  };

  const fSetTableNumber = (newTable) => {
    setTableNumber(parseInt(newTable));
  };

  const fSetStart = (newDate) => {
    setStart(new Date(newDate));
  };

  const fSetEnd = (newDate) => {
    setEnd(new Date(newDate));
  };

  const fSetComment = (newComment) => {
    setComment(newComment ? newComment : "");
  };

  const fSetLoading = (isLoading) => {
    setLoading(isLoading);
  };

  const fSetErrorMessage = (newMessage) => {
    setErrorMessage(newMessage);
  };

  const fSetLog = (newLog) => {
    setLog(newLog);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newReservation = null;

    if (reservation && !reservation._id) {
      reservation = null;
    }

    if (status !== "delete") {
      newReservation = {
        _id: reservation ? reservation._id : false,
        name: name,
        contact: contact,
        peopleCount: peopleCount,
        findBestTable: findBestTable,
        tableNumber: tableNumber,
        start: start,
        end: end,
        comment: comment,
        status: status === "check-in" ? "checked" : "unchecked",
      };

      if (status === "warning" || (status === "check-in" && log)) {
        newReservation = {
          ...newReservation,
          log: log,
        };
      }
    }

    fSetLoading(true);
    fSetDateLevel("time");
    try {
      await updateReservation(reservation, newReservation);
      fSetLoading(false);
      checkStatus(newReservation ? newReservation.status : "unchecked");
    } catch (error) {
      console.error("Error submitting reservation:", error);
      setErrorMessage("Error submitting reservation. Please try again.");
      fSetLoading(false);
      checkStatus(reservation ? reservation.status : "unchecked");
    }
  };

  const reservationValue = {
    reservation,
    status,
    fSetStatus,
    name,
    fSetName,
    contact,
    fSetContact,
    peopleCount,
    fSetPeopleCount,
    findBestTable,
    toggleFindBestTable,
    tableNumber,
    fSetTableNumber,
    start,
    fSetStart,
    end,
    fSetEnd,
    comment,
    fSetComment,
    loading,
    fSetLoading,
    errorMessage,
    fSetErrorMessage,
    log,
    fSetLog,
    handleSubmit,
  };

  return (
    <ReservationContext.Provider value={reservationValue}>
      <div className={`border h-full ${border} rounded-lg`}>{getCard()}</div>
    </ReservationContext.Provider>
  );
};

const MakeCard = () => {
  const { loading, errorMessage, handleSubmit } =
    useContext(ReservationContext);

  const { toggleReservationCard } = useContext(DashboardContext);

  return (
    <div className="fixed z-[100] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 inset-0 bg-white px-4 pt-4 md:max-w-lg w-[100%] h-[75%] md:h-[500px] md:w-auto md:rounded-lg shadow-2xl border overflow-y-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-grow justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            <span className="text-blue-500">Make</span> A Rerservation
          </h2>
        </div>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <div className="mb-4">
          <NameInput />
        </div>
        <div className="mb-12">
          <ContactInput />
        </div>
        <div className="mb-12 flex flex-col gap-8">
          <PeopleCountInput />
          <TableNumberInput />
        </div>
        <div className="mb-4">
          <StartInput />
        </div>
        <div className="mb-8">
          <EndInput />
        </div>
        <div className="mb-8">
          <CommentInput />
        </div>
        <div className="sticky bottom-0 h-16 flex items-center bg-white gap-8 justify-end mt-12">
          <div>
            <button
              type="button"
              onClick={toggleReservationCard}
              className="w-full py-2 px-4 text-gray-500 rounded-md hover:bg-gray-200 "
            >
              Cancel
            </button>
          </div>
          <div>
            {loading ? (
              <CircularProgress />
            ) : (
              <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                {" "}
                Make{" "}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

const ChangeCard = () => {
  const { loading, log, handleSubmit } = useContext(ReservationContext);

  return (
    <div className="min-w-[300px] md:min-w-[450px] max-h-[65vh] md:max-h-[400px] overflow-y-scroll px-6 pt-6 rounded-lg shadow-md bg-white ">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-grow justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            <span className="text-blue-500">Change</span> A Rerservation
          </h2>
          <ReservationMenu />
        </div>
        {log && <p className="text-yellow-500 mb-4">{log}</p>}
        <div className="mb-4">
          <NameInput />
        </div>
        <div className="mb-12">
          <ContactInput />
        </div>
        <div className="mb-12 flex flex-col gap-8">
          <PeopleCountInput />
          <TableNumberInput />
        </div>
        <div className="mb-4">
          <StartInput />
        </div>
        <div className="mb-4">
          <EndInput />
        </div>
        <div className="mb-8">
          <CommentInput />
        </div>
        <div className="sticky bottom-0 h-16 flex items-center justify-center bg-white">
          {loading ? (
            <CircularProgress />
          ) : (
            <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
              {" "}
              Change Reservation{" "}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const CheckInCard = () => {
  const { loading, log, handleSubmit } = useContext(ReservationContext);

  return (
    <div className="min-w-[300px] md:min-w-[450px] max-h-[65vh] md:max-h-[400px] overflow-y-scroll  px-6 pt-6  shadow-md bg-white rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-grow justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            <span className="text-blue-500">Check-In</span> A Rerservation
          </h2>
          <ReservationMenu />
        </div>
        {log && <p className="text-yellow-500 mb-4">{log}</p>}
        <div className="mb-4">
          <NameInput />
        </div>
        <div className="mb-12 flex flex-col gap-8">
          <PeopleCountInput />
        </div>
        <div className="mb-4 ">
          <CommentInput />
        </div>
        <div className="mb-4">
          <StartInput />
        </div>
        <div className="mb-4">
          <EndInput />
        </div>
        <div className="sticky bottom-0 h-16 flex items-center justify-center bg-white">
          {loading ? (
            <CircularProgress />
          ) : (
            <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
              {" "}
              Check-In{" "}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const CheckedCard = () => {
  const { tableNumber, loading, log, handleSubmit } =
    useContext(ReservationContext);

  return (
    <div className="min-w-[300px] max-h-[65vh] md:max-h-[400px] overflow-y-scroll  px-6 pt-6  shadow-md bg-white rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-grow justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            <span className="text-blue-900">Checked</span> Rerservation
          </h2>
        </div>
        {log && <p className="text-yellow-500 mb-4">{log}</p>}
        <div className="mb-4">
          <NameInput />
        </div>
        <div className="mb-12">
          <PeopleCountInput />
        </div>
        <div className="mb-4">
          <StartInput />
        </div>
        <div className="mb-4">
          <EndInput />
        </div>
        <div className="sticky bottom-0 h-16 flex items-center justify-center bg-white">
          {loading ? (
            <CircularProgress />
          ) : (
            <button
              disabled
              className="w-full py-2 px-4 bg-blue-900 text-white rounded-md "
            >
              {`Table: ${tableNumber}`}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const DeleteCard = () => {
  const { loading, log, handleSubmit } = useContext(ReservationContext);

  return (
    <div className="min-w-[300px] max-h-[65vh] md:max-h-[400px] hide-scrollbar overflow-y-scroll px-6 pt-6  shadow-md bg-white rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-grow justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            <span className="text-red-500">Delete</span> A Rerservation
          </h2>
          <ReservationMenu />
        </div>
        {log && <p className="text-yellow-500 mb-4">{log}</p>}
        <div className="mb-4">
          <NameInput />
        </div>
        <div className="mb-12">
          <ContactInput />
        </div>
        <div className="mb-12">
          <PeopleCountInput />
        </div>
        <div className="mb-4">
          <StartInput />
        </div>
        <div className="mb-4">
          <EndInput />
        </div>
        <div className="sticky bottom-0 h-16 flex items-center justify-center bg-white">
          {loading ? (
            <CircularProgress />
          ) : (
            <button
              id="delete"
              className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              {" "}
              Delete{" "}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const DayCard = () => {
  const { reservation, name, peopleCount, comment, log } =
    useContext(ReservationContext);
  const { fSetDateLevel, fSetCurrentReservation } =
    useContext(DashboardContext);
  return (
    <div
      onClick={() => {
        fSetDateLevel("time");
        fSetCurrentReservation(reservation);
      }}
      className={`${
        log ? "border border-yellow-500" : ""
      } flex flex-col h-full justify-around bg-gray-100 rounded-lg shadow hover:shadow-lg hover:bg-blue-200 p-4 cursor-pointer transition duration-150 ease-in-out`}
    >
      <div className="text-lg font-semibold text-gray-800"> {name}</div>
      <div className="text-gray-600 flex items-center space-x-2 mt-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-3-3H5a3 3 0 00-3 3v2h5m-3-6a3 3 0 110-6 3 3 0 010 6zm12 0a3 3 0 110-6 3 3 0 010 6zm-6 0a3 3 0 110-6 3 3 0 010 6z"
          />
        </svg>
        <span>{peopleCount}</span>
      </div>
      <div className="mb-4 max-h-16 overflow-auto">{comment}</div>
      {/* <button className="mt-3 bg-blue-500 text-white font-bold py-2 px-4 rounded">
        Contact Info
      </button> */}
    </div>
  );
};

const WarningCard = () => {
  const { loading, errorMessage, fSetLog, handleSubmit, status } =
    useContext(ReservationContext);

  const { fSetCurrentReservation } = useContext(DashboardContext);

  return (
    <div className="min-w-[300px] md:min-w-[450px] max-h-[65vh] md:max-h-[400px] overflow-y-scroll px-6 pt-6 rounded-lg shadow-md bg-white ">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-grow justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            <span
              className={
                status === "warning" ? "text-yellow-500" : "text-red-500"
              }
            >
              Warning
            </span>{" "}
            Conflicting Rerservation
          </h2>
          <button
            onClick={(e) => {
              e.preventDefault();
              fSetCurrentReservation();
            }}
          >
            <CloseIcon />
          </button>
        </div>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <div className="mb-4">
          <NameInput />
        </div>
        <div className="mb-12">
          <ContactInput />
        </div>
        <div className="mb-12 flex flex-col gap-8">
          <PeopleCountInput />
          <TableNumberInput />
        </div>
        <div className="mb-4">
          <StartInput />
        </div>
        <div className="mb-4">
          <EndInput />
        </div>
        <div className="mb-4">
          <CommentInput />
        </div>
        <div className="sticky bottom-0 h-16 flex items-center justify-center bg-white">
          {loading ? (
            <CircularProgress />
          ) : (
            <div className="flex w-full">
              <button className="w-full py-2 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:bg-yellow-600">
                {" "}
                Try Again{" "}
              </button>
              {status != "error" && (
                <button
                  onClick={() => fSetLog(errorMessage)}
                  className="w-full py-2 px-4  text-gray-500 rounded-md hover:bg-grey-600 "
                >
                  {" "}
                  Make Anyway{" "}
                </button>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReservationCard;
