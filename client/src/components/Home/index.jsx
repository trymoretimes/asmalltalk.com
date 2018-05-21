import React from 'react'

import api from '../../api'
import styles from '../../styles.css'
import 'bootstrap/dist/css/bootstrap.css'

import { SubmitStatus } from '../../constants'
import LogoBox from '../../components/LogoBox'
import AboutSection from '../../components/AboutSection'
import RegistrationSection from '../../components/RegistrationSection'
import text from '../../res/i18n.json'

import { hashHistory } from 'react-router'

class Home extends React.Component {
  constructor () {
    super()

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async verifyCode (payload) {
    const verified = await api.verify(payload)
    if (!verified) {
      await this.verifyCode(payload)
    }
  }

  async handleSubmit (payload, callback) {
    this.setState({ registrating: SubmitStatus.Submitting })

    try {
      await this.verifyCode(payload)
      const data = await api.submit(payload)
      if (data.error) {
        hashHistory.push('/notfound')
        callback(data.error, data)
      } else {
        hashHistory.push(`/users/${data.id}`)
        callback(null, data)
      }
    } catch (e) {
      callback(e, null)
    }
  }

  render () {
    const lang = window.navigator.language
    const { site_subtitle, site_name } = text[lang]
    return (
      <div className={styles.MainContainer}>
        <LogoBox title={site_name} subTitle={site_subtitle} />
        <RegistrationSection onSubmit={this.handleSubmit} />
        <AboutSection />
      </div>
    )
  }
}

export default Home
