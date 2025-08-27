import {useGetHydroPostPrecipitationQuery} from '../api/apiSlice'
import Table from 'react-bootstrap/Table'
// import classnames from 'classnames'

export const HpPrecipitation = ({year, month, monthName})=>{
  const lastDay = 32 - new Date(+year, +month-1, 32).getDate()
  const date1 = new Date(+year, +month-1, 1)/1000
  const date2 = date1+ lastDay*24*60*60 
  const {data: observations=[],
    isSuccess,
    // isFetching,
  } = useGetHydroPostPrecipitationQuery([date1,date2])
  const posts =    [83026,      83028,   83035,       83040,       83050,               83056,     83060,      83068,        83074,        83083]
  const postName = ['Захаровка','Донецк','Раздольное','Николаевка','Кременевка, Кальчик','Стрюково','Дмитровка','Новоселовка','Благодатное','Алексеево-Орловка']
  let perc = new Array(8).fill(null)
  if(isSuccess && observations){
    observations.forEach(o => {
      let i = posts.indexOf(o.station)
      let j = new Date(+o.moment*1000).getDate()
      if(i>=0){
        perc[i] = perc[i] || [i]
        perc[i][j]= +o.value===0? '0': +o.value
      }
    });
  }
  let body = []
  
  for (let i = 0; i < 8; i++) {
    let row = [<td key={i+100} >{postName[i]}</td>]
    let j = 1
    while (j < perc[i]?.length) {
      row.push(<td key={j} >{perc[i][j]?perc[i][j]:''}</td>);
      j+=1
    }
    body.push(<tr key={i+200} className="group">{row}</tr>)
  }
  let header = []
  for(let i = 1; i <= lastDay; i++){
    header.push(<th key={i} scope="col" className="px-3 py-5 font-medium">{i}</th>)
  }
  // const containerClassname = classnames('synoptics-container', {
  //   disabled: isFetching,
  // })
  return <div>
    <h4>Осадки по данным гидропостов за {monthName} месяц {year} года</h4>
    {/* <table className="hidden min-w-full rounded-md text-gray-900 md:table"> */}
    <Table striped bordered hover variant="primary" >
    {/* <table className='table table-hover'> */}
      <thead className="rounded-md bg-gray-400 text-left text-sm font-normal">
        <tr key="00">
          <th key="00" scope="col" className="px-4 py-5 font-medium sm:pl-6">
            Гидропост
          </th>
          {header}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 text-gray-900">
        {body}
      </tbody>
    </Table>
  </div>
}