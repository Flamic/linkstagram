import cn from 'classnames'

import { ReactComponent as ErrorIcon } from 'assets/images/error-icon.svg'
import { ReactComponent as PassIcon } from 'assets/images/pass-icon.svg'

import styles from './styles.module.scss'

type TextInputElement = React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>

interface Props extends TextInputElement {
  error?: string
  inputClassName?: string
  label?: string
  multiline?: boolean
  showIndicator?: boolean
}

const TextInput: React.FC<Props> = ({
  className,
  inputClassName,
  id,
  type = 'text',
  label,
  error,
  multiline,
  showIndicator,
  value,
  ...props
}) => {
  const InputElement = multiline ? 'textarea' : 'input'

  return (
    <div className={className}>
      <label htmlFor={id} className={styles.label}>
        {label}
        <div className={styles.wrapper}>
          <InputElement
            id={id}
            type={type}
            className={cn(
              { [styles.withIcon]: showIndicator },
              styles.input,
              inputClassName,
            )}
            value={value || ''}
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
    </div>
  )
}

export default TextInput
