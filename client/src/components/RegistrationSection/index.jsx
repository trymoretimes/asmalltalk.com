import React from 'react'

import styles from '../../styles.css'
import TitleBox from '../TitleBox'
import api from '../../api'
import { maybeEmailAddress } from '../../utils'
import screenshot from './clip.svg'

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

class InputRow extends React.Component {
  constructor (props) {
    super(props)

    this.state = { value: '' }
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onSubmit () {
    const { onSubmit } = this.props
    const { value } = this.state
    onSubmit(value)
  }

  onChange (evt) {
    const value = evt.target.value
    this.setState({ value })
  }

  render () {
    const { disabled, placeholder, type } = this.props
    return (
      <div>
        <div className='input-group mb-3'>
          <input
            disabled={disabled}
            type={type}
            className='form-control'
            placeholder={placeholder}
            aria-label={placeholder}
            aria-describedby={placeholder}
            onChange={this.onChange}
          />
          <div className='input-group-append'>
            <button
              className='btn btn-outline-secondary'
              type='button'
              disabled={disabled}
              onClick={this.onSubmit}
            >
              &darr;
            </button>
          </div>
        </div>
      </div>
    )
  }
}

class RegistrationSection extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      username: '',
      email: '',
      code: '',

      copied: false,
      usernameIsVerifying: false,
      usernameIsValid: null // TODO no verified yet
    }

    this.onUserNameSubmit = this.onUserNameSubmit.bind(this)
    this.onEmailSubmit = this.onEmailSubmit.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    const clipboard = new ClipboardJS('.clipboard')
    clipboard.on('success', () => {
      this.setState({ copied: true })
    })

    clipboard.on('error', (e) => {
      this.setState({ copied: false })
    })
  }

  async onUserNameSubmit (username) {
    this.setState({ username })
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
  }

  async getCode () {
    const { username, email } = this.state
    if (maybeEmailAddress(email)) {
      const { code } = await api.getCode({ username, email })
      this.setState({ code })
    }
  }

  async onEmailSubmit (email) {
    if (maybeEmailAddress(email)) {
      this.setState({ email }, async () => {
        await this.getCode()
      })
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
            type='text'
            placeholder='输入你的 v2ex 用户名'
            onSubmit={this.onUserNameSubmit}
          />
          <FlagText text={verifyTipText} type={verifyTipType} />
          <InputRow
            type='email'
            placeholder='输入你的 email'
            disabled={!usernameIsValid}
            onSubmit={this.onEmailSubmit}
          />
          <div>
            <div className='input-group mb-3'>
              <input
                className='form-control'
                placeholder='自动生成验证码'
                aria-label='自动生成验证码'
                type='text'
                id='MigicCode'
                value={code}
                disabled={!usernameIsValid || !email}
              />
              <div className='input-group-append'>
                <button
                  className='btn btn-outline-secondary clipboard'
                  type='button'
                  disabled={!usernameIsValid || !email}
                  data-clipboard-target='#MigicCode'
                  data-clipboard-action='copy'
                >
                  <img src={screenshot} reandonly width='16' alt='复制' />
                </button>
              </div>
            </div>
            <div>
              把上面 &uarr; 的验证码保存到 <a target='_blank' href='https://www.v2ex.com/settings'>V2EX 个人简介 </a> 然后点击注册
            </div>
            <p> {this.verifyCodeTip()}</p>
          </div>
          <div className={styles.SubmitContainer}>
            <button
              type='button'
              className={isReady ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
              disabled={!isReady}
              onClick={this.handleSubmit}
            >
              注册
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default RegistrationSection
