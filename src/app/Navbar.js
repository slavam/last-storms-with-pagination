import React from 'react'
import { useSelector } from 'react-redux'
// import { Link } from 'react-router-dom'
import { menuItems } from '../menuItems';
import MenuItems from './MenuItems'

// import {
//   useGetStormsQuery,
// } from '../features/storms/stormsSlice'
// import { authActions } from '../features/auth/authSlice'

export const Navbar = () => {
  const authUser = useSelector(x => x.auth.user);
  // const dispatch = useDispatch()
  // const logout = () => dispatch(authActions.logout());

  // Trigger initial fetch of notifications and keep the websocket open to receive updates
  // useGetStormsQuery()

  // const stormsMetadata = useSelector(selectStormsMetadata)
  // const numUnreadStorms = stormsMetadata.filter((n) => !n.read).length

  // let unreadStormsBadge

  // if (numUnreadStorms > 0) {
  //   unreadStormsBadge = (
  //     <span className="badge">{numUnreadStorms}</span>
  //   )
  // }
  // only show nav when logged in
  if (!authUser) return null;

  return (
    <nav>
      <section>
        <p>Пользователь: {authUser.login}</p>
        <h1>Гидрометцентр ДНР</h1>
      </section>
      <div className="nav-area">
        <ul className="menus">
          {menuItems.map((menu, index) => {
            const depthLevel = 0;
            return (
              <MenuItems
                items={menu}
                key={index}
                depthLevel={depthLevel}
              />
            );
          })}
        </ul>
      </div>
    </nav>
  )
}