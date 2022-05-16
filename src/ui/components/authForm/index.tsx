import { useFormik } from 'formik'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import api from 'core/store'
import { SignUpUser } from 'core/types/user'

import Button from '../common/button'
import TextInput from '../common/textInput'

import styles from './styles.module.scss'

interface Props {
  signUp?: boolean
}

const AuthForm: React.FC<Props> = ({ signUp }) => {
  const [login, { isLoading: isLoginLoading }] = api.useLoginMutation()
  const [createAccount, { isLoading: isSignUpLoading }] =
    api.useCreateAccountMutation()

  const formik = useFormik({
    initialValues: {
      login: '',
      ...(signUp && { username: '' }),
      password: '',
    },
    validationSchema: Yup.object({
      login: Yup.string().email('Invalid email address').required('Required'),
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
      const request = signUp
        ? createAccount(values as SignUpUser)
        : login(values)

      request.unwrap().catch((error: { data: unknown }) => {
        console.error(error)

        if (
          error.data &&
          typeof error.data === 'object' &&
          'field-error' in error.data
        ) {
          const errorFields = (error.data as { 'field-error': Array<string> })[
            'field-error'
          ]

          const errorMessage = errorFields && errorFields[1]

          toast.error(
            errorMessage
              ? errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1)
              : 'Cannot create account',
          )
        }
      })
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
          error={getError('login')}
          showIndicator={formik.touched.login}
          {...formik.getFieldProps('login')}
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
          disabled={signUp ? isSignUpLoading : isLoginLoading}
        >
          {signUp ? 'Sign up' : 'Log in'}
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
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </form>
  )
}

export default AuthForm
