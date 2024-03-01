import React, { useState } from 'react'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'
import { useGetObservationsQuery } from '../api/apiSlice' 
import { useGetMeasurementsQuery, useGetMessageDataQuery } from '../api/apiSlice'
import Select from 'react-select'
import ru from 'date-fns/locale/ru'
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import {stations} from '../../synopticDictionaries'

// const stations = [
//   {label:'Все',value:'34519,34524,34622,99023,34615,34712'},
//   {label:'Донецк',value:'34519'},
//   {label:'Дебальцево',value:'34524'},
//   {label:'Амвросиевка',value:'34622'},
//   {label:'Седово',value:'99023'},
//   {label:'Волноваха',value:'34615'},
//   {label:'Мариуполь',value:'34712'},
// ]

const terms = [
  {label:'Любой',value:''},
  {label:'0', value:'0'},
  {label:'3', value:'3'},
  {label:'6', value:'6'},
  {label:'9', value:'9'},
  {label:'12', value:'12'},
  {label:'15', value:'15'},
  {label:'18', value:'18'},
  {label:'21', value:'21'},
]

const absoluteZero = 273.15
const Observation = ({observation, measurement, measurements})=>{
  const [queryMessage, setQueryMessage] = useState('')
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const {
    data: telegramData = [],
    isSuccess,
  } = useGetMessageDataQuery(queryMessage)
  let tlgFields = []
  let telegram = []
  if(isSuccess){
    let ms = {}
    measurements.map(m=> {ms[m.meas_hash] = `${m.caption} (${m.unit})`})
    telegram = telegramData.filter((td)=> td.message_id === observation.message_id)
    tlgFields = telegram.map(t=> {return <tr key={t.id}><th>{ms[t.meas_hash]?ms[t.meas_hash]:t.meas_hash}</th><td>{t.value}</td></tr>})
  }
  let content = ""
  const handleShow = () =>{
    setQueryMessage(`/get?stations=${observation.station}&notbefore=${observation.moment}&notafter=${observation.moment}`)
    setShow(true)
  }
  let moment = new Date(+observation.moment*1000)
  let created = new Date(+observation.created_at*1000)
  let stationName = stations.find((s) => +s.value === +observation.station).label
  let termPeriod = (observation.period === 600 || observation.meas_hash === 79004873)? '10 мин.' : ((observation.unit === 'ccitt ia5' || observation.unit === 'v')? '' : observation.point/3600)

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
  let obsValue = (observation.value === value2 ? observation.value : `${observation.value}/${value2}`)
  const modal =
    <Modal show={show} onHide={handleClose} size='lg'>
      <Modal.Header  >
        <Modal.Title>Идентификатор источника {observation.message_id}</Modal.Title>
      </Modal.Header>
      <Modal.Body >
        <Table striped bordered hover variant="secondary">
          <thead>
            <tr key="1">
              <th>Создана (UTC)</th><td>{created.toISOString().replace('T',' ').slice(0,-5)}</td>
            </tr>
            <tr key="2">
              <th>Наблюдение (UTC)</th><td>{moment.toISOString().replace('T',' ').slice(0,-5)}</td>
            </tr>
            <tr key="3">
              <th>Станция/пост</th><td>{stationName}</td>
            </tr>
            {tlgFields}
          </thead>
        </Table>
      </Modal.Body>
      <Modal.Footer >
        {content}
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  return <tr key={observation.id}>
    <td>{observation.id}</td>
    <td>{created.toISOString().replace('T',' ').slice(0,-5)}</td>
    <td>{moment.toISOString().replace('T',' ').slice(0,-5)}</td>
    <td>{termPeriod}</td>
    <td>{stationName}-{observation.stream}</td>
    <td>{obsValue}</td>
    <td>{observation.unit}</td>
    <td>{measurement}</td>
    <td>{observation.bseq}:{observation.code}@{observation.meas_hash}</td>
    <td>{observation.message_id}:{observation.packet}-{observation.source}</td>
    <td><Button variant="primary" onClick={handleShow}>Source</Button></td>
    {modal}
  </tr>
}
export const SelectObservations = ()=>{
  const {
    data: measurements = [],
    isSuccess: isSuccessM,
  } = useGetMeasurementsQuery()
  let parameters = [{label: 'Все', value: null}]
  if(isSuccessM)
    measurements.map(m => {parameters.push({label: m.caption, value: m.meas_hash})})

  const [station, setStation] = useState(stations[3])
  const [date1, setDate1] = useState(new Date().toISOString().substring(0,11)+'00:00')
  const [date2, setDate2] = useState(new Date().toISOString().substring(0,16))
  const [param, setParam] = useState(parameters[0])
  const [term, setTerm] = useState(terms[0])

  let qParams = {
    stations: station.value,
    notbefore: Math.round(new Date(date1).getTime()/1000),
    notafter: Math.round(new Date(date2).getTime()/1000),
    point: term.value==='' ? '' : +term.value*3600,
    measurement: param.value,
  }
  const {
    data: observations = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetObservationsQuery(qParams)

  const eventDate1Changed = (e)=>{
    if (!e.target['validity'].valid) return;
    const dt= e.target['value'] + ':00Z';
    setDate1(dt);
  }
  const eventDate2Changed = (e)=>{
    if (!e.target['validity'].valid) return;
    const dt= e.target['value'] + ':00Z';
    setDate2(dt);
  }
  let content
  let numRecords = 0
  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    let renderedObservations = null
    
    if(observations){
      renderedObservations = observations.map((observation) => {
        numRecords += 1
        let measurement = measurements.filter((m) => +m.meas_hash === +observation.meas_hash)
        let mName = measurement[0]? measurement[0].caption : ''
        return <Observation key={observation.id} observation={observation} measurement={mName} measurements={measurements}/>
      })
    }

    const containerClassname = classnames('synoptics-container', {
      disabled: isFetching,
    })

    content = <div className={containerClassname}>
      <h4>Найденные записи <Badge bg="secondary">{numRecords}</Badge></h4>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Создана (UTC)</th>
            <th>Наблюдение (UTC)</th>
            <th>Срок/Период</th>
            <th>Станция-stream</th>
            <th>Значение</th>
            <th>Единица измерения</th>
            <th>Измерение</th>
            <th>bsec:code@hash</th>
            <th>message_id:packet-source</th>
            <th></th>
            {/* <th>rec_flag</th> */}
          </tr>
        </thead>
        <tbody>
          {renderedObservations}
        </tbody>
      </table>
    </div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }
  
  return (
    <div>
      <h4>Параметры поиска</h4>
      <Table striped bordered hover variant="secondary">
        <thead>
          <tr>
            <th>Станция/пост</th>
            <th>Измерение</th>
            <th>Начальная дата</th>
            <th>Конечная дата</th>
            <th>Срок</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Select value={station} onChange={val => setStation(val)} options={stations} id='select-station'/>
            </td>
            <td>
              <Select value={param} onChange={val => setParam(val)} options={parameters} id='select-param'/>
            </td>
            <td>
              <input type="datetime-local" id="date-from"
                  onChange={eventDate1Changed} locale={ru}
                  pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                  defaultValue={date1} />
            </td>
            <td>
              <input type="datetime-local" id="date-to"
                  onChange={eventDate2Changed} locale={ru}
                  pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                  defaultValue={date2} />
            </td>
            <td>
              <Select value={term} onChange={val => setTerm(val)} options={terms} id='select-term'/>
            </td>
          </tr>
        </tbody>
      </Table>
      <div>
        {content}
      </div>
    </div>
  )
}