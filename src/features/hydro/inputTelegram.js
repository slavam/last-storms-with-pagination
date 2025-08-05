import React, { useState } from 'react'
import { useForm } from "react-hook-form"
// import classnames from 'classnames'
// import { Spinner } from '../../components/Spinner'
import Accordion from 'react-bootstrap/Accordion'
import { useSaveHydroDataQuery } from '../api/apiSlice'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'

export const InputHydroTelegram = ()=>{
  const hydroData = {} //, setHydroData] = useState({})
  const {
    data,
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
  } = useForm({})
  const onSubmit = () => {
    // let hydroData = {
    //   hydroPostCode,
    //   waterLevel,
    //   waterLevelDeviation
    // }
    // setHydroData(hydroData)
    setActiveKeys([])
  }
  const [activeKeys, setActiveKeys] = useState(["0"])
  const handleSelect = (eventKey) => setActiveKeys(eventKey)
  const showA1=()=>{
    setTelegram(telegram.slice(0,-1)+' A1=')
  }
  const showA2=()=>{
    setTelegram(telegram.slice(0,-1)+' A2=')
  }
  const showA3=()=>{
    setTelegram(telegram.slice(0,-1)+' A3=')
  }
  const hideA1=()=>{
    setTelegram(telegram.slice(0,28)+'=')
    let result = activeKeys.filter(ak => +ak < 2);
    setActiveKeys(result)
  }
  const hideA2=()=>{
    if(telegram.indexOf(' A2')>0)
      setTelegram(telegram.slice(0,31)+'=')
    let result = activeKeys.filter(ak => ak != '3');
    setActiveKeys(result)
  }
  const hideA3=()=>{
    if(telegram.indexOf(' A3')>0)
      setTelegram(telegram.slice(0,34)+'=')
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
      <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Экземпляр 1</Accordion.Header>
          <Accordion.Body onEnter={showA1} onExited={hideA1}>
            <p>Экземпляр 1</p>
            <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Экземпляр 2</Accordion.Header>
                <Accordion.Body onEnter={showA2} onExited={hideA2}>
                  <p>Экземпляр 2</p>
                  <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                    <Accordion.Item eventKey="3">
                      <Accordion.Header>Экземпляр 3</Accordion.Header>
                      <Accordion.Body onEnter={showA3} onExited={hideA3}>
                        <p>Экземпляр 3</p>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
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
      <h3>{activeKeys}</h3>
      {content}
    </section>
  )
}