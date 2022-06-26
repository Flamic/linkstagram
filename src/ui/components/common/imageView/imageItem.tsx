import cn from 'classnames'
import { useState } from 'react'

import { ReactComponent as ImageIcon } from 'assets/images/image-icon.svg'

import styles from './styles.module.scss'

interface ImageItemProps {
  contain?: boolean
  src: string
}

const ImageItem: React.FC<ImageItemProps> = ({ contain, src }) => {
  const [loaded, setLoaded] = useState(true)

  return (
    <>
      <img
        src={src}
        alt="Post"
        className={cn(styles.img, {
          [styles.contain]: contain,
          [styles.invisible]: !loaded,
        })}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
      />
      {!loaded && (
        <div className={styles.defaultImg}>
          <ImageIcon />
        </div>
      )}
    </>
  )
}

export default ImageItem
