import React, { useState } from 'react'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'
import Select from 'react-select'
import {stations} from '../../synopticDictionaries'
import {useGetSoapRadiationQuery} from '../api/apiSlice'
import Badge from 'react-bootstrap/Badge'
import Table from 'react-bootstrap/Table'
import ru from 'date-fns/locale/ru'

const RadiationObservation = ({observation})=>{
  let stationName = stations.find((s) => +s.value === +observation.station).label
  return <tr key={observation.id}>
      <td>{observation.id}</td>
      <td>{observation.created_at.replace('T',' ').slice(0,-10)}</td>
      <td>{observation.meas_time.replace('T',' ').slice(0,-10)}</td>
      <td>{stationName}</td>
      <td>{observation.value}</td>
    </tr>
}
export const RadiationSoap = ()=>{
  const [station, setStation] = useState(stations[3])
  const [date1, setDate1] = useState(new Date().toISOString().substring(0,11)+'00:00')
  const [date2, setDate2] = useState(new Date().toISOString().substring(0,16))
  const [limit, setLimit] = useState(10)

  let qParams = {
    stations: station.value,
    notbefore: date1,
    notafter: date2,
    limit: limit,
  }
  const {
    data: observations = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetSoapRadiationQuery(qParams)

  const eventDate1Changed = (e)=>{
    if (!e.target['validity'].valid) return;
    const dt= e.target['value'] + ':00';
    setDate1(dt);
  }
  const eventDate2Changed = (e)=>{
    if (!e.target['validity'].valid) return;
    const dt= e.target['value'] + ':00';
    setDate2(dt);
  }
  const limitChanged =(e) => setLimit(e.target.value)
  
  let content
  let numRecords = 0
  let avgRadiation = 0.
  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    let renderedObservations = null
    
    if(observations && observations[0]){
      renderedObservations = observations.map((observation) => {
        numRecords += 1
        avgRadiation += +observation.value
        return <RadiationObservation key={observation.id} observation={observation}/>
      })
      if(numRecords>0)
        avgRadiation /= numRecords
    }
    const containerClassname = classnames('synoptics-container', {
      disabled: isFetching,
    })

    content = <div className={containerClassname}>
      <h4>Найденные записи <Badge bg="secondary">{numRecords}</Badge> Среднее <Badge bg="secondary">{(avgRadiation).toFixed(2)}</Badge></h4>
      <Table striped bordered hover variant="secondary" >
        <thead>
          <tr>
            <th>ID</th>
            <th>Создана (UTC)</th>
            <th>Наблюдение (UTC)</th>
            <th>Станция</th>
            <th>Значение (usv/h)</th>
          </tr>
        </thead>
        <tbody>
          {renderedObservations}
        </tbody>
      </Table>
    </div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }
  return (
    <div>
      <h1>Измеренный уровень радиации</h1>
      <h4>Параметры поиска</h4>
      <Table striped bordered hover variant="secondary" >
        <thead>
          <tr>
            <th>Станция/пост</th>
            <th>Начальная дата</th>
            <th>Конечная дата</th>
            <th>Лимит</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Select value={station} onChange={val => setStation(val)} options={stations} id='select-station'/>
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
                  pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-2][0-9]:[0-9]{2}"
                  defaultValue={date2} />
            </td>
            <td>
              <input size="4" type='number' value={limit} onChange={limitChanged} id='select-limit'/>
            </td>
          </tr>
        </tbody>
      </Table>
      {/* <Button variant="secondary" onClick={handleShow} disabled={disabled}>
        Chart
      </Button>
      {modal} */}
      <div>
        {content}
      </div>
    </div>
  )
}