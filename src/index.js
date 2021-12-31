import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import './style.css'

const inputCity = document.querySelector('#input_city')
let cityName = document.querySelector('.city_name')
let time = document.querySelector('.time')
let temp = document.querySelector('.temp')
// let feelLike = document.querySelector('.feel_like')
let humidityContent = document.querySelector('.humidity_content')
let humidityIcon = document.querySelector('.humidity_icon')
let weatherMain = document.querySelector('.weather_main')
let tempCheck = document.querySelector('#temp_check')
let weatherImg = document.querySelector('.weather_img')
let windSpeedIcon = document.querySelector('.wind_speed_icon')
let windSpeedContent = document.querySelector('.wind_speed_content')
let daily = document.querySelector('.daily')

inputCity.addEventListener('keyup', (e)=>{
  if(e.key == 'Enter'){
    if(tempCheck.checked) console.log('checked');
    getWeather(inputCity.value, tempCheck.checked)
  }
})

tempCheck.addEventListener('click', ()=>{
  getWeather(inputCity.value, tempCheck.checked)
})

async function getWeather(city, metric){
  try{
    let response
    getPosition(city).then(async (pos)=>{
      console.log(pos);
      if(!metric) {

        response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${pos.lat}&lon=${pos.lon}&appid=4f9643411dff19c1ecb502653bb56ef3&exclude=hourly,minutely&units=metric`)
      }
      else {
        response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${pos.lat}&lon=${pos.lon}&appid=4f9643411dff19c1ecb502653bb56ef3&exclude=hourly,minutely`)
      }
      if(!response.ok) {
        console.log('loi roi');
        Toastify({
          text: "Invalid city name",
        
          style: {
            background: "#FFCA28",
          }
        }).showToast();
      }
      else{
        const data = await response.json()
        console.log(data);
        getDaily(data)
        time.querySelector('.date').textContent = getDateFromDT(data.current.dt).date
        time.querySelector('.hour').textContent = getDateFromDT(data.current.dt).hour
        cityName.textContent = pos.name
        temp.innerHTML = '<i class="bi bi-thermometer-half"></i>' + data.current.temp + ' &deg' + (metric ? 'F' : 'C')
        // feelLike.innerHTML = data.current.feels_like + ' &deg' + (metric ? 'F' : 'C')
        humidityIcon.innerHTML = '<i class="bi bi-moisture"></i>'
        humidityContent.textContent = data.current.humidity + '%'

        windSpeedIcon.innerHTML = '<i class="bi bi-wind"></i>'
        windSpeedContent.textContent =  data.current.wind_speed

        weatherMain.textContent = data.current.weather[0].main
        weatherImg.innerHTML = getImgFromWeather(weatherMain.textContent)
      }
    })

  }
  catch (e) {
    console.log('heheh')
  }
}

function getDateFromDT(dt){
  var date = new Date(dt * 1000).toDateString();
  let timee = new Date(dt * 1000);
  // console.log(date);
  // console.log(time);
  let hour = timee.getHours() + ':' + timee.getMinutes();
  return {date, hour}
}

// getDateFromDT(1640577600)

async function getPosition(city){
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4f9643411dff19c1ecb502653bb56ef3`)
  if(!res.ok){
    console.log('loi roi');
    Toastify({
      text: "Invalid city name",
      position: "center",
      style: {
        background: "#FFCA28",
      }
    }).showToast();
  }
  else{
    const data = await res.json()
    let name = data.name
    let lon = data.coord.lon
    let lat = data.coord.lat
    return {name, lon, lat}
  }
}

function getDaily(data){
  console.log(data.daily);
  daily.innerHTML = ''
  let dailyWeather = data.daily
  if(tempCheck.checked){
    for(let i=1; i<=7; i++){
      let num = new Date(dailyWeather[i].dt * 1000).getDay()
      daily.innerHTML += `<div class="daily_item">
                              <div class="daily_date">${getDayFromNumber(num)}</div>
                              <div class="daily_temp_max">${dailyWeather[i].temp.max} &degF</div>
                              <div class="daily_temp_min">${dailyWeather[i].temp.min} &degF</div>
                              <div class="daily_weather">${getImgFromWeather(dailyWeather[i].weather[0].main)}</div>
                          </div>`
    }
  }
  else{
    for(let i=1; i<=7; i++){
      let num = new Date(dailyWeather[i].dt * 1000).getDay()
      daily.innerHTML += `<div class="daily_item">
                              <div class="daily_date">${getDayFromNumber(num)}</div>
                              <div class="daily_temp_max">${dailyWeather[i].temp.max} &degC</div>
                              <div class="daily_temp_min">${dailyWeather[i].temp.min} &degC</div>
                              <div class="daily_weather">${getImgFromWeather(dailyWeather[i].weather[0].main)}</div>
                          </div>`
    }
  }
}

function getDayFromNumber(num){
  switch (num) {
    case 0: return 'Sunday'
    case 1: return 'Monday'
    case 2: return 'Tuesday'
    case 3: return 'Wednesday'
    case 4: return 'Thursday'
    case 5: return 'Friday'
    case 6: return 'Saturday'
  }
}

function getImgFromWeather(weather){
  switch (weather){
    case 'Clouds': return '<i class="bi bi-clouds"></i>'
    case 'Rain': return '<i class="bi bi-cloud-rain"></i>'
    case 'Mist': return '<i class="bi bi-cloud-fog2"></i>'
    case 'Snow': return '<i class="bi bi-cloud-snow"></i>'
    default: return '<i class="bi bi-stars"></i>'
  }
}

