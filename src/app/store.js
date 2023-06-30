import { configureStore } from '@reduxjs/toolkit'
import stormsReducer from '../features/storms/stormsSlice'
import { apiSlice } from '../features/api/apiSlice'
import { authReducer } from '../features/auth/authSlice'

export const store = configureStore({
  reducer: {
    storms: stormsReducer,
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})