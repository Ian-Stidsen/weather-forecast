import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { Button, ButtonGroup, Col, FormGroup, InputGroup, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { PageLayout } from "../components/PageLayout";
import { fetchWeatherData } from "../data/fetchWeatherData";

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
  const [inputValue, setInputValue] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const unitRef = useRef<HTMLSelectElement | any>({});
  const [weatherView, setWeatherView] = useState<string>('current');

  const [rawData, setRawData] = useState<ApiResponse | {}>({});
  const [formattedData, setFormattedData] = useState<WeatherView[] | WeatherView>([]);

  function handleSearch(cityName: string) {
    if (cityName === '') {
      alert('Please enter a city name');
      return;
    }
    
    setInputValue('');
    
    fetchWeatherData(cityName, unitRef.current!.value)
    .then(data => {
      setRawData(data);
      setCurrentLocation(cityName);
      console.log(cityName)
      })
      .catch((error) => {
        console.log(error);
        alert('An error occurred while fetching weather data.');
      });
  };

  const formatWeather = (weatherViewOption: string) => {
    setWeatherView(weatherViewOption);
    const weatherData = rawData[weatherViewOption as keyof typeof rawData];
    setFormattedData(weatherData);
  }

  useEffect(() => {
    formatWeather(weatherView);
  }, [rawData])

  return (
    <>
      <PageLayout>
        <Row>
          <Col>
            <InputGroup>

              <InputGroup.Text>
                <Form.Floating>

                  <Form.Control
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={e => {
                      e.key === "Enter"? handleSearch(inputValue) : null;
                    }}
                    placeholder=" "
                  />
                  <Form.Label htmlFor="searchLocation">City</Form.Label>

                </Form.Floating>
              </InputGroup.Text>

              <Button variant="outline-secondary" onClick={e => handleSearch(inputValue)}>Search</Button>
            </InputGroup>

          </Col>
        </Row>
        <Row>
          <Col>
            <ButtonGroup>
              <Button variant="dark" onClick={e => formatWeather('current')}>Today</Button>
              <Button variant="dark" onClick={e => formatWeather('hourly')}>Hourly</Button>
              <Button variant="dark" onClick={e => formatWeather('daily')}>Daily</Button>
            </ButtonGroup>
          </Col>

          <Col>
            <Form.Select 
              ref={unitRef} 
              defaultValue={'metric'}
              onChange={e => {
                if (currentLocation === '') return;
                handleSearch(currentLocation)
              }}
            >
              <option value="metric">Celsius</option>
              <option value="imperial">Fahrenheit</option>
            </Form.Select>
          </Col>
        </Row>
        <Row>
          <Col>
              <Button onClick={e => {
                console.log(rawData);
                console.log(formattedData);
              }}>test</Button>
              {weatherView}
          </Col>
        </Row>
      </PageLayout>
    </>
  )
}

export default Weather;