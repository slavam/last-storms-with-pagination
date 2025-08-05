import React, { useState, useEffect } from 'react'
import { YMaps, Map, Placemark, Clusterer } from '@pbe/react-yandex-maps'
import { useGetWaterLevelQuery, useGetHydropostsQuery } from '../api/apiSlice'
// import { stations } from '../../synopticDictionaries'
import ru from 'date-fns/locale/ru'

export const WaterLevel = ()=>{
  const d = new Date()
  const [reportDate, setReportDate] = useState(`${d.getUTCFullYear()}-${('0'+(d.getUTCMonth()+1)).slice(-2)}-${('0'+(d.getUTCDate())).slice(-2)} 00:00:00`)
  let reportDateSec = Math.round(new Date(reportDate).getTime()/1000)
  const {
    data: hydroPosts = [],
    // isLoading,
    isFetching: gpFetching,
    isSuccess: gpSuccess,
    isError,
    error,
  } = useGetHydropostsQuery()
  // let observations=[]
  // useEffect(() => {
    const {
      data: observations=[],
      isSuccess
    } = useGetWaterLevelQuery(reportDateSec)
  // }, [reportDateSec]);
  // console.log(hydroPosts)
    const clusterPoints = []
    let wlData = null
    hydroPosts.map((s) =>{
      let waterLevel = 0
      let waterLevelChange = 0
      if(gpSuccess && isSuccess && observations){
        wlData = observations.find(o=>(o.station===s.sindex) && ((o.meas_hash===-1334432274) || (o.meas_hash===-521391231)))
        if(wlData){
          waterLevel = wlData.value
          wlData = observations.find(o=>(o.station===s.sindex) && (o.meas_hash===622080813))
          if(wlData){
            waterLevelChange = +wlData.value
            waterLevelChange = waterLevelChange>0? '↑'+waterLevelChange+'м.' : (waterLevelChange===0? 'Без изменений': '↓'+(-waterLevelChange)+'м.')
            clusterPoints.push(<Placemark key={s.sindex} defaultGeometry={[s.latitude, s.longitude]}
            properties={{
              iconContent: `Уровень ${waterLevel}м. ${waterLevelChange}`,
              hintContent: `${s.sindex} ${s.station_name}`,
            }}
            modules = {['geoObject.addon.hint']}
            options={{preset: "islands#blueStretchyIcon"}}/>)
          }
        }
      }
      
    })
    const eventDate1Changed = (e)=>{
      if (!e.target['validity'].valid) return;
      const dt= e.target['value'] + ':00';
      setReportDate(dt);
      reportDateSec = Math.round(new Date(reportDate).getTime()/1000)
    }
    return (
      <div className="col-md-8 offset-md-2 mt-1">
        <h1>Уровень воды {reportDate.slice(0,10)}</h1>
        <input type="datetime-local" id="date-from"
                  onChange={eventDate1Changed} locale={ru}
                  pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                  defaultValue={reportDate} />
      <YMaps query={{ apikey: process.env.REACT_APP_YANDEX_API_KEY }}>
        <Map
          defaultState={{
          center: [47.1, 37.7],
          zoom: 8,
          controls: ['zoomControl']
          }}
          width={800}
          height={800}
          modules={['control.ZoomControl']}
        >
          <Clusterer options={{groupByCoordinates: false}}>{clusterPoints}</Clusterer>
        </Map>
      </YMaps>
      </div>
    )
  }
  // Donetsk 48 04 20N 037 43 36E 225.00 => 48.072222, 37.726667