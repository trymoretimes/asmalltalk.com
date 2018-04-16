import React from 'react'

import styles from './styles'

class NotificationBar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      show: true
    }
  }

  componentDidUpdate () {
    setTimeout(() => {
      this.setState({ show: false })
    }, 3000)
  }

  render () {
    const { show } = this.state
    let { message } = this.props
    if (!show) {
      message = ''
    }

    return (
      <div className={styles.NotificationBar}>
        <p> {message} </p>
      </div>
    )
  }
}

export default NotificationBar
