import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  // baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000', mode: "cors" }),
  baseQuery: fetchBaseQuery({ baseUrl: 'http://31.133.32.14:8640'}),
  tagTypes: ['Station','Synoptic'],
  endpoints: (builder) => ({
    getStations: builder.query({
      query: () => '/stations.json',
      providesTags: (result = [], error, arg) => [
        'Station',
        ...result.map(({ id }) => ({ type: 'Station', id })),
      ],
    }),
    getMeasurements: builder.query({
      query: () => '/measurement.json',
      providesTags: (result = [], error, arg)=>[
        'Measurement',
        ...result.map(({id})=>({type: 'Measurement',id})),
      ],
    }),
    getDailyTemperatures: builder.query({
      query: (reportDate) => 
        // let d1 = Math.round(new Date(reportTime).getTime()/1000)
        // new Date(1701248400 * 1000).toISOString()
        `/get?stations=34519,34524,34622,99023,34615,34712&codes=12101&hashes=795976906&notbefore=${reportDate}&notafter=${reportDate+24*60*60}`,
        providesTags: (result = [], error, arg) => [
          'Station',
          ...result.map(({ id }) => ({ type: 'Temperature', id })),
        ],
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
    })
  })
})

export const {
  useGetStationsQuery,
  useGetMeasurementsQuery,
  useGetDailyTemperaturesQuery,
  useGetSynopticObservationsQuery,
  useGetSynopticObservationQuery,
  useDeleteObservationMutation,
  useGetGustsWindQuery,
  useGetTemp8Query,
  useGetPrecipitationQuery,
  useDeleteWindMutation
} = apiSlice