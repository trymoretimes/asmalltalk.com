import React from 'react'

import styles from '../../styles.css'
import screenshot from './screenshot.png'
import TitleBox from '../TitleBox'
import text from '../../res/i18n.json'

const lang = window.navigator.language || 'en-US'
const { site_name, about_text, about_text_what } = text[lang]
const AboutSection = () => (
  <div className={styles.IntroContainer}>
    <TitleBox title={about_text_what} />
    <div className={styles.IntroText}>
      <p>{ about_text }</p>
    </div>
    <div className={styles.Screenshot}>
      <img src={screenshot} />
    </div>
    <div className={styles.FooterContainer}>
      <img src='/favicon.ico' />
      {site_name} built by <a href='https://github.com/metrue'> metrue </a> and <a href='https://github.com/haojianzong'> jakehao </a> inspired by <a href='https://findkismet.com'> kismet </a>
    </div>
  </div>
)

export default AboutSection
