import cn from 'classnames'
import { useState } from 'react'

import { ReactComponent as ImageIcon } from 'assets/images/image-icon.svg'
import { InteractiveImage } from 'core/types/image'

import styles from './styles.module.scss'

interface Props {
  images: InteractiveImage[]
}

interface ItemProps {
  image: InteractiveImage
}

const GridItem: React.FC<ItemProps> = ({ image }) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <button
      type="button"
      onClick={image.onClick}
      className={cn(styles.imgWrapper, {
        [styles.interactive]: image.onClick,
      })}
    >
      <img
        src={image.url}
        alt="User's post"
        draggable={false}
        className={cn(styles.img, { [styles.invisible]: !loaded })}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
      />
      {!loaded && <ImageIcon className={styles.imageIcon} />}
    </button>
  )
}

const ImagesGrid: React.FC<Props> = ({ images }) => {
  return (
    <section className={styles.grid}>
      {images.map((image) => (
        <GridItem key={image.id} image={image} />
      ))}
    </section>
  )
}

export default ImagesGrid
