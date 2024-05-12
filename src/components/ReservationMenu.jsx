import React, { useEffect, useState, useContext, useRef } from "react";

import { ReservationContext } from "@/components/ReservationCard";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ReservationMenu = () => {
  const { fSetStatus } = useContext(ReservationContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="p-0">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            fSetStatus("change");
          }}
        >
          Change
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            fSetStatus("check-in");
          }}
        >
          Check-In
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            fSetStatus("delete");
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ReservationMenu;
