import React from 'react'

import styles from './styles'

const LogoBox = ({subTitle}) => (
  <div className={styles.LogoBox}>
    <div className={styles.LogoBoxTitle}>
      <a href='#'>小对话</a>
    </div>
    <div className={styles.LogoBoxSubTitle}>
      <p> - {subTitle} </p>
    </div>
  </div>
)

export default LogoBox
