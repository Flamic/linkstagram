import cn from 'classnames'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useOutsideClick from 'ui/hooks/useOutsideClick'

import Avatar from '../common/Avatar'
import Button from '../common/Button'
import DropdownList, { toDropdownOptions } from '../common/DropdownList'

import styles from './styles.module.scss'

const languages = ['EN', 'UA', 'PL', 'RU']

interface Props {
  backArrow?: boolean
  mode?: 'avatar' | 'home' | 'logOut'
}

const Header: React.FC<Props> = ({ backArrow, mode }) => {
  const navigate = useNavigate()
  const [showLangList, setShowLangList] = useState(false)
  const [selectedLang, setSelectedLang] = useState(languages[0])
  const dropdownListRef = useRef(null)

  useOutsideClick(dropdownListRef, () => setShowLangList(false))

  return (
    <header className={styles.header}>
      {backArrow ? (
        <i className={cn('icon-arrow', styles.iconArrow)} />
      ) : (
        <div className={styles.logo}>Linkstagram</div>
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

      {mode === 'avatar' && (
        <Avatar
          src="https://upload.wikimedia.org/wikipedia/commons/f/fb/Anthro_vixen_colored.jpg"
          size="medium"
        />
      )}

      {mode === 'home' && (
        <Button
          variant="ghost"
          border="border"
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
          className={styles.button}
          onClick={() => undefined} // TODO: Log Out
        >
          Log out
        </Button>
      )}
    </header>
  )
}

export default Header
