import cn from 'classnames'
import { ReactNode } from 'react'

import styles from './styles.module.scss'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  border?: 'border' | 'shadow'
  children: ReactNode
  hoverEffect?: boolean
  size?: 'big' | 'medium' | 'small'
  variant: 'primary' | 'secondary' | 'ghost' | 'alert' | 'dark'
}

const Button: React.FC<Props> = ({
  border,
  className,
  children,
  hoverEffect = true,
  type = 'button',
  size = 'medium',
  variant = 'primary',
  ...props
}) => {
  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={cn(
        styles.button,
        styles[variant],
        size && styles[size],
        border && styles[border],
        { [styles.hover]: hoverEffect },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
