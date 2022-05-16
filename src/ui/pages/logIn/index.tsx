import Header from 'ui/components/header'
import AuthView from 'ui/views/auth'

import styles from './styles.module.scss'

const LogInPage: React.FC = () => (
  <div className={styles.page}>
    <Header />
    <AuthView />
  </div>
)

export default LogInPage
