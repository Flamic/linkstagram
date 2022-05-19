import React from 'react'
import { TailSpin } from 'react-loader-spinner'

import styles from './styles.module.scss'

interface Props {
  size?: number
}

const Loader: React.FC<Props> = ({ size }) => (
  <div className={styles.loader}>
    <TailSpin height={size ?? 40} width={size ?? 40} color="black" />
  </div>
)

export default Loader
