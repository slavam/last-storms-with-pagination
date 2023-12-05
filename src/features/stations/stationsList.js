import React, { useMemo } from 'react'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'
import { useGetStationsQuery } from '../api/apiSlice'

let Station = ({ station }) => {
  let s = `${station.sindex} ${station.station_name}`
  // let s = `ID: ${station.id} ${station.code} ${station.name}`
  return (
    <article key={station.sindex}>
      <h3>{s}</h3>
    </article>
  )
}

export const StationsList = () => {
  const {
    data: stations = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetStationsQuery()

  const sortedStations = useMemo(() => {
    const sortedStations = stations.filter((s) => s.sindex < 80000 || s.sindex > 90000)
    // stations.slice()
    // sortedStations.sort((a, b) => a.id.localeCompare(b.id))
    return sortedStations
  }, [stations])

  let content

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    const renderedStations = sortedStations.map((station) => (
      <Station key={station.id} station={station} />
    ))

    const containerClassname = classnames('stations-container', {
      disabled: isFetching,
    })

    content = <div className={containerClassname}>{renderedStations}</div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  return (
    <section className="posts-list">
      <h2>Метеостанции</h2>
      {content}
    </section>
  )
}
