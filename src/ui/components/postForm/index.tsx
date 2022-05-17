import cn from 'classnames'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { ReactComponent as ImageIcon } from 'assets/images/image-icon.svg'
import { NewPost } from 'core/types/post'
import {
  convertObjectValues,
  emptyStringToNull,
} from 'core/utils/objectConverter'

import Button from '../common/button'
import TextInput from '../common/textInput'

import styles from './styles.module.scss'

type EditNewPost = Omit<NewPost, 'photosAttributes'> & { photos: File[] }

interface Props {
  phone?: boolean
  onCancel?(): void
  onPost?(post: EditNewPost): void
}

const PostForm: React.FC<Props> = ({ phone, onCancel, onPost }) => {
  const formik = useFormik<EditNewPost>({
    initialValues: {
      description: '',
      photos: [],
    },
    validationSchema: Yup.object({
      description: Yup.string().max(100, 'Must be 100 characters or less'),
    }),
    onSubmit: (values) => {
      onPost?.(convertObjectValues(values, emptyStringToNull) as EditNewPost)
    },
  })

  const getError = (key: keyof typeof formik.values) =>
    formik.touched[key] && formik.errors[key] ? formik.errors[key] : undefined

  const getFirstFile = () => formik.getFieldProps('photos').value?.[0]

  return (
    <form className={styles.form} onSubmit={formik.handleSubmit}>
      <div className={styles.upperBox}>
        <div>
          <label htmlFor="selectImage">
            <div
              className={cn(styles.imageBox, styles.listElement, {
                [styles.invert]: phone,
              })}
            >
              {getFirstFile() ? (
                <img
                  src={URL.createObjectURL(getFirstFile())}
                  alt="Post"
                  draggable={false}
                  className={cn(styles.img)}
                />
              ) : (
                <div className={cn(styles.defaultImage)}>
                  <ImageIcon className={styles.imageIcon} />
                  <div className={styles.defaultLabel}>
                    {phone
                      ? 'Tap here to choose any photo from your library'
                      : 'Choose any photo from your library'}
                  </div>
                </div>
              )}
            </div>
            <input
              type="file"
              id="selectImage"
              accept="image/png, image/jpeg"
              style={{ display: 'none' }}
              multiple
              onChange={(event) =>
                event.currentTarget.files?.[0] &&
                formik.setFieldValue('photos', event.currentTarget.files)
              }
            />
          </label>
        </div>

        <TextInput
          className={styles.listElement}
          type="text"
          multiline
          id="description"
          label="Description"
          placeholder="Description..."
          error={getError('description') as string | undefined}
          showIndicator={formik.touched.description}
          {...formik.getFieldProps('description')}
        />
      </div>

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
          disabled={!getFirstFile()}
        >
          Post
        </Button>
      </div>
    </form>
  )
}

export default PostForm
