import React from 'react'
import { useState } from "react"
import { useNavigate, useParams } from 'react-router-dom'
import { useGetSynopticObservationQuery, useDeleteObservationMutation } from '../api/apiSlice'
import { Spinner } from '../../components/Spinner'
import { useGetStationsQuery } from '../api/apiSlice'
import { windDirections, visRange, clHeight, clAmount, tendency, 
  weatherInTerm, weatherPast, cloudClForm, cloudCmForm, cloudChForm,
  soilCondition, cloudForm } from '../../synopticDictionaries'

export const ObservationPage = () => {
  const { observationId } = useParams();
  const navigate = useNavigate()
  const {
    data: stations = [],
  } = useGetStationsQuery()

  const {
    data: data = {
      observation: {},
    },
    isLoading,
    // isFetching,
    isSuccess,
    // isError,
    // error,
  } = useGetSynopticObservationQuery(observationId)

  const observation = data.observation
  const [title, setTitle] = useState('')
  
  const [deleteObservation] = useDeleteObservationMutation()
  // const onDeleteObservation = (observationId)=>{
  //   // e.preventDefault()
  //   deleteObservation(observationId).then(() => navigate('/synopticObservations'))
  // }

  if (isLoading) {
    return <Spinner text="Loading..." />
  } 
  if (isSuccess) {
    const station = stations.filter((s) => (s.id === observation.station_id))
    let val = observation.wind_direction
    const windDirection = val === 99 ? 'Переменное' : windDirections[val]
    val = observation.visibility_range
    
    const visibility = (val === null) ? 'Видимость не определена' : (val>=90 ? visRange[val-90] : val)
    val = observation.cloud_base_height
    
    const cloudHeight = (val === null) ? 'Не определена' : clHeight[val]
    val = observation.cloud_amount_1
    const cloudAmount = (val === null) ? 'Определить невозможно или наблюдения не производились' : clAmount[val]

    // if(observation.weather_in_term){
    //   val = observation.weather_in_term
    //   const currentWeather = ''
    //   if(val>=0 && val<=19)
    //     currentWeather = 
    // }
    const getSelectionPosition = () => {
      let selection = window.getSelection();
      // console.log(selection.focusNode.data[selection.focusOffset]);
      if(selection.focusOffset<5) {
        setTitle(station[0].name)
      }
    }
    const pressureAtStation = observation.pressure_at_station_level === null ? null : 
      <tr><th>Давление воздуха на уровне станции (hPa)</th><td>{observation.pressure_at_station_level}</td></tr>
    const pressureAtSea = observation.pressure_at_sea_level === null ? null : 
      <tr><th>Давление воздуха, приведенное к уровню моря (hPa)</th><td>{observation.pressure_at_sea_level}</td></tr>
    const pressureTendencyCharacteristic = observation.pressure_tendency_characteristic === null ? null :
      <tr><th>Характеристика барической тенденции</th><td>{tendency[observation.pressure_tendency_characteristic]}</td></tr>
    const pressureTendency = observation.pressure_tendency === null ? null : 
      <tr><th>Значение барической тенденции (hPa)</th><td>{observation.pressure_tendency}</td></tr>
    const precipitation = observation.precipitation_1 === null ? null : 
      <tr><th>Количество осадков, выпавших за 12 часов (мм)</th><td>{observation.precipitation_1 === 0 ? 'Осадков не было':
        (observation.precipitation_1 === 990 ? 'Следы осадков' :
        (observation.precipitation_1>990 ? (Math.round((observation.precipitation_1-990))/10).toFixed(1):
        observation.precipitation_1))}</td></tr>
    const currentWeather = observation.weather_in_term === null ? null :
      <tr>
        <th>Текущая погода</th><td>{weatherInTerm[observation.weather_in_term]}</td>
      </tr>
    const weatherBetweenTerms = observation.weather_past_1 === null ? null :
      <tr>
        <th>Прошедшая погода</th><td>{weatherPast[observation.weather_past_1]}/{weatherPast[observation.weather_past_2]}</td>
      </tr>
    const cloudAmountClCm = observation.cloud_amount_2 === null ? null :
      <tr>
        <th>Количество облаков CL или CM (баллы)</th><td>{clAmount[observation.cloud_amount_2]}</td>
      </tr>
    const cloudCl = observation.cloud_amount_2 === null ? null :
      (observation.clouds_1 === null ? 'Невозможно определить' :
      <tr>
        <th>Облака вертикального развития (CL)</th><td>{cloudClForm[observation.clouds_1]}</td>
      </tr>)
    const cloudCm = observation.cloud_amount_2 === null ? null :
      (observation.clouds_2 === null ? 'Невозможно определить' :
      <tr>
        <th>Облака среднего яруса (CM)</th><td>{cloudCmForm[observation.clouds_2]}</td>
      </tr>)
    const cloudCh = observation.cloud_amount_2 === null ? null :
      (observation.clouds_3 === null ? 'Невозможно определить' :
      <tr>
        <th>Облака верхнего яруса (CH)</th><td>{cloudChForm[observation.clouds_3]}</td>
      </tr>)
    const tMaxDay = observation.temperature_dey_max === null ? null :
      <tr>
        <th>Максимальная температура воздуха за день (°С)</th><td>{observation.temperature_dey_max}</td>
      </tr>
    const tMinNight = observation.temperature_night_min === null ? null :
      <tr>
        <th>Минимальная темперптура воздуха за ночь (°С)</th><td>{observation.temperature_night_min}</td>
      </tr>
    const soilSurfaceCondition = (observation.temperature_soil_min === null && observation.soil_surface_condition_2 === null) ? null :
      (observation.soil_surface_condition_2 === null ? 'Не определено' :
      <tr>
        <th>Состояние поверхности почвы</th><td>{soilCondition[observation.soil_surface_condition_2]}</td>
      </tr>)
    const tSoilNightMin = observation.temperature_soil_min === null ? null :
      <tr>
        <th>Минимальная температура поверхности почвы за ночь (°С)</th><td>{observation.temperature_soil_min}</td>
      </tr>
    // пропущена группа 4 раздела 3
    const sunDuration = observation.sunshine_duration === null ? null :
      <tr>
        <th>Продолжительность солнечного сияния (часы)</th><td>{observation.sunshine_duration}</td>
      </tr>
    const precipitation2 = observation.precipitation_2 === null ? null : 
      <tr><th>Промежуточное количество осадков, выпавших за 12 часов (мм)</th><td>{observation.precipitation_2 === 0 ? 'Осадков не было':
        (observation.precipitation_2 === 990 ? 'Следы осадков' :
        (observation.precipitation_2>990 ? (Math.round((observation.precipitation_2-990))/10).toFixed(1):
        observation.precipitation_2))}</td></tr>
    const nClouds = observation.cloud_height === null ? null : 
      (observation.cloud_amount_3 === null ? 'Наблюдения не производились' :
      <tr>
        <th>Количество облачности выбранного слоя (баллы)</th><td>{clAmount[observation.cloud_amount_3]}</td>
      </tr>)
    const cloudFormLayer = observation.cloud_height === null ? null : 
      (observation.cloud_form === null ? 'Не определена' :
      <tr>
        <th>Форма облаков выбранного слоя</th><td>{cloudForm[observation.cloud_form]}</td>
      </tr>)
    const cloudBaseHeight = observation.cloud_height === null ? null :
    <tr>
      <th>Высота нижней границы облаков (м)</th><td>{observation.cloud_height<90 ? observation.cloud_height : clHeight[observation.cloud_height-90]}</td>
    </tr>
    const addWeatherInfo = observation.weather_data_add === null ? null :
      <tr>
        <th>Дополнительная информация о погоде</th><td>{observation.weather_data_add}</td>
      </tr>
    const soilSurfaceConditionNoSnow = (observation.soil_surface_condition_1 === null && observation.temperature_soil === null) ? null :
      (observation.soil_surface_condition_1 === null ? 'Не определено' :
      <tr>
        <th>Состояние поверхности почвы без снега</th><td>{soilCondition[observation.soil_surface_condition_1]}</td>
      </tr>)
    return (
      <section>
        <article className="post">
          <h3>Телеграмма синоптическая ID={observationId}</h3>
          <button onClick={()=>deleteObservation(observationId).then(() => navigate('/synopticObservations'))} className="button muted-button">Удалить</button>
          
          <table className='table table-hover'>
            <thead>
              <tr>
                <th>Дата ввода (UTC)</th><td>{observation.created_at.replace('T',' ').slice(0,19)}</td>
              </tr>
              <tr>
                <th>Дата наблюдения (UTC)</th><td>{observation.observed_at.slice(0,10)}</td>
              </tr>
              <tr>
                <th>Срок</th><td>{observation.term}</td>
              </tr>
              <tr>
                <th>Телеграмма</th><td title={title} onClick={getSelectionPosition}>{observation.telegram.slice(6)}</td>
              </tr>
              <tr>
                <th>Метеостанция</th><td>{station[0].name}</td>
              </tr>
              <tr>
                <th>Высота нижней границы самых низких облаков (м)</th><td>{cloudHeight}</td>
              </tr>
              <tr>
                <th>Метеорологическая дальность видимости (км)</th><td>{visibility}</td>
              </tr>
              <tr>
                <th>Общее количество облаков всех ярусов (баллы)</th><td>{cloudAmount}</td>
              </tr>
              <tr>
                <th>Направление ветра (°)</th><td>{windDirection}</td>
              </tr>
              <tr>
                <th>Скорость ветра (м/с)</th><td>{observation.wind_speed_avg}</td>
              </tr>
              <tr>
                <th>Температура воздуха (°С)</th><td>{observation.temperature}</td>
              </tr>
              <tr>
                <th>Точка росы (°С)</th><td>{observation.temperature_dew_point}</td>
              </tr>
              {pressureAtStation}
              {pressureAtSea}
              {pressureTendencyCharacteristic}
              {pressureTendency}
              {precipitation}
              {currentWeather}
              {weatherBetweenTerms}
              {cloudAmountClCm}
              {cloudCl}
              {cloudCm}
              {cloudCh}
              {tMaxDay}
              {tMinNight}
              {soilSurfaceCondition}
              {tSoilNightMin}
              {sunDuration}
              {precipitation2}
              {nClouds}
              {cloudFormLayer}
              {cloudBaseHeight}
              {addWeatherInfo}
              {soilSurfaceConditionNoSnow}
            </thead>
          </table>
        </article>
      </section>
    )
  }
}