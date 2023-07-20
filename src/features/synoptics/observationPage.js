import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetSynopticObservationQuery } from '../api/apiSlice'
import { Spinner } from '../../components/Spinner'

export const ObservationPage = () => {
  const { observationId } = useParams();

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

  // let content

  if (isLoading) {
    <Spinner text="Loading..." />
  } else if (isSuccess) {
    return (
      <section>
        <article className="post">
          <h2>{data.observation.id}</h2>
          <p className="post-content">{data.observation.telegram}</p>
        </article>
      </section>
    )
  }
}