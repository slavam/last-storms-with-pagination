import React, { useLayoutEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import { formatDistanceToNow, parseISO } from 'date-fns'
import classnames from 'classnames'

import {
  useGetStormsQuery,
  allStormsRead,
  selectMetadataEntities,
} from './stormsSlice'

export const StormsList = () => {
  const dispatch = useDispatch()
  const { data: storms = [] } = useGetStormsQuery()
  const stormsMetadata = useSelector(selectMetadataEntities)
  // const users = useSelector(selectAllUsers)

  useLayoutEffect(() => {
    dispatch(allStormsRead())
  })

  const renderedStorms = storms.map((storm) => {
    // const date = parseISO(notification.date)
    // const timeAgo = formatDistanceToNow(date)
    // const user = users.find((user) => user.id === notification.user) || {
    //   name: 'Unknown User',
    // }

    const metadata = stormsMetadata[storm.id]

    const stormClassname = classnames('storm', {
      new: metadata.isNew,
    })

    return (
      <div key={storm.id} className={stormClassname}>
        <div>
          {storm.telegram}
        </div>
        <div title={storm.date}>
          {/* <i>{timeAgo} ago</i> */}
        </div>
      </div>
    )
  })

  return (
    <section className="stormsList">
      <h2>Последние шторма</h2>
      {renderedStorms}
    </section>
  )
}
