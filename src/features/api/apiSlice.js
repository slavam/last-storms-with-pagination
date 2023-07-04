import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000', mode: "cors" }),
  tagTypes: ['Station','Synoptic'],
  endpoints: (builder) => ({
    getStations: builder.query({
      query: () => '/stations.json',
      providesTags: (result = [], error, arg) => [
        'Station',
        ...result.map(({ id, name }) => ({ type: 'Station', id, name })),
      ],
    }),
    getSynopticObservations: builder.query({
      query: (currentPage) => '/synoptic_observations.json?page=1', //+currentPage,
      providesTags: ['Synoptic'],
    })
  })
})

export const {
  useGetStationsQuery,
  useGetSynopticObservationsQuery
} = apiSlice