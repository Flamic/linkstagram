import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LogInPage from 'ui/pages/logIn'
import SignUpPage from 'ui/pages/signUp'

import HomePage from '../../pages/home'
import ProfilePage from '../../pages/profile'

const Router: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/logIn" element={<LogInPage />} />
      <Route path="/signUp" element={<SignUpPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  </BrowserRouter>
)

export default Router
