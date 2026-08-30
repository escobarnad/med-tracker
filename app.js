// --- NFC URL PARAMETER HANDLING ---
const params = new URLSearchParams(window.location.search);
const toggle = params.get("toggle");

// This function flips Breakfast, Lunch, or Night in localStorage
function toggleMed(type) {
  if (type === "breakfast") {
    state.breakfastTaken = !state.breakfastTaken;
    state.breakfastTime = state.breakfastTaken ? new Date().toLocaleTimeString() : null;
  }

  if (type === "lunch") {
    state.lunchTaken = !state.lunchTaken;
    state.lunchTime = state.lunchTaken ? new Date().toLocaleTimeString() : null;
  }

  if (type === "night") {
    state.nightTaken = !state.nightTaken;
    state.nightTime = state.nightTaken ? new Date().toLocaleTimeString() : null;
  }

  saveState();
  render();
}

// --- STATE LOADING ---
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
      nightTime: null
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

// --- RENDER UI ---
function render() {
  // Breakfast
  document.getElementById("breakfastToggle").checked = state.breakfastTaken;
  document.getElementById("breakfastTime").textContent =
    state.breakfastTime ? `Time: ${state.breakfastTime}` : "";

  // Lunch
  document.getElementById("lunchToggle").checked = state.lunchTaken;
  document.getElementById("lunchTime").textContent =
    state.lunchTime ? `Time: ${state.lunchTime}` : "";

  // Night
  document.getElementById("nightToggle").checked = state.nightTaken;
  document.getElementById("nightTime").textContent =
    state.nightTime ? `Time: ${state.nightTime}` : "";
}

// --- EVENT LISTENERS ---
document.getElementById("breakfastToggle").addEventListener("change", (e) => {
  state.breakfastTaken = e.target.checked;
  state.breakfastTime = e.target.checked ? new Date().toLocaleTimeString() : null;
  saveState();
  render();
});

document.getElementById("lunchToggle").addEventListener("change", (e) => {
  state.lunchTaken = e.target.checked;
  state.lunchTime = e.target.checked ? new Date().toLocaleTimeString() : null;
  saveState();
  render();
});

document.getElementById("nightToggle").addEventListener("change", (e) => {
  state.nightTaken = e.target.checked;
  state.nightTime = e.target.checked ? new Date().toLocaleTimeString() : null;
  saveState();
  render();
});

// --- TRUE MIDNIGHT RESET ---
let lastDate = new Date().toISOString().split("T")[0];

setInterval(() => {
  const currentDate = new Date().toISOString().split("T")[0];

  if (currentDate !== lastDate) {
    // New day → reset state
    state = {
      date: currentDate,
      breakfastTaken: false,
      breakfastTime: null,
      lunchTaken: false,
      lunchTime: null,
      nightTaken: false,
      nightTime: null
    };

    saveState();
    render();
    lastDate = currentDate;
  }
}, 60000); // check every minute

// --- APPLY NFC TOGGLE IF PRESENT ---
if (toggle === "breakfast") {
  toggleMed("breakfast");
}

if (toggle === "lunch") {
  toggleMed("lunch");
}

if (toggle === "night") {
  toggleMed("night");
}

// Optional: clean the URL after toggling
if (toggle) {
  window.history.replaceState({}, document.title, "index.html");
}

render();
