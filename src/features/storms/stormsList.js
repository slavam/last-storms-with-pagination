import React, { useLayoutEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { TimeAgo } from './TimeAgo'
// import { formatDistanceToNow, parseISO } from 'date-fns'
// import classnames from 'classnames'

import {
  useGetStormsQuery,
  allStormsRead,
  // selectMetadataEntities,
} from './stormsSlice'

export const StormsList = () => {
  const dispatch = useDispatch()
  const { data: storms = [] } = useGetStormsQuery()
  // const stormsMetadata = useSelector(selectMetadataEntities)

  useLayoutEffect(() => {
    dispatch(allStormsRead())
  })

  const renderedStorms = storms.map((storm) => {
    // const date = parseISO(telegram.telegram_date)
    // const timeAgo = formatDistanceToNow(date)
    // const user = users.find((user) => user.id === notification.user) || {
    //   name: 'Unknown User',
    // }

    // const metadata = stormsMetadata[storm.id]

    // const stormClassname = classnames('storm', {
    //   new: metadata.isNew,
    // })

    return (
      // <div key={storm.id} className={stormClassname}>
      <div key={storm.id}>
        <div>
          {storm.telegram}
        </div>
        <div title={storm.telegram_date.substr(0,16).replace('T',' ') }>
          <TimeAgo timestamp={storm.telegram_date} />
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
