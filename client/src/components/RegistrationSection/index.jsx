import React from 'react'

import styles from '../../styles.css'
import TitleBox from '../TitleBox'
import api from '../../api'
import { maybeEmailAddress } from '../../utils'

const FlagText = ({ type, text }) => {
  const classNames = {
    error: styles.ErrorText,
    success: styles.PassText,
    inactive: styles.InactiveText
  }
  return (
    <p className={classNames[type] || ''}> {text} </p>
  )
}

const InputRow = ({ label, disabled, placeholder, onChangeHandler }) => {
  return (
    <div>
      <FlagText type={disabled ? 'inactive' : null} text={label} />
      <input
        placeholder={placeholder}
        type='text'
        className={styles.UserNameInput}
        disabled={disabled}
        onChange={onChangeHandler}
        />
    </div>
  )
}

class RegistrationSection extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      username: '',
      email: '',
      code: '',

      usernameIsVerifying: false,
      usernameIsValid: null // TODO no verified yet
    }

    this.onUserNameChange = this.onUserNameChange.bind(this)
    this.onEmailChange = this.onEmailChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  onUserNameChange (evt) {
    const username = evt.target.value

    this.setState({ username })
    setTimeout(async () => {
      const { username } = this.state
      this.setState({
        usernameIsVerifying: true,
        username
      })
      const info = await api.getUserProfile({ username })
      if (info.status === 'found') {
        this.setState({
          user: true,
          usernameIsVerifying: false,
          usernameIsValid: true
        }, async () => {
          await this.getCode()
        })
      } else {
        this.setState({
          code: '',
          usernameIsVerifying: false,
          usernameIsValid: false
        })
      }
    }, 2000)
  }

  async getCode () {
    const { username, email } = this.state
    if (maybeEmailAddress(email)) {
      const { code } = await api.getCode({ username, email })
      this.setState({ code })
    }
  }

  onEmailChange (evt) {
    const email = evt.target.value
    if (maybeEmailAddress(email)) {
      this.setState({ email })
      setTimeout(async () => {
        await this.getCode()
      }, 2000)
    }
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

  handleSubmit () {
    const { code, username, email } = this.state
    const { onSubmit } = this.props
    onSubmit({ code, username, email })
  }

  render () {
    const {
      email,
      usernameIsVerifying,
      usernameIsValid,
      code
    } = this.state

    let verifyTipText = ''
    let verifyTipType = 'default'
    if (usernameIsVerifying) {
      verifyTipText = '正在验证用户名'
    } else if (usernameIsValid) {
      verifyTipText = '用户名验证成功'
      verifyTipType = 'success'
    } else if (usernameIsValid === false) {
      verifyTipText = '用户名验证失败'
      verifyTipType = 'error'
    }

    const isReady = email.length > 0 && code.length > 0 && usernameIsValid
    return (
      <div className={styles.RegistrationContainer}>
        <TitleBox title='开始你的小对话' />
        <div className={styles.FormContainer}>
          <InputRow
            label='1. 输入你的 V2EX 用户名'
            placeholder='V2EX 用户名'
            onChangeHandler={this.onUserNameChange}
          />
          <FlagText text={verifyTipText} type={verifyTipType} />
          <InputRow
            label='2. 输入你的邮箱'
            placeholder='email'
            disabled={!usernameIsValid}
            onChangeHandler={this.onEmailChange}
          />
          <FlagText type={!isReady ? 'inactive' : null} text='3. 把下面的验证码添加到 V2EX 个人简介 (?)' />
          <input
            placeholder='自动生成验证码'
            type='text'
            disabled={!usernameIsValid || !email}
            className={styles.CodeInput}
            value={code}
            />
          <p> {this.verifyCodeTip()}</p>
          <button
            type='button'
            disabled={!isReady}
            onClick={this.handleSubmit}
            className={isReady ? styles.SubmitBtn : styles.SubmitBtn + ' ' + styles.BtnDisable}
            > 注册
          </button>
        </div>
      </div>
    )
  }
}

export default RegistrationSection
