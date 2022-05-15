import { Provider } from 'react-redux'

import Router from './ui/boot/router'
import setupStore from './ui/boot/store'

const App: React.FC = () => {
  const store = setupStore()

  return (
    <Provider store={store}>
      <Router />
    </Provider>
  )
}

export default App
