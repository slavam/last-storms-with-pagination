import React, { useMemo } from 'react'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'
import { useGetHydropostsQuery } from '../api/apiSlice'

let Hydropost = ({ post }) => {
  let s = `${post.sindex} ${post.station_name}`
  return (
    <article key={post.sindex}>
      <h3>{s}</h3>
    </article>
  )
}

export const HydropostsList = () => {
  const {
    data: posts = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetHydropostsQuery()

  const sortedPosts = useMemo(() => {
    const sortedPosts = posts.filter((s) => s.sindex > 80000 && s.sindex < 90000)
    return sortedPosts
  }, [posts])

  let content

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    const renderedPosts = sortedPosts.map((post) => (
      <Hydropost key={post.sindex} post={post} />
    ))

    const containerClassname = classnames('stations-container', {
      disabled: isFetching,
    })

    content = <div className={containerClassname}>{renderedPosts}</div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  return (
    <section className="posts-list">
      <h2>Гидропосты</h2>
      {content}
    </section>
  )
}
