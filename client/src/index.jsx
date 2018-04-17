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
      toUpdate: false,
      loadingCount: 0,
      created: false,
      updated: false,
      canHelp: '',
      needHelp: '',
      extraInfo: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async verifyCode (payload) {
    const { username, code } = payload
    this.setState({ loadingCount: this.state.loadingCount + 1 })
    const verified = await api.verify({ username, code })
    this.setState({ verified })
    if (!verified) {
      await this.verifyCode(payload)
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
      this.setState({
        toUpdate: true,
        created: true,
        userId: users[0]._id,
        canHelp: users[0].canHelp,
        needHelp: users[0].needHelp,
        extraInfo: users[0].extraInfo
      })
    } else {
      await this.verifyCode(payload)
      const user = await api.submit({ username, email, code })
      if (user) {
        const { _id } = user
        this.setState({
          toUpdate: true,
          created: true,
          userId: _id
        })
      }
    }
  }

  render () {
    const {
      canHelp,
      needHelp,
      extraInfo,
      userId,
      toUpdate
    } = this.state

    if (toUpdate) {
      return (
        <div className={styles.MainContainer}>
          <LogoBox />
          <DetailComponent
            userId={userId}
            canHelp={canHelp}
            needHelp={needHelp}
            extraInfo={extraInfo}
          />
        </div>
      )
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
