import cn from 'classnames'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { ReactComponent as ImageIcon } from 'assets/images/image-icon.svg'
import { MAX_POST_IMAGES_COUNT } from 'core/constants/limits'
import { NewPost } from 'core/types/post'
import {
  convertObjectValues,
  emptyStringToNull,
} from 'core/utils/objectConverter'

import Button from '../common/button'
import ImageView from '../common/imageView'
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

  const getFiles = () => formik.getFieldProps('photos').value as File[]
  const filesPresent = () =>
    Boolean(formik.getFieldProps('photos').value?.length)

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
              {filesPresent() ? (
                <ImageView
                  images={getFiles().map((file, index) => ({
                    id: index,
                    url: URL.createObjectURL(file),
                  }))}
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
              onChange={(event) => {
                const fileList = event.currentTarget.files

                if (!fileList?.length) return

                if (fileList.length > MAX_POST_IMAGES_COUNT) {
                  toast.error(
                    `Exceeded image limit. Maximum count is ${MAX_POST_IMAGES_COUNT}`,
                  )

                  return
                }

                formik.setFieldValue('photos', Array.from(fileList))
              }}
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
          disabled={!filesPresent()}
        >
          Post
        </Button>
      </div>
    </form>
  )
}

export default PostForm
