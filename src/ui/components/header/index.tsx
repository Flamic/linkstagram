import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { removeAuthData, useAuth } from 'core/services/auth'
import api from 'core/store'
import useOutsideClick from 'ui/hooks/useOutsideClick'

import Avatar from '../common/avatar'
import Button from '../common/button'
import DropdownList, { toDropdownOptions } from '../common/dropdownList'

import styles from './styles.module.scss'

const languages = ['EN', 'UA', 'PL', 'RU']

interface Props {
  mode?: 'home' | 'logOut'
  onBack?(): void
}

const Header: React.FC<Props> = ({ onBack, mode }) => {
  const navigate = useNavigate()
  const [showLangList, setShowLangList] = useState(false)
  const [selectedLang, setSelectedLang] = useState(languages[0])
  const dropdownListRef = useRef(null)

  const auth = useAuth()
  const [getAccount, { data: account }] = api.useLazyGetAccountQuery()

  useOutsideClick(dropdownListRef, () => setShowLangList(false))

  useEffect(() => {
    if (auth) getAccount()
  }, [auth, getAccount])

  return (
    <header className={styles.header}>
      {onBack ? (
        <button type="button" onClick={onBack} className={styles.arrowButton}>
          <i className={cn('icon-arrow', styles.iconArrow)} />
        </button>
      ) : (
        <Link to="/" className={styles.logo}>
          Linkstagram
        </Link>
      )}

      <div className={styles.dropdownWrapper}>
        <Button
          variant="secondary"
          border="border"
          className={styles.langButton}
          onClick={(event) => {
            setShowLangList(!showLangList)
            event.stopPropagation()
          }}
        >
          {selectedLang}
        </Button>
        <DropdownList
          options={toDropdownOptions(
            languages.filter((lang) => lang !== selectedLang),
          )}
          visible={showLangList}
          onChange={(lang) => setSelectedLang(lang)}
          dropdownRef={dropdownListRef}
          className={styles.dropdownList}
        />
      </div>

      {!mode && account && (
        <Link to={`/profile/${account.username}`}>
          <Avatar src={account.profilePhotoUrl} size="medium" />
        </Link>
      )}

      {mode === 'home' && (
        <Button
          variant="ghost"
          border="border"
          size="small"
          className={styles.button}
          onClick={() => navigate('/')}
        >
          Home
        </Button>
      )}

      {mode === 'logOut' && (
        <Button
          variant="alert"
          border="border"
          size="small"
          className={styles.button}
          onClick={() => removeAuthData()}
        >
          Log out
        </Button>
      )}
    </header>
  )
}

export default Header
