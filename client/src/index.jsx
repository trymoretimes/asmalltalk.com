import React from 'react'
import ReactDOM from 'react-dom'

import api from './api'
import styles from './styles.css'
import DetailComponent from './components/DetailComponent'
import LogoBox from './components/LogoBox'
import AboutSection from './components/AboutSection'
import RegistrationSection from './components/RegistrationSection'

class App extends React.Component {
  constructor () {
    super()

    this.state = {
      email: '',
      username: '',
      code: '',

      usernameVerifying: false,
      usernameVerified: false,

      verified: false,
      verifyNameTip: '',
      loadingCount: 0,
      created: false,
      updated: false
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUpdateInfo = this.handleUpdateInfo.bind(this)
  }

  async verifyCode () {
    const { username, code } = this.state
    this.setState({ loadingCount: this.state.loadingCount + 1 })
    const verified = await api.verify({ username, code })
    this.setState({ verified })
    if (!verified) {
      await this.verifyCode()
    } else {
      this.setState({
        loadingTip: '账号验证成功',
        loadingCount: 0
      })
    }
  }

  async handleSubmit (payload) {
    const { username, email, code } = payload
    const users = await api.query({ email, username })
    if (users.length > 0) {
      this.setState({ created: true, userId: users[0]._id })
    } else {
      await this.verifyCode()
      const user = await api.submit({ username, email, code })
      if (user) {
        const { _id } = user
        this.setState({ created: true, userId: _id })
      }
    }
  }

  async handleUpdateInfo (info) {
    const { canHelp, needHelp, extraInfo } = info
    const { userId } = this.state
    const updated = await api.updateInfo({ canHelp, needHelp, extraInfo, userId })
    if (updated) {
      this.setState({ updated })
    }
  }

  render () {
    const { created, updated } = this.state

    if (created) {
      return (
        <DetailComponent handleSubmit={this.handleUpdateInfo} />
      )
    }

    if (updated) {
      return (<p> 信息更新成功 </p>)
    }

    return (
      <div className={styles.MainContainer}>
        <LogoBox />
        <RegistrationSection onSubmit={this.handleSubmit} />
        <AboutSection />
      </div>
    )
  }
}

const COMMENTOR_ID = 'YoYo'
const node = document.getElementById(COMMENTOR_ID)
ReactDOM.render(<App />, node)
