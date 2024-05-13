import React, { useEffect, useState, useContext, createContext } from "react";

import { formatDate, createNewDateWithEndTime } from "../utils/utils.js";
import { ReservationContext } from "@/components/ReservationCard.jsx";

import { DurationPicker, TimePicker } from "@/components/Picker.jsx";

import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Checkbox from "@mui/material/Checkbox";

export const NameInput = () => {
  const { name, fSetName, status } = useContext(ReservationContext);

  return (
    <>
      <label htmlFor="name" className="block text-gray-700">
        Name:
      </label>
      <input
        disabled={
          !(
            status === "change" ||
            status === "make" ||
            status === "warning" ||
            status === "error"
          )
        }
        type="text"
        id="name"
        className="form-input mt-1 block w-full border-none bg-gray-100 rounded-md shadow-sm py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
        value={name}
        onChange={(e) => fSetName(e.target.value)}
        required
      />
    </>
  );
};

export const ContactInput = () => {
  const { contact, fSetContact, status } = useContext(ReservationContext);

  return (
    <>
      <label htmlFor="contact" className="block text-gray-700">
        Email or Phone:
      </label>
      <input
        type="text" /* {/[a-zA-Z]/.test(contact[0]) ? "email" : "number"} */
        disabled={
          !(
            status === "change" ||
            status === "make" ||
            status === "warning" ||
            status === "error"
          )
        }
        id="contact"
        className="form-input mt-1 block w-full border-none bg-gray-100 rounded-md shadow-sm py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
        value={contact}
        onChange={(e) => fSetContact(e.target.value)}
        required
      />
    </>
  );
};

