import React, { useMemo } from 'react'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'
import { useGetSoapMeteoStationsQuery } from '../api/apiSlice'
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps'

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

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    const renderedStations = stations.meteostations.map((station) => (
      <Station key={station.index} station={station} />
    ))

    const containerClassname = classnames('stations-container', {
      disabled: isFetching,
    })

    content = <div className={containerClassname}>
      {renderedStations}
      <YMaps query={{ apikey: process.env.REACT_APP_YANDEX_API_KEY }}>
        <Map
          defaultState={{
            center: [47.7, 38.0],
            zoom: 8
          }}
          width={600}
          height={600}
        >
          <Placemark defaultGeometry={[48.0161457, 37.8057165]} />
          <Placemark defaultGeometry={[47.6167, 	37.35]} />         {/* Vol*/}
          <Placemark defaultGeometry={[47.8, 	38.5167]} />           {/* Am*/}
          <Placemark defaultGeometry={[48.35, 	38.4333]} />         {/* Deb*/}
          <Placemark defaultGeometry={[47.0333, 	37.5]} />          {/* Mar*/}
          <Placemark defaultGeometry={[47.067221, 	38.160801]} />   {/* Sed*/}
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