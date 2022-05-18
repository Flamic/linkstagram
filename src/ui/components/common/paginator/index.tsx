import cn from 'classnames'
import { useState } from 'react'

import Button from '../button'

import styles from './styles.module.scss'

interface Props {
  initialPage?: number
  onChange?(page: number): boolean
}

const Paginator: React.FC<Props> = ({ initialPage = 1, onChange }) => {
  const [page, setPage] = useState(initialPage)

  const changePage = (toPage: number) => {
    if (onChange) {
      const accepted = onChange(toPage)

      if (accepted) setPage(toPage)
    } else {
      setPage(toPage)
    }
  }

  return (
    <div className={styles.box}>
      {page > 1 && (
        <>
          <Button
            variant="secondary"
            hoverEffect={false}
            onClick={() => changePage(1)}
            className={styles.button}
          >
            <span className={styles.chevron}>&lt;&lt;</span>
            <span>First page</span>
          </Button>
          <Button
            variant="secondary"
            hoverEffect={false}
            onClick={() => changePage(page - 1)}
            className={styles.button}
          >
            <span className={styles.chevron}>&lt;</span>
            <span>Previous</span>
          </Button>
        </>
      )}
      <Button
        variant="secondary"
        hoverEffect={false}
        onClick={() => changePage(page + 1)}
        className={cn(styles.button, styles.rightButton)}
      >
        <span>Next</span>
        <span className={styles.chevron}>&gt;</span>
      </Button>
    </div>
  )
}

export default Paginator
