import React, { useState } from 'react'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'
import { useGetObservationsQuery } from '../api/apiSlice' 
import { useGetMeasurementsQuery } from '../api/apiSlice'
import Select from 'react-select'
import ru from 'date-fns/locale/ru'
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'

const stations = [
  {label:'Все',value:'34519,34524,34622,99023,34615,34712'},
  {label:'Донецк',value:'34519'},
  {label:'Дебальцево',value:'34524'},
  {label:'Амвросиевка',value:'34622'},
  {label:'Седово',value:'99023'},
  {label:'Волноваха',value:'34615'},
  {label:'Мариуполь',value:'34712'},
]

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
const Observation = ({observation, measurement})=>{
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
  return <tr key={observation.id}>
    <td>{observation.id}</td>
    <td>{created.toISOString().replace('T',' ').slice(0,-5)}</td>
    <td>{moment.toISOString().replace('T',' ').slice(0,-5)}</td>
    <td>{termPeriod}</td>
    <td>{stationName}</td>
    <td>{obsValue}</td>
    <td>{observation.unit}</td>
    <td>{measurement}</td>
    <td>{observation.code}@{observation.meas_hash}</td>
    {/* <td>{observation.pkind}</td>
    <td>{observation.rec_flag}</td> */}
  </tr>
}
export const SelectObservations = ()=>{
  // const [dtlEventDate, setDtlEventDate] = useState(new Date().toISOString().slice(0,-8))
  const {
    data: measurements = [],
    isSuccess: isSuccessM,
  } = useGetMeasurementsQuery()
  let parameters = [{label: 'Все', value: null}]
  if(isSuccessM)
    measurements.map(m => {parameters.push({label: m.caption, value: m.meas_hash})})

  const [station, setStation] = useState(stations[1])
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
        return <Observation key={observation.id} observation={observation} measurement={mName}/>
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
            <th>Станция</th>
            <th>Значение</th>
            <th>Единица измерения</th>
            <th>Измерение</th>
            <th>code@hash</th>
            {/* <th>pkind</th>
            <th>rec_flag</th> */}
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
    <div>
      {/* <section className="posts-list"> */}
      <h4>Параметры поиска</h4>
      {/* <table className='table table-hover'> */}
      <Table striped bordered hover variant="secondary">
        <thead>
          <tr>
            <th>Метеостанция</th>
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