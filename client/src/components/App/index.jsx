import React from 'react'

import api from '../../api'
import styles from '../../styles.css'
import 'bootstrap/dist/css/bootstrap.css'

import { SubmitStatus } from '../../constants'

import DetailComponent from '../../components/DetailComponent'
import LogoBox from '../../components/LogoBox'
import AboutSection from '../../components/AboutSection'
import RegistrationSection from '../../components/RegistrationSection'

import { hashHistory } from 'react-router'

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
    this.setState({ loadingCount: this.state.loadingCount + 1 })
    const verified = await api.verify(payload)
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
        hashHistory.push('/notfound')
        this.setState({ created: false })
        callback(data.error, data)
      } else {
        hashHistory.push(`/users/${data._id}`)
        this.setState({ created: true })
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

export default App
