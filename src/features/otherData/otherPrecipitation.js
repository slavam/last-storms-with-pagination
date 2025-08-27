import { useGetOtherPrecipitationQuery } from '../api/apiSlice'
import Table from 'react-bootstrap/Table'

export const OtherPrecipitation = ({year, month, lastDay,monthName})=>{
  const {data,
    isSuccess,
  } = useGetOtherPrecipitationQuery([month,year])
  // const observations = data
  let body = []
  const mStations = ['Авдотьино','Раздольное','Николаевка','Стрюково','Дмитровка','Новоселовка','Благодатное','Алексеево-Орловка','Кременевка','Захаровка']
  let observations = new Array(mStations.length)
  if(isSuccess && data){
    
    data.forEach((p) => {
      let j = mStations.indexOf(p.source)
      if(j>=0){
        observations[j] ||= new Array(lastDay)
        let i = +p.obs_date.slice(-2)
        observations[j][i] ||= [null,null]
        let k = p.period === 'day'? 1:0
        observations[j][i][k] = p.value
      }
    })
  }
  // let row = [<td key={j}>{mStations[j]}</td>]
    // console.log(observations[0])
    // const observations = data.precipitation
    for (let j = 0; j < mStations.length; j++) {
      let row = [<td key={j} >{mStations[j]}</td>]
      for (let i = 1; i <= lastDay; i++) {
        // let bgColor = i%2===0? '#666':'#888'
        let val = (observations[j] && observations[j][i])? `${observations[j][i][0]===null?'':observations[j][i][0]}/${observations[j][i][1]===null?'':observations[j][i][1]}`:''
        row.push(<td key={1000+i} >{val}</td>)
      }
      body.push(<tr key={j+100}  className="group">{row}</tr>)
    }
  // }
  let header = []
  for(let i = 1; i <= lastDay; i++){
    header.push(<th key={i} scope="col" className="px-3 py-5 font-medium">{i}</th>)
  }
  return (
  <div >
    <h4>Осадки по данным прочих источников за {monthName} месяц {year} года</h4>
    {/* <table className="hidden min-w-full rounded-md text-gray-900 md:table"> */}
    <Table striped bordered hover variant="primary" >
      <thead className="rounded-md bg-gray-400 text-left text-sm font-normal">
        <tr key="00">
          <th key="00" scope="col" className="px-4 py-5 font-medium sm:pl-6">
            Источник
          </th>
          {header}
        </tr>
      </thead>
      <tbody >
        {body}
      </tbody>
    </Table>
  </div>
  )
}