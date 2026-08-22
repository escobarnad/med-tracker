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

render();
