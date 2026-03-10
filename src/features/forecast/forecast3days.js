import { Spinner } from '../../components/Spinner'
import {useForecast3daysQuery} from '../api/apiSlice'
import { useState } from 'react'

export const Forecast3days = ()=>{
  const d = new Date()
  const currentDate = `${d.getUTCFullYear()}-${('0'+(d.getUTCMonth()+1)).slice(-2)}-${('0'+(d.getUTCDate())).slice(-2)}`
  const [reportDate, setReportDate] = useState(currentDate)
  // const rdPlus1 = reportDate.setDate(reportDate.getDate()+1)
  const maxDate = new Date().toISOString().substring(0,10)
  let rdPlus1 = new Date(reportDate)
  rdPlus1.setDate(rdPlus1.getDate() + 1)
  const rd1 = rdPlus1.toLocaleDateString()
  let rdPlus2 = new Date(reportDate)
  rdPlus2.setDate(rdPlus2.getDate() + 2)
  const rd2 = rdPlus2.toLocaleDateString()
  let rdPlus3 = new Date(reportDate)
  rdPlus3.setDate(rdPlus3.getDate() + 3)
  const rd3 = rdPlus3.toLocaleDateString()
  const {
      data: forecast = {},
      isLoading,
      isSuccess,
      isError,
  } = useForecast3daysQuery(reportDate)
  let content
  if (isLoading) {
      content = <Spinner text="Loading..." />
  } else if (isSuccess && forecast) {
    content = <div>
      <h4>Прогноз погоды на {rd1}</h4>
      <h4>В городе Донецке</h4>
      <p>{forecast.forecast_city}</p>
      <h4>В Донецкой Народной Республике</h4>
      <p>{forecast.forecast}</p>
      <h4>Прогноз погоды на {rd2}</h4>
      <h4>В городе Донецке</h4>
      <p>{forecast.forecast_city_plus_1}</p>
      <h4>В Донецкой Народной Республике</h4>
      <p>{forecast.forecast_plus_1}</p>
      <h4>Прогноз погоды на {rd3}</h4>
      <h4>В городе Донецке</h4>
      <p>{forecast.forecast_city_plus_2}</p>
      <h4>В Донецкой Народной Республике</h4>
      <p>{forecast.forecast_plus_2}</p>
    </div>
  } else if (isError) {
    content = <h4>Данные не найдены</h4>
  }
  return(
    <div className="col-md-6 offset-md-3 mt-5">
      <h1>Прогноз на 1-3 сутки </h1>
      <input type="date" id="input-date" max={maxDate} name="input-date" value={reportDate} onChange={(event) => {setReportDate(event.target.value>maxDate?maxDate:event.target.value);}} required={true} autoComplete="on" />
      {content}
    </div>
  )
}