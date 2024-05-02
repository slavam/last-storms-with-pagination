import React, { useMemo } from 'react'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'
import { useGetSoapMeteoStationsQuery } from '../api/apiSlice'
import { YMaps, Map, Placemark, Clusterer } from '@pbe/react-yandex-maps'

let Station = ({ station }) => {
  let s = `${station.index} ${station.name}`
  return (
    <article>
      <h3>{s}</h3>
    </article>
  )
}
export const StationsListSoap = ()=>{
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
  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    let stationCoordinates = {
      '34519': [48.0161457, 37.8057165],
      '34524': [48.35, 38.4333],
      '34622': [47.8, 38.5167],
      '99023': [47.067221, 38.160801],
      '34615': [47.6167, 	37.35],
      '34712': [47.0333, 37.5]
    }
    const renderedStations = stations.meteostations.map((station) => 
      {clusterPoints.push(<Placemark key={station.index} defaultGeometry={stationCoordinates[station.index]} 
        properties={{
          iconContent: station.index,
          hintContent: station.name,
        }} 
        modules = {
          ['geoObject.addon.hint']
        }
        options={{preset: "islands#grayStretchyIcon"}}/>)
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
          {/* <Placemark
        geometry={{
          coordinates: [48.0161457, 37.8057165]
        }}
        properties={{
          hintContent: 'Собственный значок метки',
          balloonContent: 'Это красивая метка'
        }}
        options={{
          iconLayout: 'default#image',
          // iconImageHref: 'images/myIcon.gif',
          iconImageSize: [30, 42],
          iconImageOffset: [-3, -42]
        }}
      /> */}
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