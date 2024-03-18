import React, { useMemo } from 'react'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'
import { useGetSoapMeteoStationsQuery } from '../api/apiSlice'

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

    content = <div className={containerClassname}>{renderedStations}</div>
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