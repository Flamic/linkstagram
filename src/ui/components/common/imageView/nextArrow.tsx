import cn from 'classnames'

import { ReactComponent as Arrow } from 'assets/images/short-arrow-icon.svg'

import styles from './styles.module.scss'

interface Props {
  direction: 'right' | 'left'
  hide?: boolean
  onClick?(): void
}

const NextArrow: React.FC<Props> = ({ direction, hide, onClick }) =>
  hide ? null : (
    <button
      type="button"
      className={cn(styles.arrowButton, {
        [styles.left]: direction === 'left',
        [styles.right]: direction === 'right',
      })}
      onClick={(event) => {
        event.stopPropagation()
        event.preventDefault()
        onClick?.()
      }}
    >
      <Arrow className={styles.arrow} />
    </button>
  )

export default NextArrow
