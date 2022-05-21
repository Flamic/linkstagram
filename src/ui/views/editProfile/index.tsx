import { useEffect } from 'react'
import ReactModal from 'react-modal'
import { useMediaQuery } from 'react-responsive'
import { toast } from 'react-toastify'

import { TABLET_MEDIA } from 'core/constants/media'
import { getUsername, removeAuthData, updateUsername } from 'core/services/auth'
import { uploadFiles } from 'core/services/uppy'
import api from 'core/store'
import { EditAccount } from 'core/types/user'
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
  const isPhone = useMediaQuery(TABLET_MEDIA)
  const { data: account, isError: isAccountError } = api.useGetAccountQuery()
  const [saveProfile] = api.useUpdateAccountMutation()

  const handleSaveProfile = (request: ReturnType<typeof saveProfile>) => {
    request
      .unwrap()
      .then((data) => {
        toast.success('Profile successfully updated')

        if (getUsername() !== data.username) updateUsername(data.username)
      })
      .catch((error) => {
        console.error(error)
        toast.error('Cannot change profile data')
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
      {isPhone && <Header mode="logOut" />}
      <div className={styles.box}>
        {isPhone || (
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
            phone={isPhone}
            profile={account}
            onCancel={onClose}
            onSave={(profile) => {
              if (profile.photo) {
                uploadFiles([profile.photo])
                  .then((photos) =>
                    handleSaveProfile(
                      saveProfile({
                        account: {
                          ...profile,
                          photo: undefined,
                          profilePhoto: photos[0].image,
                        },
                      } as EditAccount),
                    ),
                  )
                  .catch((error) => {
                    console.error(error)
                    toast.error('Cannot upload new avatar to the storage')
                  })
              } else {
                handleSaveProfile(
                  saveProfile({
                    account: {
                      ...profile,
                      photo: undefined,
                    },
                  } as EditAccount),
                )
              }
            }}
          />
        )}
      </div>
    </ReactModal>
  )
}

export default EditProfileView
