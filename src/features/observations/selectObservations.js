import React, { useState } from 'react'
import classnames from 'classnames'
// import { Link } from 'react-router-dom'
import { Spinner } from '../../components/Spinner'
import { useGetObservationsQuery } from '../api/apiSlice' 
import Select from 'react-select'

const stations = [
  {label:'Все',value:'34519,34524,34622,99023,34615,34712'},
  {label:'Донецк',value:'34519'},
  {label:'Дебальцево',value:'34524'},
  {label:'Амвросиевка',value:'34522'},
  {label:'Седово',value:'99023'},
  {label:'Волноваха',value:'34615'},
  {label:'Мариуполь',value:'34712'},
]
const absoluteZero = 273.15
const Observation = ({observation})=>{
  let moment = new Date(+observation.moment*1000)
  let stationName = stations.find((s) => +s.value === +observation.station).label
  let value2
  switch (observation.unit) {
    case 'pa':
      value2 = +observation.value/100
      break
    case 'k':
      value2 = (+observation.value - absoluteZero).toFixed(1)
      break
    default:
      value2 = observation.value
  }
  return <tr key={observation.id}>
    <td>{observation.id}</td>
    <td>{moment.toLocaleString()}</td>
    <td>{observation.point}</td>
    <td>{observation.value}/{value2}</td>
    <td>{stationName}</td>
    <td>{observation.unit}</td>
    <td>{observation.message_id}</td>
    <td>{observation.bseq}</td>
    <td>{observation.code}@{observation.meas_hash}</td>
  </tr>
}
export const SelectObservations = ()=>{
  
  const [station, setStation] = useState(stations[1])
  const [date1, setDate1] = useState(new Date().toISOString().substring(0,10))
  const [date2, setDate2] = useState(new Date().toISOString().substring(0,10))
  let qParams = {
    stations: station.value,
    notbefore: Math.round(new Date(date1).getTime()/1000),
    notafter: Math.round(new Date(date2).getTime()/1000)
  }
  const {
    data: observations = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetObservationsQuery(qParams)

  let content

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    
    const renderedObservations = observations.map((observation) => (
      <Observation key={observation.id} observation={observation} />
    ))

    const containerClassname = classnames('synoptics-container', {
      disabled: isFetching,
    })

    content = <div className={containerClassname}>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Дата(moment)</th>
            <th>Срок(point)</th>
            <th>Значение(value)</th>
            <th>Станция(station)</th>
            <th>Единица измерения(unit)</th>
            <th>message_ID</th>
            <th>bseq</th>
            <th>meas_hash</th>
          </tr>
        </thead>
        <tbody>
          {renderedObservations}
        </tbody>
      </table>
      {/* <Link to={'/createStormBulletin'} params={{bulletinType: 'storm'}}>Создать бюллетень</Link> */}
    </div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }
  
  return (
    // <section className="posts-list">
    <div>
      <label htmlFor="select-station">Метеостанция</label>
      <Select value={station} onChange={val => setStation(val)} options={stations} id='select-station'/>
      {content}
    </div>
  )
}