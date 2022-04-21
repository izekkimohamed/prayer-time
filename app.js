const circleFirst = document.querySelector(".first");
const circleThird = document.querySelector(".third");
const iftar = document.querySelector(".iftar");
const prayersList = document.querySelector(".prayers-list");
const nextPrayerName = document.querySelector(".next-prayer__name");
const nextPrayerTime = document.querySelector(".next-prayer__time");
const date = document.querySelector(".date");
const time = document.querySelector(".time");
const strokeLengthFirst = circleFirst.getTotalLength();
const strokeLengthThird = circleThird.getTotalLength();
let timings;
const today = moment().format("DD-MMM-YYYY");
const tomorrow = moment().add(1, "days").format("DD-MMM-YYYY");
async function fetchData() {
  let city = prompt("Enter your CITY name");
  let country = prompt("Enter your COUNTRY name");
  if (city && country) {
    const [todayTimings, tomorrowTimings] = await Promise.all([
      fetch(
        `https://api.aladhan.com/v1/timingsByCity/${today}?city=${city}&country=${country}&method=12`,
      ),
      fetch(
        `https://api.aladhan.com/v1/timingsByCity/${tomorrow}?city=${city}&country=${country}&method=12`,
      ),
    ]);

    const data = await Promise.all([
      todayTimings.json(),
      tomorrowTimings.json(),
    ]);
    timings = {
      todayTimings: formatPrayers(data[0].data),
      tomorrowTimings: formatPrayers(data[1].data),
    };
    displayPrayers();
    displayDate();
    showNextPrayer();
    showIftar();
  } else {
    alert("Please enter your city and country name");
    city = prompt("Enter your CITY name");
    country = prompt("Enter your COUNTRY name");
  }
}
function formatPrayers(data) {
  const prayers = [
    {
      name: "الفجر",
      time: data.timings.Fajr,
    },
    {
      name: "الشروق",
      time: data.timings.Sunrise,
    },
    {
      name: "الظهر",
      time: data.timings.Dhuhr,
    },
    {
      name: "العصر",
      time: data.timings.Asr,
    },
    {
      name: "المغرب",
      time: data.timings.Maghrib,
    },
    {
      name: "العشاء",
      time: data.timings.Isha,
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
    const li = document.createElement("li");
    li.innerHTML = `<span>${prayer.time}</span><span>:</span><span>${prayer.name}</span>`;
    prayersList.appendChild(li);
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

    const remainingTime = moment().diff(
      moment(`${prayers.date},${nextPrayer.time}`),
    );
    if (remainingTime < 0) {
      nextPrayerTime.innerHTML = getRemainingTime(remainingTime);
      nextPrayerName.innerHTML = nextPrayer.name;
      circleThird.style.strokeDashoffset =
        (-strokeLengthThird * remainingTime) / (24 * 60 * 60 * 1000);
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

const showIftar = () => {
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
      circleFirst.style.strokeDashoffset =
        (strokeLengthFirst * remaining) / total;
    }
  }, 1000);
};

function displayDate() {
  const { day, weekday, month, year } = timings.todayTimings.todayDate;
  const today = moment().format("ddd MMM YY");
  const hijri = `${year} ${weekday.ar} ${day}  ${month.ar}`;
  date.innerHTML = `<h3>${today}</h3>  <h3>${hijri}</h3> `;
  setInterval(() => {
    const currentTime = moment().format("hh:mm:ss");
    time.innerHTML = `<h3> ${currentTime} </h3>`;
  }, 1000);
}
fetchData();
