import React, { useState } from 'react'
import { useGetStationsQuery, useGetPrecipitationQuery, useDeleteWindMutation } from '../api/apiSlice'
import Pagination from '../../components/Pagination'
import { useNavigate } from 'react-router-dom'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'

let Precipitation = ({observation})=>{
  const [deleteWind] = useDeleteWindMutation()
  const navigate = useNavigate()
  return (
    <tr key={observation.id}>
      <td>{observation.obs_date}/{observation.period === 'day'? 'День':'Ночь'}</td>
      <td>{observation.created_at.substr(0,19).replace('T',' ')}</td>
      <td>{observation.source}</td>
      <td align='center'>{+observation.value>=1.0 ? parseInt(observation.value):observation.value}</td>
      <td>{observation.description}</td>
      <td><button onClick={()=>deleteWind(observation.id).then(() => navigate('/otherDataPrecipitation'))} className="button muted-button">Удалить</button></td>
    </tr>
  )
}
export const PrecipitationList = ()=>{
  const [currentPage, setCurrentPage] = useState(1)
  const {
    data: data = {
      pageSize: 20,
      totalCount: 0,
      observations: []
    },
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetPrecipitationQuery(currentPage)

  let content

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    const renderedPrecipitation = data.observations.map((observation) => (
      <Precipitation key={observation.id} observation={observation} />
    ))

    const containerClassname = classnames('stations-container', {disabled: isFetching,})

    content = <div className={containerClassname}>
      <p>Стр. {currentPage}</p>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th>Дата наблюдения</th>
            <th>Дата и время ввода (UTC)</th>
            <th>Станция/пост</th>
            <th>Значение	(мм)</th>
            <th>Комментарий</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {renderedPrecipitation}
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
      <h2>Осадки</h2>
      {content}
    </section>
  )
}