import { AppStore } from '../store'

let store: AppStore

export const getStore = () => store
export const setStore = (data: AppStore) => {
  store = data
}
