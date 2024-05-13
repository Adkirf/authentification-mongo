export function formatDate(date) {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function createNewDateWithEndTime(start, end) {
  const newDate = new Date(start);

  const [hours, minutes] = end.split(":").map(Number); // Convert the split strings into numbers

  newDate.setHours(hours, minutes, 0, 0); // Also reset seconds and milliseconds to 0

  return newDate;
}

export function filterClosestTime(
  currentDate,
  currentReservation,
  currentReservations,
  isFuture
) {
  let closestTime = isFuture ? Infinity : -Infinity;
  let closestIndex = -1;

  if (currentReservation) {
    const res = currentReservations
      .map((reservation, index) => {
        if (reservation._id == currentReservation._id) {
          return currentReservations[isFuture ? index + 1 : index - 1];
        }
      })
      .find((res) => res);
    if (res) {
      return res;
    }
  }

  for (let i = 0; i < currentReservations.length; i++) {
    const startTime = new Date(currentReservations[i].start);
    const endTime = new Date(currentReservations[i].end);
    const time = isFuture ? startTime.getTime() : endTime.getTime();

    if (
      (isFuture && time > currentDate.getTime()) ||
      (!isFuture && time < currentDate.getTime())
    ) {
      const timeDifference = Math.abs(time - currentDate.getTime());
      if (timeDifference < Math.abs(closestTime - currentDate.getTime())) {
        closestTime = time;
        closestIndex = i;
      }
    }
  }
  return closestIndex !== -1 ? currentReservations[closestIndex] : null;
}

export async function getAvailableTables() {
  const capableTables = await Table.find({
    capacity: { $gte: peopleCount },
  });

  const intersectingReservations = await Reservation.find({
    $or: [
      {
        start: {
          $gte: startDate,
          $lte: endDate,
        },
      },
      { end: { $gte: startDate, $lte: endDate } },
    ],
  });

  const capableTableIds = capableTables.map((table) => table._id);

  const intersectingTableIds = intersectingReservations.map(
    (reservation) => reservation.tableId
  );

  const availableTables = capableTableIds
    .filter((tableId) => !intersectingTableIds.includes(tableId))
    .sort(
      (a, b) =>
        Math.abs(a.capacity - peopleCount) - Math.abs(b.capacity - peopleCount)
    );

  if (availableTables.length === 0) {
    return res.status(400).json({
      success: false,
      error: "No available table for the given time",
    });
  }
}

function getBaseUrl() {
  if (typeof window === "undefined") {
    // Server-side
    return process.env.BASEURL || "http://localhost:3000"; // Use relative URLs for server-side calls
  } else {
    // Client-side
    return process.env.NEXT_PUBLIC_BASEURL || "http://localhost:3000"; // This needs to be exposed to the client-side
  }
}

//!!!! For all errors or behavior-to-be-observed, add a comment to the corresponding reservation, table or user!!!!!!

// RESERVATIONS
function isInvalid(reservation) {
  if (
    !reservation.contact ||
    !reservation.name ||
    reservation.peopleCount < 1 ||
    !reservation.start ||
    !reservation.end ||
    !(
      reservation.findBestTable != null ||
      reservation.findBestTable != undefined
    )
  ) {
    return {
      severity: "error",
      message: "Please check all input fields",
      data: reservation,
    };
  }
  const timeDifference = Math.abs(
    reservation.end.getTime() - reservation.start.getTime()
  );
  const differenceInMinutes = timeDifference / (1000 * 60);

  if (differenceInMinutes < 30) {
    return {
      severity: "error",
      message: "Minimum duration are 30min",
      data: reservation,
    };
  }
  return false;
}

async function findBestTable(reservation) {
  let tables = [];
  try {
    tables = (await getTables()).data;
  } catch (e) {
    console.log(e);
    throw { severity: "error", message: "unable to get tables" };
  }

  let availableTables = [];

  tables.forEach((table) => {
    const isIntersecting = table.reservations.some((tableReservation) => {
      const tableReservationStart = new Date(tableReservation.start).getTime();
      const tableReservationEnd = new Date(tableReservation.end).getTime();
      const reservationStart = reservation.start.getTime();
      const reservationEnd = reservation.end.getTime();

      return (
        reservationStart < tableReservationEnd &&
        reservationEnd > tableReservationStart &&
        tableReservation._id != reservation._id
      );
    });

    if (!isIntersecting) {
      availableTables.push(table);
    }
  });

  if (availableTables.length < 1) {
    throw new Error("no available tables found");
  }

  availableTables.sort((a, b) => a.seats - b.seats);
  const suitableTable = availableTables.find(
    (table) => table.seats >= reservation.peopleCount
  );

  if (!suitableTable) {
    throw new Error(
      "no table with that many seats. You can try again with a specific table"
    );
  }

  return suitableTable;
}

export async function getReservations(month) {
  try {
    console.log(`${getBaseUrl()}/api/reservations?month=${month}`);
    const response = await fetch(
      `${getBaseUrl()}/api/reservations?month=${month}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      console.log("response not ok at get all reservations");
      throw data;
    }
    return await response.json();
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getReservation(reservation) {
  try {
    const response = await fetch(
      `${getBaseUrl()}/api/reservations?_id=${reservation._id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      console.log("response not ok at get specific reservation");

      throw data;
    }
    return await response.json();
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function makeReservation(reservation) {
  const errorData = isInvalid(reservation);
  if (errorData) {
    console.log("error in valdiating");
    throw errorData;
  }
  try {
    if (
      (!reservation.tableNumber && reservation.tableNumber != 0) ||
      reservation.findBestTable
    ) {
      const tableNumber = (await findBestTable(reservation)).tableNumber;

      if (!tableNumber && tableNumber != 0) {
        throw { severity: "error", message: "error in find best table" };
      }
      reservation = {
        ...reservation,
        tableNumber: tableNumber,
      };
    }
  } catch (e) {
    console.log("error in finding table");
    console.log(e);
    throw {
      severity: "error",
      message: e.message ? e.message : "unexpected error",
    };
  }

  try {
    const response = await fetch(`${getBaseUrl()}/api/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...reservation,
      }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw data;
    }
    return await response.json();
  } catch (e) {
    console.log("error in make reservation");
    console.log(e);
    throw e;
  }
}

export async function changeReservation(changeReservationId, newReservation) {
  const errorData = isInvalid(newReservation);

  if (errorData) {
    throw errorData;
  }
  try {
    if (
      (!newReservation.tableNumber && newReservation.tableNumber != 0) ||
      newReservation.findBestTable
    ) {
      const tableNumber = await findBestTable(newReservation).tableNumber;
      newReservation = {
        ...newReservation,
        tableNumber: tableNumber,
      };
    }
  } catch (e) {
    console.log(e);
    throw {
      severity: "error",
      message: e.message ? e.message : "unexpected error",
    };
  }

  try {
    const response = await fetch(
      `${getBaseUrl()}/api/reservations?_id=${changeReservationId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newReservation,
        }),
      }
    );
    if (!response.ok) {
      const data = await response.json();
      throw data;
    }
    const res = await response.json();
    console.log(res);
    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function deleteReservation(reservation) {
  try {
    const response = await fetch(
      `${getBaseUrl()}/api/reservations?_id=${reservation._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...reservation,
        }),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      console.log(data);
      throw data;
    }
    const res = await response.json();
    console.log(res);
    return await res;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// TABLES
export async function getTables() {
  try {
    const response = await fetch(`${getBaseUrl()}/api/tables`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      console.log("response not ok at get all tables");
      throw data;
    }
    return await response.json();
  } catch (e) {
    console.log(e);
    throw e;
  }
}
