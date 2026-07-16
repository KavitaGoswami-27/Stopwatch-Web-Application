
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


let startTime = 0;
let elapsedTime = 0;
let interval = null;
let running = false;

let lapNumber = 1;
let lapTimes = [];

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


function updateDateTime(){

    const now = new Date();

    currentDate.textContent =
        "📅 " + now.toDateString();

    currentClock.textContent =
        "🕒 " + now.toLocaleTimeString();

}

setInterval(updateDateTime,1000);

updateDateTime();


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


function pauseStopwatch(){

    if(!running) return;

    clearInterval(interval);

    running = false;

    statusText.innerHTML = "🟡 Paused";

}

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

function updateStatistics(){

    lapCount.textContent = lapTimes.length;

    if(lapTimes.length === 0){

        bestLap.textContent = "--";
        avgLap.textContent = "--";
        return;

    }

    let fastest = Math.min(...lapTimes);

    bestLap.textContent = formatTime(fastest);

    let total = lapTimes.reduce((sum,value)=>sum+value,0);

    let average = Math.floor(total / lapTimes.length);

    avgLap.textContent = formatTime(average);

}


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

startBtn.addEventListener("click",startStopwatch);

pauseBtn.addEventListener("click",pauseStopwatch);

resetBtn.addEventListener("click",resetStopwatch);

lapBtn.addEventListener("click",addLap);


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

document.addEventListener("keydown", function (event) {

    if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
    ) {
        return;
    }

    if (event.code === "Space") {

        event.preventDefault();

        if (running) {

            pauseStopwatch();

        } else {

            startStopwatch();

        }

    }

    if (event.key.toLowerCase() === "l") {

        addLap();

    }

    if (event.key.toLowerCase() === "r") {

        resetStopwatch();

    }

});

downloadBtn.addEventListener("click", function () {

    if (lapTimes.length === 0) {

        alert("No lap times to export!");

        return;

    }

    let text = "====== STOPWATCH ======\n\n";

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


console.log("Stopwatch Loaded Successfully!");

const allButtons = document.querySelectorAll("button");

allButtons.forEach(button => {

    button.addEventListener("click", function(){

        button.style.transform = "scale(0.95)";

        setTimeout(() => {

            button.style.transform = "";

        },150);

    });

});

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


const oldAddLap=addLap;

addLap=function(){

    oldAddLap();

    highlightBestLap();

};

let minuteShown=false;

setInterval(function(){

    if(elapsedTime>=60000 && !minuteShown){

        minuteShown=true;

        alert("🎉 Congratulations!\n\nYou completed 1 Minute!");

    }

},1000);


function checkAchievements(){

    if(lapTimes.length===10){

        alert("🏁 Awesome!\n\n10 Laps Completed.");

    }

}


const previousLap=addLap;

addLap=function(){

    previousLap();

    checkAchievements();

};

window.addEventListener("load",function(){

    document.querySelector(".container").style.opacity="0";

    document.querySelector(".container").style.transform="translateY(40px)";

    setTimeout(function(){

        document.querySelector(".container").style.transition=".8s";

        document.querySelector(".container").style.opacity="1";

        document.querySelector(".container").style.transform="translateY(0px)";

    },200);

});

console.log("====================================");
console.log(" Stopwatch Ready 🚀");
console.log(" Developed using HTML CSS JavaScript");
console.log("====================================");