const timer_p = document.querySelector(".timer");

const pomodoroTime_p = document.querySelector(
  ".pomodoro-time-setting"
).innerHTML;
const shortBreak_p = document.querySelector(
  ".short-break-time-setting"
).innerHTML;
const longBreak_p = document.querySelector(
  ".long-break-time-setting"
).innerHTML;

const start_btn = document.querySelector(".start-button");
const pause_btn = document.querySelector(".pause-button");
const reset_btn = document.querySelector(".reset-button");

let pomodoroTime = parseInt(pomodoroTime_p) * 60000;
let shortBreakTime = parseInt(shortBreak_p) * 60000;
let longBreakTime = parseInt(longBreak_p) * 60000;

let isTimerPaused = false;
let temp;

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}
function convertMsToMinutesSeconds(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.round((milliseconds % 60000) / 1000);

  return seconds === 60
    ? `${minutes + 1}:00`
    : `${minutes}:${padTo2Digits(seconds)}`;
}

function startCountdown() {
  start_btn.hidden = true;

  if (isTimerPaused) {
    isTimerPaused = false;
    pomodoroTime = temp;
  }

  const x = setInterval(function () {
    if (!isTimerPaused) {
      pomodoroTime -= 1000;
      timer_p.innerHTML = convertMsToMinutesSeconds(pomodoroTime);

      if (pomodoroTime <= 0) {
        clearInterval(x);
        start_btn.hidden = false;
      }
    }
  }, 1000);
}
function pauseCountdown() {
  if (isTimerPaused) {
    pomodoroTime = temp;
    pause_btn.innerHTML = "Pause";
    isTimerPaused = false;
  } else {
    temp = pomodoroTime;
    pause_btn.innerHTML = "Continue";
    isTimerPaused = true;
  }
}
function resetCountdown() {
  isTimerPaused = false;
  start_btn.hidden = false;
}

function main() {
  start_btn.addEventListener("click", startCountdown);
  pause_btn.addEventListener("click", pauseCountdown);
  reset_btn.addEventListener("click", resetCountdown);
}

main();
