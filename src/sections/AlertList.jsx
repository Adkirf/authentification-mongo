import React, { useState, useEffect, useContext, useRef } from "react";
import { DashboardContext } from "@/pages/dashboard";

import Alert from "@mui/material/Alert";

const AlertList = () => {
  const { alerts, removeAlert } = useContext(DashboardContext);
  return (
    <div className="fixed flex flex-col top-4 md:top-auto md:bottom-4 right-4 gap-2 z-[100]">
      {alerts.map((alert, index) => (
        <AlertTile
          key={alert.id}
          message={alert.message}
          severity={alert.severity}
          id={alert.id}
          index={index}
          removeAlert={removeAlert}
        />
      ))}
    </div>
  );
};

export default AlertList;

const AlertTile = ({ severity, message, id, removeAlert }) => {
  const [isVisible, setIsVisible] = useState(true);
  const alertRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
      removeAlert(id);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [message]);

  return (
    <div
      ref={alertRef}
      className={`alert ${isVisible ? "opacity-100" : "opacity-0"}`}
      style={{ transition: "opacity 0.3s" }}
    >
      <Alert severity={severity}>{message}</Alert>
    </div>
  );
};
