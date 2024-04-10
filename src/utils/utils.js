export function formatDate(date) {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function filterClosestTime(currentDate, array, isFuture) {
  console.log(`current Date ${currentDate}`);
  console.log(array);
  let closestTime = isFuture ? Infinity : -Infinity;
  let closestIndex = -1;

  for (let i = 0; i < array.length; i++) {
    const startTime = new Date(array[i].start);
    const endTime = new Date(array[i].end);
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
  console.log(`closestIndex  ${closestIndex}`);
  return closestIndex !== -1 ? array[closestIndex] : null;
}
