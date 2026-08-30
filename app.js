// --- NFC URL PARAMETER HANDLING ---
const params = new URLSearchParams(window.location.search);
const toggle = params.get("toggle");

// This function flips Breakfast or Lunch in localStorage
function toggleMed(type) {
  if (type === "breakfast") {
    state.breakfastTaken = !state.breakfastTaken;
    state.breakfastTime = state.breakfastTaken ? new Date().toLocaleTimeString() : null;
  }

  if (type === "lunch") {
    state.lunchTaken = !state.lunchTaken;
    state.lunchTime = state.lunchTaken ? new Date().toLocaleTimeString() : null;
  }

  saveState();
  render();
}

// --- EXISTING CODE ---
function loadState() {
  const stored = JSON.parse(localStorage.getItem("medTracker"));
  const today = new Date().toISOString().split("T")[0];

  if (!stored || stored.date !== today) {
    const fresh = {
      date: today,
      breakfastTaken: false,
      breakfastTime: null,
      lunchTaken: false,
      lunchTime: null
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

function render() {
  document.getElementById("breakfastToggle").checked = state.breakfastTaken;
  document.getElementById("breakfastTime").textContent =
    state.breakfastTime ? `Time: ${state.breakfastTime}` : "";

  document.getElementById("lunchToggle").checked = state.lunchTaken;
  document.getElementById("lunchTime").textContent =
    state.lunchTime ? `Time: ${state.lunchTime}` : "";
}

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

// --- APPLY NFC TOGGLE IF PRESENT ---
if (toggle === "breakfast") {
  toggleMed("breakfast");
}

if (toggle === "lunch") {
  toggleMed("lunch");
}

// Optional: clean the URL after toggling
if (toggle) {
  window.history.replaceState({}, document.title, "index.html");
}

render();

