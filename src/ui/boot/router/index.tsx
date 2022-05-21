import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { useAuth } from 'core/services/auth'
import HomePage from 'ui/pages/home'
import LogInPage from 'ui/pages/logIn'
import ProfilePage from 'ui/pages/profile'
import SignUpPage from 'ui/pages/signUp'

const Router: React.FC = () => {
  const auth = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={auth ? <HomePage /> : <Navigate to="/logIn" />}
        />
        <Route
          path="/logIn"
          element={auth ? <Navigate to="/" /> : <LogInPage />}
        />
        <Route
          path="/signUp"
          element={auth ? <Navigate to="/" /> : <SignUpPage />}
        />
        <Route
          path="/profile/:username"
          element={auth ? <ProfilePage /> : <Navigate to="/logIn" />}
        />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
