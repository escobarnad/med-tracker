/* ------------------------------
   COLOR SYSTEM
------------------------------ */

const screenColors = [
  "#3cb371", // green
  "#1abcbd", // teal
  "#3b82f6"  // blue
];

const pastelColors = [
  "rgba(60, 179, 113, 0.15)", // green pastel
  "rgba(26, 188, 189, 0.15)", // teal pastel
  "rgba(59, 130, 246, 0.15)"  // blue pastel
];

/* ------------------------------
   STATE MANAGEMENT
------------------------------ */

const params = new URLSearchParams(window.location.search);
const toggle = params.get("toggle");

function loadState() {
  const stored = JSON.parse(localStorage.getItem("medTracker"));
  const today = new Date().toISOString().split("T")[0];

  if (!stored || stored.date !== today) {
    const fresh = {
      date: today,

      breakfastTaken: false,
      breakfastTime: null,

      lunchTaken: false,
      lunchTime: null,

      nightTaken: false,
      nightTime: null,

      brushMorning: false,
      brushMorningTime: null,

      brushNight: false,
      brushNightTime: null,

      miloBreakfast: false,
      miloBreakfastTime: null,

      miloLunch: false,
      miloLunchTime: null,

      miloSnackie: false,
      miloSnackieTime: null,

      miloDinner: false,
      miloDinnerTime: null,

      miloBrushTeeth: false,
      miloBrushTeethTime: null
    };

    localStorage.setItem("medTracker", JSON.stringify(fresh));
    return fresh;
  }

  return stored;
}

let state = loadState();

function saveState() {
  localStorage.setItem("medTracker", JSON.stringify(state));
}

/* ------------------------------
   RENDER UI
------------------------------ */

function render() {
  document.getElementById("breakfastToggle").checked = state.breakfastTaken;
  document.getElementById("breakfastTime").textContent =
    state.breakfastTime ? `Time: ${state.breakfastTime}` : "";

  document.getElementById("lunchToggle").checked = state.lunchTaken;
  document.getElementById("lunchTime").textContent =
    state.lunchTime ? `Time: ${state.lunchTime}` : "";

  document.getElementById("nightToggle").checked = state.nightTaken;
  document.getElementById("nightTime").textContent =
    state.nightTime ? `Time: ${state.nightTime}` : "";

  document.getElementById("brushMorning").checked = state.brushMorning;
  document.getElementById("brushMorningTime").textContent =
    state.brushMorningTime ? `Time: ${state.brushMorningTime}` : "";

  document.getElementById("brushNight").checked = state.brushNight;
  document.getElementById("brushNightTime").textContent =
    state.brushNightTime ? `Time: ${state.brushNightTime}` : "";

  document.getElementById("miloBreakfast").checked = state.miloBreakfast;
  document.getElementById("miloBreakfastTime").textContent =
    state.miloBreakfastTime ? `Time: ${state.miloBreakfastTime}` : "";

  document.getElementById("miloLunch").checked = state.miloLunch;
  document.getElementById("miloLunchTime").textContent =
    state.miloLunchTime ? `Time: ${state.miloLunchTime}` : "";

  document.getElementById("miloSnackie").checked = state.miloSnackie;
  document.getElementById("miloSnackieTime").textContent =
    state.miloSnackieTime ? `Time: ${state.miloSnackieTime}` : "";

  document.getElementById("miloDinner").checked = state.miloDinner;
  document.getElementById("miloDinnerTime").textContent =
    state.miloDinnerTime ? `Time: ${state.miloDinnerTime}` : "";

  document.getElementById("miloBrushTeeth").checked = state.miloBrushTeeth;
  document.getElementById("miloBrushTeethTime").textContent =
    state.miloBrushTeethTime ? `Time: ${state.miloBrushTeethTime}` : "";
}

/* ------------------------------
   EVENT LISTENERS
------------------------------ */

function addToggleListener(id, stateKey, timeKey) {
  document.getElementById(id).addEventListener("change", (e) => {
    state[stateKey] = e.target.checked;
    state[timeKey] = e.target.checked ? new Date().toLocaleTimeString() : null;
    saveState();
    render();
    applyColors();
  });
}

addToggleListener("breakfastToggle", "breakfastTaken", "breakfastTime");
addToggleListener("lunchToggle", "lunchTaken", "lunchTime");
addToggleListener("nightToggle", "nightTaken", "nightTime");

