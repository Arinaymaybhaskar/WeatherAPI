import React, { Component, useEffect, useState } from 'react';
import { WiHumidity } from 'react-icons/wi';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';


function WeatherApp() {
  // function for the weather Icon
  const iconURL = (iconId) => `https://openweathermap.org/img/wn/${iconId}@2x.png`

  // function to retrieve weather data from the OpenWeather API
  const getFormattedData = async (location, units = 'metric') => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lng}&appid=305cda710b0e1e995503b7032ebd6617&units=${units}`;
    const data = await fetch(URL)
      .then((res) => res.json())
      .then((data) => data);

    const {
      weather,
      main: { temp, temp_min, temp_max, humidity },
      wind: { speed, deg },
      sys: { country },
      name
    } = data;

    const { description, icon } = weather[0];

    return {
      description,
      iconURL: iconURL(icon),
      temp,
      temp_min,
      temp_max,
      humidity,
      speed,
      deg,
      country,
      name
    };
  };
  
  // function to capitalize the first letter of the weather description
  const capitalize = description => {
    return description.charAt(0).toUpperCase() + description.slice(1);
  }

  // setting initial value to delhi
  const [location, setLocation] = useState('delhi');
  const [units, setUnit] = useState("metric");
  const [weather, setWeather] = useState(null);

  // function to set units by pressing the button 
  const unitType = (u) => {
    const button = u.currentTarget;
    const currentUnit = button.innerText.slice(1)

    const isMetric = currentUnit === "C";
    button.innerText = isMetric ? "°F" : "°C";
    setUnit(isMetric ? "metric" : "imperial");
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFormattedData(location, units);
      setWeather(data);
    };

    fetchData();
  }, [units, location]);

  // function to get location by pressing the enter key
  const searchLocation = (p) => {
    if (p.keyCode === 13) {
      setLocation(p.currentTarget.value);
      p.currentTarget.blur();
    }
  }


  // places autocomplete

  // function to set coordinates for the initial value in the openweather api
  const [address, setAddress] = useState("")
  const [coordinates, setCoordinates] = useState({
    lat: '28.6139',
    lng: '77.2090'
  })


  const handleSelect = async value => {
    const results = await geocodeByAddress(value);
    const ll = await getLatLng(results[0])
    setAddress(value)
    setCoordinates(ll)
  }


  return (
    <div className=' lg:h-auto md:h-auto  h-full overflow-y-scroll max-w-3xl flex-grow flex mx-10 bg-[#ffffff] rounded-xl p-4 pb-4 scrollbar-none'>
      <div className='w-full flex flex-col  items-center gap-4 '>
        {/* Search bar */}
        <div id='search-bar' className='w-full '>
          <PlacesAutocomplete
            value={address}
            onChange={setAddress}
            onSelect={handleSelect}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div className='flex flex-col w-full'>
                <div className='flex flex-row font-medium'>
                  <button className='bg-[#f2f4f8] rounded-l-lg pl-2 flex items-center justify-center '>
                    <span class="material-symbols-outlined">
                      search
                    </span>
                  </button>
                  <input
                    {...getInputProps({
                      placeholder: 'Search Places...',
                      className: 'flex flex-grow py-4 px-2 text-base rounded-lg rounded-l-none outline-none bg-[#f2f4f8]',
                    })}
                    onKeyDown={searchLocation}
                  />
                  <button
                    onClick={(u) => unitType(u)}
                    className='rounded-lg w-32 bg-[#f2f4f8] px-3 ml-4 '>
                    °F
                  </button>
                </div>
                <div className="bg-[#f2f4f8] mt-2 rounded-lg flex flex-col p-2 text-xs mr-36">
                  <p className='text-xs w-full pb-1 border-b-[1px]'>Suggestions:</p>
                  {loading && <div>Loading...</div>}
                  {suggestions.map(suggestion => {
                    const className = suggestion.active
                      ? 'suggestion-item--active'
                      : 'suggestion-item';
                    // inline style for demonstration purpose
                    const style = suggestion.active
                      ? { backgroundColor: 'white', cursor: 'pointer', padding: '5px' }
                      : { backgroundColor: '#f2f4f8', cursor: 'pointer', padding: '5px' };
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style,
                        })}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </div>

        {/* Search results */}
        {
          weather && (
            <div id='result' className='flex w-full items-center h-auto gap-4 flex-col lg:flex-row md-flex-row'>
              <div className='flex lg:w-2/3 w-full gap-4 md:flex-row flex-col lg:flex-row h-full'>
                {/* Weather description, Icon, address*/}
                <div className='flex flex-col justify-center items-center w-auto lg:w-1/2 md:w-1/2 h-60 bg-[#f2f4f8] rounded-lg' id='main-box'>
                  <div className='w-40 h-40'>
                    <img src={weather.iconURL} className='w-full' alt='weather icon' />
                  </div>
                  <div className='flex flex-col w-full p-4'>
                    <div id='description' className='text-xl '>
                      {`${capitalize(weather.description)}`}
                    </div>
                    <div id='location name' className='text-sm text-neutral-600' >
                      <p>{`${weather.name}, ${weather.country}`}</p>
                    </div>
                  </div>
                </div>
                <div className='flex w-auto lg:w-1/2 md:w-1/2 bg-[#f2f4f8] h-60 rounded-lg p-4'>
                  {/* Temperature Information */}
                  <div id='Temperature' className='flex flex-col gap-2'>
                    <p className='text-8xl'>{`${weather.temp.toFixed()}°`}
                      <span className='text-3xl'>{`${units === "metric" ? "C" : "F"}`}</span>
                    </p>
                    <div className='flex gap-4 justify-center content-center items-center w-full h-full'>
                      <p className='border-[1px] border-neutral-200 rounded-lg p-2 w-1/2'><span className='text-neutral-500 text-xs'>Minimum: </span> <br />{`${weather.temp_min.toFixed()} °${units === "metric" ? "C" : "F"}`}</p>
                      <p className='border-[1px] border-neutral-200 rounded-lg p-2 w-1/2'><span className='text-neutral-500 text-xs'>Maximum: </span><br /> {`${weather.temp_max.toFixed()} °${units === "metric" ? "C" : "F"}`}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col md-flex-row  lg:w-1/3 md-w-full w-full h-full max-h-60 gap-4'>
                {/* Humidity Info */}
                <div id='humidity' className='w-full rounded-lg p-2 h-[46%] bg-[#f2f4f8] flex'>
                  <img src="./humidity.png" alt="" className='w-auto p-5 h-full' />
                  <p className='text-4xl font-semibold'>
                    <span className='text-lg text-neutral-500'>
                      Humidity:
                    </span> <br />
                    {`${weather.humidity}%`}
                  </p>
                </div>
                {/* Wind Info */}
                <div id='wind' className='flex rounded-lg h-[46%] bg-[#f2f4f8]'>
                  <img src="./windIcon.png" className='w-auto h-full p-5' alt="" />
                  <div className='flex justify-center flex-col'>
                    <span className='text-lg text-neutral-500 font-semibold'>
                      Wind:
                    </span>
                    <p className='font-semibold text-xs'>
                    <span className='text-neutral-600'>
                      Speed: 
                    </span>
                      {` ${weather.speed} ${units === "metric" ? "m/s" : "mph"}`}</p>
                    <p className='font-semibold text-xs'>
                    <span className='text-neutral-600'>
                      Direction: 
                    </span>
                      {` ${weather.deg}°`}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}
export default WeatherApp;