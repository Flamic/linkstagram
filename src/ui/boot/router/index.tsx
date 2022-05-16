import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { useAuth } from 'core/services/auth'
import HomePage from 'ui/pages/home'
import LogInPage from 'ui/pages/logIn'
import ProfilePage from 'ui/pages/profile'
import SignUpPage from 'ui/pages/signUp'

const Router: React.FC = () => {
  const token = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <HomePage /> : <LogInPage />} />
        <Route path="/logIn" element={token ? <HomePage /> : <LogInPage />} />
        <Route path="/signUp" element={token ? <HomePage /> : <SignUpPage />} />
        <Route
          path="/profile"
          element={token ? <ProfilePage /> : <LogInPage />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
