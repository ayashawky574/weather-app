const UI = {};

   
document.querySelectorAll("[id]").forEach(el => {
    UI[el.id] = el;
});

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function updateDates(){
let date = new Date();
UI.today.innerText =days[date.getDay()] ;
UI.todayDate.innerText= date.getDate()+months[date.getMonth()];
UI.tomorrow.innerText = days[(date.getDay()+1)%7] ;
UI.afterTomorrow.innerText = days[(date.getDay()+2)%7]
}

updateDates()

 function getLocation(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }else{
        alert("Geolocation is not supported by this browser.")
    }
}


let lat ;
let long;
async function showPosition(position){
     lat =position.coords.latitude;
    long = position.coords.longitude;
    await getWeather(lat ,long) 
    // getForecast(currentCity)
}

getLocation()

async function getWeather( latitude , longitude ){
    try{
        let response = await fetch(`http://api.weatherapi.com/v1/current.json?key=a482a46e2e404e61ab7170048251211&q=${latitude+","+longitude }`);
let data =await response.json();
UI.degree.innerHTML = data.current.temp_c + `<sup>o</sup>c`;
UI.forecastIcon.src= data.current.condition.icon;
UI.stateWeather.innerText = data.current.condition.text;
let currentLocation = data.location.name ;
UI.locationName.innerText = currentLocation; 
UI.cloud.innerText = data.current.cloud + "%" ;
UI.gust.innerText = data.current.gust_kph;
UI.wind.innerText = data.current.wind_dir;
await getForecast(currentLocation)
    }catch(err){
        console.log("getWeatherError");
        
    }
}

async function getForecast(q){
    try{
        let response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=a482a46e2e404e61ab7170048251211&q=${q}&days=3`)
    let data =await response.json();
    let latCity ,longCity;
    UI.seconddayForecastImg.src = data.forecast.forecastday[1].day.condition.icon;
    UI.tomorrowForecastImg.src = data.forecast.forecastday[2].day.condition.icon;
    UI.maxTemp.innerHTML = data.forecast.forecastday[1].day.maxtemp_c +  `<sup>o</sup>c`;
    UI.maxTomorrow.innerHTML = data.forecast.forecastday[2].day.maxtemp_c +  `<sup>o</sup>c`;
    UI.minTemp.innerHTML = data.forecast.forecastday[1].day.mintemp_c +  `<sup>o</sup>c`;
    UI.minTomorrow.innerHTML = data.forecast.forecastday[2].day.mintemp_c +  `<sup>o</sup>c`;
   UI.forecastprag.innerText = data.forecast.forecastday[1].day.condition.text;
   UI.tomorrowPrag.innerText = data.forecast.forecastday[2].day.condition.text;
   latCity = data.location.lat;
   longCity = data.location.lon;
   return [latCity,longCity]
    }catch(err){
        console.log("getForecastError");
    }
    
}

async function searchCityName(cityName){
    try{
       let response =await fetch(`http://api.weatherapi.com/v1/search.json?key=a482a46e2e404e61ab7170048251211&q=${cityName}`);
    let data = await response.json();
    cityName = data[0]?.name;
    return cityName;
    }catch(err){
        console.log("searchCityNameError");
    }
}

UI.searchInput.addEventListener("input",async function(){
       const input = UI.searchInput.value;
        if (input != ""){
            const city = await searchCityName(input)
          let [lat,long] = await getForecast(city)
             getWeather(lat,long)
        }
})

