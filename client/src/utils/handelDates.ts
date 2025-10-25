function handelDates(oldDate: Date | string): string {
  const oldDateObj = typeof oldDate === "string" ? new Date(oldDate) : oldDate;
  const currentTime = Date.now();
  const differenceInMs = currentTime - oldDateObj.getTime();
  const differenceInSeconds = Math.floor(differenceInMs / 1000);
  const differenceInMinutes = Math.floor(differenceInMs / (1000 * 60));
  const differenceInHours = Math.floor(differenceInMs / (1000 * 60 * 60));
  const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
  const differenceInWeeks = Math.floor(
    differenceInMs / (1000 * 60 * 60 * 24 * 7)
  );
  
  if (differenceInSeconds < 60) {
    return `Last update: ${differenceInSeconds} second${
      differenceInSeconds !== 1 ? "s" : ""
    } ago`;
  } else if (differenceInMinutes < 60) {
    return `Last update: ${differenceInMinutes} minute${
      differenceInMinutes !== 1 ? "s" : ""
    } ago`;
  } else if (differenceInHours < 24) {
    return `Last update: ${differenceInHours} hour${
      differenceInHours !== 1 ? "s" : ""
    } ago`;
  } else if (differenceInDays < 7) {
    return `Last update: ${differenceInDays} day${
      differenceInDays !== 1 ? "s" : ""
    } ago`;
  } else {
    return `Last update: ${differenceInWeeks} week${
      differenceInWeeks !== 1 ? "s" : ""
    } ago`;
  }
}

export default handelDates;
