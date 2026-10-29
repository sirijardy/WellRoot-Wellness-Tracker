
let date = new Date().toDateString();
let data = JSON.parse(localStorage.getItem("wellRoot")) || {};
if (data.date !== date) data = {};

let water = data.water || 0, sleep = data.sleep || 0;
let foods = data.foods || [], exercises = data.exercises || [];
let tasks = data.tasks || [], habits = data.habits || [false, false, false, false];
let lastQuote = -1;

function save() {
  localStorage.setItem("wellRoot", JSON.stringify({
    date, water, sleep, foods, exercises, tasks, habits
  }));
}

// Quotes: no immediate repeats
function changeQuote() {
  let quotes = [
    "Small steps lead to big changes.",
    "Believe in yourself!",
    "Progress, not perfection.",
    "Your health is your wealth.",
    "Take one day at a time.",
    "You deserve kindness too."
  ];
  let n;
  do { n = Math.floor(Math.random() * quotes.length); }
  while (n === lastQuote);
  lastQuote = n;
  document.getElementById("quote").innerText = quotes[n];
}

// Water
function changeWater(n) {
  water = Math.round(Math.max(0, Math.min(2, water + n)) * 100) / 100;
  waterAmount.innerText = water + " L";
  waterSummary.innerText = water + " L";
  waterBar.style.width = water / 2 * 100 + "%";
  waterMessage.innerText = water === 2 ? "Goal reached! 🎉" : "Keep going!";
  save();
}

// Food: add, edit and delete
function addFood() {
  let name = foodName.value.trim(), cal = Number(calories.value);
  let pro = Number(protein.value);
  if (!name || calories.value === "" || protein.value === "" ||
      !Number.isFinite(cal) || !Number.isFinite(pro) || cal < 0 || pro < 0)
    return alert("Enter valid food details.");

  foods.push({ name, cal, pro });
  foodName.value = calories.value = protein.value = "";
  showFood(); save();
}

function showFood() {
  foodList.innerHTML = "";
  let cal = 0, pro = 0;
  foods.forEach((f, i) => {
    let li = document.createElement("li");
    li.append(document.createTextNode(`${f.name} - ${f.cal} cal, ${f.pro} g protein `));
    let edit = document.createElement("button");
    edit.innerText = "Edit";
    edit.onclick = () => {
      let name = prompt("Food name:", f.name);
      if (name === null) return;
      let c = prompt("Calories:", f.cal);
      if (c === null) return;
      let p = prompt("Protein (g):", f.pro);
      if (p === null) return;
      if (!name.trim() || c.trim() === "" || p.trim() === "" ||
          !Number.isFinite(Number(c)) || !Number.isFinite(Number(p)) ||
          Number(c) < 0 || Number(p) < 0)
        return alert("Enter valid details.");
      foods[i] = { name: name.trim(), cal: Number(c), pro: Number(p) };
      showFood(); save();
    };
    let del = document.createElement("button");
    del.innerText = "Delete";
    del.onclick = () => { foods.splice(i, 1); showFood(); save(); };
    li.append(edit, del); foodList.append(li);
    cal += f.cal; pro += f.pro;
  });
  foodTotal.innerText = `Calories: ${cal} | Protein: ${pro} g`;
}

// Exercise: add, edit and delete
function addExercise() {
  let name = exerciseName.value.trim(), value = exerciseMinutes.value;
  let mins = Number(value);
  if (!name || value === "" || !Number.isFinite(mins) || mins <= 0)
    return alert("Enter a valid activity and minutes.");
  exercises.push({ name, mins });
  exerciseName.value = exerciseMinutes.value = "";
  showExercise(); save();
}

function showExercise() {
  exerciseList.innerHTML = "";
  let total = 0;
  exercises.forEach((e, i) => {
    let li = document.createElement("li");
    li.append(document.createTextNode(`${e.name} - ${e.mins} min `));
    let edit = document.createElement("button");
    edit.innerText = "Edit";
    edit.onclick = () => {
      let name = prompt("Activity name:", e.name);
      if (name === null) return;
      let value = prompt("Minutes:", e.mins);
      if (value === null) return;
      if (!name.trim() || value.trim() === "" ||
          !Number.isFinite(Number(value)) || Number(value) <= 0)
        return alert("Enter valid details.");
      exercises[i] = { name: name.trim(), mins: Number(value) };
      showExercise(); save();
    };
    let del = document.createElement("button");
    del.innerText = "Delete";
    del.onclick = () => { exercises.splice(i, 1); showExercise(); save(); };
    li.append(edit, del); exerciseList.append(li);
    total += e.mins;
  });
  exerciseSummary.innerText = total + " min";
  exerciseTotal.innerText = total + " / 30 minutes";
  exerciseBar.style.width = Math.min(total / 30 * 100, 100) + "%";
  exerciseMessage.innerText = total >= 30 ? "Goal reached! 🎉" : "Keep moving!";
}

// Sleep
function saveSleep() {
  let value = sleepHours.value, n = Number(value);
  if (value === "" || !Number.isFinite(n) || n < 0 || n > 24)
    return alert("Enter sleep hours from 0 to 24.");
  sleep = n; showSleep(); save();
}

function showSleep() {
  sleepAmount.innerText = sleep + " hours";
  sleepSummary.innerText = sleep + " hrs";
  sleepBar.style.width = Math.min(sleep / 8 * 100, 100) + "%";
  sleepMessage.innerText = sleep >= 8 ? "Great sleep! 🌙" : "Rest well!";
  sleepHours.value = sleep || "";
}

// Tasks: add, complete, edit and delete
function addTask() {
  let name = taskName.value.trim();
  if (!name) return alert("Enter a task.");
  tasks.push({ name, done: false });
  taskName.value = ""; showTasks(); save();
}

function showTasks() {
  taskList.innerHTML = "";
  tasks.forEach((t, i) => {
    let li = document.createElement("li");
    let cb = document.createElement("input");
    cb.type = "checkbox"; cb.checked = t.done;
    let span = document.createElement("span");
    span.innerText = t.name;
    if (t.done) span.classList.add("done");
    cb.onchange = () => { tasks[i].done = cb.checked; showTasks(); save(); };

    let edit = document.createElement("button");
    edit.innerText = "Edit";
    edit.onclick = () => {
      let name = prompt("Edit task:", t.name);
      if (name === null) return;
      if (!name.trim()) return alert("Task cannot be empty.");
      tasks[i].name = name.trim(); showTasks(); save();
    };
    let del = document.createElement("button");
    del.innerText = "Delete";
    del.onclick = () => { tasks.splice(i, 1); showTasks(); save(); };
    li.append(cb, span, edit, del); taskList.append(li);
  });
}

// Habits
let boxes = document.querySelectorAll(".habit");

function showHabits() {
  let count = 0;
  boxes.forEach((b, i) => { b.checked = habits[i]; if (b.checked) count++; });
  habitMessage.innerText = count === 4
    ? "All habits completed! 🎉" : count + " of 4 completed";
  habitProgress.innerText = count / 4 * 100 + "% completed";
}

boxes.forEach((b, i) => {
  b.onchange = () => { habits[i] = b.checked; showHabits(); save(); };
});

// Display saved data
changeWater(0);
showFood(); showExercise(); showSleep(); showTasks(); showHabits();




