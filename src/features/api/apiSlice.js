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
      query: (currentPage) => '/synoptic_observations.json?page='+currentPage,
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
    })
  })
})

export const {
  useGetStationsQuery,
  useGetSynopticObservationsQuery,
  useGetSynopticObservationQuery,
  useDeleteObservationMutation
} = apiSlice