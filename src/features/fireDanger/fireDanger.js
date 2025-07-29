import React, { useState } from 'react'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'
import { useGetFireDangerQuery } from '../api/apiSlice'
import { stationCoordinates } from '../../synopticDictionaries'
import Table from 'react-bootstrap/Table'
import { YMaps, Map, Placemark, Clusterer } from '@pbe/react-yandex-maps'

{/* <h6>0-400 зеленый; 401-1000 синий; 1001-3000 желтый; 3001-5000 оранж
евый; более 5000 красный.</h6> */}
const markerColor = [null,'islands#darkGreenStretchyIcon','islands#darkBlueStretchyIcon','islands#yellowStretchyIcon','islands#darkOrangeStretchyIcon','islands#redStretchyIcon']
let clusterPoints = []
const stations = [null,'Донецк','Амвросиевка','Дебальцево','Волноваха','Мариуполь',null,null,null,null,'Седово']

export const FireDanger = ()=>{
  const codes = [null,34519,34622,34524,34615,34712,null,null,null,null,34721]
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
      clusterPoints = []
      renderedObservations = fd.fireDangers.map((observation) => {
        if([1,2,3,4,5,10].indexOf(+observation.station_id)>=0){
          let fdClass = +observation.fire_danger<401 ? 1 : 
            (+observation.fire_danger<1001 ? 2 : (+observation.fire_danger<3001 ? 3 : 
            (+observation.fire_danger<5001 ? 4 : 5)))
          clusterPoints.push(<Placemark key={observation.id} defaultGeometry={stationCoordinates[codes[+observation.station_id]]} 
            properties={{
              iconContent: observation.fire_danger,
              hintContent: stations[+observation.station_id],
            }} 
            modules = {
              ['geoObject.addon.hint']
            }
            options={{preset: markerColor[+fdClass]}}/>)
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
      })
    }
    const containerClassname = classnames('synoptics-container', {
      disabled: isFetching,
    })
    content = <div  className={containerClassname}>
      <h4>Показатели пожарной опасности на {reportDate}</h4>
      <YMaps query={{ apikey: process.env.REACT_APP_YANDEX_API_KEY }}>
        <Map
          defaultState={{
            center: [47.7, 38.0],
            zoom: 8,
            controls: ['zoomControl']
          }}
          width={600}
          height={600}
          modules={['control.ZoomControl']}
        >
          <Clusterer
            options={{
              groupByCoordinates: false,
            }}>{clusterPoints}</Clusterer>
        </Map>
      </YMaps>
      <br/>
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
    <section className="posts-list">
      <h1>Пожароопасность</h1>
      <h4>Задайте дату</h4>
      <input type="date" id="input-date" max={maxDate} name="input-date" value={reportDate} onChange={(event) => setReportDate(event.target.value>maxDate?maxDate:event.target.value)} required={true} autoComplete="on" />
      <br/>
      {content}
    </section>
  )
}