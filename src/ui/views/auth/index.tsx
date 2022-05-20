import LogInBackground from 'assets/images/log-in-bg.png'
import SignUpBackground from 'assets/images/sign-up-bg.png'
import AuthForm from 'ui/components/authForm'

import styles from './styles.module.scss'

interface Props {
  signUp?: boolean
}

const AuthView: React.FC<Props> = ({ signUp }) => {
  return (
    <main className={styles.view}>
      {signUp ? (
        <img src={SignUpBackground} alt="Sign up background" />
      ) : (
        <img src={LogInBackground} alt="Log in background" />
      )}
      <AuthForm signUp={signUp} />
    </main>
  )
}

export default AuthView
