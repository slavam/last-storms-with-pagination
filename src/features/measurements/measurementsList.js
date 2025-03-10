import React, { useMemo } from 'react'
import { Spinner } from '../../components/Spinner'
import { useGetMeasurementsQuery } from '../api/apiSlice'
import Table from 'react-bootstrap/Table'

export const MeasurementsList = () => {
  const {
    data: measurements = [],
    isLoading,
    // isFetching,
    isSuccess,
    isError,
    error,
  } = useGetMeasurementsQuery()

  const sortedMeasurements = useMemo(() => {
    const sortedMeasurements = measurements.slice()
    sortedMeasurements.sort((a, b) => a.caption.localeCompare(b.caption))
    return sortedMeasurements
  }, [measurements])

  let contentM
  let renderedMeasurements
  if (isLoading) {
    contentM = <Spinner text="Loading..." />
  } else if (isSuccess) {
    contentM = null
    renderedMeasurements = sortedMeasurements.map((measurement) => (
      <tr key={measurement.meas_hash}>
        <td>{measurement.bufrcode}</td>
        <td>{measurement.meas_hash}</td>
        <td>{measurement.caption}</td>
        <td>{measurement.unit}</td>
      </tr>
    ))
  } else if (isError) {
    contentM = <div>{error.toString()}</div>
  }

  return (
    <section className="posts-list">
      <h2>Измерения</h2>
      {contentM}
      <Table striped bordered hover variant="primary"  >
        <thead>
          <th>Код</th><th>Хеш</th><th>Название</th><th>Единица измерения</th>
        </thead>
        <tbody>
          {renderedMeasurements}
        </tbody>
      </Table>
    </section>
  )
}