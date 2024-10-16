import { useSelector } from 'react-redux'
export function Profile(){
  const authUser = useSelector(x => x.auth.user)
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
  return <div>
    <h4>Build date 2024-10-16</h4>
    {content}
  </div>
}