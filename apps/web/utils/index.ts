export const minutesToSeconds = (time: number) => time * 60;
export const secondsToMinutes = (time: number) => time / 60;
export const formatTime = (time: number) => time < 10 ? `0${time}` : time;

export const format = (time: number) => {
  const minutes = Math.floor(secondsToMinutes(time));
  const seconds = time - minutesToSeconds(minutes);
  const minutesFormatted = formatTime(minutes);
  const secondsFormatted = formatTime(seconds);
  return `${minutesFormatted}:${secondsFormatted}`;
};