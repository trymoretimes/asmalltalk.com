import React from 'react'
import ReactDOM from 'react-dom'

import api from './api'
import styles from './styles.css'
import { maybeEmailAddress } from './utils'

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

    return (
      <div>
        <input
          placeholder='v2ex username'
          type='text'
          className={styles.UserNameInput}
          onChange={this.onUserNameChange.bind(this)}
        />
        <input
          placeholder='code'
          type='text'
          className={styles.CodeInput}
          value={code}
        />
        <p> { loading }</p>
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
        > Submit
        </button>
      </div>
    )
  }
}

const COMMENTOR_ID = 'YoYo'
const node = document.getElementById(COMMENTOR_ID)
ReactDOM.render(<App />, node)
