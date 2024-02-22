import { useEffect, useState } from 'react'
import './App.css'
import PropTypes from "prop-types";

/* Images */
import searchIcon from './assets/buscar.png'
import clearIcon from  './assets/dom.png'
import cloudIcon from './assets/nublado.png'
import drizzleIcon from './assets/llovizna.png'
import rainIcon from './assets/lluvia.png'
import snowIcon from './assets/nevando.png'
import humidityIcon from './assets/humedad.png'
import windIcon from './assets/viento.png'

const WeatherDetails = ({icon, temp, city, country, lat, long, humidity, wind}) => {
  return (
    <>
      <div className='image'>
        <img src={icon} alt="Image" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className='lat'>latitud</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='long'>longitud</span>
          <span>{long}</span>
        </div>
      </div>
      <div className='data-container'>
        <div className='element'>
          <img src={humidityIcon} alt="humidity" className='icon'/>
          <div className='data'>
            <div className='humidity-percent'>{humidity}%</div>
            <div className='text'>Humedad</div>
          </div>
        </div>
        <div className='element'>
          <img src={windIcon} alt="humidity" className='icon'/>
          <div className='data'>
            <div className='humidity-percent'>{wind} km/h</div>
            <div className='text'>Velocidad de Viento</div>
          </div>
        </div>
      </div>
    </>
  );
}

WeatherDetails.PropTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  long: PropTypes.number.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
}

function App() {

  let apiKey = "d48f1c747285c595b7bf69c83836e4fb";
  const [text, setText] = useState("Lima");

  const [icon, setIcon] = useState(clearIcon)
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading,  setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  }

  const search = async () => {
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apiKey}&units=Metric`;
    try {
      let res = await fetch(url);
      let data = await res.json();
      console.log(data);
      if(data.cod === "404"){
        console.error("Ciudad no encontrada")
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat)
      setLong(data.coord.lon)
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);
    }catch (error){
      console.log("Ha ocurrido un error", error.message);
      setError("Ha ocurrido un error al obtener datos meteorológicos")
    }finally{
      setLoading(false);
    }
  }

  const handleCity = (e) => {
    setText(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  }

  useEffect(function () {
    search();
  }, []);

  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input type="text" className='cityInput' placeholder='Buscar Ciudad' value={text} onChange={handleCity} onKeyDown={handleKeyDown}/>
            <div className='search-icon' onClick={()=>search()}>
              <img src={searchIcon} alt="" />
            </div>
        </div>
        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} long={long} humidity={humidity} wind={wind}/>}
        {loading && <div className='loading-message'>Cargando...</div>}
        {error && <div className='error-message'>{error}</div>}
        {cityNotFound && <div className='city-not-found'>Ciudad no encontrada</div>}
        <p className='copyright'>
          Diseñado por <span>Roly Ari</span>
        </p>
      </div>
    </>
  )
}

export default App
