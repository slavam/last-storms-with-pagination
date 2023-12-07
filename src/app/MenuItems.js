import Dropdown from './Dropdown'
import { useState, useEffect, useRef } from "react"
import { Link } from 'react-router-dom'
import { authActions } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'

const MenuItems = ({ items, depthLevel }) => {
  const dispatch = useDispatch()
  const logout = () => dispatch(authActions.logout());
  const [dropdown, setDropdown] = useState(false)
  let ref = useRef()
  useEffect(() => {
    const handler = (event) => {
      if (dropdown && ref.current && !ref.current.contains(event.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler)
    return () => {
    // Cleanup the event listener
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [dropdown])
  const onMouseEnter = () => {
    window.innerWidth > 960 && setDropdown(true);
  };

  const onMouseLeave = () => {
    window.innerWidth > 960 && setDropdown(false);
  }
  const closeDropdown = () => {
    dropdown && setDropdown(false);
  }
  return (
    <li className="menu-items" ref={ref} 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={items.url==='/logout'?logout:closeDropdown}
    >
      {items.submenu ? (
        <>
          <button type="button" aria-haspopup="menu" aria-expanded={dropdown ? "true" : "false"}
            onClick={() => setDropdown((prev) => !prev)}>
            {items.title}{' '}
            {depthLevel > 0 ? <span>&raquo;</span> : <span className="menu-arrow" />}
          </button>
          <Dropdown depthLevel={depthLevel} submenus={items.submenu} dropdown={dropdown}/>
        </>
      ) : (
        <Link to={items.url}>{items.title}</Link>
      )}
    </li>
  );
};

export default MenuItems;
