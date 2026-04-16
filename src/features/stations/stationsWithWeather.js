import { useState, useEffect, useRef } from 'react'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'
import { useGetSoapMeteoStationsQuery } from '../api/apiSlice'
import { useCurrentWeatherQuery } from '../api/apiSlice'
import { YMaps, Map as YandexMap, Placemark, Clusterer } from '@pbe/react-yandex-maps'
import { stationCoordinates } from '../../synopticDictionaries'

const absoluteZero = 273.15

export const StationsWithWeather = () => {
  const observedAt = () => {
    const s = new Date().toISOString().slice(0, 15).replace('T', ' ') + '0:00'
    return new Date(s).getTime() / 1000 + 3600 * 3
  }
  
  const [station, setStation] = useState(34519)
  const [queryMoment, setQueryMoment] = useState(observedAt())
  
  // Создаём ref для хранения актуальных данных
  const observationsCacheRef = useRef(new Map())
  const currentStationRef = useRef(station)
  
  let qParams = {
    station: station,
    notbefore: queryMoment,
  }
  
  const {
    data: observations = [],
    isLoading: cwLoading,
    isSuccess: cwSuccess,
  } = useCurrentWeatherQuery(qParams)
  
  useEffect(() => {
    setQueryMoment(observedAt())
  }, [station])
  
  // Обновляем кэш и ref при получении новых данных
  useEffect(() => {
    if (!cwSuccess || !observations) return
    
    const observationsArray = Array.isArray(observations) ? observations : observations.data || []
    
    // Группируем данные по станциям
    observationsArray.forEach(observation => {
      const stationId = observation.station
      if (!observationsCacheRef.current.has(stationId)) {
        observationsCacheRef.current.set(stationId, {})
      }
      const stationData = observationsCacheRef.current.get(stationId)
      stationData[observation.meas_hash] = observation.value
      observationsCacheRef.current.set(stationId, stationData)
      
    })
    
    
    // Обновляем currentStationRef
    currentStationRef.current = station
  }, [observations, cwSuccess, station])
  
  // Функция для создания HTML баллуна из данных станции
  const createBalloonContent = (stationId, stationData) => {
    const temperature = stationData[1451382247] 
      ? (+stationData[1451382247] - absoluteZero).toFixed(1) 
      : null
    const windDirection = stationData[-789901366]
    const windSpeed = stationData[1345858116]
    const humidity = stationData[-996973625]
    
    if (!temperature) return '<p>Нет данных о температуре</p>'
    let stationName = stations.meteostations.find((station)=>station.index===stationId).name
    // console.log(JSON.stringify(stations.meteostations.find((station)=>station.index===stationId).name))
    return `
      <h5>${stationName}</h5>
      <p>Время измерения местное ${new Date().toLocaleTimeString().slice(0, 4)}0</p>
      <table style="border-collapse: collapse;">
        <tbody>
          <tr><th>Температура</th><td style="padding-left: 15px;">${temperature}°C</td></tr>
          <tr><th>Влажность</th><td style="padding-left: 15px;">${humidity || 'Н/Д'}%</td></tr>
          <tr><th>Скорость ветра</th><td style="padding-left: 15px;">${windSpeed || 'Н/Д'} м/с</td></tr>
          <tr><th>Направление ветра</th><td style="padding-left: 15px;">${windDirection || 'Н/Д'}°</td></tr>
        </tbody>
      </table>
    `
  }
  
  const {
    data: stations = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetSoapMeteoStationsQuery()
  
  let content
  const clusterPoints = []
  
  if (isLoading || cwLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    const renderedStations = stations.meteostations.map((station) => {
      clusterPoints.push(
        <Placemark 
          key={station.index} 
          defaultGeometry={stationCoordinates[station.index]} 
          properties={{
            iconContent: station.index,
            hintContent: station.name,
            balloonContentBody: '<p>Загрузка данных...</p>' // Начальное содержимое
          }} 
          modules={['geoObject.addon.hint', 'geoObject.addon.balloon']}
          options={{ preset: "islands#grayStretchyIcon" }}
          instanceRef={(ref) => {
            if (ref) {
              ref.events.add('click', (e) => {
                const target = e.get('target')
                const id = target.properties.get('iconContent')
                
                // 1. Сразу показываем загрузку
                target.properties.set('balloonContentBody', '<p>Загрузка данных...</p>')
                
                // 2. Пытаемся получить данные из кэша
                const cachedData = null //observationsCacheRef.current.get(+id)
                
                if (cachedData && Object.keys(cachedData).length > 0) {
                  // Если данные есть в кэше - показываем сразу
                  const balloonHtml = createBalloonContent(id, cachedData)
                  target.properties.set('balloonContentBody', balloonHtml)
                } else {
                  // Если данных нет - ждём загрузки
                  // Устанавливаем таймер для повторной попытки
                  const checkDataInterval = setInterval(() => {
                    const newCachedData = observationsCacheRef.current.get(+id)
                    if (newCachedData && Object.keys(newCachedData).length > 0) {
                      const balloonHtml = createBalloonContent(id, newCachedData)
                      target.properties.set('balloonContentBody', balloonHtml)
                      clearInterval(checkDataInterval)
                    }
                  }, 100)
                  
                  // Очищаем интервал через 5 секунд, чтобы не висел вечно
                  setTimeout(() => clearInterval(checkDataInterval), 5000)
                }
                
                // 3. Обновляем состояние станции для основного запроса
                setStation(id)
                
                // 4. Обновляем время запроса, если прошло больше 10 минут (600 секунд)
                const clickMoment = new Date()
                if ((clickMoment.getTime() / 1000 - queryMoment) > 600) {
                  setQueryMoment(observedAt())
                }
              })
            }
          }}
        />
      )
      return null // Не возвращаем ничего, так как Placemark уже добавлен в clusterPoints
    })
    
    const containerClassname = classnames('stations-container', { disabled: isFetching })
    content = (
      <div className={containerClassname}>
        {/* {renderedStations} */}
        <YMaps query={{ apikey: process.env.REACT_APP_YANDEX_API_KEY }}>
          <YandexMap
            defaultState={{
              center: [47.7, 38.0],
              zoom: 8,
              controls: ['zoomControl']
            }}
            width={600}
            height={600}
            modules={['control.ZoomControl']}
          >
            <Clusterer options={{ groupByCoordinates: false }}>
              {clusterPoints}
            </Clusterer>
          </YandexMap>
        </YMaps>
      </div>
    )
  } else if (isError) {
    content = <div>Нет данных {error?.toString() || 'Ошибка загрузки'}</div>
  }
  
  return (
    <section>
      <h2>Метеостанции с текущей погодой</h2>
      {content}
    </section>
  )
}