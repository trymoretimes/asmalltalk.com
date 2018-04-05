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
      verified: false
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
          this.onCodeChange()
        })
      } else {
        this.setState({ code: '' })
      }
    })
  }

  onEmailChange (evt) {
    const email = evt.target.value
    if (maybeEmailAddress(email)) {
      this.setState({ email })
    }
  }

  async onCodeChange () {
    const { username, code } = this.state
    const verified = await api.verify({ username, code })
    this.setState({ verified })
  }

  async handleSubmit () {
    const { username } = this.state
    const resp = await api.submit({ username })
    const code = await resp.json()
    this.setState({ code })
  }

  render () {
    const { code, verified } = this.state

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
        <input
          placeholder='email'
          type='email'
          disabled={!verified}
          className={styles.EmailInput}
          onChange={this.onEmailChange.bind(this)}
        />
        <button onClick={this.handleSubmit.bind(this)}> Submit </button>
      </div>
    )
  }
}

const COMMENTOR_ID = 'YoYo'
const node = document.getElementById(COMMENTOR_ID)
ReactDOM.render(<App />, node)
