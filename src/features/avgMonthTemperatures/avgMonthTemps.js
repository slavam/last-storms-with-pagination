import React, { useState } from 'react'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'
import { useGetAvgMonthTempQuery } from '../api/apiSlice'
import Select from 'react-select'
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import {stations} from '../../synopticDictionaries'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
// import {useNavigate} from 'react-router-dom'

export const AvgMonthlyTemperatures = ()=>{
  const months = [
    {label:'Январь',value: 1},
    {label:'Февраль',value: 2},
    {label:'Март',value: 3},
    {label:'Апрель',value: 4},
    {label:'Май',value: 5},
    {label:'Июнь',value: 6},
    {label:'Июль',value: 7},
    {label:'Август',value: 8},
    {label:'Сентябрь',value: 9},
    {label:'Октябрь',value: 10},
    {label:'Ноябрь',value: 11},
    {label:'Декабрь',value: 12},
  ]
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
    data: airTemperatures = [],
    isSuccess,
  } = useGetAvgMonthTempQuery(dates)
  const codes = [34519,34524,34622,34721,34615,34712]
  const terms = [0,3,6,9,12,15,18,21]
  let row = new Array(codes.length)
  let avg = new Array(codes.length)
  let m = []
  if(isSuccess && airTemperatures){
    airTemperatures.forEach(e => {
      let i = codes.indexOf(e.station)
      let t = terms.indexOf(e.point/3600)
      let d = new Date(e.moment*1000)
      let day = d.getUTCDate()
      row[i] ||= new Array(monthLastDay)
      row[i][day] ||= new Array(8)
      row[i][day][t] = (+e.value-absoluteZero)
    });
    
    for(let i=0; i<codes.length; i++){
      avg[i] ||= new Array(monthLastDay+1)
      avg[i][0] = codes[i]
      for(let j=1; j<=monthLastDay; j++){
        if(row[i] && row[i][j]){
          let sum =row[i][j].reduce((accumulator, currentValue) => accumulator + currentValue,0)
          let numNotNull = (row[i][j].filter(n => n)).length
          avg[i][j] = (sum/numNotNull).toFixed(1)
        }
      }
    }
    let hdr = [<th key='0'>Метеостанции</th>]
    for(let d=1; d<=monthLastDay; d++){
      hdr.push(<th key={d}>{d}</th>)
    }
    m.push(<tr key="00">{hdr}</tr>)
    for(let i=0; i<codes.length; i++){
      let station = stations.find(s => +s.value === codes[i])
      let tds = [<td key='0'><b>{station.label}</b></td>]
      for(let j=1; j<=monthLastDay; j++){
        tds.push(<td key={j}>{avg[i][j]}</td>)
      }
      m.push(<tr key={i}>{tds}</tr>)
    }
  }
  const navigate = useNavigate();
  const toComponentB=()=>{
    navigate('/createDtePdf', { state: { year: year, month: month.label, nDays: monthLastDay, m: avg } });
  }
  let content = m
  // console.log(m)
  return (
    <div>
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
      <h4>Средняя за сутки (00:01-24:00) температура воздуха (°С) за {month.label} месяц {year} года на метеостанциях ДНР</h4>
      <Table striped bordered hover variant="primary"  >
        {/* <thead> */}
        {/* </thead> */}
        <tbody>
          {content}
        </tbody>
      </Table>
      <Button variant="secondary" onClick={toComponentB}>Создать PDF</Button>
    </div>
  )
}