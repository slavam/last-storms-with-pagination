import React, { useState } from 'react'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'
import { useGetFireDangerQuery } from '../api/apiSlice'
import Table from 'react-bootstrap/Table'
// import ru from 'date-fns/locale/ru'
// import { YMaps, Map, Placemark, Clusterer } from '@pbe/react-yandex-maps'

const OneFireDanger = ({observation})=>{
  if([1,2,3,4,5,10].indexOf(+observation.station_id)>=0){
    let fdClass = +observation.fire_danger<401 ? 1 : 
      (+observation.fire_danger<1001 ? 2 : (+observation.fire_danger<3001 ? 3 : 
      (+observation.fire_danger<5001 ? 4 : 5)))
    const stations = [null,'Донецк','Амвросиевка','Дебальцево','Волноваха','Мариуполь',null,null,null,null,'Седово']
    let dailyPrecipitation = Math.round((parseFloat(observation.precipitation_day)+parseFloat(observation.precipitation_night))*10)/10
    return <tr key={observation.id}>
        <td>{stations[observation.station_id]}</td>
        <td>{fdClass}</td>
        <td>{observation.fire_danger}</td>
        <td>{observation.temperature}</td>
        <td>{observation.temperature_dew_point}</td>
        <td>{dailyPrecipitation}</td>
      </tr>
  }
}

export const FireDanger = ()=>{
  const maxDate = new Date().toISOString().substring(0,10)
  const d = new Date()
  const currentDate = `${d.getUTCFullYear()}-${('0'+(d.getUTCMonth()+1)).slice(-2)}-${('0'+(d.getUTCDate())).slice(-2)}`
  const [reportDate, setReportDate] = useState(currentDate)
  const {
    data: fd,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetFireDangerQuery(reportDate)
  
  let content
  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    let renderedObservations = null
    
    if(fd.fireDangers && fd.fireDangers[0]){
      renderedObservations = fd.fireDangers.map((observation) => {
        return <OneFireDanger key={observation.id} observation={observation}/>
      })
    }
    const containerClassname = classnames('synoptics-container', {
      disabled: isFetching,
    })
    content = <div  className={containerClassname}>
      <h4>Показатели пожарной опасности на {reportDate}</h4>
      <Table striped bordered hover variant="secondary" >
        <thead>
          <tr>
            <th>Метеостанция</th>
            <th>Класс</th>
            <th>Пожароопасность</th>
            <th>Температура (°С)</th>
            <th>Точка росы (°С)</th>
            <th>Осадки за сутки (мм)</th>
          </tr>
        </thead>
        <tbody>
        {renderedObservations}
        </tbody>      				
      </Table>
    </div>
  }else if (isError) {
    content = <div>{error.toString()}</div>
  }
  return(
    <div>
      <h1>Пожароопасность</h1>
      <h4>Задайте дату</h4>
      <input type="date" id="input-date" max={maxDate} name="input-date" value={reportDate} onChange={(event) => setReportDate(event.target.value>maxDate?maxDate:event.target.value)} required={true} autoComplete="on" />
      
      {content}
    </div>
  )
}