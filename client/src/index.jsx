import React from 'react'
import ReactDOM from 'react-dom'

import api from './api'
import styles from './styles.css'
import screenshot from './screenshot.png'
import { maybeEmailAddress } from './utils'
import DetailComponent from './components/DetailComponent'
import TitleBox from './components/TitleBox'
import LogoBox from './components/LogoBox'

class App extends React.Component {
  constructor () {
    super()

    this.state = {
      email: '',
      username: '',
      code: '',
      verified: false,
      nameVerified: false,
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

    this.setState({ verifyNameTip: '正在验证用户名', username })
    const { valid, code } = await api.isValidUser({ username })
    if (valid) {
      this.setState({
        nameVerified: true,
        verifyNameTip: '✓ 账号有效',
        code
      })
    } else {
      this.setState({ verifyNameTip: '无效的用户名' })
    }
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
      nameVerified,
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
            <p className={nameVerified ? styles.PassText : styles.ErrorText}>{verifyNameTip}</p>
            <p className={nameVerified ? '' : styles.InactiveText} >
                  2. 输入你的邮箱
              </p>
            <input
              placeholder='email'
              type='email'
              disabled={!nameVerified}
              className={styles.EmailInput}
              onChange={this.onEmailChange}
              />
            <p className={nameVerified && !!email ? '' : styles.InactiveText} >
                  3. 把下面的验证码添加到 V2EX 个人简介 (?)
              </p>
            <input
              placeholder='自动生成验证码'
              type='text'
              disabled={!nameVerified || !email}
              className={styles.CodeInput}
              value={code}
              />
            <p> {this.verifyCodeTip()}</p>
            <button
              type='button'
              disabled={!enableSubmit}
              onClick={this.handleSubmit}
              className={(!nameVerified || !email) ? styles.SubmitBtn + ' ' + styles.BtnDisable : styles.SubmitBtn}
              > 注册
              </button>
          </div>
        </div>
        <div className={styles.IntroContainer}>
          <TitleBox title='How does it works?' />
          <div className={styles.IntroText}>
            <p>小对话每天为你匹配一位 V2EX 好友，然后发送一封包括他个人介绍的邮件到你的邮箱。</p>
          </div>
          <div className={styles.Screenshot}>
            <img src={screenshot} />
          </div>
        </div>
      </div>
    )
  }
}

const COMMENTOR_ID = 'YoYo'
const node = document.getElementById(COMMENTOR_ID)
ReactDOM.render(<App />, node)
