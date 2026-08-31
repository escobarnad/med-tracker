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
  // Meds
  document.getElementById("breakfastToggle").checked = state.breakfastTaken;
  document.getElementById("breakfastTime").textContent =
    state.breakfastTime ? `Time: ${state.breakfastTime}` : "";

  document.getElementById("lunchToggle").checked = state.lunchTaken;
  document.getElementById("lunchTime").textContent =
    state.lunchTime ? `Time: ${state.lunchTime}` : "";

  document.getElementById("nightToggle").checked = state.nightTaken;
  document.getElementById("nightTime").textContent =
    state.nightTime ? `Time: ${state.nightTime}` : "";

  // Teeth
  document.getElementById("brushMorning").checked = state.brushMorning;
  document.getElementById("brushMorningTime").textContent =
    state.brushMorningTime ? `Time: ${state.brushMorningTime}` : "";

  document.getElementById("brushNight").checked = state.brushNight;
  document.getElementById("brushNightTime").textContent =
    state.brushNightTime ? `Time: ${state.brushNightTime}` : "";

  // Milo
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
    lastDate = currentDate;
  }
}, 60000);

/* ------------------------------
   NFC QUICK TOGGLE
------------------------------ */

if (toggle) {
  if (toggle === "breakfast") state.breakfastTaken = !state.breakfastTaken;
  if (toggle === "lunch") state.lunchTaken = !state.lunchTaken;
  if (toggle === "night") state.nightTaken = !state.nightTaken;

  saveState();
  render();
  window.history.replaceState({}, document.title, "index.html");
}

/* ------------------------------
   CAROUSEL LOGIC
------------------------------ */

let currentScreen = 0;
const carousel = document.getElementById("carousel");
const pillTitle = document.getElementById("pillTitle");

const titles = [
  "Meds Tracker",
  "Teeth Cleaning",
  "Milo’s Tracker"
];

function updateScreen() {
  carousel.style.transform = `translateX(-${currentScreen * 100}%)`;
  pillTitle.textContent = titles[currentScreen];
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
   INITIAL RENDER
------------------------------ */

render();
updateScreen();
