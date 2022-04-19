import { configureStore } from '@reduxjs/toolkit'

import { rootReducer } from '../../core/store'

export const setupStore = () =>
  configureStore({
    reducer: rootReducer,
  })

export default setupStore
