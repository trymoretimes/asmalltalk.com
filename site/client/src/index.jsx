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
      code: ''
    }
  }

  componentDidMount () {
  }

  onUserNameChange (evt) {
    const username = evt.target.value
    this.setState({ username }, async () => {
      const valid = await api.isValidUser({ username })
      if (valid) {
        const code = await api.getCode(username)
        console.log(code)
        this.setState({ code })
      }
    })
  }

  onEmailChange (evt) {
    const email = evt.target.value
    if (maybeEmailAddress(email)) {
      this.setState({ email })
    }
  }

  async handleSubmit () {
    const { username } = this.state
    const resp = await api.submit({ username })
    const code = await resp.json()
    this.setState({ code })
  }

  render () {
    const { code } = this.state

    return (
      <div>
        <input
          placeholder='v2ex username'
          className={styles.UserNameInput}
          onChange={this.onUserNameChange.bind(this)}
        />
        <input
          placeholder='code'
          className={styles.CodeInput}
        >
          ${code}
        </input>
        <input
          placeholder='email'
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
