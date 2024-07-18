import React, { useState } from 'react'
import { useForm, Controller } from "react-hook-form"
// import classnames from 'classnames'
// import { Spinner } from '../../components/Spinner'
import { useSaveHydroDataQuery } from '../api/apiSlice'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'

export const InputHydroTelegram = ()=>{
  const [hydroData, setHydroData] = useState({})
  const {
    data: response = {},
    isSuccess,
  } = useSaveHydroDataQuery(hydroData)
  // const saveHydroTelegram = useSaveHydroDataQuery(hydroData)
  const hydroPostCode = process.env.REACT_APP_CODE_83028
  
  const [term, setTerm] = useState('08')
  const [contentIndex, setContentIndex] = useState('1')
  let d = new Date().getUTCDate()
  let currDay = d>9 ? d : ('0'+d)
  
  const [group11, setGroup11] = useState('10000')
  const [waterLevel, setWaterLevel] = useState(0)
  const [group12, setGroup12] = useState('20000')
  const [waterLevelDeviation, setWaterLevelDeviation] = useState(0)
  const [telegram, setTelegram] = useState(`HHZZ ${hydroPostCode} ${currDay}${term}${contentIndex} ${group11} ${group12}=`)
  
  const waterLevelChanged = (e)=>{
    let wl = +e.target.value
    wl = wl>4999 ? 4999 : wl
    wl = wl<-999 ? -999 : wl
    setWaterLevel(wl)
    let g1 = wl >= 0 ? wl.toString().padStart(4,'0') : (5000+Math.abs(wl)).toString()
    setGroup11(`1${g1}`)
    setTelegram(`HHZZ ${hydroPostCode} ${currDay}${term}${contentIndex} 1${g1} ${group12}=`)
  }
  const waterLevelDeviationChanged = (e)=>{
    let wld = +e.target.value
    wld = wld>999 ? 999 : wld
    wld = wld<-999 ? -999 : wld
    setWaterLevelDeviation(wld)
    let g2 = wld == 0 ? '0000' : (wld>0 ? (wld.toString().padStart(3,'0')+'1') : (Math.abs(wld).toString().padStart(3,'0')+'2'))
    setGroup12(`2${g2}`)
    setTelegram(`HHZZ ${hydroPostCode} ${currDay}${term}${contentIndex} ${group11} 2${g2}=`)
  }
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    // defaultValues: {
    //   report_date: new Date().toISOString().substr(0, 10),
    //   storm_hour: new Date().getHours(),
    //   storm_minute: 0,
    //   curr_number: 'ШТОРМОВОЕ ПРЕДУПРЕЖДЕНИЕ №',
    //   storm: '',
    //   synoptic1: synoptics[0],
    //   chief: chiefs[0],
    // },
    // formOptions
  })
  const onSubmit = (data) => {
    let hydroData = {
      hydroPostCode,
      waterLevel,
      waterLevelDeviation
    }
    setHydroData(hydroData)
    // alert(JSON.stringify(data))
    // let currDate = new Date()
    // let hydroData = {
    //   'Report': {
    //     station: hydroPostCode,
    //     meas_time_utc: `${currDate.toISOString().split('T')[0]}T${term}:00:00`
    //   },
    //   data_list: {
    //     item: [
    //       {
    //         id: 1,
    //         rec_flag: 1,
    //         code: 360101,
    //         proc: 21,
    //         period: 1,
    //         pkind: 10
    //       },
    //       { // water level
    //         id: 2,
    //         rec_flag: 3,
    //         code: 13205,
    //         unit: 'm',
    //         value: waterLevel/100,
    //         block:1
    //       }
    //     ]
    //   }
    // }
    // setHydroData(hydroData)
    
    // console.log(data); 
    // reset()
    // navigate('/stormBulletins')
    // response = client.call(:set_data, message:{user: 'test',pass: 'test',
    // 'Report'=>{station:'34721','meas_time_utc'=>'2024-05-14T05:00'},
    // data_list:{item:[{id:"1",'rec_flag'=>1,code:'360021',proc:'21',period:'1',pkind:'10'},
                    //  {id:"2",'rec_flag'=>3,code:'10004',value:'98594.44',units:'pa',block:"1"}]}})
  }
  const myForm =
    <Form onSubmit={handleSubmit(onSubmit)} onReset={reset}> 
      <Form.Label>Раздел 1</Form.Label>
      <Form.Group className="mb-3" controlId="formWaterLevel">
        <Form.Label>Уровень воды</Form.Label>
        <Form.Control type="number" value={waterLevel} onChange={waterLevelChanged} min="-999" max="4999" />
        <Form.Text className="text-muted">
          Уровень воды над нулем поста в сантиметрах
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formWaterLevelDeviation">
        <Form.Label>Изменение уровня воды</Form.Label>
        <Form.Control type="number" value={waterLevelDeviation} onChange={waterLevelDeviationChanged} min="-999" max="999"/>
        <Form.Text className="text-muted">
          Изменение уровня воды в сантиметрах
        </Form.Text>
      </Form.Group>

      <Button variant="primary" type="submit">
        Сохранить
      </Button>
    </Form>

  if(isSuccess)
    alert("Success")
  let content
  content = <div>
    <p>{telegram}</p>
    {myForm}
  </div>
  return (
    <section>
      <h2>Ввод гидротелеграмм</h2>
      {content}
    </section>
  )
}