import React from 'react'
import ReactDOM from 'react-dom'

import api from './api'
import styles from './styles.css'
import 'bootstrap/dist/css/bootstrap.css'

import { SubmitStatus } from './constants'

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
      needHelp: ''
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

  async handleSubmit (payload, callback) {
    this.setState({ registrating: SubmitStatus.Submitting })

    try {
      await this.verifyCode(payload)
      const data = await api.submit(payload)
      if (data.error) {
        this.setState({
          created: false,
          toUpdate: false
        })
        callback(data.error, data)
      } else {
        this.setState({
          created: true,
          userId: data._id,
          toUpdate: true
        })
        callback(null, data)
      }
    } catch (e) {
      callback(e, null)
    }
  }

  render () {
    const {
      canHelp,
      needHelp,
      userId,
      toUpdate
    } = this.state

    if (toUpdate) {
      return (
        <div className={styles.MainContainer}>
          <LogoBox subTitle='注册完成！更新下列信息将帮助你更精确匹配好友' />
          <DetailComponent
            userId={userId}
            canHelp={canHelp}
            needHelp={needHelp}
          />
          <AboutSection />
        </div>
      )
    }

    return (
      <div className={styles.MainContainer}>
        <LogoBox subTitle='很高兴认识你' />
        <RegistrationSection onSubmit={this.handleSubmit} />
        <AboutSection />
      </div>
    )
  }
}

const COMMENTOR_ID = 'YoYo'
const node = document.getElementById(COMMENTOR_ID)
ReactDOM.render(<App />, node)
