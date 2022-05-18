import cn from 'classnames'
import { useRef, useState } from 'react'

import useOutsideClick from 'ui/hooks/useOutsideClick'

import styles from './styles.module.scss'

interface Props {
  className?: string
  items: string[]
  onSelect?(selected: string): void
}

const MenuButton: React.FC<Props> = ({ className, items, onSelect }) => {
  const [showList, setShowList] = useState(false)
  const listRef = useRef(null)

  useOutsideClick(listRef, () => setShowList(false))

  return (
    <div className={cn(styles.box, className)}>
      <button
        type="button"
        onClick={(event) => {
          setShowList(true)
          event.stopPropagation()
        }}
        className={styles.button}
      >
        <i className="icon-more" />
      </button>
      {showList && (
        <div className={styles.itemBox} ref={listRef}>
          {items.map((item) => (
            <button
              type="button"
              onClick={() => {
                onSelect?.(item)
                setShowList(false)
              }}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default MenuButton
