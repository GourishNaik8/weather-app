import { ICON_MAP } from "./iconMap";
import "./style.css";
import { getWeather } from "./weather";

getWeather().then(renderWeather);
//   .catch((e) => {
//     console.error(e);
//     alert("Error getting Weather Info!");
//   });

function renderWeather({ current, daily, hourly }) {
  renderCurrent(current);
  renderDaily(daily);
  renderHourly(hourly);
  setTimeout(() => {
    document.body.querySelector("[data-loader]").remove();
    document.body.querySelector("[data-weather]").classList.remove("hide");
  }, 3000);
}

// chunk function

function setValue(selectior, val, { parent = document } = {}) {
  parent.querySelector(`[data-${selectior}]`).textContent = val;
}

function getIconUrl(iconcode) {
  return `icons/${ICON_MAP.get(iconcode)}.svg`;
}

const currentIcon = document.querySelector("[data-current-icon]");

function renderCurrent(current) {
  currentIcon.src = getIconUrl(current.iconcode);
  setValue("current-temp", current.currentTemp);
  setValue("current-high", current.highTemp);
  setValue("current-low", current.lowTemp);
  setValue("current-fl-high", current.highFL);
  setValue("current-fl-low", current.lowFL);
  setValue("current-wind", current.windSpeed);
  setValue("current-precip", current.precip);
}

// daily report

const DAY_FORMAT = new Intl.DateTimeFormat(undefined, { weekday: "long" });

const dailySection = document.querySelector("[data-day-section]");
const dayCardTemplate = document.getElementById("day-card-template");

function renderDaily(daily) {
  dailySection.innerHTML = "";
  daily.forEach((day) => {
    const ele = dayCardTemplate.content.cloneNode(true);
    setValue("day", DAY_FORMAT.format(day.timestamp), { parent: ele });
    setValue("temp", day.maxTemp, { parent: ele });
    ele.querySelector("[data-icon]").src = getIconUrl(day.iconcode);
    dailySection.append(ele);
  });
}

// hourly report

const HOUR_FORMAT = new Intl.DateTimeFormat(undefined, { hour: "numeric" });

const hourlySection = document.querySelector("[data-hour-section]");
const HourRowTemplate = document.getElementById("hour-row-template");

function renderHourly(hourly) {
  console.log(hourly);
  hourlySection.innerHTML = "";
  hourly.forEach((hr) => {
    const ele = HourRowTemplate.content.cloneNode(true);
    setValue("time", HOUR_FORMAT.format(hr.timestamp), { parent: ele });
    setValue("temp", hr.temp, { parent: ele });
    setValue("day", DAY_FORMAT.format(hr.timestamp), { parent: ele });
    setValue("fl-temp", hr.feelsLike, { parent: ele });
    setValue("wind", hr.windspeed, { parent: ele });
    setValue("percip", hr.precip, { parent: ele });
    ele.querySelector("[data-icon]").src = getIconUrl(hr.iconcode);
    hourlySection.append(ele);
  });
}
