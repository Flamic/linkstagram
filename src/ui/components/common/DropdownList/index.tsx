import styles from './styles.module.scss'

interface DropdownOption {
  caption: string
  id: string
}

interface Props {
  onChange: (arg: string) => void
  options: DropdownOption[]
  visible?: boolean
}

const DropdownList: React.FC<Props> = ({ onChange, options, visible }) => {
  return visible ? (
    <div className={styles.box}>
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
