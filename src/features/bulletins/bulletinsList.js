import React, { useState } from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import { Spinner } from '../../components/Spinner'
import { useGetBulletinsQuery } from '../api/apiSlice' 
import Pagination from '../../components/Pagination'
import Select from 'react-select'
// import { Navbar } from '../../app/Navbar'

let Bulletin = ({ bulletin }) => {
  
  return (
    <tr key={bulletin.id}>
      <td>{bulletin.report_date.substr(0,10)}</td>
      <td><Link to={`http://localhost:3000/bulletins/${bulletin.id}/bulletin_show.pdf`} target="_blank" params={{variant: 'warning'}}>
        {bulletin.curr_number}
      </Link></td>
    </tr>
  )
}
export const BulletinsList = ()=>{
  
  const bulletinsType = [
    {label: 'Штормовые предупреждения', value: 'storm'},
    {label: 'Бюллетени ежедневные', value: 'daily'},
  ]
  const [currentPage, setCurrentPage] = useState(1)
  const [bulletinType, setBulletinType] = useState(bulletinsType[0])
  let qParams = [currentPage, bulletinType.value]
  const {
    data = {
      pageSize: 15,
      totalCount: 0,
      bulletins: []
    },
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetBulletinsQuery(qParams)

  let content

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    
    const renderedBulletins = data.bulletins.map((bulletin) => (
      <Bulletin key={bulletin.id} bulletin={bulletin} />
    ))

    const containerClassname = classnames('synoptics-container', {
      disabled: isFetching,
    })

    content = <div className={containerClassname}>
      {/* <p>pageSize {data.pageSize}</p> */}
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={data.totalCount}
        pageSize={data.pageSize}
        onPageChange={page => setCurrentPage(page)}
      />
      <table className='table table-hover'>
        <thead>
          <tr>
            <th>Дата </th>
            <th>Название/номер</th>
          </tr>
        </thead>
        <tbody>
          {renderedBulletins}
        </tbody>
      </table>
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={data.totalCount}
        pageSize={data.pageSize}
        onPageChange={page => setCurrentPage(page)}
      />
      <Link to={'/createStormBulletin'} params={{bulletinType: 'storm'}}>Создать бюллетень</Link>
    </div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }
  
  return (
    <section className="posts-list">
      <label htmlFor="select-type">Задайте тип данных : </label>
      <Select value={bulletinType} onChange={val => setBulletinType(val)} options={bulletinsType} id='select-type'/>
      <h2>{bulletinType.label}</h2>
      {content}
    </section>
  )
}