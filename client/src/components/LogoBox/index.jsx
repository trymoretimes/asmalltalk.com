import React from 'react'

import styles from './styles'

const LogoBox = ({title, subTitle}) => (
  <div className={styles.LogoBox}>
    <div className={styles.LogoBoxTitle}>
      <a href='#'>{title}</a>
    </div>
    <div className={styles.LogoBoxSubTitle}>
      <p> - {subTitle} </p>
    </div>
  </div>
)

export default LogoBox
