const usertab = document.querySelector("#userweather");
const searchtab = document.querySelector("#searchweather");
const usercontainer = document.querySelector(".weather_container");
const grantaccescontainer = document.querySelector(".grant_location_container");
const searchform = document.querySelector("#searchForm");
const loading_screen = document.querySelector(".loading_cont");
const userInfo_cont = document.querySelector(".user_info_cont");

let oldTab = usertab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current_tab");
getfromsessionStorage();

function switchTab(newTab) {
  if (newTab !== oldTab) {
    oldTab.classList.remove("current_tab");
    oldTab = newTab;
    oldTab.classList.add("current_tab");
    if (!searchform.classList.contains("active")) {
      userInfo_cont.classList.remove("active");
      grantaccescontainer.classList.remove("active");
      searchform.classList.add("active");
    } else {
      searchform.classList.remove("active");
      userInfo_cont.classList.remove("active");
      getfromsessionStorage();
    }
  }
}

usertab.addEventListener("click", () => switchTab(usertab));
searchtab.addEventListener("click", () => switchTab(searchtab));

function getfromsessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    grantaccescontainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchWeatherInfo(coordinates);
  }
}

async function fetchWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  grantaccescontainer.classList.remove("active");
  loading_screen.classList.add("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loading_screen.classList.remove("active");
    userInfo_cont.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loading_screen.classList.remove("active");
    alert("Failed to fetch weather info. Please try again.");
    grantaccescontainer.classList.add("active");
  }
}

function renderWeatherInfo(weatherInfo) {
  const cityname = document.querySelector(".city_Name");
  const countryIcon = document.querySelector(".countryicon");
  const descrip = document.querySelector(".weather_info");
  const weatherIcon = document.querySelector(".weather_icon");
  const Temp = document.querySelector(".temp");
  const windSpeed = document.querySelector(".data_windspeed");
  const Humidity = document.querySelector(".data_humidity");
  const CloudData = document.querySelector(".data_clouds");

  cityname.innerHTML = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country?.toLowerCase()}.png`;
  descrip.innerHTML = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  Temp.innerHTML = weatherInfo?.main?.temp;
  windSpeed.innerHTML = weatherInfo?.wind?.speed;
  Humidity.innerHTML = weatherInfo?.main?.humidity;
  CloudData.innerHTML = weatherInfo?.clouds?.all;
}

function getlocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("No Geolocation support available");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchWeatherInfo(userCoordinates);
}

const grantbtn = document.querySelector("#grant_btn");
grantbtn.addEventListener("click", getlocation);

const searchInput = document.querySelector("#searchinput");

searchform.addEventListener("submit", (e) => {
  e.preventDefault();
  const cityName = searchInput.value;
  if (cityName !== "") {
    fetchSearchedweatherInfo(cityName);
  }
});

async function fetchSearchedweatherInfo(city) {
  loading_screen.classList.add("active");
  userInfo_cont.classList.remove("active");
  grantaccescontainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loading_screen.classList.remove("active");
    userInfo_cont.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loading_screen.classList.remove("active");
    alert("Couldn't find the data");
  }
}
