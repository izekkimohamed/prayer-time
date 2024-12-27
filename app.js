const circleFirst = document.querySelector(".first");
const circleThird = document.querySelector(".third");
const iftar = document.querySelector(".iftar");
const iftarWrraper = document.querySelector(".iftar-wrapper");
const prayersList = document.querySelector(".prayer-times");
const nextPrayerName = document.querySelector(".next-prayer__name");
const nextPrayerTime = document.querySelector(".next-prayer__time");
const date = document.querySelector(".date");
const time = document.querySelector(".time");
const cityName = document.querySelector(".location-name");

let timings;
const today = moment().format("DD-MMM-YYYY");
const tomorrow = moment().add(1, "days").format("DD-MMM-YYYY");
async function fetchData() {
  const { city, country } = await getIPLocation();

  if (city && country) {
    const [todayTimings, tomorrowTimings] = await Promise.all([
      fetch(
        `https://api.aladhan.com/v1/timingsByCity/${today}?city=${city}&country=${country}&method=12`,
      ),
      fetch(
        `https://api.aladhan.com/v1/timingsByCity/${tomorrow}?city=${city}&country=${country}&method=12`,
      ),
    ]);

    const data = await Promise.all([todayTimings.json(), tomorrowTimings.json()]);
    const ramadan = data[0].data.date.hijri.month.ar === "رمضان";

    timings = {
      todayTimings: formatPrayers(data[0].data),
      tomorrowTimings: formatPrayers(data[1].data),
    };
    displayPrayers();
    displayDate();
    cityName.innerHTML = `${city} - ${country}`;
    showNextPrayer();
    showIftar(ramadan);
  } else {
    alert("Please enter your city and country name");
    city = prompt("Enter your CITY name");
    country = prompt("Enter your COUNTRY name");
  }
}

/*
<div class="prayer-item">
          <span class="prayer-icon fajr">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-cloud-moon"
            >
              <path d="M10.188 8.5A6 6 0 0 1 16 4a1 1 0 0 0 6 6 6 6 0 0 1-3 5.197" />
              <path d="M13 16a3 3 0 1 1 0 6H7a5 5 0 1 1 4.9-6Z" />
            </svg>
          </span>
          <span class="prayer-name">Fajr</span>
          <span class="prayer-time">5:37 am</span>
        </div>
        <div class="prayer-item">
          <span class="prayer-icon sunrise">
           
          </span>
          <span class="prayer-name">Sunrise</span>
          <span class="prayer-time">6:42 am</span>
        </div>
        <div class="prayer-item">
          <span class="prayer-icon dhuhr">
            
          </span>
          <span class="prayer-name">Dhuhr</span>
          <span class="prayer-time">12:10 pm</span>
        </div>
        <div class="prayer-item">
          <span class="prayer-icon asr">
            
          </span>
          <span class="prayer-name">Asr</span>
          <span class="prayer-time">3:16 pm</span>
        </div>
        <div class="prayer-item">
          <span class="prayer-icon maghrib">
            
          </span>
          <span class="prayer-name">Maghrib</span>
          <span class="prayer-time">5:38 am</span>
        </div>
        <div class="prayer-item">
          <span class="prayer-icon isha">
            
          </span>
          <span class="prayer-name">Isha'a</span>
          <span class="prayer-time">6:43 pm</span>
        </div>
*/

