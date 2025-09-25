// -------<<< Get and Map Date & Time >>>--------
let checkBtn = document.getElementById("checkBtn")
let cityCountryMainTxt = document.getElementById("cityCountryMainTxt")

let crntTime = document.getElementById("crntTime");
let crntDate = document.getElementById("crntDate");

let fajrName = document.getElementById("fajrName")
let dhuhrName = document.getElementById("dhuhrName")
let asrName = document.getElementById("asrName")
let maghribName = document.getElementById("maghribName")
let ishaName = document.getElementById("ishaName")

let fajrTime = document.getElementById("fajrTime")
let dhuhrTime = document.getElementById("dhuhrTime")
let asrTime = document.getElementById("asrTime")
let maghribTime = document.getElementById("maghribTime")
let ishaTime = document.getElementById("ishaTime")

function currentDateTime() {
    let now = new Date();

    // Date
    let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    let date = `${months[now.getMonth()]} ${now.getDate()}`;
    let year = now.getFullYear();

    // Hours in 12-hour format
    let hours = now.getHours();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, "0");

    // Minutes + Seconds
    let minutes = String(now.getMinutes()).padStart(2, "0");
    let seconds = String(now.getSeconds()).padStart(2, "0");

    crntDate.textContent = `${date}, ${year}`;
    crntTime.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
}

currentDateTime()
setInterval(currentDateTime , 1000);

// -------<<< Get and Map Namaz Timmings >>>--------

function nmztimchk(){
    
    let cityInp = document.getElementById("cityInp").value.trim();
    let countryInp = document.getElementById("countryInp").value.trim();

    if (!cityInp || !countryInp) {
        alert("Please enter both city and country");
        return;
    }

    axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${cityInp}&country=${countryInp}&method=1`)
    
    .then((result) => {

        console.log(result);
        let timings = result.data.data.timings
        console.log(timings);

        // Save data in localStorage
        localStorage.setItem("lastCity" , cityInp)
        localStorage.setItem("lastCountry" , countryInp)
        localStorage.setItem("lastTimings" , JSON.stringify(timings))

        // Show heading
        cityCountryMainTxt.textContent = `${cityInp}, ${countryInp}`;

        // Show timings
        showTimings(timings)

    })
    .catch((err) => {
        console.log("error => " , err);
    });

}

function showTimings(timings) {

    const namazName$Tim = [
        { name: "Salat al-Fajr"   , time: timings.Fajr },
        { name: "Salat al-Dhuhr"  , time: timings.Dhuhr },
        { name: "Salat al-Asr"    , time: timings.Asr },
        { name: "Salat al-Maghrib", time: timings.Maghrib },
        { name: "Salat al-Isha"   , time: timings.Isha }
    ];

    const allNameElements = [ fajrName , dhuhrName , asrName , maghribName , ishaName ];
    const allTimingElements = [ fajrTime , dhuhrTime , asrTime , maghribTime , ishaTime ];

    namazName$Tim.forEach( (namaz , i) => {
        allNameElements[i].textContent = namaz.name
        
        // String -> Hours + Minutes
        let [hrs , min] = namaz.time.split(":").map(Number)
        hrs = parseInt(hrs, 10);
        min = parseInt(min, 10);

        // AM/PM calculate
        let ampm = hrs >= 12 ? "PM" : "AM";
        hrs = hrs % 12 || 12;
        hrs = String(hrs).padStart(2, "0");
        min = String(min).padStart(2, "0");

        // Show in UI
        allTimingElements[i].textContent = `${hrs}:${min} ${ampm}`
    });

}

window.addEventListener("load" , () => {
    let savedTimings = localStorage.getItem("lastTimings");

    if (savedTimings) {
        showTimings(JSON.parse(savedTimings))
        document.getElementById("cityInp").value = localStorage.getItem("lastCity") || ""
        document.getElementById("countryInp").value = localStorage.getItem("lastCountry") || ""

        // Show heading on reload
        cityCountryMainTxt.textContent = `${localStorage.getItem("lastCity")}, ${localStorage.getItem("lastCountry")}`
    }
})

// check btn
checkBtn.addEventListener("click", nmztimchk);
