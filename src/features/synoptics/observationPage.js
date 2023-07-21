import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetSynopticObservationQuery, useDeleteObservationMutation } from '../api/apiSlice'
import { Spinner } from '../../components/Spinner'
import { Link } from 'react-router-dom'

export const ObservationPage = () => {
  const { observationId } = useParams();
  const navigate = useNavigate()
  const {
    data: data = {
      observation: {}
    },
    isLoading,
    // isFetching,
    isSuccess,
    // isError,
    // error,
  } = useGetSynopticObservationQuery(observationId)

  const observation = data.observation
  const [deleteObservation] = useDeleteObservationMutation()
  // const onDeleteObservation = (observationId)=>{
  //   // e.preventDefault()
  //   deleteObservation(observationId).then(() => navigate('/synopticObservations'))
  // }

  if (isLoading) {
    return <Spinner text="Loading..." />
  } 
  if (isSuccess) {
    return (
      <section>
        <article className="post">
          <h3>Телеграмма синоптическая ID={observationId}</h3>
          {/* <button type="button" onClick={deleteObservation(observationId).then(() => navigate('/synopticObservations'))} className="button muted-button">Удалить</button> */}
          <button onClick={()=>deleteObservation(observationId).then(() => navigate('/synopticObservations'))} className="button muted-button">Удалить</button>
          
          <table className='table table-hover'>
            <thead>
              <tr>
                <th>Дата ввода (UTC)</th><td>{observation.created_at.replace('T',' ').slice(0,19)}</td>
              </tr>
              <tr>
                <th>Дата наблюдения (UTC)</th><td>{observation.observed_at.slice(0,10)}</td>
              </tr>
              <tr>
                <th>Срок</th><td>{observation.term}</td>
              </tr>
              <tr>
                <th>Телеграмма</th><td>{observation.telegram.slice(6)}</td>
              </tr>
            </thead>
          </table>
        </article>
      </section>
    )
  }
}