import {
  createAction,
  createSlice,
  createEntityAdapter,
  createSelector,
  isAnyOf,
} from '@reduxjs/toolkit'

// import { forceGenerateNotifications } from '../../api/server'
import { apiSlice } from '../api/apiSlice'

const stormsReceived = createAction(
  'storms/stormsReceived'
)

export const extendedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStorms: builder.query({
      query: () => '/storm_observations/n_last_storms.json',
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        // create a websocket connection when the cache subscription starts
        const ws = new WebSocket('ws://localhost')
        try {
          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded

          // when data is received from the socket connection to the server,
          // update our query result with the received message
          const listener = (event) => {
            const message = JSON.parse(event.data)
            switch (message.type) {
              case 'storms': {
                updateCachedData((draft) => {
                  // Insert all received notifications from the websocket
                  // into the existing RTKQ cache array
                  draft.push(...message.payload)
                  draft.sort((a, b) => b.date.localeCompare(a.date))
                })
                // Dispatch an additional action so we can track "read" state
                dispatch(stormsReceived(message.payload))
                break
              }
              default:
                break
            }
          }

          ws.addEventListener('message', listener)
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        ws.close()
      },
    }),
  }),
})

export const { useGetStormsQuery } = extendedApi

const emptyStorms = []

export const selectStormsResult = extendedApi.endpoints.getStorms.select()

const selectStormsData = createSelector(
  selectStormsResult,
  (stormsResult) => stormsResult.data ?? emptyStorms
)
/*
export const fetchNotificationsWebsocket = () => (dispatch, getState) => {
  const allNotifications = selectNotificationsData(getState())
  const [latestNotification] = allNotifications
  const latestTimestamp = latestNotification?.date ?? ''
  // Hardcode a call to the mock server to simulate a server push scenario over websockets
  forceGenerateNotifications(latestTimestamp)
}
*/
const stormsAdapter = createEntityAdapter()

const matchStormsReceived = isAnyOf(
  stormsReceived,
  extendedApi.endpoints.getStorms.matchFulfilled
)

const stormsSlice = createSlice({
  name: 'storms',
  initialState: stormsAdapter.getInitialState(),
  reducers: {
    allStormsRead(state, action) {
      Object.values(state.entities).forEach((notification) => {
        notification.read = true
      })
    },
  },
  extraReducers(builder) {
    builder.addMatcher(matchStormsReceived, (state, action) => {
      // Add client-side metadata for tracking new notifications
      const stormsMetadata = action.payload.map((notification) => ({
        id: notification.id,
        read: false,
        isNew: true,
      }))

      Object.values(state.entities).forEach((notification) => {
        // Any notifications we've read are no longer new
        notification.isNew = !notification.read
      })

      stormsAdapter.upsertMany(state, stormsMetadata)
    })
  },
})

export const { allStormsRead } = stormsSlice.actions

export default stormsSlice.reducer

export const {
  selectAll: selectStormsMetadata,
  selectEntities: selectMetadataEntities,
} = stormsAdapter.getSelectors((state) => state.storms)
