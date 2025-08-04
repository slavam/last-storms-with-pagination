import React, { useState } from 'react'
import { useGetAvgMonthTemperature15HoursQuery } from '../api/apiSlice'
import Select from 'react-select'
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import {stations} from '../../synopticDictionaries'
import { months } from '../../synopticDictionaries'

export const AvgMonthTemperature15Hours = ()=>{
  let d = new Date()
  const [year, setYear] = useState(d.getFullYear())
  const [month, setMonth] = useState(months[d.getMonth()])
  const [startDate, setStartDate] = useState(`${year}-${month.value}-1`)
  const date1 = Math.round(new Date(startDate).getTime()/1000)
  const monthLastDay = new Date(year, month.value, 0).getDate()
  const date2 = date1+monthLastDay*24*60*60
  const dates = [date1,date2]
  const absoluteZero = 273.15
  const {
    data: avgDailyTemp = [],
    isSuccess,
  } = useGetAvgMonthTemperature15HoursQuery(dates)
  const codes = [34519,34524,34622,34721,34615,34712]
  let row = new Array(codes.length)
  let m = []
  if(isSuccess && avgDailyTemp){
    avgDailyTemp.forEach(e => {
      let i = codes.indexOf(e.station)
      let d = new Date(e.moment*1000)
      let day = d.getUTCDate()
      row[i] ||= new Array(monthLastDay)
      row[i][day] = Math.round((+e.value-absoluteZero)*100)/100
    });
    
    let hdr = [<th key='0'>Метеостанции</th>]
    for(let d=1; d<=monthLastDay; d++){
      hdr.push(<th key={d}>{d}</th>)
    }
    m.push(<tr key="00">{hdr}</tr>)
    for(let i=0; i<codes.length; i++){
      let station = stations.find(s => +s.value === codes[i])
      let tds = [<td key='0'><b>{station.label}</b></td>]
      for(let j=1; j<=monthLastDay; j++){
        tds.push(<td key={j}>{row[i][j]}</td>)
      }
      m.push(<tr key={i}>{tds}</tr>)
    }
  }

  let content = m
  return (
    <div className="col-md-10 offset-md-1 mt-1">
      <Container style={{width: '400px'}}>
      <h4>Задайте месяц и год</h4>
      <Table striped bordered hover variant="secondary"  >
        <thead>
          <tr>
            <th>Месяц</th>
            <th>Год</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{width:"300px"}}>
              <Select value={month} onChange={val=>{setMonth(val);setStartDate(`${year}-${val.value}-01`)}} options={months} id='select-month'/>
            </td>
            <td>
              <input type='number' value={year} onChange={e=>{setYear(e.target.value);setStartDate(`${e.target.value}-${month.value}-01`)}} min='2016'  style={{width:"100px"}}/>
            </td>
          </tr>
        </tbody>
      </Table>
      </Container>
      <h4>Средняя за сутки (18-15) температура воздуха (°С) за {month.label} месяц {year} года на метеостанциях ДНР</h4>
      <Table striped bordered hover variant="primary"  >
        <tbody>
          {content}
        </tbody>
      </Table>
    </div>
  )
}