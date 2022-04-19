import { combineReducers } from '@reduxjs/toolkit'

import setupStore from '../../ui/boot/store'

export const rootReducer = combineReducers({})

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
