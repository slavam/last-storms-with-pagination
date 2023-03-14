import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import {
  // fetchNotificationsWebsocket,
  selectStormsMetadata,
  useGetStormsQuery,
} from '../features/storms/stormsSlice'

export const Navbar = () => {
  const dispatch = useDispatch()

  // Trigger initial fetch of notifications and keep the websocket open to receive updates
  useGetStormsQuery()

  const stormsMetadata = useSelector(selectStormsMetadata)
  const numUnreadStorms = stormsMetadata.filter((n) => !n.read)
    .length

  const fetchNewStorms = () => {
    // dispatch(fetchStormsWebsocket())
  }

  let unreadStormsBadge

  if (numUnreadStorms > 0) {
    unreadStormsBadge = (
      <span className="badge">{numUnreadStorms}</span>
    )
  }

  return (
    <nav>
      <section>
        <h1>Штормовые телеграммы</h1>

        <div className="navContent">
          <div className="navLinks">
            <Link to="/stations">Метеостанции</Link>
            <Link to="/storms">
              Шторма {unreadStormsBadge}
            </Link>
          </div>

        </div>
      </section>
    </nav>
  )
}
