import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const hmcDnrIp = 'http://10.54.1.6:8080'
const stations = '34519,34524,34622,34721,34615,34712'
const points = '0,10800,21600,32400,43200,54000,64800,75600'
let url = window.location.href
const soapApiIp = ((url.indexOf('localhost')>-1 || (url.indexOf('//10.54')>-1))? '10.54.1.11:8083':'31.133.32.14:8083')
export const apiSlice = createApi({
  reducerPath: 'api',
  // baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000', mode: "cors" }),
  // baseQuery: fetchBaseQuery({ baseUrl: 'http://31.133.32.14:8640'}),
  baseQuery: fetchBaseQuery({ baseUrl: 'http://10.54.1.30:8640'}),
  tagTypes: ['Station','Hydropost','Synoptic','Measurement','Bulletins','Observations','Telegram','Teploenergo',
    'SoapObservations','SoapRadiation','WmoStation','FireDanger','NewHydroTelegram'],
  endpoints: (builder) => ({
    getFireDanger: builder.query({
      query: (reportDate)=>{
        return `${hmcDnrIp}/fire_dangers/daily_fire_danger?format=json&report_date=${reportDate}`},
      providesTags: ['FireDanger']
    }),
    getWmoStations: builder.query({
      query: () => `${hmcDnrIp}/wmo_stations/wmo_stations.json`,
      providesTags: (result = [], error, arg) => [
        'WmoStation',
        ...result.map(({ id }) => ({ type: 'WmoStation', id })),
      ],
    }),
    getSoapMeteoStations: builder.query({
      // query: ()=> 'http://localhost:3000/stations/meteostations?format=json',
      query: ()=> `http://${soapApiIp}/stations/meteostations?format=json`,
      providesTags: ['SoapMeteoStations'],
    }),
    getHydroposts: builder.query({
      query: ()=>'/stations.json',
      providesTags: (result = [], error, arg) => [
        'Hydropost',
        ...result.map(({ id }) => ({ type: 'Hydropost', id })),
      ],
    }),
    getMeasurements: builder.query({
      query: () => '/measurement.json',
      providesTags: (result = [], error, arg)=>[
        'Measurement',
        ...result.map(({id})=>({type: 'Measurement',id})),
      ],
    }),
    getSoapRadiation: builder.query({
      query: (qParams)=>{
        return `http://${soapApiIp}/observations/observations?mode=no-cors&min_quality=1&sources=1300&hashes=-1881179977&limit=${qParams.limit}&stations=${qParams.stations}&after=${qParams.notbefore}&before=${qParams.notafter}`
      },
      providesTags: ['SoapRadiation']
    }),
    getSoapObservations: builder.query({
      query: (qParams)=> {
        let hashes = qParams.measurement ? `&hashes=${qParams.measurement}`:'';
        let sources = +qParams.sources===0 ? '' : `&sources=${qParams.sources}`
        let stream = qParams.stream.value===null ? '' : `&streams=${qParams.stream.value}`
        let term = qParams.syn_hours==='' ? '' : `&syn_hours=${qParams.syn_hours}`
        return `http://${soapApiIp}/observations/observations?min_quality=${qParams.quality}&limit=${qParams.limit}&stations=${qParams.stations}&after=${qParams.notbefore}&before=${qParams.notafter}${sources}${hashes}${term}${stream}`
        // return `http://localhost:3000/observations/observations?min_quality=${qParams.quality}&limit=${qParams.limit}&stations=${qParams.stations}&after=${qParams.notbefore}&before=${qParams.notafter}${sources}${hashes}${term}${stream}`
      },
      providesTags: ['SoapObservations']
    }),
    getObservations: builder.query({
      query: (qParams)=> {
        let hashes = qParams.measurement ? `&hashes=${qParams.measurement}`:'';
        let point = qParams.point==='' ? '' : `&point=${qParams.point}`
        return `/get?stations=${qParams.stations}&notbefore=${qParams.notbefore}&notafter=${qParams.notafter}${hashes}${point}&limit=100`
      },
      providesTags: ['Observations']
    }),
    getMessageData: builder.query({
      query: (queryMessage)=>  {
        return `${queryMessage}`}, 
        providesTags: (result = [], error, arg)=>[
          'Telegram',
          ...result.map(({id})=>({type: 'Telegram',id})),
        ],
    }),
    getAvgMonthTemp: builder.query({
      query: (dates)=>{
        // const stations = '34519,34524,34622,34721,34615,34712'
        return `/get?stations=${stations}&hashes=795976906&notbefore=${dates[0]}&notafter=${dates[1]}`
      },
      providesTags: ['Teploenergo']
    }),
    getDailySynopticData: builder.query({
      query: (qParams)=>
      `/get?stations=${stations}&codes=${qParams[1].substring(1,6)}&hashes=${qParams[1].substring(7,100)}&notbefore=${+qParams[0]}&notafter=${+qParams[0]+24*60*60}`,
      providesTags: (result = [], error, arg) => [
        'SynopticData',
        ...result.map(({ id }) => ({ type: 'SynopticData', id })),
      ],
    }),
    getDailyTemperatures: builder.query({query: (reportDate) => 
        // `/get?stations=${stations}&quality=null&streams=0&source=100&codes=12101&hashes=795976906&notbefore=${reportDate}&notafter=${reportDate+22*60*60}`,
        `/get?stations=${stations}&quality=1&source=100,10202&hashes=795976906,1451382247&point=${points}&notbefore=${reportDate}&notafter=${reportDate+22*60*60}`,
      
      providesTags: (result = [], error, arg) => [
        'Temperature',
        ...result.map(({ id }) => ({ type: 'Temperature', id })),
      ],
    }),
    getBulletins: builder.query({
      // baseQuery: fetchBaseQuery({ baseUrl: 'http://10.105.24.41:8080'}),
      // query: (qParams)=> `http://10.105.24.41:8080/bulletins/list?format=json&page=${qParams[0]}&bulletin_type=${qParams[1]}`,
      query: (qParams)=> `${hmcDnrIp}/bulletins/list?format=json&page=${qParams[0]}&bulletin_type=${qParams[1]}`, //&user_id=${qParams[2]}`,
      providesTags: ['Bulletins'],
    }),
    getSynopticObservations: builder.query({
      query: (currentPage) => '/synoptic_observations.json?page='+currentPage+'&page_size=15',
      providesTags: ['Synoptic'],
    }),
    getSynopticObservation: builder.query({
      query: (observationId) => `/synoptic_observations/${observationId}.json`,
      providesTags: ['Synoptic'],
    }),
    deleteObservation: builder.mutation({
      query: (id) => ({
        url: `/synoptic_observations/${id}.json`,
        method: "DELETE",
      }),
      invalidatesTags: ["Synoptic"]
    }),
    getGustsWind: builder.query({
      query:(currentPage)=>'/other_observations.json?factor=wind&page_size=15&page='+currentPage,
      providesTags: ['Wind']
    }),
    getTemp8: builder.query({
      query:(currentPage)=>'/other_observations.json?factor=temp&page_size=15&page='+currentPage,
      providesTags: ['Wind', 'Temp8']
    }),getPrecipitation: builder.query({
      query:(currentPage)=>'/other_observations.json?factor=perc&page_size=15&page='+currentPage,
      providesTags: ['Wind', 'Precipitation']
    }),
    deleteWind: builder.mutation({
      query: (id)=>({
        url: `/other_observations/${id}.json`,
        method: "DELETE"
      }),
      invalidatesTags: ['Wind']
    }),
    saveHydroData: builder.query({
      query: hydroData=>{
        let s = ''
        Object.keys(hydroData).forEach(key=>{s+=(`${key}=${hydroData[key]}&`)})
        return `http://${soapApiIp}/conservations/conservations?${s.slice(0,-1)}`
      },
    }),
    // saveHydroData: builder.mutation({
    //   query: hydroData=>({
    //     method: "POST",
    //     url: 'http://localhost:3000/conservations/save_hydro_data?format=json',
    //     body: hydroData
    //   }),
    //   invalidatesTags: ['NewHydroTelegram']
    // }),
    createStorm: builder.mutation({
      query: bulletin =>({
        method: "POST",
        url: `${hmcDnrIp}/bulletins?format=json`,
        body: bulletin
      })
    })
  })
})

export const {
  useGetWmoStationsQuery,
  useGetMeasurementsQuery,
  useGetDailyTemperaturesQuery,
  useGetDailySynopticDataQuery,
  useGetSynopticObservationsQuery,
  useGetSynopticObservationQuery,
  useDeleteObservationMutation,
  useGetGustsWindQuery,
  useGetTemp8Query,
  useGetPrecipitationQuery,
  useDeleteWindMutation,
  useGetBulletinsQuery,
  useCreateStormMutation,
  useGetObservationsQuery,
  useGetMessageDataQuery,
  useGetAvgMonthTempQuery,
  useGetHydropostsQuery,
  useGetSoapMeteoStationsQuery,
  useGetSoapObservationsQuery,
  useGetSoapRadiationQuery,
  useGetFireDangerQuery,
  useSaveHydroDataQuery
} = apiSlice