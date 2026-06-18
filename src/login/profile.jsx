import { useState } from 'react'
import { useSelector } from 'react-redux'
import { applyTheme, getTheme } from '../theme/theme'

export function Profile(){
  const authUser = useSelector(x => x.auth.user)
  const [darkTheme, setDarkTheme] = useState(() => getTheme() === 'dark')

  const handleThemeChange = (e) => {
    const isDark = e.target.checked
    applyTheme(isDark ? 'dark' : 'light')
    setDarkTheme(isDark)
  }

  let content = authUser?
    <section>
      <h3>Пользователь</h3>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th>ID</th><td>{authUser.id}</td>
          </tr>
          <tr>
            <th>Логин</th><td>{authUser.login}</td>
          </tr>
          <tr>
            <th>Роль</th><td>{authUser.role}</td>
          </tr>
          <tr>
            <th>Фамилия</th><td>{authUser.last_name}</td>
          </tr>
          <tr>
            <th>Имя</th><td>{authUser.first_name}</td>
          </tr>
          <tr>
            <th>Отчество</th><td>{authUser.middle_name}</td>
          </tr>
          <tr>
            <th>Должность</th><td>{authUser.position}</td>
          </tr>
          <tr>
            <th>Метеостанция</th><td>{authUser.station_id?authUser.station_id:'Без привязки'}</td>
          </tr>
        </thead>
      </table>
    </section>
    :
    <h1>Unknown</h1>

  return <div className="col-md-2 offset-md-5 mt-1">
    <h4>Build date 2026-06-18 with Cursor AI</h4>
    <section>
      <h3>Настройки</h3>
      <div className="custom-control custom-switch">
        <input
          type="checkbox"
          className="custom-control-input"
          id="darkThemeSwitch"
          checked={darkTheme}
          onChange={handleThemeChange}
        />
        <label className="custom-control-label" htmlFor="darkThemeSwitch">
          Тёмная тема
        </label>
      </div>
    </section>
    {content}
  </div>
}
