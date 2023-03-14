const url =
  "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&precipitation_unit=inch&timeformat=unixtime&timezone=Asia%2FSingapore";

  const onemore = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=15.920188&lon=78.353791&key=1ec25e27d08e4ad3a59f4c9be961d961'

  const currentW = 'https://api.weatherbit.io/v2.0/current?lat=15.920188&lon=78.353791&key=1ec25e27d08e4ad3a59f4c9be961d961';

  const ingCode = 'https://www.weatherbit.io/static/img/icons/t01d.png';

  import axios from "axios";

export function getWeather(lat, lon, timezone) {
  return axios.get(url).then(({ data }) => {
    console.log( data);
    return {
      current: passCurrentWeather(data),
      daily: passDailyWeather(data),
      hourly: passHourlyWeather(data),
    };
  });

  //  axios.get("https://api.open-meteo.com/v1/forecast",{
  //  params:{
  //      lat:lat,
  //      long:lon,

  //  },
  // })
}

function passCurrentWeather({ current_weather, daily } = data) {
  const {
    temperature: currentTemp,
    windspeed: windSpeed,
    weathercode: iconcode,
  } = current_weather;

  const {
    temperature_2m_max: [maxTemp],
    temperature_2m_min: [minTemp],
    apparent_temperature_max: [maxFeelsLike],
    apparent_temperature_min: [minFeelsLike],
    precipitation_sum: [precip],
  } = daily;

  // this below code is works as same as above one
  // const maxTemp = daily.temprature_2m_max[0]

  return {
    currentTemp: Math.round(currentTemp),
    highTemp: Math.round(maxTemp),
    lowTemp: Math.round(minTemp),
    highFL: Math.round(maxFeelsLike),
    lowFL: Math.round(minFeelsLike),
    windSpeed: Math.round(windSpeed),
    precip: Math.round(precip * 100) / 100,
    iconcode,
  };
}

function passDailyWeather({ daily }) {
  return daily.time.map((time, index) => {
    return {
      timestamp: time * 1000,
      iconcode: daily.weathercode[index],
      maxTemp: Math.round(daily.temperature_2m_max[index]),
    };
  });
}

function passHourlyWeather({ hourly, current_weather }) {
  return hourly.time
    .map((time, index) => {
      return {
        timestamp: time * 1000,
        iconcode: hourly.weathercode[index],
        temp: Math.round(hourly.temperature_2m[index]),
        feelsLike: Math.round(hourly.apparent_temperature[index]),
        windspeed: Math.round(hourly.windspeed_10m[index]),
        precip: Math.round(hourly.precipitation[index] * 100) / 100,
      };
    })
    .filter(({ timestamp }) => timestamp >= current_weather.time * 1000);
}
