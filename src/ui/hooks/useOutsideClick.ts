import { RefObject, useEffect } from 'react'

const useOutsideClick = (ref: RefObject<Element>, onClick: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) =>
      ref.current &&
      event.target &&
      !ref.current.contains(event.target as Element) &&
      onClick()

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [ref, onClick])
}

export default useOutsideClick
