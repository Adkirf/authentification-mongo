import React, { useState, useEffect, useContext } from "react";
import { DashboardContext } from "@/pages/dashboard";

import Alert from "@mui/material/Alert";

const AlertList = () => {
  const { alerts, removeAlert } = useContext(DashboardContext);

  console.log(alerts);

  return (
    <div className="fixed flex flex-col bottom-4 right-4 gap-2">
      {alerts.map((alert, index) => (
        <AlertTile
          key={index}
          message={alert.message}
          severity={alert.severity}
          index={index}
          removeAlert={removeAlert}
        />
      ))}
    </div>
  );
};

export default AlertList;

const AlertTile = ({ severity, message, removeAlert, index }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const handleRemove = () => {
    setIsVisible(false);
    removeAlert(index);
  };

  return (
    <div
      className={`alert ${isVisible ? "opacity-100" : "opacity-0"}`}
      onAnimationEnd={() => {
        if (!isVisible) removeAlert(index);
      }}
    >
      <Alert severity={severity}>{message}</Alert>
    </div>
  );
};
