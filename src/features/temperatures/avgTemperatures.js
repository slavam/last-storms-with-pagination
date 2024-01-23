import React, { useState } from 'react'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'
import Select from 'react-select'
import Table from 'react-bootstrap/Table'
import { useGetDailyTemperaturesQuery } from '../api/apiSlice'

export const AvgTemperatures = ()=>{
  const startTerms = [
    {label:'00', value:0},
    {label:'03', value:1},
    {label:'06', value:2},
    {label:'09', value:3},
    {label:'12', value:4},
    {label:'15', value:5},
    {label:'18', value:6},
    {label:'21', value:7},
  ]
  const starts = [0,3,6,9,12,15,18,21]
  const d = new Date()
  const currentDate = `${d.getUTCFullYear()}-${('0'+(d.getUTCMonth()+1)).slice(-2)}-${('0'+(d.getUTCDate())).slice(-2)}`
  const [reportDate, setReportDate] = useState(currentDate);
  const [startTerm, setStartTerm] = useState(startTerms[0])
  let reportDateSec = Math.round(new Date(reportDate).getTime()/1000)+(60*60*3*startTerm.value)

  const {
    data: observations = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetDailyTemperaturesQuery(reportDateSec)

  let content

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
// Донецк		    34519																
// Дебальцево		34524																
// Амвросиевка	34622																
// Седово				99023											
// Волноваха		34615															
// Мариуполь    34712
    
    const absoluteZero = 273.15
    const codeStations = [null,34519,34524,34622,99023,34615,34712]
    let shiftTerms = starts.slice(startTerm.value).concat(starts.slice(0,startTerm.value))
    let row0 = ['Срок'].concat(shiftTerms).concat(['Средняя'])
    let i,j
    let temps = [[],
                 ['Донецк',null,null,null,null,null,null,null,null,0,0],
                 ['Дебальцево',null,null,null,null,null,null,null,null,0,0],
                 ['Амвросиевка',null,null,null,null,null,null,null,null,0,0],
                 ['Седово',null,null,null,null,null,null,null,null,0,0],
                 ['Волноваха',null,null,null,null,null,null,null,null,0,0],
                 ['Мариуполь',null,null,null,null,null,null,null,null,0,0]]
    observations.map((o) => {
      i = codeStations.indexOf(o.station)
      j = shiftTerms.indexOf(o.point/3600)+1
      temps[i][j] = (o.value-absoluteZero).toFixed(1)
      if(o.value) {temps[i][9]+=(+o.value-absoluteZero); temps[i][10]+=1}
    })
    const createTr = (i) => {
      if(temps[i][10]>0)temps[i][9] = +((temps[i][9]/temps[i][10]).toFixed(2))
      let row = []
      let st 
      for(let j=0; j<starts.length+2; j++){
        st = j === 9? (<b>{temps[i][j]}</b>) : temps[i][j]
        row.push(<td key={j}>{st}</td>)
      }
      return <tr key={i}>{row}</tr>
    }
    const createBody = ()=>{
      let body=[]
      for(let i=1; i<codeStations.length; i++){
        body.push(createTr(i))
      }
      return <tbody>{body}</tbody>
    }
    let myBody = createBody()
    const containerClassname = classnames('synoptics-container', {
      disabled: isFetching,
    })
    let liveHead = row0.map((th)=> <th>{th}</th>)
    content = <div className={containerClassname}>
      <Table striped bordered hover variant="primary">
        <thead>
          <tr>{liveHead}</tr>
        </thead>
        {myBody}
      </Table>
      {/* <Link to={'/asPdf'} params={{tempTable: temps}}>PDF</Link> */}
    </div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }
  const maxDate = new Date().toISOString().substring(0,10)
  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <h2>Среднесуточная температура воздуха</h2>
      <Table striped bordered hover variant="secondary">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Начальный срок (UTC)</th>
          </tr>
        </thead>
          <tbody>
            <td><input type="date" id="input-date" max={maxDate} name="input-date" value={reportDate} onChange={(event) => {setReportDate(event.target.value>maxDate?maxDate:event.target.value); setStartTerm(+startTerm.label>d.getUTCHours()? startTerms[0]:startTerm);}} required={true} autoComplete="on" /></td>
            <td><Select value={startTerm} onChange={val => setStartTerm((reportDate>=maxDate && +val.label>d.getUTCHours())? startTerms[0]:val)} options={startTerms} id='select-start-term'/></td>
          </tbody>
      </Table>
      
      <h5>Температура воздуха (°С) {reportDate} в сроки наблюдений, начиная со срока {startTerm.label} по данным метеорологических станций</h5>
      {content}
    </div>
  )
}