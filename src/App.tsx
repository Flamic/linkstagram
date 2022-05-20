import Modal from 'react-modal'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import Router from './ui/boot/router'
import setupStore from './ui/boot/store'

Modal.setAppElement('#root')

const App: React.FC = () => {
  const store = setupStore()

  return (
    <Provider store={store}>
      <Router />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Provider>
  )
}

export default App
