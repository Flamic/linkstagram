import cn from 'classnames'
import { useState } from 'react'
import Slider from 'react-slick'

import { ReactComponent as ImageIcon } from 'assets/images/image-icon.svg'
import { Image } from 'core/types/image'

import ImageItem from './imageItem'
import NextArrow from './nextArrow'
import styles from './styles.module.scss'

interface Props {
  className?: string
  contain?: boolean
  images: Image[]
  keepAspectRatio?: boolean
  onClick?(): void
}

const ImageView: React.FC<Props> = ({
  className,
  contain,
  images,
  keepAspectRatio,
  onClick,
}) => {
  const [slideIndex, setSlideIndex] = useState(0)

  return (
    <div
      className={cn(
        styles.box,
        {
          [styles.keepAspectRatio]: keepAspectRatio,
          [styles.interactive]: onClick,
        },
        className,
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-hidden="true"
    >
      <Slider
        centerPadding="24px"
        slidesToShow={1}
        slidesToScroll={1}
        swipeToSlide
        infinite={false}
        nextArrow={
          <NextArrow
            direction="right"
            hide={slideIndex === images.length - 1}
          />
        }
        prevArrow={<NextArrow direction="left" hide={slideIndex === 0} />}
        className={styles.slider}
        dots
        beforeChange={(_, next) => setSlideIndex(next)}
      >
        {images.length ? (
          images.map((image) => (
            <ImageItem key={image.id} src={image.url} contain={contain} />
          ))
        ) : (
          <div className={styles.defaultImg}>
            <ImageIcon />
          </div>
        )}
      </Slider>
    </div>
  )
}

export default ImageView