function formatPrayers(data) {
  const prayers = [
    {
      name: "الفجر",
      time: data.timings.Fajr,
      svg: `<svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-cloud-moon"
            >
              <path d="M10.188 8.5A6 6 0 0 1 16 4a1 1 0 0 0 6 6 6 6 0 0 1-3 5.197" />
              <path d="M13 16a3 3 0 1 1 0 6H7a5 5 0 1 1 4.9-6Z" />
            </svg>`,
    },
    {
      name: "الشروق",
      time: data.timings.Sunrise,
      svg: ` <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 2v8" />
              <path d="m4.93 10.93 1.41 1.41" />
              <path d="M2 18h2" />
              <path d="M20 18h2" />
              <path d="m19.07 10.93-1.41 1.41" />
              <path d="M22 22H2" />
              <path d="m8 6 4-4 4 4" />
              <path d="M16 18a4 4 0 0 0-8 0" />
            </svg>`,
    },
    {
      name: "الظهر",
      time: data.timings.Dhuhr,
      svg: `<svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-sun"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>`,
    },
    {
      name: "العصر",
      time: data.timings.Asr,
      svg: `<svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-cloud-sun"
            >
              <path d="M12 2v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="M20 12h2" />
              <path d="m19.07 4.93-1.41 1.41" />
              <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" />
              <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" />
            </svg>`,
    },
    {
      name: "المغرب",
      time: data.timings.Maghrib,
      svg: `<svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-sunset"
            >
              <path d="M12 10V2" />
              <path d="m4.93 10.93 1.41 1.41" />
              <path d="M2 18h2" />
              <path d="M20 18h2" />
              <path d="m19.07 10.93-1.41 1.41" />
              <path d="M22 22H2" />
              <path d="m16 6-4 4-4-4" />
              <path d="M16 18a4 4 0 0 0-8 0" />
            </svg>`,
    },
    {
      name: "العشاء",
      time: data.timings.Isha,
      svg: `<svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-moon"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>`,
    },
  ];
  const date = data.date;
  return {
    prayers,
    date: date.readable,
    todayDate: date.hijri,
  };
}
function displayPrayers() {
  const { todayTimings, tomorrowTimings } = timings;
  const lastPrayer = todayTimings.prayers[todayTimings.prayers.length - 1];

  const prayers =
    moment(`${todayTimings.date},${lastPrayer.time}`) > moment()
      ? todayTimings.prayers
      : tomorrowTimings.prayers;

  prayers.forEach((prayer) => {
    const div = document.createElement("div");
    div.classList.add("prayer-item");
    div.innerHTML = `
          <span class="prayer-icon">
            ${prayer.svg}
          </span>
          <span class="prayer-name">${prayer.name}</span>
          <span class="prayer-time">${prayer.time}</span>`;
    prayersList.appendChild(div);
  });
}
function showNextPrayer() {
  const { todayTimings, tomorrowTimings } = timings;
  let i = 0;
  const holdTime = 15 * 60 * 1000; // 15 minutes
  const now = moment().format("HH:mm");
  const todayPrayers = todayTimings.prayers.filter(
    (prayer) => prayer.time + holdTime > now,
  );
  const tomorrowPrayers = tomorrowTimings.prayers;
  setInterval(() => {
    const prayers =
      todayPrayers.length > 0
        ? {
            prayers: todayPrayers,
            date: todayTimings.date,
          }
        : {
            prayers: tomorrowPrayers,
            date: tomorrowTimings.date,
          };
    const nextPrayer = prayers.prayers[i];

    const remainingTime = moment().diff(moment(`${prayers.date},${nextPrayer.time}`));
    if (remainingTime < 0) {
      nextPrayerTime.innerHTML = getRemainingTime(remainingTime);
      // nextPrayerName.innerHTML = nextPrayer.name;
      // circleThird.style.strokeDashoffset =
      //   (-strokeLengthThird * remainingTime) / (24 * 60 * 60 * 1000);
    } else if (remainingTime < holdTime) {
      nextPrayerTime.innerHTML = "الان";
      nextPrayerName.innerHTML = nextPrayer.name;
    } else {
      i = i + 1; // move to next prayer
    }
  }, 1000);
}

function getDate(time) {
  const data = timings.todayTimings;
  return new Date(`${data.date} ,${time}`).getTime();
}

function getRemainingTime(time) {
  const sec = 1000;
  const min = sec * 60;
  const hour = min * 60;
  function addZero(num) {
    return num < 10 ? "0" + num : num;
  }
  let remainingTime = time < 0 ? time * -1 : time;
  const remainigHour = addZero(Math.floor(remainingTime / hour));
  const remainigMin = addZero(Math.floor((remainingTime % hour) / min));
  const remainigSec = addZero(Math.floor((remainingTime % min) / sec));
  if (time < 0) {
    return `-${remainigHour} : ${remainigMin} : ${remainigSec}`;
  } else {
    return `${remainigHour} : ${remainigMin} : ${remainigSec}`;
  }
}

const showIftar = (ramadan) => {
  if (!ramadan) {
    return;
  }
  iftarWrraper.style.visibility = "visible";
  const { date, prayers } = timings.todayTimings;
  const hold = 30 * 60 * 1000; // 30 minutes

  const total = moment(`${date},${prayers[0].time}`).diff(
    moment(`${date},${prayers[4].time}`),
  );
  if (moment() < moment(`${date},${prayers[0].time}`)) {
    iftar.innerHTML = "";

    circleFirst.style.strokeDashoffset = strokeLengthFirst;
    return;
  }
  if (moment() > moment(`${date},${prayers[4].time}`)) {
  }

  const interval = setInterval(() => {
    const remaining = moment().diff(moment(`${date},${prayers[4].time}`));

    if (remaining > 0 && remaining < hold) {
      iftar.innerHTML = `<h3 class="iftar-name">
      حان وقت الافطار
      </h3>
      `;
      circleFirst.style.strokeDashoffset = 0;
    } else if (remaining + hold > hold) {
      iftar.innerHTML = "";
      circleFirst.style.strokeDashoffset = 0;
      clearInterval(interval);
    } else {
      iftar.innerHTML = `
      <h3 class="iftar-name"> الافطار </h3>
      <h3 class="time">
      ${getRemainingTime(remaining)}
      </h3>
      `;
      circleFirst.style.strokeDashoffset = (strokeLengthFirst * remaining) / total;
    }
  }, 1000);
};

function displayDate() {
  const { day, weekday, month, year } = timings.todayTimings.todayDate;
  const today = moment().format("dddd DD MMMM  YYYY");
  const hijri = `${year} ${weekday.ar} ${day}  ${month.ar}`;
  date.innerHTML = `<span>${today}</span> <br/> <span>${hijri}</span> `;
  setInterval(() => {
    const currentTime = moment().format("hh:mm");
    time.innerHTML = `<span> ${currentTime} </span>`;
  }, 1000);
}
fetchData();

async function getPublicIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP:", error);
  }
}

async function getIPLocation() {
  const ip = await getPublicIP();
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const locationData = await response.json();

    return {
      city: locationData.city,
      region: locationData.region,
      country: locationData.country_name,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      timezone: locationData.timezone,
    };
  } catch (error) {
    console.error("Error fetching IP location:", error);
  }
}
