
import axios from 'axios'
import { useState, useEffect } from 'react'
import './App.css'
import CardWeather from './assets/components/CardWeather'
import Loading from './assets/components/Loading'
import ErrorFetch from './assets/components/ErrorFetch'

function App() {

  const [latLong, setLatLong] = useState()
  const [weather, setWeather] = useState()
  const [temperature, setTemperature] = useState()
  const [hasError, setHasError] = useState(false)
  const [handleError, setHandleError] = useState()
  const [weathergb, setWeathergb] = useState()
  const [removeLoading, setRemoveLoading] = useState(false)

  useEffect(() => {
    const success = position => {
      const obj = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
      setLatLong(obj)
    }
    const error = err => {
      console.log(err);
      setHasError(true)
      setHandleError(err)
    }
    navigator.geolocation.getCurrentPosition(success, error);
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (latLong) {
        const apiKey = '83bd1e14194bbcbd764e136645bd1c3e'
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latLong.latitude}&lon=${latLong.longitude}&appid=${apiKey}`)
          .then(res => {
            const celsius = (res.data.main.temp - 273.15).toFixed(1)
            const farenheit = (celsius * 9 / 5 + 32).toFixed(1)
  
            setTemperature({ celsius, farenheit })
            setWeather(res.data)
            setWeathergb(res.data.weather[0].main)
            setRemoveLoading(true)
          })
          .catch(err => console.log(err))
      }
    }, 2000)
  }, [latLong])



  return (
    <div className="App" id={weathergb}>
      <div className='App__Container--Card'>
        
        {
          hasError
          ? <ErrorFetch handleError={handleError} />
          : <CardWeather weather={weather} temperature={temperature} />
        }
        {!removeLoading && <Loading />}
      </div>
    </div>
  )
}

export default App
