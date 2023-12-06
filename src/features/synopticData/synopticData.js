import React, { useState } from 'react'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'
import { useGetDailySynopticDataQuery } from '../api/apiSlice'
import Select from 'react-select'

export const SynopticData = ()=>{
  const dataTypes = [
    {value: '012101@795976906', label: 'Температура воздуха'},
    {value: '012103@-1185861913', label: 'Температура точки росы'},
    {value: '020013@1704154372', label: 'Высота нижней границы облаков'},
    {value: '020010@2031169671', label: 'Общее количество облаков'},
    {value: '020001@-785872443', label: 'Метеорологическая дальность видимости'},
    {value: '010004@1223041370', label: 'Атмосферное давление'},
    {value: '010051@-258507042', label: 'Давление приведенное к среднему уровню моря'},
    {value: '011002@1498965724', label: 'Макс. скорость ветра'},
    
  ]
  const today = new Date().toISOString().substring(0,10)
  // const currentDate = `${d.getUTCFullYear()}-${('0'+(d.getUTCMonth()+1)).slice(-2)}-${('0'+(d.getUTCDate())).slice(-2)}`
  const [reportDate, setReportDate] = useState(today);
  const [dataType, setDataType] = useState(dataTypes[0])
  let reportDateSec = Math.round(new Date(reportDate).getTime()/1000)
  let qParams = [reportDateSec,dataType.value]
  const {
    data: observations = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetDailySynopticDataQuery(qParams)

  let content

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
// Донецк		    34519																
// Дебальцево		34524																
// Амвросиевка	34622																
// Седово				99023											
// //Красноармейск																		
// Волноваха		34615															
// //Артемовск																		
// Мариуполь    34712
// [0,3,6,9,12,15,18,21]
    // const absoluteZero = 273.15
    const codeStations = [null,34519,34524,34622,99023,34615,34712]
    let terms = [null,0,3,6,9,12,15,18,21]
    let i,j
    let temps = [['Срок',0,3,6,9,12,15,18,21],
                 ['Донецк',null,null,null,null,null,null,null,null],
                 ['Дебальцево',,,,,,,,],
                 ['Амвросиевка',,,,,,,,],
                 ['Седово',,,,,,,,],
                 ['Волноваха',,,,,,,,],
                 ['Мариуполь',,,,,,,,]]
    // if(observations && observations !== 'null' && observations !== 'undefined' && observations.length>0)
      observations.map((o) => {
        i = codeStations.indexOf(o.station)
        j = terms.indexOf(o.point/3600)
        temps[i][j] = (+o.value).toFixed(1)
        // if(o.value) {temps[i][9]+=(+o.value); temps[i][10]+=1}
      })
    
    const createTr = (i) => {
      // if(temps[i][10]>0)temps[i][9] = +((temps[i][9]/temps[i][10]).toFixed(2))
      let row = []
      // let st 
      for(let j=0; j<terms.length; j++){
        // st = j === 9? (<b>{temps[i][j]}</b>) : temps[i][j]
        row.push(<td key={j}>{temps[i][j]}</td>)
      }
      return <tr>{row}</tr>
    }
    const createBody = ()=>{
      let body=[]
      for(let i=0; i<codeStations.length; i++){
        body.push(createTr(i))
      }
      return <tbody>{body}</tbody>
    }

    let myBody = createBody()

    const containerClassname = classnames('synoptics-container', {
      disabled: isFetching,
    })

    content = <div className={containerClassname}>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th>Местное время</th>
            <th>3:00</th>
            <th>6:00</th>
            <th>9:00</th>
            <th>12:00</th>
            <th>15:00</th>
            <th>18:00</th>
            <th>21:00</th>
            <th>0:00</th>
          </tr>
        </thead>
        {myBody}
      </table>
      {/* <Link to={'/asPdf'} params={{tempTable: temps}}>PDF</Link> */}
    </div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  const hdr = `${dataType.label} ${reportDate} в сроки наблюдений по данным метеорологических станций`
  const maxDate = new Date().toISOString().substring(0,10)
  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <h2>Синоптические данные по срокам на станциях</h2>
      <div className="form-group">
        <label for="select-type">Задайте тип данных : </label>
        <Select value={dataType} onChange={val => setDataType(val)} options={dataTypes} id='select-type'/>
        <label for="input-date">Задайте дату : </label>
        <input type="date" id="input-date" max={maxDate} name="input-date" value={reportDate} onChange={(event) => setReportDate(event.target.value>maxDate?maxDate:event.target.value)} required={true} autoComplete="on" />
      </div>
      {hdr}
      {content}
    </div>
  )
}