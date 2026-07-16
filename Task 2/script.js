// ==========================
// PREMIUM STOPWATCH
// Part 3A
// ==========================

// Elements

const display = document.getElementById("display");
const statusText = document.getElementById("status");

const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const lapBtn = document.getElementById("lap");

const lapList = document.getElementById("lapList");

const lapCount = document.getElementById("lapCount");
const bestLap = document.getElementById("bestLap");
const avgLap = document.getElementById("avgLap");

const themeBtn = document.getElementById("themeBtn");

const currentDate = document.getElementById("currentDate");
const currentClock = document.getElementById("currentClock");

const downloadBtn = document.getElementById("download");

// Stopwatch Variables

let startTime = 0;
let elapsedTime = 0;
let interval = null;
let running = false;

// Lap Variables

let lapNumber = 1;
let lapTimes = [];

// ==========================
// Update Stopwatch Display
// ==========================

function updateDisplay(){

    let time = elapsedTime;

    let hours = Math.floor(time / 3600000);

    let minutes = Math.floor((time % 3600000) / 60000);

    let seconds = Math.floor((time % 60000) / 1000);

    let milliseconds = time % 1000;

    display.textContent =
        String(hours).padStart(2,'0') + " : " +
        String(minutes).padStart(2,'0') + " : " +
        String(seconds).padStart(2,'0') + " : " +
        String(milliseconds).padStart(3,'0');

}

// ==========================
// Live Date & Clock
// ==========================

function updateDateTime(){

    const now = new Date();

    currentDate.textContent =
        "📅 " + now.toDateString();

    currentClock.textContent =
        "🕒 " + now.toLocaleTimeString();

}

setInterval(updateDateTime,1000);

updateDateTime();

// ==========================
// Start Stopwatch
// ==========================

function startStopwatch(){

    if(running) return;

    startTime = Date.now() - elapsedTime;

    interval = setInterval(function(){

        elapsedTime = Date.now() - startTime;

        updateDisplay();

    },10);

    running = true;

    statusText.innerHTML = "🟢 Running";

}

// ==========================
// Pause Stopwatch
// ==========================

function pauseStopwatch(){

    if(!running) return;

    clearInterval(interval);

    running = false;

    statusText.innerHTML = "🟡 Paused";

}

// ==========================
// Reset Stopwatch
// ==========================

function resetStopwatch(){

    clearInterval(interval);

    running = false;

    elapsedTime = 0;

    lapNumber = 1;

    lapTimes = [];

    lapList.innerHTML = "";

    lapCount.textContent = "0";

    bestLap.textContent = "--";

    avgLap.textContent = "--";

    updateDisplay();

    statusText.innerHTML = "🔴 Stopped";

}

updateDisplay();
// ==========================
// Part 3B
// Lap Functions & Statistics
// ==========================

// Convert milliseconds into HH : MM : SS : MS format
function formatTime(time){

    let hours = Math.floor(time / 3600000);

    let minutes = Math.floor((time % 3600000) / 60000);

    let seconds = Math.floor((time % 60000) / 1000);

    let milliseconds = time % 1000;

    return (
        String(hours).padStart(2,'0') + " : " +
        String(minutes).padStart(2,'0') + " : " +
        String(seconds).padStart(2,'0') + " : " +
        String(milliseconds).padStart(3,'0')
    );

}

// ==========================
// Calculate Statistics
// ==========================

function updateStatistics(){

    lapCount.textContent = lapTimes.length;

    if(lapTimes.length === 0){

        bestLap.textContent = "--";
        avgLap.textContent = "--";
        return;

    }

    // Best Lap
    let fastest = Math.min(...lapTimes);

    bestLap.textContent = formatTime(fastest);

    // Average Lap
    let total = lapTimes.reduce((sum,value)=>sum+value,0);

    let average = Math.floor(total / lapTimes.length);

    avgLap.textContent = formatTime(average);

}

// ==========================
// Add Lap
// ==========================

function addLap(){

    if(!running){

        alert("Start the stopwatch first!");

        return;

    }

    lapTimes.push(elapsedTime);

    const li = document.createElement("li");

    li.innerHTML = `
        <span>🏁 Lap ${lapNumber}</span>
        <strong>${formatTime(elapsedTime)}</strong>
    `;

    lapList.prepend(li);

    lapNumber++;

    updateStatistics();

}

// ==========================
// Button Events
// ==========================

startBtn.addEventListener("click",startStopwatch);

pauseBtn.addEventListener("click",pauseStopwatch);

resetBtn.addEventListener("click",resetStopwatch);

lapBtn.addEventListener("click",addLap);
// ==========================
// Part 3C
// Theme, Keyboard & Export
// ==========================

