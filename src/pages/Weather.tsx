import { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, Col, InputGroup, Row, Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { PageLayout } from "../components/PageLayout";
import { fetchWeatherData } from "../data/fetchWeatherData";
import styles from "../styles/Weather.module.css";

interface Weather {
  description: string,
  icon: string,
  id: string,
  main: string,
}

interface WeatherView {
  clouds: number,
  dew_point: number,
  feels_like: number,
  humidity: number,
  pop?: number,
  pressure: number,
  sunrise: number,
  sunset: number,
  temp: number,
  uvi: number,
  visibility: number,
  weather: Weather[],
  wind_deg: number,
  wind_speed: number,
}

interface ApiResponse {
  current: WeatherView,
  daily: WeatherView[],
  hourly: WeatherView[],
  latitude: number,
  longitude: number,
  timezone: string,
  timezone_offset: number,
}

export function Weather() {
  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const unitRef = useRef<HTMLSelectElement | any>('metric');
  const [unitOfMeasurement, setUnitOfMeasurement] = useState<string>('metric');
  const [weatherView, setWeatherView] = useState<string>('current');

  const [rawData, setRawData] = useState<ApiResponse | {}>({});
  const [formattedData, setFormattedData] = useState<WeatherView[] | []>([]);

  function handleSearch(cityName: string) {
    if (cityName === '') {
      alert('Please enter a city name');
      return;
    }
    
    setSearchInputValue('');
    
    fetchWeatherData(cityName, unitRef.current!.value)
    .then(data => {
      setRawData(data);
      setCurrentLocation(cityName);
      })
      .catch((error) => {
        alert('An error occurred while fetching weather data. Check the console for details.');
        throw new Error(error);
      });
  };

  const formatWeatherData = (weatherViewOption: string) => {
    const currentWeatherView = weatherViewOption == null? weatherView : weatherViewOption;
    setWeatherView(currentWeatherView);
    const weatherData = rawData[currentWeatherView as keyof typeof rawData];
    if (weatherData === undefined) return;
    weatherViewOption === 'current'? setFormattedData([weatherData]) : setFormattedData(weatherData);
  }

  useEffect(() => {
    formatWeatherData(weatherView);
  }, [rawData])

  const measurementUnits = {
    metric: {
      temp: '°C',
      wind_speed: 'm/s',
    }
    ,
    imperial: {
      temp: '°F',
      wind_speed: 'mph',
    }
  }

  const displayWeather = () => {
    if (formattedData.length === 0) return null;
    
    return (
      <Table>
        <thead>
          <tr>
            {weatherView !== 'current'? <th>Time</th> : null}
            <th>Temperature</th>
            <th>Feels Like</th>
            <th>Wind Speed</th>
            <th>Weather</th>
          </tr>
        </thead>
        <tbody>
            {formattedData && formattedData.length > 0? (
              formattedData.map((value, index) => {
                const degreesSymbols = measurementUnits[unitOfMeasurement as keyof typeof measurementUnits].temp;
                const windSpeedSymbols = measurementUnits[unitOfMeasurement as keyof typeof measurementUnits].wind_speed;

                const currentDate = new Date();
                const hour = currentDate.getHours() + index;
                const day = currentDate.getDate() + index;
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day, hour);

                if (weatherView === 'daily') {
                  const time = ['morn', 'day', 'eve', 'night'];
                  const timeText = ['Morning', 'Day', 'Evening', 'Night'];
                  const result = time.map((time, i) => {
                    return (
                      <tr key={`${index}.${i}`}>
                        <td>{`${date.getDate()}, ${timeText[i]}`}</td>
                        <td>{`${value.temp[time as keyof typeof value.temp]} ${degreesSymbols}`}</td>
                        <td>{`${value.feels_like[time as keyof typeof value.temp]} ${degreesSymbols}`}</td>
                        <td>{`${value.wind_speed} ${windSpeedSymbols}`}</td>
                        <td>{value.weather[0].description}</td>
                      </tr>
                    )
                  })
                  return result;
                } else {
                  return (
                    <tr key={index}>
                      {weatherView !== 'current'? <td>{date.getHours()}</td> : null}
                      <td>{`${value.temp} ${degreesSymbols}`}</td>
                      <td>{`${value.feels_like} ${degreesSymbols}`}</td>
                      <td>{`${value.wind_speed} ${windSpeedSymbols}`}</td>
                      <td>{value.weather[0].description}</td>
                    </tr>
                  )
                }
              })) : (
                <tr>
                  <td>No data available</td>
                </tr>
              )
            }
        </tbody>
      </Table>
    )
  }

  return (
    <>
      <PageLayout>
        <Row>

          <InputGroup>

            <InputGroup.Text>
              <Form.Floating>

                <Form.Control
                  type="text"
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                  onKeyDown={e => {
                    e.key === "Enter"? handleSearch(searchInputValue) : null;
                  }}
                  placeholder=" "
                />
                <Form.Label htmlFor="searchLocation">City</Form.Label>

              </Form.Floating>
            </InputGroup.Text>

            <Button variant="outline-secondary" onClick={e => handleSearch(searchInputValue)}>Search</Button>
          </InputGroup>

        </Row>
        <Row>
          <Col>
            <ButtonGroup>
              <Button className={weatherView === 'current'? styles.weatherViewBtnActive : ''} variant="dark" onClick={e => formatWeatherData('current')}>Today</Button>
              <Button className={weatherView === 'hourly'? styles.weatherViewBtnActive : ''} variant="dark" onClick={e => formatWeatherData('hourly')}>Hourly</Button>
              <Button className={weatherView === 'daily'? styles.weatherViewBtnActive : ''} variant="dark" onClick={e => formatWeatherData('daily')}>Daily</Button>
            </ButtonGroup>
          </Col>

          <Col>
            <Form.Select 
              ref={unitRef} 
              defaultValue={'metric'}
              onChange={e => {
                setUnitOfMeasurement(e.target.value);
                if (currentLocation === '') return;
                handleSearch(currentLocation)
              }}
            >
              <option value="metric">°C</option>
              <option value="imperial">°F</option>
            </Form.Select>
          </Col>
        </Row>
        <Row>
          <Col>
              {displayWeather()}
          </Col>
        </Row>
      </PageLayout>
    </>
  )
}

export default Weather;