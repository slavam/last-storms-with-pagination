import {useCurrentWeatherQuery} from '../api/apiSlice'
import {stations} from '../../synopticDictionaries'
import { useState } from 'react'
import Select from 'react-select'
import { Spinner } from '../../components/Spinner'

export const CurrentWeather = ()=>{
  let s
  const observedAt = () => {
    s = new Date().toISOString().slice(0, 15).replace('T', ' ') + '0:00'
    return new Date(s).getTime()/1000 +3600*3
  }
  const meteoStations = stations.slice(3,9)
  const [station, setStation] = useState(meteoStations[0])

  let qParams = {
    station: station.value,
    notbefore: observedAt(),
  }
  const {
    data: observations = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useCurrentWeatherQuery(qParams)
  let temperature
  let windDirection
  let windSpeed
  let humidity
  const absoluteZero = 273.15
  let content
  if (isLoading) {
      content = <Spinner text="Loading..." />
    } else if (isSuccess) {
      observations.map((data) => {
        let measurement = data.meas_hash
        switch (measurement) {
          case 1451382247:
            temperature = (+data.value - absoluteZero).toFixed(1)                                              
            break
          case -789901366:
            windDirection = data.value
            break
          case 1345858116:
            windSpeed = data.value
            break
          case -996973625:
            humidity = data.value
            break
        }
      })
      content = <div className='font-bold text-lg'>
        <ul className="list-disc pl-4" >
          <li key='1' className="whitespace-nowrap">
            Температура: <b>{temperature}°C</b>
          </li>
          <li key='2' className="whitespace-nowrap">
            Направление ветра: <b>{windDirection}°</b>
          </li>
          <li key='3' className="whitespace-nowrap">
            Скорость ветра: <b>{windSpeed}м/с</b>
          </li>
          <li key='4' className="whitespace-nowrap">
            Относительная влажность: <b>{humidity}%</b>
          </li>
        </ul>
      </div>
    }
  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <h4>Погода на метеостанции {station.label} по состоянию на {s} UTC</h4>
      <Select className="mb-3" value={station} onChange={val => setStation(val)} options={meteoStations} id='select-station'/>
      {content}
    </div>
  )
}