import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'
import { useGetSoapMeteoStationsQuery } from '../api/apiSlice'
import { useCurrentWeatherQuery } from '../api/apiSlice'
import { stationCoordinates } from '../../synopticDictionaries'
import { YMaps, Map, Placemark, Clusterer } from '@pbe/react-yandex-maps'
import { useState, useEffect } from 'react'

let Station = ({ station }) => {
  let s = `${station.index} ${station.name}`
  return (
    <article>
      <h3>{s}</h3>
    </article>
  )
}
const absoluteZero = 273.15
export const StationsListSoap = ()=>{
  let s
  const observedAt = () => {
    s = new Date().toISOString().slice(0, 15).replace('T', ' ') + '0:00'
    return new Date(s).getTime()/1000 +3600*3
  }
  const [station, setStation] = useState(34519)
  const [queryMoment, setQueryMoment] = useState(observedAt())
  useEffect(() => {
    setQueryMoment(observedAt());
  }, [station])
  let qParams = {
    station: station,
    notbefore: queryMoment,
    notafter: queryMoment+600
  }
  const {
    data: observations = [],
    isLoading: cwLoading,
    isSuccess: cwSuccess,
  } = useCurrentWeatherQuery(qParams)

  const {
    data: stations = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetSoapMeteoStationsQuery()
  useEffect(() => {
    if (cwSuccess && observations && station) {
      // Обновить баллун для выбранной станции
      // updateBalloonContent(station, observations);
    }
  }, [observations, cwSuccess, station])

  let content
  const clusterPoints = []
  if (isLoading || cwLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    const renderedStations = stations.meteostations.map((station) => {
      clusterPoints.push(<Placemark 
        key={station.index} 
        defaultGeometry={stationCoordinates[station.index]} 
        properties={{
          iconContent: station.index,
          hintContent: station.name,
        }} 
        modules = {
          ['geoObject.addon.hint','geoObject.addon.balloon']
        }
        options={{preset: "islands#grayStretchyIcon"}}
        instanceRef={(ref) => {
          if (ref) {
            ref.events.add('click', (e) => {
              const target = e.get('target');
              const id = target.properties.get('iconContent');
              
              setStation(id)
              let clickMoment = new Date()
              if((clickMoment - queryMoment)>600)
                setQueryMoment(observedAt())
              let temperature, windDirection, windSpeed, humidity
              if(cwSuccess && observations){
                observations.map(observation=>{
                  if(observation.station === +id){
                    switch (observation.meas_hash) {
                      case 1451382247:
                        temperature = (+observation.value - absoluteZero).toFixed(1)
                        break
                      case -789901366:
                        windDirection = observation.value
                        break
                      case 1345858116:
                        windSpeed = observation.value
                        break
                      case -996973625:
                        humidity = observation.value
                        break
                      default:
                        break;
                    }
                  }
                })
                if(temperature){
                  console.log(JSON.stringify(id))
                  let t = `<p>Время измерения местное ${new Date().toLocaleTimeString().slice(0,4)}0</p><table border-collapse: collapse;><thead><tr><th >Температура</th><td style="padding-left: 15px;">${temperature}°C</td></tr><tr><th>Влажность</th><td style="padding-left: 15px;">${humidity}%</td></tr><tr><th >Скорость ветра</th><td style="padding-left: 15px;">${windSpeed} м/с</td></tr><tr><th >Направление ветра</th><td style="padding-left: 15px;">${windDirection}°</td></tr></thead></table>`
                  target.properties.set('balloonContentBody', t) 
                }
              }
              
            });
          }
        }}
      />)
      return (<Station key={station.index} station={station} />)}
    )
    const containerClassname = classnames('stations-container', {
      disabled: isFetching,
    })

    content = <div className={containerClassname}>
      {renderedStations}
      <YMaps query={{ apikey: process.env.REACT_APP_YANDEX_API_KEY }}>
        <Map
          defaultState={{
            center: [47.7, 38.0],
            zoom: 8,
            controls: ['zoomControl']
          }}
          width={600}
          height={600}
          modules={['control.ZoomControl']}
        >
          <Clusterer
            options={{
              groupByCoordinates: false,
            }}>{clusterPoints}</Clusterer>
        </Map>
      </YMaps>
    </div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }
  return (
    <section>
      <h2>Метеостанции (SOAP)</h2>
      {content}
    </section>
  )
}