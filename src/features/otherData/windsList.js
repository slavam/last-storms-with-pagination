import React, { useState } from 'react'
import { useGetStationsQuery, useGetGustsWindQuery, useDeleteWindMutation } from '../api/apiSlice'
import Pagination from '../../components/Pagination'
import { useNavigate } from 'react-router-dom'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'

let Wind = ({observation, stations})=>{
  const [deleteWind] = useDeleteWindMutation()
  const navigate = useNavigate()
  return (
    <tr key={observation.id}>
      <td>{observation.obs_date} {observation.period}:00</td>
      <td>{observation.created_at.substr(0,19).replace('T',' ')}</td>
      <td>{stations[observation.station_id]}</td>
      <td align='center'>{parseInt(observation.value)}</td>
      <td><button onClick={()=>deleteWind(observation.id).then(() => navigate('/otherDataWinds'))} className="button muted-button">Удалить</button></td>
    </tr>
  )
}
export const WindsList = () => {
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
  } = useGetGustsWindQuery(currentPage)
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
    const renderedWinds = data.observations.map((observation) => (
      <Wind key={observation.id} observation={observation} stations={namesStation} />
    ))

    const containerClassname = classnames('stations-container', {disabled: isFetching,})

    content = <div className={containerClassname}>
      <p>Page {currentPage}</p>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th>Дата и время наблюдения</th>
            <th>Дата и время ввода (UTC)</th>
            <th>Метеостанция</th>
            <th>Скорость (м/с)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {renderedWinds}
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
      <h2>Порывы ветра</h2>
      {content}
    </section>
  )
}