addToggleListener("brushMorning", "brushMorning", "brushMorningTime");
addToggleListener("brushNight", "brushNight", "brushNightTime");

addToggleListener("miloBreakfast", "miloBreakfast", "miloBreakfastTime");
addToggleListener("miloLunch", "miloLunch", "miloLunchTime");
addToggleListener("miloSnackie", "miloSnackie", "miloSnackieTime");
addToggleListener("miloDinner", "miloDinner", "miloDinnerTime");
addToggleListener("miloBrushTeeth", "miloBrushTeeth", "miloBrushTeethTime");

/* ------------------------------
   MIDNIGHT RESET
------------------------------ */

let lastDate = new Date().toISOString().split("T")[0];

setInterval(() => {
  const currentDate = new Date().toISOString().split("T")[0];

  if (currentDate !== lastDate) {
    state = loadState();
    saveState();
    render();
    applyColors();
    lastDate = currentDate;
  }
}, 60000);

/* ------------------------------
   CAROUSEL LOGIC + ANIMATIONS
------------------------------ */

let currentScreen = 0;
const carousel = document.getElementById("carousel");
const pillTitle = document.getElementById("pillTitle");
const screens = document.querySelectorAll(".screen");

function applyColors() {
  const color = screenColors[currentScreen];
  const pastel = pastelColors[currentScreen];

  pillTitle.style.backgroundColor = color;

  document.getElementById("prevScreen").style.backgroundColor = color;
  document.getElementById("nextScreen").style.backgroundColor = color;

  document.querySelectorAll(".toggle-label").forEach((label) => {
    label.style.backgroundColor = pastel;

    const slider = label.querySelector(".slider");
    const input = label.querySelector("input");

    slider.style.backgroundColor = input.checked ? color : "#cfd3d6";
  });
}

function updateScreen() {
  screens.forEach((screen) => screen.classList.remove("active", "dimmed"));

  screens[currentScreen].classList.add("dimmed");

  carousel.style.transform = `translateX(-${currentScreen * 100}%)`;

  setTimeout(() => {
    screens.forEach((screen, index) => {
      screen.classList.remove("active", "dimmed");

      if (index === currentScreen) {
        screen.classList.add("active");
      } else {
        screen.classList.add("dimmed");
      }
    });
  }, 120);

  pillTitle.textContent = ["Meds Tracker", "Teeth Cleaning", "Milo’s Tracker"][currentScreen];
  applyColors();
}

document.getElementById("nextScreen").addEventListener("click", () => {
  currentScreen = (currentScreen + 1) % 3;
  updateScreen();
});

document.getElementById("prevScreen").addEventListener("click", () => {
  currentScreen = (currentScreen - 1 + 3) % 3;
  updateScreen();
});

/* ------------------------------
   SWIPE SUPPORT
------------------------------ */

let startX = 0;

carousel.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

carousel.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;

  if (endX < startX - 50) {
    currentScreen = (currentScreen + 1) % 3;
  } else if (endX > startX + 50) {
    currentScreen = (currentScreen - 1 + 3) % 3;
  }

  updateScreen();
});

/* ------------------------------
   NFC QUICK TOGGLE (FINAL WORKING VERSION)
------------------------------ */

const nfcMap = {
  breakfast: ["breakfastTaken", "breakfastTime", 0],
  lunch: ["lunchTaken", "lunchTime", 0],
  night: ["nightTaken", "nightTime", 0],

  brushMorning: ["brushMorning", "brushMorningTime", 1],
  brushNight: ["brushNight", "brushNightTime", 1],

  miloBreakfast: ["miloBreakfast", "miloBreakfastTime", 2],
  miloLunch: ["miloLunch", "miloLunchTime", 2],
  miloSnackie: ["miloSnackie", "miloSnackieTime", 2],
  miloDinner: ["miloDinner", "miloDinnerTime", 2],
  miloBrushTeeth: ["miloBrushTeeth", "miloBrushTeethTime", 2]
};

if (toggle && nfcMap[toggle]) {
  const [stateKey, timeKey, screenIndex] = nfcMap[toggle];

  state[stateKey] = !state[stateKey];
  state[timeKey] = state[stateKey] ? new Date().toLocaleTimeString() : null;

  saveState();

  currentScreen = screenIndex;

  render();
  updateScreen();
  applyColors();

  window.history.replaceState({}, document.title, window.location.pathname);
}

/* ------------------------------
   INITIAL RENDER
------------------------------ */

render();
updateScreen();
