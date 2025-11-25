import React, { useState } from 'react'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'
import { useGetSoapObservationsQuery, useGetMeasurementsQuery, useGetMessageDataQuery } from '../api/apiSlice'
import Select from 'react-select'
import ru from 'date-fns/locale/ru'
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import {stations} from '../../synopticDictionaries'
import { Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns'

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, TimeScale);

const absoluteZero = 273.15
const terms = [
  {label:'Любой',value:''},
  {label:'00:00', value:'0'},
  {label:'03:00', value:'3'},
  {label:'05:00', value:'5'},
  {label:'06:00', value:'6'},
  {label:'09:00', value:'9'},
  {label:'12:00', value:'12'},
  {label:'15:00', value:'15'},
  {label:'17:00', value:'17'},
  {label:'18:00', value:'18'},
  {label:'21:00', value:'21'},
]
const sources =[
  {label:'Любой',value:''},                                                                                     
  {label:'100 SYNOP',value:'100'},
  {label:'200 SEA',value:'200'},                                                                                
  {label:'1300 радиация',value:'1300'},
  {label:'1500 гидрология',value:'1500'},                                                                       
  {label:'2100 агро',value:'2100'},
  {label:'2400 снег',value:'2400'},                                                                             
  {label:'10100 SOAP',value:'10100'},
  {label:'10101 шторма',value:'10101'},                                                                         
  {label:'10202 Common XML',value:'10202'},
] 

