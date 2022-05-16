import Header from 'ui/components/header'
import AuthView from 'ui/views/auth'

import styles from './styles.module.scss'

const SignUpPage: React.FC = () => (
  <div className={styles.page}>
    <Header />
    <AuthView signUp />
  </div>
)

export default SignUpPage
