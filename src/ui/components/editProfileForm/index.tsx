import cn from 'classnames'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { Profile } from 'core/types/user'

import Avatar from '../common/avatar'
import Button from '../common/button'
import TextInput from '../common/textInput'

import styles from './styles.module.scss'

type EditProfile = Pick<
  Profile,
  'username' | 'firstName' | 'lastName' | 'jobTitle' | 'description'
> & { photo: File | null }

interface Props {
  phone?: boolean
  profile: Profile
  onCancel?(): void
  onSave?(profile: EditProfile): void
}

const EditProfileForm: React.FC<Props> = ({
  phone,
  profile,
  onCancel,
  onSave,
}) => {
  const formik = useFormik<EditProfile>({
    initialValues: {
      ...profile,
      photo: null,
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(2, 'Must be 2 characters or more')
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
      firstName: Yup.string()
        .max(30, 'Must be 30 characters or less')
        .nullable(),
      lastName: Yup.string()
        .max(30, 'Must be 30 characters or less')
        .nullable(),
      jobTitle: Yup.string()
        .max(30, 'Must be 30 characters or less')
        .nullable(),
      description: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .nullable(),
    }),
    onSubmit: (values) => {
      onSave?.({
        ...values,
        firstName: values.firstName || null,
        lastName: values.lastName || null,
        jobTitle: values.jobTitle || null,
        description: values.description || null,
      })
    },
  })

  const getError = (key: keyof typeof formik.values) =>
    formik.touched[key] && formik.errors[key] ? formik.errors[key] : undefined

  const avatar = (
    <Avatar
      onChoose={(file) => formik.setFieldValue('photo', file)}
      src={profile.profilePhotoUrl}
    />
  )
  const username = (
    <TextInput
      className={styles.listElement}
      type="text"
      id="username"
      label="Nickname"
      placeholder="alexexample..."
      error={getError('username')}
      showIndicator={formik.touched.username}
      {...formik.getFieldProps('username')}
    />
  )
  const firstName = (
    <TextInput
      className={styles.listElement}
      inputClassName={phone ? undefined : styles.input}
      type="text"
      id="firstName"
      label="First Name"
      placeholder="First name"
      error={getError('firstName')}
      showIndicator={formik.touched.firstName}
      {...formik.getFieldProps('firstName')}
    />
  )
  const lastName = (
    <TextInput
      className={styles.listElement}
      inputClassName={phone ? undefined : styles.input}
      type="text"
      id="lastName"
      label="Second Name"
      placeholder="Last name"
      error={getError('lastName')}
      showIndicator={formik.touched.lastName}
      {...formik.getFieldProps('lastName')}
    />
  )
  const jobTitle = (
    <TextInput
      className={styles.listElement}
      type="text"
      id="jobTitle"
      label="Job Title"
      placeholder="Enter your job"
      error={getError('jobTitle')}
      showIndicator={formik.touched.jobTitle}
      {...formik.getFieldProps('jobTitle')}
    />
  )
  const description = (
    <TextInput
      className={styles.listElement}
      type="text"
      multiline
      id="description"
      label="Description"
      placeholder="Describe yourself"
      error={getError('description')}
      showIndicator={formik.touched.description}
      {...formik.getFieldProps('description')}
    />
  )

  return (
    <form className={styles.form} onSubmit={formik.handleSubmit}>
      {phone ? (
        <div className={styles.upperBox}>
          {avatar}
          {username}
          {firstName}
          {lastName}
        </div>
      ) : (
        <div className={styles.avatarRow}>
          <div className={styles.avatar}>{avatar}</div>
          <div className={styles.nameInputColumn}>
            {firstName}
            {lastName}
          </div>
        </div>
      )}
      {username}
      {jobTitle}
      {description}

      <div
        className={cn(
          phone ? styles.buttonColumn : styles.buttonRow,
          styles.listElement,
        )}
      >
        <Button
          variant="secondary"
          border="border"
          onClick={onCancel}
          size="big"
          className={styles.button}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          size="big"
          className={styles.button}
        >
          Save
        </Button>
      </div>
    </form>
  )
}

export default EditProfileForm
