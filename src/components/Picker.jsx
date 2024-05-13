import React, { useState, useRef, useEffect, useContext } from "react";
import { DashboardContext } from "@/pages/dashboard";

const openingHours = {
  open: 8,
  close: 23,
};
const timeOptions = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];

const minutes = ["00", "30"];

export const DurationPicker = ({ indexSpan, onSelect, isDropDown }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeSelected, setTimeSelected] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setTimeSelected(indexSpan > timeOptions.length || indexSpan <= 0);
  }, [indexSpan]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.classList.contains("duration-picker-button")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative text-left w-full">
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className={`duration-picker-button items-center justify-center py-4 px-4 border-2 w-full shadow-sm text-sm font-medium rounded-md text-gray-700 ${
          timeSelected ? "" : "border-blue-500"
        }  ${
          timeSelected
            ? "bg-gray-100 hover:bg-gray-300"
            : "bg-white hover:bg-gray-50"
        }`}
      >
        {timeOptions[indexSpan - 1]}
        {timeSelected ? "-" : "h"}
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute left-0 w-full max-h-40 overflow-auto  bg-white shadow-md mt-1 z-10 `}
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {timeOptions.map((time, index) => (
              <button
                key={index}
                className="text-gray-700 block w-full text-center px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
                onClick={(e) => {
                  onSelect(time);
                  setIsOpen(false);
                }}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const MonthPicker = ({}) => {
  const { currentDate, fSetNextOrPrevDate, dateLevel } =
    useContext(DashboardContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.classList.contains("duration-picker-button")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectMonth = async (monthIndex) => {
    if (monthIndex === -1) {
      fSetNextOrPrevDate(true, new Date());
    } else {
      const newMonth = new Date(currentDate.getFullYear(), monthIndex);
      fSetNextOrPrevDate(true, newMonth);
    }
    setIsOpen(false);
  };

  const buttonLabel = () => {
    const year = currentDate.getFullYear();
    const month = months[currentDate.getMonth()];
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");

    switch (dateLevel) {
      case "month":
        return `${month} ${year}`;
      case "day":
        return `${day} ${month}`;
      case "time":
        return `${day} ${month}`;
      default:
        return "Select Date";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="duration-picker-button  px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        {buttonLabel()}
      </button>
      {isOpen && (
        <ul
          ref={dropdownRef}
          className="absolute left-0  max-h-40 overflow-auto bg-white shadow-md mt-1 z-10 bottom-full md:bottom-auto"
        >
          <li
            className={`px-4 py-2 hover:bg-blue-100 cursor-pointer`}
            onClick={() => selectMonth(-1)}
          >
            Today
          </li>
          {months.map((month, index) => (
            <li
              key={index}
              className={`px-4 py-2 hover:bg-blue-100 cursor-pointer ${
                currentDate.getMonth() === index ? "bg-blue-200" : ""
              }`}
              onClick={() => selectMonth(index)}
            >
              {month}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const TimePicker = ({
  start,
  time,
  onSelect,
  indexSpan,
  disabled,
  isDropDown,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(...Array(24).keys());
  const [timeSelected, setTimeSelected] = useState(false);
  const [timeValid, setTimeValid] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setTimeSelected(indexSpan > timeOptions.length || indexSpan <= 0);
    if (indexSpan > timeOptions.length) {
      setTimeValid(true);
    }
    if (indexSpan <= 0) {
      setTimeValid(false);
    }
  }, [indexSpan]);

  useEffect(() => {
    const newHours = [];

    for (let i = openingHours.open; i <= openingHours.close; i++) {
      newHours.push(i < 10 ? `0${i}` : i);
    }
    setHours(newHours);
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.classList.contains("duration-picker-button")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative text-left w-full">
      <button
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className={`duration-picker-button items-center justify-center py-4 px-4 w-full shadow-sm text-sm font-medium rounded-md text-gray-700 ${
          !timeSelected
            ? ""
            : timeValid
            ? "border-2 border-blue-500"
            : "border-2 border-red-500"
        }  ${
          !timeSelected
            ? "bg-gray-100 hover:bg-gray-300"
            : "bg-white hover:bg-gray-50"
        }`}
      >
        {time}
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute left-0 w-full max-h-40 overflow-auto bg-white shadow-md mt-1 z-10 ${
            isDropDown ? "bottom-full" : "-top-40"
          } md:bottom-auto`}
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {hours.map((hour) => (
              <div key={hour} className="flex">
                <div className="w-1/4 flex justify-center text-gray-700 text-sm items-center">
                  {hour}:
                </div>
                <div className="w-3/4 flex justify-between">
                  {minutes.map((minute) => (
                    <button
                      key={`${hour}-${minute}`}
                      className="text-gray-700 block w-1/2 text-center px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => {
                        onSelect(`${hour}:${minute}`);
                        setIsOpen(false);
                      }}
                    >
                      {minute}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
