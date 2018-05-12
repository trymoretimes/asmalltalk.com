import React from 'react'

import api from '../../api'
import styles from '../../styles.css'
import 'bootstrap/dist/css/bootstrap.css'

import { SubmitStatus } from '../../constants'
import LogoBox from '../../components/LogoBox'
import AboutSection from '../../components/AboutSection'
import RegistrationSection from '../../components/RegistrationSection'

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
    return (
      <div className={styles.MainContainer}>
        <LogoBox subTitle='很高兴认识你' />
        <RegistrationSection onSubmit={this.handleSubmit} />
        <AboutSection />
      </div>
    )
  }
}

export default Home
