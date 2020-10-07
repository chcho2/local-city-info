import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../actions/actions.js'

const mapStateToProps = ({
  informationReducer: { lat, long }
}) => ({ lat, long });

const mapDispatchToProps = dispatch => ({
  addWeather(data) { dispatch(actions.addWeather(data)) }
});

const WeatherView = props => {
  const [weatherData, setWeatherData] = useState([]);
  const [fetchedData, setFetchedData] = useState(false);

  const fetchData = () => {
    fetch(`/weather/?latitude=${props.lat}&longitude=${props.long}`, {
      method: 'GET',
      headers: {
        "Content-Type": "Application/JSON",
      }
    })
      .then(res => res.json())
      .then(data => {
        setWeatherData([data.weather]);
        setFetchedData(true);
        props.addWeather(data.weather.daily);
        console.log('WeatherView Data: ', data.weather.daily);
      })
      .catch(err => console.log('Weather fetch ERROR: ', err));
  }

  const convertKtoF = (K) => Math.round((((K - 273.15) * 9) / 5) + 32);

  const dayOfWeek = (dayNum) => {
    switch (dayNum) {
      case 0: return 'Sunday';
      case 1: return 'Monday';
      case 2: return 'Tuesday';
      case 3: return 'Wednesday';
      case 4: return 'Thursday';
      case 5: return 'Friday';
      case 6: return 'Saturday';
      default: return 'Invalid input';
    }
  }

  const createWeatherBoxes = (data) => {
    const dayNum = new Date().getDay();
    // const date = new Date(data.daily[0].dt * 1000);
    console.log(data)
    return data.map((day, i) => {
      const date = new Date(day.daily[0].dt * 1000);
      return (
        <div key={`dd${i}`} className='weather-wrapper'>
          <div className="weather-bg">
            <strong><center>{date.toDateString()}</center></strong>
            <p className="weather-desc">{day.current.weather[0].description}</p>
            <img src={`http://openweathermap.org/img/wn/${day.current.weather[0].icon}@2x.png`}></img>
            <div className='temp-wrapper'>
              <p>Hi: {convertKtoF(day.daily[0].temp.max)}°F</p>
              <p>Low: {convertKtoF(day.daily[0].temp.min)}°F</p>
            </div>
          </div>
        </div>
      )
    })
  }

  useEffect(() => {
    if (!fetchedData) fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [props.city])

  if (fetchedData) {
    const weatherDivs = createWeatherBoxes(weatherData);
    return (
      <div className='weather-container'>

        <Link to={'/detailed-weather'}>
          {weatherDivs}
        </Link>

      </div>
    );
  } else {
    return (
      <div>Fetching weather info</div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(WeatherView);

/*TODO:
  get more days for weather
  fix search
  link up redux
  more info weather
*/
