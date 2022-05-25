const periodTitle_p = document.querySelector(".actual-period-title");
const timer_p = document.querySelector(".timer");

const pomodoroSettings_div = document.querySelector(".pomodoro-settings");
const shortBreakSettings_div = document.querySelector(".short-break-settings");
const longBreakSettings_div = document.querySelector(".long-break-settings");

let pomodoroTime_p = pomodoroSettings_div.querySelector(
  ".pomodoro-time-setting"
);
let shortBreak_p = shortBreakSettings_div.querySelector(
  ".short-break-time-setting"
);
let longBreak_p = longBreakSettings_div.querySelector(
  ".long-break-time-setting"
);

const pomodoroPlus_btn = pomodoroSettings_div.querySelector(".plus-button");
const pomodoroMinus_btn = pomodoroSettings_div.querySelector(".minus-button");
const shortBreakPlus_btn = shortBreakSettings_div.querySelector(".plus-button");
const shortBreakMinus_btn =
  shortBreakSettings_div.querySelector(".minus-button");
const longBreakPlus_btn = longBreakSettings_div.querySelector(".plus-button");
const longBreakMinus_btn = longBreakSettings_div.querySelector(".minus-button");

const start_btn = document.querySelector(".start-button");
const pause_btn = document.querySelector(".pause-button");
const reset_btn = document.querySelector(".reset-button");

let pomodoroTime = parseInt(pomodoroTime_p.innerHTML) * 60000;
let shortBreakTime = parseInt(shortBreak_p.innerHTML) * 60000;
let longBreakTime = parseInt(longBreak_p.innerHTML) * 60000;

let interval;
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
  pause_btn.hidden = false;

  activateSettings();

  if (isTimerPaused) {
    isTimerPaused = false;
    pomodoroTime = temp;
  }

  interval = setInterval(function () {
    if (!isTimerPaused) {
      pomodoroTime -= 1000;
      timer_p.innerHTML = convertMsToMinutesSeconds(pomodoroTime);

      if (pomodoroTime <= 0) {
        clearInterval(interval);
        pause_btn.hidden = true;
        start_btn.hidden = false;

        disableSettings();
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
  clearInterval(interval);

  isTimerPaused = false;
  start_btn.hidden = false;
  pause_btn.hidden = true;

  disableSettings();

  timer_p.innerHTML = pomodoroTime_p.innerHTML;
  pomodoroTime = parseInt(pomodoroTime_p.innerHTML) * 60000;
}

function increasePomodoroSetting() {
  pomodoroTime += 60000;
  pomodoroTime_p.innerHTML = convertMsToMinutesSeconds(pomodoroTime);
  timer_p.innerHTML = convertMsToMinutesSeconds(pomodoroTime);
}
function decreasePomodoroSetting() {
  if (pomodoroTime > 60000) {
    pomodoroTime -= 60000;
    pomodoroTime_p.innerHTML = convertMsToMinutesSeconds(pomodoroTime);
    timer_p.innerHTML = convertMsToMinutesSeconds(pomodoroTime);
  }
}
function increaseShortBreakSetting() {
  shortBreakTime += 60000;
  shortBreak_p.innerHTML = convertMsToMinutesSeconds(shortBreakTime);
}
function decreaseShortBreakSetting() {
  if (shortBreakTime > 60000) {
    shortBreakTime -= 60000;
    shortBreak_p.innerHTML = convertMsToMinutesSeconds(shortBreakTime);
  }
}
function increaseLongBreakSetting() {
  longBreakTime += 60000;
  longBreak_p.innerHTML = convertMsToMinutesSeconds(longBreakTime);
}
function decreaseLongBreakSetting() {
  if (longBreakTime > 60000) {
    longBreakTime -= 60000;
    longBreak_p.innerHTML = convertMsToMinutesSeconds(longBreakTime);
  }
}

function activateSettings() {
  pomodoroPlus_btn.disabled = true;
  pomodoroMinus_btn.disabled = true;
  shortBreakPlus_btn.disabled = true;
  shortBreakMinus_btn.disabled = true;
  longBreakPlus_btn.disabled = true;
  longBreakMinus_btn.disabled = true;
}

function disableSettings() {
  pomodoroPlus_btn.disabled = false;
  pomodoroMinus_btn.disabled = false;
  shortBreakPlus_btn.disabled = false;
  shortBreakMinus_btn.disabled = false;
  longBreakPlus_btn.disabled = false;
  longBreakMinus_btn.disabled = false;
}

function main() {
  timer_p.innerHTML = pomodoroTime_p.innerHTML;

  start_btn.addEventListener("click", startCountdown);
  pause_btn.addEventListener("click", pauseCountdown);
  reset_btn.addEventListener("click", resetCountdown);

  pomodoroPlus_btn.addEventListener("click", increasePomodoroSetting);
  pomodoroMinus_btn.addEventListener("click", decreasePomodoroSetting);
  shortBreakPlus_btn.addEventListener("click", increaseShortBreakSetting);
  shortBreakMinus_btn.addEventListener("click", decreaseShortBreakSetting);
  longBreakPlus_btn.addEventListener("click", increaseLongBreakSetting);
  longBreakMinus_btn.addEventListener("click", decreaseLongBreakSetting);
}

main();
