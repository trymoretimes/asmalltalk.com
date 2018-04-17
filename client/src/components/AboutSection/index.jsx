import React from 'react'

import styles from '../../styles.css'
import screenshot from './screenshot.png'
import TitleBox from '../TitleBox'

const AboutSection = () => (
  <div className={styles.IntroContainer}>
    <TitleBox title='什么是小对话' />
    <div className={styles.IntroText}>
      <p>小对话每天为你匹配一位 V2EX 好友，然后发送一封包括他个人介绍的邮件到你的邮箱。</p>
    </div>
    <div className={styles.Screenshot}>
      <img src={screenshot} />
    </div>
  </div>
)

export default AboutSection
