import React, { useMemo } from 'react'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'
import { useGetWmoStationsQuery } from '../api/apiSlice'
import Table from 'react-bootstrap/Table'
import { YMaps, Map, Placemark, Clusterer } from '@pbe/react-yandex-maps'
// import ru from 'date-fns/locale/ru'

let Station = ({ station }) => {
  return (
    <tr key={station.id}>
      <td>{station.code}</td><td>{station.name}</td><td>{station.country}</td>
    </tr>
  )
}

export const WmoStationsList = () => {
  const {
    data: stations = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetWmoStationsQuery()

  let content
  const clusterPoints = [<Placemark key={99023} defaultGeometry={[47.067221, 	38.160801]}/>]
  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    const renderedStations = stations.map((station) => (
      clusterPoints.push(<Placemark key={station.id} defaultGeometry={[+station.latitude, 	+station.longitude]} />)
      // <Station key={station.id} station={station} />
    ))

    const containerClassname = classnames('stations-container', {
      disabled: isFetching,
    })

    content = <div className={containerClassname}>
      <YMaps query={{ apikey: process.env.REACT_APP_YANDEX_API_KEY }}>
        <Map
          defaultState={{
            center: [47.7, 38.0],
            zoom: 7
          }}
          width={800}
          height={600}
        >
          <Clusterer
            options={{
              preset: "islands#invertedVioletClusterIcons",
              groupByCoordinates: false,
            }}
          >{clusterPoints}</Clusterer>
        </Map>
      </YMaps>
      {/* <Table>
        <thead>
          <th>Code</th>
          <th>Name</th>
          <th>Country</th>
        </thead>
        <tbody>
          {renderedStations}
        </tbody>
      </Table> */}
      
    </div>

  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  return (
    <section className="posts-list">
      <h2>WMO-станции</h2>
      {content}
    </section>
  )
}