const Observation = ({observation, measurement, measurements, stream})=>{
  const [queryMessage, setQueryMessage] = useState('')
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const {
    data: telegramData = [],
    isSuccess,
  } = useGetMessageDataQuery(queryMessage)
  let tlgFields = []
  if(isSuccess){
    let ms = {}
    measurements.forEach(m=> {ms[m.meas_hash] = `${m.caption} (${m.unit})`})
    tlgFields = telegramData.map((t)=> {
      if(t.message_id)
        return ((+t.message_id) === (+observation.message_id)) ? <tr key={t.id}>
          <th key={t.id+t.value}>{ms[t.meas_hash]?ms[t.meas_hash]:`${t.meas_hash} (${t.unit})`}</th><td key={t.id}>{t.value}</td>
        </tr> : null
      else
        return <tr key={t.id}>
          <th key={t.id+t.value}>{ms[t.meas_hash]?ms[t.meas_hash]: `${t.meas_hash} (${t.unit})`}</th><td key={t.id}>{t.value}</td>
        </tr>
    })
  }
  let content = ""
  const handleShow = () =>{
    const d = new Date(observation.meas_time);
    let sec = d.getTime()/1000
    // console.log(observation)
    let streams = stream===null ? '' : `&streams=${stream}`
    setQueryMessage(`/get?stations=${observation.station}&notbefore=${sec}&notafter=${sec}&sources=${observation.source}${streams}`)
    setShow(true)
  }
  
  let stationName = stations.find((s) => +s.value === +observation.station).label
  // let termPeriod = (observation.period === 600 || observation.meas_hash === 79004873)? '10 мин.' : ((observation.unit === 'ccitt ia5' || observation.unit === 'v')? '' : observation.point/3600)
  let value2 = null
  switch (observation.units) {
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
        <Modal.Title>Идентификатор источника {observation.message_id? observation.message_id : "(Протокол SOAP)"}</Modal.Title>
      </Modal.Header>
      <Modal.Body >
        <Table striped bordered hover variant="secondary">
          <thead>
            <tr key="1">
              <th>Создана (UTC)</th><td>{observation.created_at.replace('T',' ').slice(0,-10)}</td>
            </tr>
            <tr key="2">
              <th>Наблюдение (UTC)</th><td>{observation.meas_time.replace('T',' ').slice(0,-10)}</td>
            </tr>
            <tr key="3">
              <th>Станция/пост</th><td>{stationName}</td>
            </tr>
            {/* <tr key="4">
              <th>stream</th><td>{observation.stream}</td>
            </tr> */}
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
    <td>{observation.id}/{observation.rec_flag}</td>
    <td>{observation.created_at.replace('T',' ').slice(0,-10)}</td>
    {/* <td>{observation.created_at}</td> */}
    <td>{observation.meas_time.replace('T',' ').slice(0,-10)}</td>
    {/* <td>{observation.meas_time}</td> */}
    <td>{observation.syn_hour}/{observation.period?observation.period/60:''}</td>
    <td>{stationName}-{observation.place}{observation.quality?`/${observation.quality}`:''}</td>
    <td>{obsValue}</td>
    <td>{observation.units}</td>
    <td>{measurement}</td>
    <td>{observation.bseq}:{observation.code}@{observation.meashash}</td>
    <td>{observation.message_id}:{observation.source}</td>
    <td><Button variant="primary" onClick={handleShow}>Комплект</Button></td>
    {modal}
  </tr>
}
export const SelectSoapObservations = ()=>{
  const {
    data: measurements = [],
    isSuccess: isSuccessM,
  } = useGetMeasurementsQuery()
  let parameters = [{label: 'Все', value: null}]
  if(isSuccessM)
    measurements.forEach(m => {parameters.push({label: m.caption, value: m.meas_hash})})

  const [station, setStation] = useState(stations[3])
  const [date1, setDate1] = useState(new Date().toISOString().substring(0,11)+'00:00')
  const [date2, setDate2] = useState(new Date().toISOString().substring(0,16))
  const [param, setParam] = useState(parameters[0])
  const [term, setTerm] = useState(terms[0])
  const [limit, setLimit] = useState(10)
  const [source, setSource] = useState(sources[0])
  const [stream, setStream] = useState({value: null, label: 'Любой'})
  const [quality, setQuality] = useState({value: 0, label: 'Любое'})
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  let qParams = {
    stations: station.value,
    notbefore: date1, //Math.round(new Date(date1).getTime()/1000),
    notafter: date2, //Math.round(new Date(date2).getTime()/1000),
    limit: limit,
    sources: source.value,
    stream: stream.value,
    quality: quality.value,
    syn_hours: term.value==='' ? '' : term.label,
    measurement: param.value,
  }
  const {
    data: observations = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetSoapObservationsQuery(qParams)
  // console.log(observations.length)

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
  const limitChanged =(e) => setLimit(+e.target.value)
  
  let content
  let numRecords = 0
  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    let renderedObservations = null
    
    if(observations && observations[0]){
      
      renderedObservations = observations.map((observation) => {
        numRecords += 1
        let measurement = measurements.filter((m) => +m.meas_hash === +observation.meashash)
        // let measurement = measurements.filter((m) => +m.meas_hash === +observation.meas_hash)
        let mName = measurement[0]? measurement[0].caption : ''
        return <Observation key={observation.id} observation={observation} measurement={mName} measurements={measurements} stream={stream.value}/>
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
            <th>ID/type</th>
            <th>Создана (UTC)</th>
            <th>Наблюдение (UTC)</th>
            <th>Срок/Период(мин.)</th>
            <th>Станция-place/qlty</th>
            <th>Значение</th>
            <th>Единица измерения</th>
            <th>Измерение</th>
            <th>bsec:code@hash</th>
            <th>message_id:source</th>
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
  const options = {
    scales: {
      x: {
          type: 'time',
          // time: {
          //     unit: 'hour'
          // }
      }
    }
  };
  const hydroCodes = [83026,83028,83035,83036,83040,83045,83048,83050,83056,83060,83068,83074,83083]
  const codes = [34519,34524,34622,34721,34615,34712]
  let ds = [[],[],[],[],[],[],[],[],[],[],[],[],[]]
  const isMeteo = !(+(station.value[0])===8)
  observations.forEach(o => {
    let i = isMeteo? codes.indexOf(+o.station): hydroCodes.indexOf(+o.station)
    if(i>=0){
      let radius= 2 //0
      // if(o.syn_hour)
      //   radius = +(o.syn_hour.substring(0,2))>0? +o.syn_hour.substring(0,2) : 2
      // else
      //   radius = +(o.meas_time.substring(11,13))>0? +o.meas_time.substring(11,13):2
      ds[i].push({
        x: o.created_at,
        y: +o.value,
        r: radius,
      })
    }
  });
  const hydroPostData = {
    datasets: [
      {
        label: 'Захаровка',
        data: ds[0],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Донецк',
        data: ds[1],
        backgroundColor: 'rgba(155, 99, 132, 0.5)',
      },
      {
        label: 'Раздольное',
        data: ds[2],
        backgroundColor: 'rgba(55, 99, 132, 0.5)',
      },
      {
        label: 'Сартана',
        data: ds[3],
        backgroundColor: 'rgba(255, 199, 132, 0.5)',
      },
      {
        label: 'Николаевка',
        data: ds[4],
        backgroundColor: 'rgba(255, 99, 32, 0.5)',
      },
      {
        label: 'Кремневка, р.Кальчик',
        data: ds[5],
        backgroundColor: 'rgba(255, 99, 232, 0.5)',
      },
      {
        label: 'Мариуполь',
        data: ds[6],
        backgroundColor: 'rgba(55, 199, 132, 0.5)',
      },
      {
        label: 'Кременевка, р. Малый Кальчик',
        data: ds[7],
        backgroundColor: 'rgba(55, 99, 232, 0.5)',
      },
      {
        label: 'Стрюково',
        data: ds[8],
        backgroundColor: 'rgba(155, 199, 32, 0.5)',
      },
      {
        label: 'Дмитровка',
        data: ds[9],
        backgroundColor: 'rgba(55, 99, 32, 0.5)',
      },
      {
        label: 'Новоселовка',
        data: ds[10],
        backgroundColor: 'rgba(155, 199, 132, 0.5)',
      },
      {
        label: 'Благодатное',
        data: ds[11],
        backgroundColor: 'rgba(55, 9, 132, 0.5)',
      },
      {
        label: 'Алексеево-Орловка',
        data: ds[12],
        backgroundColor: 'rgba(155, 199, 62, 0.5)',
      },
    ]
  }
  const bubleChartData = {
    datasets: [
      {
        label: 'Донецк',
        data: ds[0],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Дебальцево',
        data: ds[1],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Амвросиевка',
        data: ds[2],
        backgroundColor: 'rgba(53, 162, 35, 0.5)',
      },
      {
        label: 'Седово',
        data: ds[3],
        backgroundColor: 'rgba(153, 162, 35, 0.5)',
      },
      {
        label: 'Волноваха',
        data: ds[4],
        backgroundColor: 'rgba(253, 62, 35, 0.5)',
      },
      {
        label: 'Мариуполь',
        data: ds[5],
        backgroundColor: 'rgba(253, 162, 135, 0.5)',
      },
    ],
  };
  const modal =
    <Modal show={show} onHide={handleClose} size='lg'>
      <Modal.Header  >
        <Modal.Title>{param.label}</Modal.Title>
      </Modal.Header>
      <Modal.Body >
        <Bubble options={options} data={isMeteo?bubleChartData:hydroPostData} />
      </Modal.Body>
      <Modal.Footer >
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    const disabled = param.label === 'Все'? true: false
  return (
    <div>
      <h4>Параметры поиска</h4>
      <Table striped bordered hover variant="secondary" >
        <thead>
          <tr>
            <th>Станция/пост</th>
            <th>Измерение</th>
            <th>Начальная дата</th>
            <th>Конечная дата</th>
            <th>Срок</th>
            <th>Источник</th>
            <th>Поток</th>
            <th>Качество</th>
            <th>Лимит</th>
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
                  pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-2][0-9]:[0-9]{2}"
                  defaultValue={date2} />
            </td>
            <td>
              <Select value={term} onChange={val => setTerm(val)} options={terms} id='select-term'/>
            </td>
            <td>
              {/* <input size="4" type='number' value={source} onChange={sourceChanged} id='select-source'/> */}
              <Select value={source} onChange={val => setSource(val)} options={sources} id='select-source'/>
            </td>
            <td>
              <Select value={stream} onChange={val => setStream(val)} options={[{value:null,label:'Любой'},{value:0,label:'0 - основной'},{value:1,label:'1 - автоматический'}]} id='select-stream'/>
            </td>
            <td>
              <Select value={quality} onChange={val => setQuality(val)} options={[{value:0,label:'Любое'},{value:1,label:'Актуальные'}]} id='select-йгфдшен'/>
            </td>
            <td>
              <input size="4" type='number' value={limit} onChange={limitChanged} id='select-limit'/>
            </td>
          </tr>
        </tbody>
      </Table>
      <Button variant="secondary" onClick={handleShow} disabled={disabled}>
        Chart
      </Button>
      {modal}
      <div>
        {content}
      </div>
    </div>
  )
}