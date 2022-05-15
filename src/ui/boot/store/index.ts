import { configureStore } from '@reduxjs/toolkit'

import api from 'core/store'

export const setupStore = () =>
  configureStore({
    reducer: { [api.reducerPath]: api.reducer },
  })

export default setupStore
