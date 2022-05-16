import { useFormik } from 'formik'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'

import Button from '../common/button'
import TextInput from '../common/textInput'

import styles from './styles.module.scss'

interface Props {
  signUp?: boolean
}

const AuthForm: React.FC<Props> = ({ signUp }) => {
  const formik = useFormik({
    initialValues: {
      email: '',
      ...(signUp && { username: '' }),
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      ...(signUp && {
        username: Yup.string()
          .min(2, 'Must be 2 characters or more')
          .max(20, 'Must be 20 characters or less')
          .required('Required'),
      }),
      password: Yup.string()
        .min(8, 'Must be 8 characters at least')
        .max(30, 'Must be 30 characters or less')
        .required('Required'),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2))
    },
  })

  const getError = (key: keyof typeof formik.values) =>
    formik.touched[key] && formik.errors[key] ? formik.errors[key] : undefined

  return (
    <form className={styles.form} onSubmit={formik.handleSubmit}>
      <div className={styles.upperBox}>
        <h1>{signUp ? 'Sign Up' : 'Log In'}</h1>
        <TextInput
          className={styles.input}
          type="email"
          id="email"
          label="Email"
          placeholder="example@mail.com"
          error={getError('email')}
          showIndicator={formik.touched.email}
          {...formik.getFieldProps('email')}
        />
        {signUp && (
          <TextInput
            className={styles.input}
            type="text"
            id="username"
            label="User Name"
            placeholder="alexexample..."
            error={getError('username')}
            showIndicator={formik.touched.username}
            {...formik.getFieldProps('username')}
          />
        )}
        <TextInput
          className={styles.input}
          type="password"
          id="password"
          label="Password"
          placeholder="Type in..."
          error={getError('password')}
          showIndicator={formik.touched.password}
          {...formik.getFieldProps('password')}
        />
      </div>
      <div className={styles.lowerBox}>
        <Button
          type="submit"
          variant="primary"
          size="big"
          className={styles.submitButton}
        >
          Sign Up
        </Button>
        <div className={styles.subLine}>
          {signUp ? (
            <>
              <span>Have an account?</span>
              <Link to="/logIn" className={styles.link}>
                Log In
              </Link>
            </>
          ) : (
            <>
              <span>Don&apos;t have an account?</span>
              <Link to="/signUp" className={styles.link}>
                {signUp ? 'Sign up' : 'Log in'}
              </Link>
            </>
          )}
        </div>
      </div>
    </form>
  )
}

export default AuthForm
