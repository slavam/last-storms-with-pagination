import React, { useMemo } from 'react'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'
import { useGetSoapMeteoStationsQuery } from '../api/apiSlice'
import { stationCoordinates } from '../../synopticDictionaries'
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