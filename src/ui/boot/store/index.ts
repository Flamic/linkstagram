import { configureStore } from '@reduxjs/toolkit'

import api from 'core/store'

export const setupStore = () =>
  configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  })

export default setupStore
