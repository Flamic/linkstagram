import { useFormik } from 'formik'
import * as Yup from 'yup'

import Button from '../common/button'
import TextInput from '../common/textInput'

import styles from './styles.module.scss'

const SignUpForm: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      username: Yup.string()
        .min(2, 'Must be 2 characters or more')
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
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
      <h1>Sign Up</h1>
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
      <Button type="submit" variant="primary" className={styles.submitButton}>
        Sign Up
      </Button>
    </form>
  )
}

export default SignUpForm
