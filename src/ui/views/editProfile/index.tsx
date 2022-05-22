import { useEffect } from 'react'
import ReactModal from 'react-modal'
import { useMediaQuery } from 'react-responsive'

import { TABLET_MEDIA } from 'core/constants/media'
import { getUsername, removeAuthData, updateUsername } from 'core/services/auth'
import { uploadFiles } from 'core/services/uppy'
import api from 'core/store'
import { PhotoAttribute } from 'core/types/image'
import { RawEditAccount } from 'core/types/user'
import { tryCatchRequest } from 'core/utils/error'
import { omitPropery } from 'core/utils/objectConverter'
import Button from 'ui/components/common/button'
import Loader from 'ui/components/common/loader'
import EditProfileForm from 'ui/components/editProfileForm'
import Header from 'ui/components/header'

import styles from './styles.module.scss'

interface Props {
  show?: boolean
  onClose?(): void
}

const EditProfileView: React.FC<Props> = ({ show, onClose }) => {
  const isTablet = useMediaQuery(TABLET_MEDIA)
  const { data: account, isError: isAccountError } = api.useGetAccountQuery()
  const [saveProfile, { isLoading }] = api.useUpdateAccountMutation()

  const save = async (profile: RawEditAccount) => {
    if (isLoading) return

    let uploadedPhoto: PhotoAttribute | undefined

    const ok = await tryCatchRequest({
      request: async () => {
        if (profile.photo) [uploadedPhoto] = await uploadFiles([profile.photo])
      },
      errorMessage: 'Cannot upload new avatar',
    })

    if (!ok) return

    await tryCatchRequest({
      request: async () => {
        await saveProfile({
          ...omitPropery(profile, 'photo'),
          profilePhoto: uploadedPhoto,
        }).unwrap()

        if (profile.username && getUsername() !== profile.username)
          updateUsername(profile.username)
      },
      errorMessage: 'Cannot change profile data',
      successMessage: 'Profile successfully updated',
      onSuccess: onClose,
    })
  }

  useEffect(() => {
    if (isAccountError) onClose?.()
  }, [isAccountError, onClose])

  return (
    <ReactModal
      isOpen={Boolean(show)}
      closeTimeoutMS={300}
      shouldCloseOnOverlayClick
      onRequestClose={onClose}
      className={styles.modal}
    >
      {isTablet && <Header mode="logOut" />}
      <div className={styles.box}>
        {isTablet || (
          <div className={styles.upperBox}>
            <h1>Profile information</h1>
            <Button
              variant="alert"
              hoverEffect={false}
              onClick={() => {
                removeAuthData()
                onClose?.()
              }}
            >
              Log out
            </Button>
          </div>
        )}
        {!account ? (
          <Loader />
        ) : (
          <EditProfileForm
            phone={isTablet}
            profile={account}
            onCancel={onClose}
            onSave={save}
          />
        )}
      </div>
    </ReactModal>
  )
}

export default EditProfileView
