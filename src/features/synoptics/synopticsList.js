import React, { useState } from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import { Spinner } from '../../components/Spinner'
import { useGetSynopticObservationsQuery } from '../api/apiSlice'
import { useGetStationsQuery } from '../api/apiSlice'
import Pagination from '../../components/Pagination'

let Observation = ({ observation, stations }) => {
  
  return (
    <tr key={observation.id}>
      <td>{observation.observed_at.substr(0,19).replace('T',' ')}</td>
      <td>{observation.term}</td>
      <td>{stations[observation.station_id]}</td>
      <td><Link to={`/synopticObservations/${observation.id}`} params={{observationId: observation.id}}>
        {observation.telegram}
      </Link></td>
    </tr>
  )
}

export const SynopticsList = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const {
    data = {
      pageSize: 20,
      totalCount: 0,
      observations: []
    },
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetSynopticObservationsQuery(currentPage)

  const {
    data: stations = [],
  } = useGetStationsQuery()

  const namesStation = []
  stations.forEach(station => {
    namesStation[station.id] = station.name
  })
  
  let content

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    const renderedSynoptics = data.observations.map((observation) => (
      <Observation key={observation.id} observation={observation} stations={namesStation} />
    ))

    const containerClassname = classnames('synoptics-container', {
      disabled: isFetching,
    })

    content = <div className={containerClassname}>
      <p>Page {currentPage}</p>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th>Дата наблюдения (UTC)</th>
            <th>Срок</th>
            <th>Метеостанция</th>
            <th>Телеграмма</th>
          </tr>
        </thead>
        <tbody>
          {renderedSynoptics}
        </tbody>
      </table>
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={data.totalCount}
        pageSize={data.pageSize}
        onPageChange={page => setCurrentPage(page)}
      />
    </div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  return (
    <section className="posts-list">
      <h2>Синоптические телеграммы</h2>
      {content}
    </section>
  )
}
