import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
// import CardGroup from 'react-bootstrap/CardGroup';
import * as actions from "../actions/actions.js";
// const mapDispatchToProps = dispatch => ({
//   addCity(data) { dispatch(actions.addCity(data)) }
// });
const mapStateToProps = ({ informationReducer: { weatherDays } }) => ({
  weatherDays,
});
const DetailedWeather = (props) => {
  const WEATHER_API_URI = "#";
  const weatherInfo = {
    dayName: "Monday",
    description: "Clear Sky",
    imgURL: "http://openweathermap.org/img/wn/01d@2x.png",
    currentTemp: "75",
    hiTemp: "80",
    loTemp: "65",
    humidity: "100",
    windSpeed: "10",
    sunRise: "06:30",
    sunSet: "19:00",
  };
  const arrayOfDays = [
    weatherInfo,
    weatherInfo,
    weatherInfo,
    weatherInfo,
    weatherInfo,
    weatherInfo,
    weatherInfo,
  ];
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const convertKtoF = (K) => Math.round(((K - 273.15) * 9) / 5 + 32);
  const slicedWeatherDays = props.weatherDays.slice(
    0,
    props.weatherDays.length - 1
  );
  const weatherArr = slicedWeatherDays.map((day, index) => {
    // TODO: dynamically generate day of week :)
    console.log("Day: ", day.dt);
    const imgCode = day.weather[0].icon;
    const dayOfWeek = daysOfWeek[index];
    const date = new Date(day.dt * 1000);
    console.log(dayOfWeek);
    return (
      <section key={index} className="weather-card">
        <div className="detailed-weather-title">
          <h4>{date.toDateString()}</h4>
          <p className="weather-description">
            {day.weather[0].description}
          </p>
        </div>

        <img
          // variant="top"
          src={`http://openweathermap.org/img/wn/${imgCode}@2x.png`}
        />
        <div className="weather-deatils">
          <div className="temp-group">
            <p>
              <span>Hi:</span> {convertKtoF(day.temp.max)}°F
            </p>
            <p>
              <span>Lo:</span> {convertKtoF(day.temp.min)}°F
            </p>
          </div>
          <div className="temp-details">
            <p>
              <span>Feels like:</span> {convertKtoF(day.feels_like.day)}°F
            </p>
            <p>
              <span>Humidity:</span> {day.humidity}%
            </p>
            <p>
              <span>WS:</span> {day.wind_speed} MPH
            </p>
            <p>
              <span>UV Index:</span> {day.uvi}
            </p>
          </div>
        </div>
      </section>
    );
  });
  return (
    <div className="detailed-weather-main">
      <div className="weather-header">
        <Link to={"/"} className="home-btn">
          Home
        </Link>
      </div>
      <div className="detailed-weather">
        <h1>7 Day Weather</h1>
        <div className="detailed-weather-container">
          <div id="detailed-weather-current-day">{weatherArr.slice(0, 1)}</div>
          <div className="detailed-weather-wrapper">{weatherArr.slice(1)}</div>
        </div>
      </div>
    </div>
  );
};
export default connect(mapStateToProps, null)(DetailedWeather);
