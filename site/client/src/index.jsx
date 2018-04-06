import React from 'react'
import ReactDOM from 'react-dom'

import api from './api'
import styles from './styles.css'
import { maybeEmailAddress } from './utils'
import screenshot from './screenshot.png'

class App extends React.Component {
  constructor () {
    super()

    this.state = {
      email: '',
      username: '',
      code: '',
      verified: false,
      loading: ''
    }
  }

  componentDidMount () {
  }

  onUserNameChange (evt) {
    const username = evt.target.value
    this.setState({ username }, async () => {
      const { valid, code } = await api.isValidUser({ username })
      if (valid) {
        this.setState({ code }, () => {
          this.verifyCode()
        })
      } else {
        this.setState({ code: '' })
      }
    })
  }

  async verifyCode () {
    const st = setTimeout(async () => {
      const { username, code } = this.state
      const verified = await api.verify({ username, code })
      this.setState({ verified })

      if (!verified) {
        this.verifyCode()

        const { loading } = this.state
        this.setState({ loading: `${loading}.` })
      } else {
        clearTimeout(st)
      }
    }, 1000)
  }

  onEmailChange (evt) {
    const email = evt.target.value
    if (maybeEmailAddress(email)) {
      this.setState({ email })
    }
  }

  async handleSubmit () {
    const { username, email, code } = this.state
    const created = await api.submit({ username, email, code })
    if (created) {
      alert('You are all set')
    }
  }

  render () {
    const { code, verified, email, loading } = this.state

    document.body.style = 'background: #b8e5f8;';

    return (
      <div className={styles.MainContainer}>
          <h2 className={styles.CenterText}>本周对话</h2>
          <h4 className={styles.CenterText}>轻松拓展你的朋友圈</h4>
          <div className={styles.FormContainer}>
            1. 输入你的 V2EX 用户名
            <input
              placeholder='用户名'
              type='text'
              className={styles.UserNameInput}
              onChange={this.onUserNameChange.bind(this)}
            />
            2. 把下面的验证码添加到 V2EX 个人简介 (?)
            <input
              placeholder='自动生成验证码'
              type='text'
              disabled='true'
              className={styles.CodeInput}
              value={code}
            />
            <p> { loading }</p>
            3. 输入你的邮箱
            <input
              placeholder='email'
              type='email'
              disabled={!verified}
              className={styles.EmailInput}
              onChange={this.onEmailChange.bind(this)}
            />
            <button
              type='button'
              disabled={!verified && !!email}
              onClick={this.handleSubmit.bind(this)}
              className={styles.SubmitBtn}
            > 注册使用
            </button>
          </div>
          <div className={styles.introContainer}>
              <p className={styles.CenterText}>· · ·</p>
              <h4 className={styles.CenterText}>How does it work?</h4>
              <p>本周会话每周为你匹配一位 V2EX 好友，然后发送一封包括他个人介绍的邮件到你的邮箱。</p>
              <p className={styles.CenterText}>· · ·</p>
              <img className={styles.Screenshot} src={screenshot} />
          </div>
      </div>
    )
  }
}

const COMMENTOR_ID = 'YoYo'
const node = document.getElementById(COMMENTOR_ID)
ReactDOM.render(<App />, node)
