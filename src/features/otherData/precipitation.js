import { useState } from 'react' //app/ui/fonts'
import {HpPrecipitation} from './hydroPostPrecipitation'
import {OtherPrecipitation} from './otherPrecipitation'
import {MsPrecipitation} from './meteoStationPrecipitation'
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import Select from 'react-select'
import { months } from '../../synopticDictionaries'

export const metadata = {
  title: `Осадки`,
}
export const Precipitation=()=> {
  let d = new Date()
  const [year, setYear] = useState(d.getFullYear())
  const [month, setMonth] = useState(months[d.getMonth()])
  let lastDay = 32 - new Date(year, +month.value-1, 32).getDate()
  
  return (
    <div className="col-md-10 offset-md-1 mt-1">
      <h1>Осадки</h1>
      <Container style={{width: '400px'}}>
        <h4>Задайте месяц и год</h4>
        <Table striped bordered hover variant="secondary" >
          <thead>
            <tr>
              <th>Месяц</th>
              <th>Год</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{width:"300px"}}>
                <Select value={month} onChange={val=>{setMonth(val)}} options={months} id='select-month'/>
              </td>
              <td>
                <input type='number' value={year} onChange={e=>{setYear(e.target.value)}} min='2016'  style={{width:"100px"}}/>
              </td>
            </tr>
          </tbody>
        </Table>
      </Container>
      <MsPrecipitation year={year} month={month.value} monthName={month.label}/>
      <HpPrecipitation year={year} month={month.value} monthName={month.label}/>
      <OtherPrecipitation year={year} month={month.value} lastDay={lastDay} monthName={month.label}/>
    </div>
  )
}