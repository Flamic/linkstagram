import cn from 'classnames'

import { ReactComponent as ErrorIcon } from 'assets/images/error-icon.svg'
import { ReactComponent as PassIcon } from 'assets/images/pass-icon.svg'

import styles from './styles.module.scss'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  showIndicator?: boolean
}

const TextInput: React.FC<Props> = ({
  className,
  id,
  type = 'text',
  label,
  error,
  showIndicator,
  ...props
}) => {
  return (
    <label htmlFor={id}>
      {label}
      <div className={styles.wrapper}>
        <input
          id={id}
          type={type}
          className={cn({ [styles.withIcon]: showIndicator }, className)}
          {...props}
        />
        {showIndicator &&
          (error ? (
            <ErrorIcon className={styles.errorIcon} />
          ) : (
            <PassIcon className={styles.passIcon} />
          ))}
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </label>
  )
}

export default TextInput
