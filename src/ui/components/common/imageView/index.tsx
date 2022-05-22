import cn from 'classnames'
import { useState } from 'react'
import Slider from 'react-slick'

import { ReactComponent as ImageIcon } from 'assets/images/image-icon.svg'
import { ReactComponent as Arrow } from 'assets/images/short-arrow-icon.svg'
import { Image } from 'core/types/image'

import styles from './styles.module.scss'

interface Props {
  className?: string
  contain?: boolean
  images: Image[]
  keepAspectRatio?: boolean
  onClick?(): void
}

interface ArrowProps {
  direction: 'right' | 'left'
  hide?: boolean
  onClick?(): void
}

interface ImageItemProps {
  contain?: boolean
  src: string
}

const NextArrow: React.FC<ArrowProps> = ({ direction, hide, onClick }) =>
  hide ? null : (
    <button
      type="button"
      className={cn(styles.arrowButton, {
        [styles.left]: direction === 'left',
        [styles.right]: direction === 'right',
      })}
      onClick={(event) => {
        event.stopPropagation()
        onClick?.()
      }}
    >
      <Arrow className={styles.arrow} />
    </button>
  )

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
