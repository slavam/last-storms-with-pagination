import {useGetMeteoStationPrecipitationQuery} from '../api/apiSlice'
import Table from 'react-bootstrap/Table'

export function MsPrecipitation({year, month,monthName}) {
    const lastDay = 32 - new Date(+year, +month-1, 32).getDate()
    const date1 = new Date(+year, +month-1, 1)/1000
    const date2 = date1+ lastDay*24*60*60 
    const {data: observations=[],
      isSuccess,
    } = useGetMeteoStationPrecipitationQuery([date1,date2])
  const stations = [34519,34524,34622,34721,34615,34712]
  let prec = new Array(6).fill(null)
  if(isSuccess && observations){
    observations.forEach(o => {
        let i = stations.indexOf(o.station)
        let j = new Date(+o.moment*1000).getDate()
        if(i>=0){
        prec[i] = prec[i] || [i]
        o.point===10800? prec[i][j*2-1]=o.value : prec[i][j*2]=o.value
        }
    })
  }
  let body = []
  const mStations = ['Донецк','Дебальцево','Амвросиевка','Седово','Волноваха','Мариуполь']
  for (let i = 0; i < 6; i++) {
    let row = [<td key={i+100} >{mStations[i]}</td>]
    let j = 1
    while (j < prec[i]?.length) {
      row.push(<td key={i} >{prec[i][j]?prec[i][j]:''}/{prec[i][j+1]?prec[i][j+1]:''}</td>);
      j+=2
    }
    body.push(<tr key={i} className="group">{row}</tr>)
  }
  let header = []
  for(let i = 1; i <= lastDay; i++){
    header.push(<th key={i} scope="col" className="px-3 py-5 font-medium">{i}</th>)
  }
  return(
    <div>
      <h4>Осадки по данным метеостанций за {monthName} месяц {year} года</h4>
      <Table striped bordered hover variant="primary" >
        <thead className="rounded-md bg-gray-400 text-left text-sm font-normal">
          <tr key="0">
            <th key="0" scope="col" className="px-4 py-5 font-medium sm:pl-6">
              Метеостанция
            </th>
            {header}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-gray-900">
          {body}
        </tbody>
      </Table>
    </div>
  )
}