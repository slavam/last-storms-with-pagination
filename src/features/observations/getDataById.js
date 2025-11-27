import {useDataByIdQuery} from '../api/apiSlice'
import { useState } from 'react'
import Table from 'react-bootstrap/Table'
import { useForm } from "react-hook-form"

export const ShowById = ()=>{
  const [id, setId] = useState('1')
  const {
      data: obs = [],
      isSuccess,
    } = useDataByIdQuery(id)
  
  let content = null
  if(isSuccess && obs){
    let observation = obs[0]
    let created_at = new Date(observation.created_at*1000).toISOString().replace('T',' ').slice(0,-5)
    let observed_at = new Date(observation.moment*1000).toISOString().replace('T',' ').slice(0,-8)
    let point = observation.point/3600
    let place = observation.place? <tr key="6">
          <th>place</th><td>{observation.place}</td>
        </tr> : null
    let point_at = new Date(observation.point_at*1000).toISOString().replace('T',' ').slice(0,-8)
    let lat = observation.lat? <tr key="10">
          <th>Широта/lat</th><td>{observation.lat}</td>
        </tr> : null
    let lon = observation.lon? <tr key="11">
          <th>Долгота/lon</th><td>{observation.lon}</td>
        </tr> : null        
    let message_id = observation.message_id? <tr key="14">
          <th>ID сообщения/message_id</th><td>{observation.message_id}</td>
        </tr> : null
    let qlty = observation.qlty===null? "Актуальна":"Удалена"
    let alarm = observation.alarm? <tr key="18">
          <th>Шторм/alarm</th><td>Шторм</td>
        </tr> : null
    let proc = observation.proc!==null ? <tr key="21">
          <th>Признак значимости времени/proc</th><td>{observation.proc}</td>
        </tr> : null
    let period = observation.period!==null ? <tr key="22">
          <th>Период измерения/period</th><td>{observation.period}</td>
        </tr> : null
    let pkind = observation.pkind? <tr key="23">
          <th>Код единиц измерения периода/pkind</th><td>{observation.pkind}</td>
        </tr> : null
    let height = observation.height? <tr key="24">
          <th>Высота измерения (метры)/height</th><td>{observation.height}</td>
        </tr> : null
    let sens_type = observation.sens_type!==null ? <tr key="25">
          <th>Тип датчика/sens_type</th><td>{observation.sens_type}</td>
        </tr> : null
    let sens_id = observation.sens_id? <tr key="26">
          <th>Номер датчика/sens_id</th><td>{observation.sens_id}</td>
        </tr> : null
    let meas_hash = observation.meas_hash? <tr key="27">
          <th>Хэш измерения/meas_hash</th><td>{observation.meas_hash}</td>
        </tr> : null
    // let toParentLink = <Link to={`/getDataById/${observation.packet}`}>{observation.packet}</Link>
    content = <Table striped bordered hover variant="secondary">
      <thead>
        <tr key="1">
          <th>Создана (UTC)/created_at</th><td>{created_at}</td>
        </tr>
        <tr key="2">
          <th>Наблюдение (UTC)/moment</th><td>{observed_at}</td>
        </tr>
        <tr key="3">
          <th>Станция/пост/station</th><td>{observation.station}</td>
        </tr>
        <tr key="4">
          <th>ID/id</th><td>{observation.id}</td>
        </tr> 
        <tr key="5">
          <th>Срок/point</th><td>{point}</td>
        </tr> 
        {place}
        <tr key="7">
          <th>Время измерения (UTC)/point_at</th><td>{point_at}</td>
        </tr>
        <tr key="8">
          <th>Значение/value</th><td>{observation.value}</td>
        </tr>
        <tr key="9">
          <th>Единица измерения/unit</th><td>{observation.unit}</td>
        </tr>
        {lat}
        {lon}
        <tr key="12">
          <th>Поток/stream</th><td>{observation.stream}</td>
        </tr>
        <tr key="13">
          <th>Код BUFR/code</th><td>{observation.code}</td>
        </tr>
        {message_id}
        <tr key="15">
          <th>Источник измерения/source</th><td>{observation.source}</td>
        </tr>
        <tr key="16">
          <th>ID родителя/packet</th><td>{observation.packet}</td>
        </tr>
        <tr key="17">
          <th>Качество/qlty</th><td>{qlty}</td>
        </tr>
        {alarm}
        <tr key="19">
          <th>Базовая последовательность/bseq</th><td>{observation.bseq}</td>
        </tr>
        <tr key="20">
          <th>Тип записи/rec_flag</th><td>{observation.rec_flag}</td>
        </tr>
        {proc}
        {period}
        {pkind}
        {height}
        {sens_type}
        {sens_id}
        {meas_hash}
      </thead>
    </Table>
  }
  const {
      register,
      handleSubmit,
    } = useForm({
      defaultValues: {
        id: ''
      },
    })
  const onSubmit = (data) => {
    setId(+data.id)
  } 
  return(
    <div className="col-md-8 offset-md-2 mt-5">
      <h1>Задайте идентификатор записи</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-6 mb-3">
            <label><b>ID</b></label>
            <br/>
            <input type="text" style={{width:140+'px'}} id="id" {...register("id")} required/>
          </div>
        </div>
        <input type="submit" value='Выбрать' />
      </form>
      <br/>
      <h1>Значения полей</h1>
      {content}
    </div>
  )
}