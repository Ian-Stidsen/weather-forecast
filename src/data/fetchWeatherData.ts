

export async function fetchWeatherData(cityName: string, unit: string): Promise<Object> {
  const WEATHER_API_KEY = import.meta.env.VITE_REACT_APP_WEATHER_API_KEY;
  const LOCATION_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${WEATHER_API_KEY}`;

  
  const locationData = await fetch(LOCATION_API_URL)
    .then(res => res.json());

  
  const lat: Number = locationData[0].lat;
  const lon: Number = locationData[0].lon;
  
  const WEATHER_API_URL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=${unit}&appid=${WEATHER_API_KEY}`;
  
  const weatherData = await fetch(WEATHER_API_URL)
    .then(res => res.json());

  return weatherData;
}