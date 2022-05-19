import cn from 'classnames'
import { useState } from 'react'

import Button from '../button'

import styles from './styles.module.scss'

interface Props {
  hideNext?: boolean
  page: number
  onChange?(page: number): void
}

const Paginator: React.FC<Props> = ({ hideNext, page, onChange }) => {
  return (
    <div className={styles.box}>
      {page > 1 && (
        <>
          <Button
            variant="secondary"
            hoverEffect={false}
            onClick={() => onChange?.(1)}
            className={styles.button}
          >
            <span className={styles.chevron}>&lt;&lt;</span>
            <span>First page</span>
          </Button>
          <Button
            variant="secondary"
            hoverEffect={false}
            onClick={() => onChange?.(page - 1)}
            className={styles.button}
          >
            <span className={styles.chevron}>&lt;</span>
            <span>Previous</span>
          </Button>
        </>
      )}
      {!hideNext && (
        <Button
          variant="secondary"
          hoverEffect={false}
          onClick={() => onChange?.(page + 1)}
          className={cn(styles.button, styles.rightButton)}
        >
          <span>Next</span>
          <span className={styles.chevron}>&gt;</span>
        </Button>
      )}
    </div>
  )
}

export default Paginator
