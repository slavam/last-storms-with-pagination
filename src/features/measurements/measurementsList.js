import React, { useMemo } from 'react'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'
import { useGetMeasurementsQuery } from '../api/apiSlice'

let Measurement = ({ measurement }) => {
  let s = `${measurement.meas_code}; ${measurement.caption}; ${measurement.unit}`
  return (
    <article key={measurement.meas_hash}>
      <p>{s}</p>
    </article>
  )
}
export const MeasurementsList = () => {
  const {
    data: measurements = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetMeasurementsQuery()

  const sortedMeasurements = useMemo(() => {
    const sortedMeasurements = measurements.slice()
    // stations.slice()
    // sortedStations.sort((a, b) => a.id.localeCompare(b.id))
    return sortedMeasurements
  }, [measurements])

  let contentM
  if (isLoading) {
    contentM = <Spinner text="Loading..." />
  } else if (isSuccess) {
    const renderedMeasurements = sortedMeasurements.map((measurement) => (
      <Measurement key={measurement.meas_hash} measurement={measurement} />
    ))

    const containerClassname = classnames('stations-container', {
      disabled: isFetching,
    })

    contentM = <div className={containerClassname}>{renderedMeasurements}</div>
  } else if (isError) {
    contentM = <div>{error.toString()}</div>
  }

  return (
    <section className="posts-list">
      <h2>Измерения</h2>
      {contentM}
    </section>
  )
}