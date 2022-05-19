import cn from 'classnames'
import { useState } from 'react'
import Slider from 'react-slick'

import { ReactComponent as ImageIcon } from 'assets/images/image-icon.svg'
import { ReactComponent as Arrow } from 'assets/images/short-arrow-icon.svg'
import { Image } from 'core/types/image'

import styles from './styles.module.scss'

interface Props {
  className?: string
  images: Image[]
  keepAspectRatio?: boolean
}

interface ArrowProps {
  direction: 'right' | 'left'
  hide?: boolean
  onClick?(): void
}

const NextArrow: React.FC<ArrowProps> = ({ direction, hide, onClick }) =>
  hide ? null : (
    <button
      type="button"
      className={cn(styles.arrowButton, {
        [styles.left]: direction === 'left',
        [styles.right]: direction === 'right',
      })}
      onClick={onClick}
    >
      <Arrow className={styles.arrow} />
    </button>
  )

const ImageView: React.FC<Props> = ({ className, images, keepAspectRatio }) => {
  const [slideIndex, setSlideIndex] = useState(0)

  return (
    <div
      className={cn(
        styles.box,
        { [styles.keepAspectRatio]: keepAspectRatio },
        className,
      )}
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
            <img
              key={image.id}
              src={image.url}
              alt="Post"
              className={styles.img}
            />
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
