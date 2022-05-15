import cn from 'classnames'
import { RefObject } from 'react'

import styles from './styles.module.scss'

interface DropdownOption {
  caption: string
  id: string
}

interface Props {
  className?: string
  dropdownRef?: RefObject<HTMLDivElement>
  onChange: (arg: string) => void
  options: DropdownOption[]
  visible?: boolean
}

export const toDropdownOptions = (options: string[]) =>
  options.map((option) => ({
    caption: option,
    id: option,
  }))

const DropdownList: React.FC<Props> = ({
  className,
  dropdownRef,
  onChange,
  options,
  visible,
}) => {
  return visible ? (
    <div className={cn(styles.box, className)} ref={dropdownRef}>
      {options.map((option) => (
        <button
          key={option.id}
          className={styles.option}
          onClick={() => onChange(option.id)}
          type="button"
        >
          {option.caption}
        </button>
      ))}
    </div>
  ) : null
}

export default DropdownList
