import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import {
  // fetchStormsWebsocket,
  selectStormsMetadata,
  useGetStormsQuery,
} from '../features/storms/stormsSlice'
import { authActions } from '../features/auth/authSlice'
// import { Login } from '../login/Login';

export const Navbar = () => {
  const authUser = useSelector(x => x.auth.user);
  const dispatch = useDispatch()
  const logout = () => dispatch(authActions.logout());

  // Trigger initial fetch of notifications and keep the websocket open to receive updates
  useGetStormsQuery()

  const stormsMetadata = useSelector(selectStormsMetadata)
  const numUnreadStorms = stormsMetadata.filter((n) => !n.read).length

  

  // const fetchNewStorms = () => {
  //   dispatch(fetchStormsWebsocket())
  // }

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
        <h1>Последние шторма</h1>

        <div className="navContent">
          <div className="navLinks">
            <Link to="/stations">Метеостанции</Link>
            <Link to="/storms">Шторма {unreadStormsBadge}</Link>
            <button onClick={logout} className="btn btn-link nav-item nav-link">Logout</button>
          </div>
          {/* <Login /> */}
        </div>
      </section>
    </nav>
  )
}
