// -------<<< Get and Map Date & Time >>>--------
let crntTime = document.getElementById("crntTime");
let crntDate = document.getElementById("crntDate");

function currentDateTime() {
    let now = new Date();

    // Date
    let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    let date = `${months[now.getMonth()]} ${now.getDate()}`;
    let year = now.getFullYear();

    // Hours in 12-hour format
    let hours = now.getHours();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

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
        
    let userCity = document.getElementById("cityInp")
    let userCountry = document.getElementById("countryInp")
    
    axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${userCity}&country=${userCountry}&method=1`)
    
    .then((result) => {
        let timings = result.data.data.timings
        console.log(timings);

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

            // AM/PM calculate
            let ampm = hrs >= 12 ? "PM" : "AM";
            hrs = hrs % 12 || 12;
            hrs = String(hrs).padStart(2, "0"); 
            min = String(min).padStart(2, "0");

            // Show in UI
            allTimingElements[i].textContent = `${hrs}:${min} ${ampm}`
        });

    })
    .catch((err) => {
        console.log("error => " , err);
    });

}
nmztimchk()