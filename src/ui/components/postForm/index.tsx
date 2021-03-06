import cn from 'classnames'
import { useFormik } from 'formik'
import { useMediaQuery } from 'react-responsive'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { ReactComponent as ImageIcon } from 'assets/images/image-icon.svg'
import { MAX_POST_IMAGES_COUNT } from 'core/constants/limits'
import { TABLET_MEDIA } from 'core/constants/media'
import { RawNewPost } from 'core/types/post'

import Button from '../common/button'
import ImageView from '../common/imageView'
import TextInput from '../common/textInput'

import styles from './styles.module.scss'

interface Props {
  onCancel?(): void
  onPost?(post: RawNewPost): void
}

const PostForm: React.FC<Props> = ({ onCancel, onPost }) => {
  const isTablet = useMediaQuery(TABLET_MEDIA)
  const formik = useFormik<RawNewPost>({
    initialValues: {
      description: '',
      photos: [],
    },
    validationSchema: Yup.object({
      description: Yup.string()
        .max(200, 'Must be 200 characters or less')
        .nullable(),
    }),
    onSubmit: (values) => {
      onPost?.({
        description: values.description || null,
        photos: values.photos,
      })
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
        <div className={styles.imageBoxWrapper}>
          <label htmlFor="selectImage">
            <div
              className={cn(styles.imageBox, styles.listElement, {
                [styles.invert]: isTablet,
              })}
            >
              {filesPresent() ? (
                <ImageView
                  images={getFiles().map((file, index) => ({
                    id: index,
                    url: URL.createObjectURL(file),
                  }))}
                  keepAspectRatio={isTablet}
                />
              ) : (
                <div className={cn(styles.defaultImage)}>
                  <ImageIcon className={styles.imageIcon} />
                  <div className={styles.defaultLabel}>
                    {isTablet
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
          isTablet ? styles.buttonColumn : styles.buttonRow,
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
