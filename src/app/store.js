import { configureStore } from '@reduxjs/toolkit'
import stormsReducer from '../features/storms/stormsSlice'
import { apiSlice } from '../features/api/apiSlice'

export default configureStore({
  reducer: {
    storms: stormsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})