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

export const formatProgressSong = (time:number, remaining = false) => {
  var minutes = Math.floor(time / 60000);
  var seconds = ((time % 60000) / 1000).toFixed(0);
  const result = `${minutes}:${(Number(seconds) < 10 ? '0' : '')}${seconds}`;
  return remaining ? `-${result}`: result;
};