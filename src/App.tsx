import { Provider } from 'react-redux'

import { setStore } from './core/services/store'
import Router from './ui/boot/router'
import setupStore from './ui/boot/store'

const App: React.FC = () => {
  const store = setupStore()

  setStore(store)

  return (
    <Provider store={store}>
      <Router />
    </Provider>
  )
}

export default App
