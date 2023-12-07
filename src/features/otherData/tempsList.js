import React, { useState } from 'react'
import { useGetStationsQuery, useGetTemp8Query, useDeleteWindMutation } from '../api/apiSlice'
import Pagination from '../../components/Pagination'
import { useNavigate } from 'react-router-dom'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'

let Temperature = ({observation, stations})=>{
  const [deleteWind] = useDeleteWindMutation()
  const navigate = useNavigate()
  return (
    <tr key={observation.id}>
      <td>{observation.obs_date}</td>
      <td>{observation.created_at.substr(0,19).replace('T',' ')}</td>
      <td>{stations[observation.station_id]}</td>
      <td align='center'>{parseInt(observation.value)}</td>
      <td><button onClick={()=>deleteWind(observation.id).then(() => navigate('/otherDataTemps'))} className="button muted-button">Удалить</button></td>
    </tr>
  )
}
export const TempsList = () => {
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
  } = useGetTemp8Query(currentPage)

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
    const renderedTemps = data.observations.map((observation) => (
      <Temperature key={observation.id} observation={observation} stations={namesStation} />
    ))

    const containerClassname = classnames('stations-container', {disabled: isFetching,})

    content = <div className={containerClassname}>
      <p>Page {currentPage}</p>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th>Дата наблюдения</th>
            <th>Дата и время ввода (UTC)</th>
            <th>Метеостанция</th>
            <th>Температура (°С)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {renderedTemps}
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
    <section >
      <h2>Температура на 8 часов</h2>
      {content}
    </section>
  )
}