// --------------------------
// Dark / Light Mode
// --------------------------

let darkMode = false;

themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark");

    darkMode = !darkMode;

    if (darkMode) {

        themeBtn.innerHTML = "☀️ Light Mode";

    } else {

        themeBtn.innerHTML = "🌙 Dark Mode";

    }

});

// --------------------------
// Keyboard Shortcuts
// --------------------------

document.addEventListener("keydown", function (event) {

    // Ignore shortcuts while typing
    if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
    ) {
        return;
    }

    // Space = Start / Pause
    if (event.code === "Space") {

        event.preventDefault();

        if (running) {

            pauseStopwatch();

        } else {

            startStopwatch();

        }

    }

    // L = Lap
    if (event.key.toLowerCase() === "l") {

        addLap();

    }

    // R = Reset
    if (event.key.toLowerCase() === "r") {

        resetStopwatch();

    }

});

// --------------------------
// Export Lap Times
// --------------------------

downloadBtn.addEventListener("click", function () {

    if (lapTimes.length === 0) {

        alert("No lap times to export!");

        return;

    }

    let text = "====== PREMIUM STOPWATCH ======\n\n";

    text += "Lap Times\n\n";

    lapTimes.forEach(function (time, index) {

        text +=
            "Lap " +
            (index + 1) +
            " : " +
            formatTime(time) +
            "\n";

    });

    text += "\n";

    text += "Total Laps : " + lapTimes.length + "\n";

    if (lapTimes.length > 0) {

        text +=
            "Best Lap : " +
            formatTime(Math.min(...lapTimes)) +
            "\n";

        let avg =
            lapTimes.reduce((a, b) => a + b, 0) /
            lapTimes.length;

        text +=
            "Average Lap : " +
            formatTime(Math.floor(avg));

    }

    const blob = new Blob([text], {
        type: "text/plain"
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "LapTimes.txt";

    link.click();

});

// --------------------------
// Welcome Message
// --------------------------

console.log("Premium Stopwatch Loaded Successfully!");
// ==========================
// Part 3D
// Premium Features
// ==========================

// --------------------------
// Button Click Animation
// --------------------------

const allButtons = document.querySelectorAll("button");

allButtons.forEach(button => {

    button.addEventListener("click", function(){

        button.style.transform = "scale(0.95)";

        setTimeout(() => {

            button.style.transform = "";

        },150);

    });

});

// --------------------------
// Stopwatch Glow Effect
// --------------------------

function updateGlow(){

    if(running){

        display.style.textShadow =
            "0 0 15px #00ffcc, 0 0 30px #00ffcc";

    }

    else{

        display.style.textShadow = "none";

    }

}

setInterval(updateGlow,100);

// --------------------------
// Highlight Best Lap
// --------------------------

function highlightBestLap(){

    if(lapTimes.length===0) return;

    const items = lapList.querySelectorAll("li");

    items.forEach(item=>{

        item.style.border="none";

        item.style.background="rgba(255,255,255,.15)";

    });

    const best=Math.min(...lapTimes);

    lapTimes.forEach((time,index)=>{

        if(time===best){

            const li=items[items.length-1-index];

            if(li){

                li.style.border="2px solid gold";

                li.style.background="rgba(255,215,0,.25)";

            }

        }

    });

}

// Run after every lap

const oldAddLap=addLap;

addLap=function(){

    oldAddLap();

    highlightBestLap();

};

// --------------------------
// Achievement Messages
// --------------------------

let minuteShown=false;

setInterval(function(){

    if(elapsedTime>=60000 && !minuteShown){

        minuteShown=true;

        alert("🎉 Congratulations!\n\nYou completed 1 Minute!");

    }

},1000);

// --------------------------
// 10 Lap Achievement
// --------------------------

function checkAchievements(){

    if(lapTimes.length===10){

        alert("🏁 Awesome!\n\n10 Laps Completed.");

    }

}

// Override Again

const previousLap=addLap;

addLap=function(){

    previousLap();

    checkAchievements();

};

// --------------------------
// Welcome Animation
// --------------------------

window.addEventListener("load",function(){

    document.querySelector(".container").style.opacity="0";

    document.querySelector(".container").style.transform="translateY(40px)";

    setTimeout(function(){

        document.querySelector(".container").style.transition=".8s";

        document.querySelector(".container").style.opacity="1";

        document.querySelector(".container").style.transform="translateY(0px)";

    },200);

});

// --------------------------
// Footer Console Message
// --------------------------

console.log("====================================");
console.log(" Premium Stopwatch Ready 🚀");
console.log(" Developed using HTML CSS JavaScript");
console.log("====================================");