export const PeopleCountInput = () => {
  const { status, peopleCount, fSetPeopleCount } =
    useContext(ReservationContext);

  return (
    <div className="flex flex-col flex-grow gap-4 items-center">
      <label
        htmlFor="peopleCount"
        className="flex w-full text-start text-gray-700"
      >
        Number of People:
      </label>

      <div className="flex w-full justify-around">
        <input
          disabled={
            !(
              status === "change" ||
              status === "make" ||
              status === "warning" ||
              status === "error"
            )
          }
          type="number"
          id="peopleCount"
          min="1"
          className="pt-4 text-xl text-center border-b-2 border-gray-500 w-16  focus:border-blue-500 focus:outline-none focus:ring-blue-500 focus:ring-opacity-50"
          value={peopleCount}
          onChange={(e) => {
            fSetPeopleCount(e, null);
          }}
          required
        />
        <div
          className={
            status === "change" || status === "make" ? "flex gap-1" : "hidden"
          }
        >
          {[3, 4, 5, 6].map((count) => (
            <button
              key={count}
              type="button"
              className={`px-4 py-2 rounded-md ${
                peopleCount == count
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-300"
              }`}
              onClick={() => fSetPeopleCount(null, count)}
            >
              {count}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TableNumberInput = () => {
  const {
    findBestTable,
    toggleFindBestTable,
    tableNumber,
    fSetTableNumber,
    status,
  } = useContext(ReservationContext);

  return (
    <div className="flex w-full flex-col w">
      <div className="flex flex-col flex-grow gap-4 items-center">
        <div
          className={
            findBestTable ? "hidden" : "flex flex-col w-full items-center"
          }
        >
          <label
            htmlFor="tableNumber"
            className="flex w-full text-start text-gray-700"
          >
            Table Number:
          </label>

          <input
            type="number"
            id="tableNumber"
            className="pt-4 text-xl text-center border-b-2 border-gray-500 w-16  focus:border-blue-500 focus:outline-none focus:ring-blue-500 focus:ring-opacity-50"
            value={tableNumber || tableNumber == 0 ? tableNumber : ""}
            onChange={(e) => fSetTableNumber(e.target.value)}
          />
        </div>
        <div className="flex flex-grow items-center gap-2">
          <div className="flex flex-grow justify-end">
            <FormControlLabel
              value="bottom"
              control={
                <Switch
                  type="checkbox"
                  name="findBestTable"
                  id="findBestTable"
                  checked={findBestTable}
                  onChange={toggleFindBestTable}
                />
              }
              label="Find best table"
              labelPlacement="bottom"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const StartInput = () => {
  const { start, end, fSetStart, fSetEnd, status } =
    useContext(ReservationContext);

  useEffect(() => {
    if (!start) {
      return;
    }
    let minutes = start.getMinutes();

    if (minutes % 30 === 0) {
      return;
    }

    let offset = minutes % 30;
    let adjustment = offset < 15 ? -offset : 30 - offset;

    let roundedDate = new Date(start.getTime() + adjustment * 60000);

    roundedDate.setSeconds(0);
    roundedDate.setMilliseconds(0);

    const diffMilliseconds = end - start;
    const diffMinutes = diffMilliseconds / 60000;
    const halfHourSteps = Math.ceil(diffMinutes / 30) * 0.5;

    fSetEnd(new Date(roundedDate.getTime() + halfHourSteps * 30 * 60000));
    fSetStart(roundedDate);
  }, [start]);

  const handleTime = (time) => {
    const newStart = new Date(`${formatDate(start).split("T")[0]}T${time}`);
    const newEnd = new Date(newStart);
    fSetStart(newStart);
  };

  const handleDate = (e) => {
    const diffMilliseconds = end - start;
    const diffMinutes = diffMilliseconds / 60000;
    const duration = Math.ceil(diffMinutes / 30) * 0.5;

    let newStart = new Date(
      `${e.target.value}T${formatDate(start).split("T")[1]}`
    );

    const newEnd = new Date(newStart);

    const wholeHours = Math.floor(duration);
    const additionalMinutes = (duration - wholeHours) * 60;

    newEnd.setHours(
      newStart.getHours() + wholeHours,
      newStart.getMinutes() + additionalMinutes
    );

    fSetStart(newStart);
    fSetEnd(newEnd);
  };

  return (
    <>
      <label htmlFor="dateTime" className="block text-gray-700">
        Start:
      </label>
      <div className="flex justify-start items-center gap-4 mt-2 border-b pb-2">
        <div className="w-3/5">
          <TimePicker
            time={formatDate(start).split("T")[1]}
            disabled={
              !(
                status === "change" ||
                status === "make" ||
                status === "warning" ||
                status === "error"
              )
            }
            onSelect={handleTime}
          />
        </div>
        <input
          disabled={
            !(
              status === "change" ||
              status === "make" ||
              status === "warning" ||
              status === "error"
            )
          }
          type="date"
          id="date"
          className="mt-1 block py-2 pl-4 max-w-[200px] max-h-[50px] rounded-md bg-gray-100 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          value={formatDate(start).split("T")[0]}
          onChange={(e) => handleDate(e)}
          required
          style={{ width: "auto", display: "inline-block" }}
        />
      </div>
    </>
  );
};

export const EndInput = () => {
  const { start, end, fSetStart, fSetEnd, status } =
    useContext(ReservationContext);
  const [indexSpan, setIndexSpan] = useState(0.5);

  const fSetIndexSpan = (duration) => {
    let newIndexSpan = 0;
    for (let i = 0; i < duration; i += 0.5) {
      newIndexSpan++;
    }

    setIndexSpan(newIndexSpan);
  };

  useEffect(() => {
    const diffMilliseconds = end - start;
    const diffMinutes = diffMilliseconds / 60000;
    const halfHourSteps = Math.ceil(diffMinutes / 30) * 0.5;
    fSetIndexSpan(halfHourSteps);
  }, [start, end]);

  const handleDuration = (duration) => {
    const endDate = new Date(start);

    const wholeHours = Math.floor(duration);
    const additionalMinutes = (duration - wholeHours) * 60;

    endDate.setHours(
      start.getHours() + wholeHours,
      start.getMinutes() + additionalMinutes
    );

    fSetEnd(endDate);
    fSetIndexSpan(duration);
  };

  const handleTime = (time) => {
    let newEnd = new Date(`${formatDate(end).split("T")[0]}T${time}`);
    fSetEnd(newEnd);
  };

  return (
    <div className="flex w-full justify-between flex-row">
      <div
        className={
          status === "change" ||
          status === "make" ||
          status === "warning" ||
          status === "error"
            ? "flex  flex-col items-center w-[45%]"
            : "hidden"
        }
      >
        <label
          htmlFor="timeDuration"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Select Duration:
        </label>
        <DurationPicker indexSpan={indexSpan} onSelect={handleDuration} />
      </div>

      <div
        className={
          status === "change" ||
          status === "make" ||
          status === "warning" ||
          status === "error"
            ? "flex flex-col items-center w-[10%] text-gray-700"
            : "hidden"
        }
      >
        or
        <span className="border border-gray-500 h-full" />
      </div>
      <div className="flex  flex-col w-[45%]">
        <label
          htmlFor="endTime"
          className="block mb-2 text-sm font-medium text-gray-900 w-full text-center"
        >
          End Time:
        </label>
        <TimePicker
          start={start}
          indexSpan={indexSpan}
          time={formatDate(end).split("T")[1]}
          disabled={
            !(
              status === "change" ||
              status === "make" ||
              status === "warning" ||
              status === "error"
            )
          }
          onSelect={handleTime}
        />
      </div>
    </div>
  );
};

export const CommentInput = () => {
  const { status, comment, fSetComment } = useContext(ReservationContext);

  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleCommentChange = (event) => {
    fSetComment(event.target.value);
  };

  const handleSave = () => {
    toggleEdit();
  };

  return (
    <div className="  bg-white rounded-lg border shadow-md hover:bg-gray-100 cursor-pointer w-full">
      {isEditing ? (
        <div className="flex w-full flex-col">
          <textarea
            className="w-full p-2 text-sm border rounded-md"
            value={comment}
            onChange={handleCommentChange}
          />
          <button
            className="mt-2 w-24 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            Save
          </button>
        </div>
      ) : (
        <button
          disabled={status == "check-in" || status == "checked"}
          className="flex flex-col w-full h-full"
          onClick={(e) => {
            e.preventDefault();
            toggleEdit();
          }}
        >
          <label
            htmlFor="comment"
            className="block m-4 mb-2 text-sm font-medium text-gray-900"
          >
            Comment:
          </label>
          <p className="m-4 text-start text-gray-700">{comment || ""}</p>
        </button>
      )}
    </div>
  );
};
