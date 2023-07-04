import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import {
  selectStormsMetadata,
  useGetStormsQuery,
} from '../features/storms/stormsSlice'
import { authActions } from '../features/auth/authSlice'

export const Navbar = () => {
  const authUser = useSelector(x => x.auth.user);
  const dispatch = useDispatch()
  const logout = () => dispatch(authActions.logout());

  // Trigger initial fetch of notifications and keep the websocket open to receive updates
  useGetStormsQuery()

  const stormsMetadata = useSelector(selectStormsMetadata)
  const numUnreadStorms = stormsMetadata.filter((n) => !n.read).length

  let unreadStormsBadge

  if (numUnreadStorms > 0) {
    unreadStormsBadge = (
      <span className="badge">{numUnreadStorms}</span>
    )
  }
  // only show nav when logged in
  if (!authUser) return null;

  return (
    <nav>
      <section>
        <p>Пользователь: {authUser.login}</p>
        <h1>Последние шторма</h1>
        <div className="navContent">
          <div className="navLinks">
            <Link to="/stations">Метеостанции</Link>
            <Link to="/storms" >Шторма {unreadStormsBadge}</Link>
            <Link to="/synopticObservations">SYNOP</Link>
            <Link to="/logout" onClick={logout}>Выход</Link>
          </div>
        </div>
      </section>
    </nav>
  )
}