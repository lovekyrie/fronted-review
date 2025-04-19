function humanReadable (seconds) {
  // hours 小于99
  const hours = Math.floor(seconds / 3600);
  // minutes 小于59
  const minutes = Math.floor((seconds % 3600) / 60);
  // seconds 小于59
  const remainingSeconds = seconds % 60;

  return [hours, minutes, remainingSeconds].map(dealWithZero).join(':');
}

function dealWithZero(num) {
  return num < 10 ? `0${num}` : num;
}

