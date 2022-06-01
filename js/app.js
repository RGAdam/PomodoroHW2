// ---------------- DOM Cache ----------------
const periodTitle_p = document.querySelector(".actual-period-title");
const timer_p = document.querySelector(".timer");

const halfCircles = document.querySelectorAll(".half-circle");
const halfCircleTop = document.querySelector(".half-circle-top");

const pomodoroSettings_div = document.querySelector(".pomodoro-settings");
const shortBreakSettings_div = document.querySelector(".short-break-settings");
const longBreakSettings_div = document.querySelector(".long-break-settings");

// Need this to be able to change
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
// ---------------- DOM Cache End ----------------

// declaring necessary variables
let pomodoroTime = parseInt(pomodoroTime_p.innerHTML) * 60000;
let shortBreakTime = parseInt(shortBreak_p.innerHTML) * 60000;
let longBreakTime = parseInt(longBreak_p.innerHTML) * 60000;

let isTimerPaused = false;
let interval, temp;
let percentage = 100;
let pomodoroCount = 1;
let currentPeriod = "pomodoro";

// makes it so one-digit numbers appear as two-digit ones with a 0 in front
function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

// converts and formats milliseconds into minutes and seconds
function convertMsToMinutesSeconds(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.round((milliseconds % 60000) / 1000);

  return seconds === 60
    ? `${minutes + 1}:00`
    : `${minutes}:${padTo2Digits(seconds)}`;
}

// converts minutes and seconds into milliseconds
function convertMinSecToMS(string) {
  let stringParts = string.split(":");

  return (stringParts[0] * 60 + stringParts[1]) * 10;
}

// calculates the percentage of a value based on another one
function calculatePercentage(percentageValue, maxPercentageValue) {
  return 100 - (percentageValue / convertMinSecToMS(maxPercentageValue)) * 100;
}

// sets the circle's degree of rotation accordingly to how time is elapsed
function setProgressBar(percentage) {
  let degreeBasedOnPercentage = (percentage / 100) * 360;

  halfCircles.forEach((el) => {
    el.style.transform = `rotate(${degreeBasedOnPercentage}deg)`;

    if (degreeBasedOnPercentage >= 180) {
      halfCircles[0].style.transform = "rotate(180deg)";
      halfCircleTop.style.opacity = "0";
    } else {
      halfCircleTop.style.opacity = "1";
    }
  });
}

// starts the pomodoro timer
function startCountdown() {
  start_btn.hidden = true;
  pause_btn.hidden = false;

  disableSettings();

  // if the timer is paused, this will let it continue from where it was paused
  if (isTimerPaused) {
    isTimerPaused = false;
    pomodoroTime = temp;
  }

  // set an internal with a value of 1 second
  interval = setInterval(function () {
    // if the timer wasn't paused and the current period is pomodoro,
    // this starts the timer from the value that is set
    if (!isTimerPaused && currentPeriod === "pomodoro") {
      pomodoroTime -= 1000;
      // calculates and sets how the circle should be filled
      percentage = calculatePercentage(pomodoroTime, pomodoroTime_p.innerHTML);
      setProgressBar(percentage);

      periodTitle_p.innerHTML = "Pomodoro " + pomodoroCount;
      timer_p.innerHTML = convertMsToMinutesSeconds(pomodoroTime);
      // if the pomodoro timer reaches zero, and it was the fourth (or 8th, 12th, 16th...)
      // it initializes a long break timer
      if (pomodoroTime === 0 && !(pomodoroCount % 4)) {
        new Audio("beep.mp3").play();
        currentPeriod = "longbreak";
        longBreakTime = parseInt(longBreak_p.innerHTML) * 60000;
      }
      // otherwise initializes a short break timer
      else if (pomodoroTime === 0) {
        new Audio("beep.mp3").play();
        currentPeriod = "shortbreak";
        shortBreakTime = parseInt(shortBreak_p.innerHTML) * 60000;
      }
    }
    // starts a short break timer, if the next period is a short break
    else if (!isTimerPaused && currentPeriod === "shortbreak") {
      shortBreakTime -= 1000;
      percentage = calculatePercentage(shortBreakTime, shortBreak_p.innerHTML);
      setProgressBar(percentage);

      periodTitle_p.innerHTML = "Short Break";
      timer_p.innerHTML = convertMsToMinutesSeconds(shortBreakTime);
      if (shortBreakTime === 0) {
        new Audio("beep.mp3").play();
        currentPeriod = "pomodoro";
        pomodoroTime = parseInt(pomodoroTime_p.innerHTML) * 60000;
        pomodoroCount++;
      }
    }
    // starts a long break timer, if the next period is a long break
    else if (!isTimerPaused && currentPeriod === "longbreak") {
      longBreakTime -= 1000;
      percentage = calculatePercentage(longBreakTime, longBreak_p.innerHTML);
      setProgressBar(percentage);

      periodTitle_p.innerHTML = "Long Break";
      timer_p.innerHTML = convertMsToMinutesSeconds(longBreakTime);
      if (longBreakTime === 0) {
        new Audio("beep.mp3").play();
        currentPeriod = "pomodoro";
        pomodoroTime = parseInt(pomodoroTime_p.innerHTML) * 60000;
        pomodoroCount++;
      }
    }
  }, 1000);
}

// saves the timer's position if it gets paused
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

// resets the timer, without resetting the settings the user gave
function resetCountdown() {
  clearInterval(interval);

  isTimerPaused = false;
  start_btn.hidden = false;
  pause_btn.hidden = true;

  enableSettings();

  timer_p.innerHTML = pomodoroTime_p.innerHTML;
  pomodoroTime = parseInt(pomodoroTime_p.innerHTML) * 60000;
  pomodoroCount = 1;
  currentPeriod = "pomodoro";
}

// functions for the +/- button
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

// disable or enable all setting buttons in one line
function disableSettings() {
  pomodoroPlus_btn.disabled = true;
  pomodoroMinus_btn.disabled = true;
  shortBreakPlus_btn.disabled = true;
  shortBreakMinus_btn.disabled = true;
  longBreakPlus_btn.disabled = true;
  longBreakMinus_btn.disabled = true;
}
function enableSettings() {
  pomodoroPlus_btn.disabled = false;
  pomodoroMinus_btn.disabled = false;
  shortBreakPlus_btn.disabled = false;
  shortBreakMinus_btn.disabled = false;
  longBreakPlus_btn.disabled = false;
  longBreakMinus_btn.disabled = false;
}

// adds event listeners to all the buttons
function addEventListeners() {
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

addEventListeners();
