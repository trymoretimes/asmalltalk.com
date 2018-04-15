import React from 'react'
import ReactDOM from 'react-dom'

import api from './api'
import styles from './styles.css'
import { maybeEmailAddress } from './utils'
import DetailComponent from './components/DetailComponent'
import LogoBox from './components/LogoBox'
import AboutSection from './components/AboutSection'
import TitleBox from './components/TitleBox'

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

    this.onUserNameChange = this.onUserNameChange.bind(this)
    this.onEmailChange = this.onEmailChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUpdateInfo = this.handleUpdateInfo.bind(this)
  }

  verifyCodeTip () {
    const { verified, loadingCount } = this.state
    if (verified) {
      return '✓ 账号验证成功'
    } else if (loadingCount > 0) {
      return '验证中' + '.'.repeat(loadingCount % 4)
    } else {
      return ''
    }
  }

  componentDidMount () {
  }

  async onUserNameChange (evt) {
    const username = evt.target.value

    this.setState({ username })
    setTimeout(async () => {
      const { username } = this.state
      this.setState({
        verifyNameTip: '正在验证用户名',
        usernameVerifying: true,
        username
      })
      const info = await api.getUserProfile({ username })
      if (info.status === 'found') {
        this.setState({
          usernameVerified: true,
          verifyNameTip: '✓ 账号有效',
          usernameVerifying: false
        })
      } else {
        this.setState({
          verifyNameTip: '无效的用户名',
          usernameVerifying: false
        })
      }
    }, 1000)
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

  onEmailChange (evt) {
    const email = evt.target.value
    if (maybeEmailAddress(email)) {
      this.setState({ email })
      setTimeout(async () => {
        const { username, email } = this.state
        const { code } = await api.getCode(username, email)
        this.setState({ code })
      }, 500)
    }
  }

  async handleSubmit () {
    const { username, email, code } = this.state
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
    const {
      code,
      email,
      usernameVerified,
      verifyNameTip,
      created,
      updated
    } = this.state

    const enableSubmit = email.length > 0 && code.length > 0
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
        <div className={styles.RegistrationContainer}>
          <TitleBox title='开始你的小对话' />
          <div className={styles.FormContainer}>
            <p>1. 输入你的 V2EX 用户名</p>
            <input
              placeholder='用户名'
              type='text'
              className={styles.UserNameInput}
              onChange={this.onUserNameChange}
              />
            <p className={usernameVerified ? styles.PassText : styles.ErrorText}>{verifyNameTip}</p>
            <p className={usernameVerified ? '' : styles.InactiveText} >
                  2. 输入你的邮箱
              </p>
            <input
              placeholder='email'
              type='email'
              disabled={!usernameVerified}
              className={styles.EmailInput}
              onChange={this.onEmailChange}
              />
            <p className={usernameVerified && !!email ? '' : styles.InactiveText} >
                  3. 把下面的验证码添加到 V2EX 个人简介 (?)
              </p>
            <input
              placeholder='自动生成验证码'
              type='text'
              disabled={!usernameVerified || !email}
              className={styles.CodeInput}
              value={code}
              />
            <p> {this.verifyCodeTip()}</p>
            <button
              type='button'
              disabled={!enableSubmit}
              onClick={this.handleSubmit}
              className={(!usernameVerified || !email) ? styles.SubmitBtn + ' ' + styles.BtnDisable : styles.SubmitBtn}
              > 注册
            </button>
          </div>
          <AboutSection />
        </div>
      </div>
    )
  }
}

const COMMENTOR_ID = 'YoYo'
const node = document.getElementById(COMMENTOR_ID)
ReactDOM.render(<App />, node)
