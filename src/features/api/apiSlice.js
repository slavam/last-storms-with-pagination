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
        ...result.map(({ id }) => ({ type: 'Station', id })),
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
  useGetSynopticObservationsQuery,
  useGetSynopticObservationQuery,
  useDeleteObservationMutation,
  useGetGustsWindQuery,
  useGetTemp8Query,
  useDeleteWindMutation
} = apiSlice