check_LS()

let inputCountry = document.getElementById("input-country")
let countriesList = document.getElementById("countries")
let inputCity = document.getElementById("input-city")
let citiesList = document.getElementById("cities")

let theCurrentTime = theClock()

let countries = {

    "العراق": "IQ",

    "مصر": "EG",

    "السعودية": "SA"

}

let cities = {

    "العراق": {
        "الموصل": "IQ-NI",
        "بغداد": "IQ-BG",
        "البصرة": "IQ-BA"
    },

    "مصر": {
        "القاهرة": "EG-C",
        "الاسكندرية": "EG-ALX",
        "أسوان": "EG-ASN"
    },

    "السعودية": {
        "مكة": "SA-02",
        "الرياض": "SA-01",
        "الشرقية": "SA-04"
    },

}

for (const countryNameAndIso of Object.entries(countries)) {
    
    let option = document.createElement("option")
    option.setAttribute("value", countryNameAndIso[0])
    option.dataset.countryIso = countryNameAndIso[1]

    countriesList.appendChild(option)

}

function setTheCountry() {

    citiesList.innerHTML = ""

    if (inputCountry.value != "") {
        
        for (const cityNameAndIso of Object.entries(cities[inputCountry.value])) {
    
            let option = document.createElement("option")
            option.setAttribute("value", cityNameAndIso[0])
            option.dataset.cityIso = cityNameAndIso[1]
    
            citiesList.appendChild(option)
        }
        
    }
    

}

function button() {

    if (inputCountry.value != "" && inputCity.value != "") {

        countriesList.querySelectorAll("option").forEach((o, i) => {
    
            o.value === inputCountry.value ? localStorage.setItem("countryIso", o.dataset.countryIso) : null
        })
    
        citiesList.querySelectorAll("option").forEach((o, i) => {
    
            o.value === inputCity.value ? localStorage.setItem("cityIso", o.dataset.cityIso) : null
        })

        window.location.reload()

        check_LS()
        
    } else {

        swal.fire({

            "title": "Opsss",
            "text": "Please, fill out the fields",
            "icon": "warning",
            "timer": 3000,

        })
        
    }
    
}

function check_LS() {
    
    localStorage.getItem("countryIso") != null ? document.querySelector(".the-layout").style.display = "none" : null

}

function setAgain() {

    localStorage.clear()

    window.location.reload()

}

function mainRoom() {

    changeImages()

    let theCountry = localStorage.getItem("countryIso") || `SA`
    let theCity = localStorage.getItem("cityIso") || `SA-02`

    axios.get(`http://api.aladhan.com/v1/timingsByCity?city=${theCity}&country=${theCountry}`)
    .then((response) => {
        let allData = response.data.data
        let theHijriDate = allData.date.hijri
        let theGregorianDate = allData.date.gregorian
        let thePrayresTimes = allData.timings

        document.getElementById("day-name").innerHTML = theHijriDate.weekday.ar
        document.getElementById("day-h").innerHTML = theHijriDate.day
        document.getElementById("month-h").innerHTML = theHijriDate.month.ar
        document.getElementById("yaer-h").innerHTML = theHijriDate.year

        document.getElementById("sunrise-time").innerHTML = thePrayresTimes.Sunrise

        document.querySelector(".fajr h1").innerHTML = thePrayresTimes.Fajr.slice(0, 2)
        document.querySelector(".fajr b").innerHTML = thePrayresTimes.Fajr.slice(3)
        document.querySelector(".dhuhr h1").innerHTML = thePrayresTimes.Dhuhr.slice(0, 2)
        document.querySelector(".dhuhr b").innerHTML = thePrayresTimes.Dhuhr.slice(3)
        document.querySelector(".asr h1").innerHTML = thePrayresTimes.Asr.slice(0, 2)
        document.querySelector(".asr b").innerHTML = thePrayresTimes.Asr.slice(3)
        document.querySelector(".maghrib h1").innerHTML = thePrayresTimes.Maghrib.slice(0, 2)
        document.querySelector(".maghrib b").innerHTML = thePrayresTimes.Maghrib.slice(3)
        document.querySelector(".isha h1").innerHTML = thePrayresTimes.Isha.slice(0, 2)
        document.querySelector(".isha b").innerHTML = thePrayresTimes.Isha.slice(3)

        let theFajrPray = thePrayresTimes.Fajr
        let theDhuhrPray = thePrayresTimes.Dhuhr
        let theAsrPray = thePrayresTimes.Asr
        let theMaghribPray = thePrayresTimes.Maghrib
        let theIshaPray = thePrayresTimes.Isha

        if (theCurrentTime < theFajrPray) {
            
            document.querySelector(".isha")
            addOnPray(document.querySelector(".fajr"), `current-pray`)

        } if (theCurrentTime > theFajrPray && theCurrentTime < theDhuhrPray) {
            
            document.querySelector(".fajr")
            addOnPray(document.querySelector(".dhuhr"), `current-pray`)

        } if (theCurrentTime > theDhuhrPray && theCurrentTime < theAsrPray) {
            
            document.querySelector(".dhuhr")
            addOnPray(document.querySelector(".asr"), `current-pray`)

        } if (theCurrentTime > theAsrPray && theCurrentTime < theMaghribPray) {
            
            document.querySelector(".asr")
            addOnPray(document.querySelector(".maghrib"), `current-pray`)

        } if (theCurrentTime > theMaghribPray && theCurrentTime <= theIshaPray) {
            
            document.querySelector(".maghrib")
            addOnPray(document.querySelector(".isha"), `current-pray`)

        }

    }).catch((error) => {

        console.log(error);

    })

}
mainRoom()

function theClock() {

    let theDate = new Date()
    let h = theDate.getHours()
    let m = theDate.getMinutes()
    let s = theDate.getSeconds()

    h < 10 ? h = `0${h}` : h
    m < 10 ? m = `0${m}` : m
    s < 10 ? s = `0${s}` : s

    document.getElementById("hours").innerHTML = h
    document.getElementById("minutes").innerHTML = m
    document.getElementById("seconds").innerHTML = s

    window.onload = function() {

        setInterval(theClock, 1000)

    }

    return `${h}:${m}`

}

function addOnPray(thePary, addClass) {

    let hr = document.createElement("hr")
    let q = document.createElement("q")
    let qText = document.createTextNode("{إِنَّ الصَّلاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا}")

    q.appendChild(qText)

    thePary.classList.add(`${addClass}`)

    thePary.append(hr, q)

}

function changeImages() {

    let images = [
        `/images/mosque1.jpg`,
        `/images/mosque2.jpg`,
        `/images/mosque3.jpg`,
        `/images/mosque4.jpg`,
    ]

    
    setInterval(() => {
        let getRandomImage = Math.floor(Math.random() * images.length)
        document.querySelector(".main-img").src = images[getRandomImage]
    }, 15000)

}