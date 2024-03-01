import React from 'react'
import { useSelector } from 'react-redux'
import { menuItems } from '../menuItems';
import MenuItems from './MenuItems'
// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown'

export const Navbar1 = () => {
  const authUser = useSelector(x => x.auth.user);
  
  // only show nav when logged in
  // if (!authUser) return null;

  return (
    <>
    <nav>
      <section>
        <p>Пользователь: {authUser? authUser.login:'Unknown'}</p>
        <h1>Гидрометцентр ДНР</h1>
      </section>
      <div className="nav-area">
        <ul className="menus">
          {menuItems.map((menu, index) => {
            const depthLevel = 0;
            return (
              <MenuItems items={menu} key={index} depthLevel={depthLevel}/>
            );
          })}
        </ul>
      </div>
    </nav>
    </>
  )
}