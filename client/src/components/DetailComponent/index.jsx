import React from 'react'

import styles from '../../styles.css'
import api from '../../api'
import TitleBox from '../TitleBox'
import NotificationBar from '../NotificationBar'

class DetailComponent extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      canHelp: props.canHelp,
      needHelp: props.needHelp,
      extraInfo: props.extraInfo,

      updating: false,
      updated: null
    }

    this.onCanHelpChange = this.onCanHelpChange.bind(this)
    this.onNeedHelpChange = this.onNeedHelpChange.bind(this)
    this.onExtraInfoChange = this.onExtraInfoChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onCanHelpChange (evt) {
    const val = evt.target.value
    this.setState({ canHelp: val })
  }

  onNeedHelpChange (evt) {
    const val = evt.target.value
    this.setState({ needHelp: val })
  }

  onExtraInfoChange (evt) {
    const val = evt.target.value
    this.setState({ extraInfo: val })
  }

  async onSubmit () {
    const { userId } = this.props
    const { canHelp, needHelp, extraInfo } = this.state
    this.setState({ updating: true }, async () => {
      const updated = await api.updateInfo({ canHelp, needHelp, extraInfo, userId })
      this.setState({ updating: false, updated })
    })
  }

  render () {
    const {
      canHelp,
      needHelp,
      extraInfo,
      updating,
      updated
    } = this.state
    let message = ''
    let shouldDisableSubmit = false
    if (updating) {
      message = '正在更新'
      shouldDisableSubmit = true
    } else if (updated !== null) {
      message = updated ? '更新成功' : '更新失败'
    }
    return (
      <div className={styles.MainContainer}>
        <TitleBox title='更新信息' />
        <div className={styles.FormContainer}>
          <p> 你想从别人获得哪些帮助</p>
          <input
            value={needHelp}
            placeholder='你需要什么帮助'
            className={styles.UserNameInput}
            onChange={this.onNeedHelpChange}
          />
          <p> 你可以帮助别人哪些</p>
          <input
            value={canHelp}
            placeholder='你可以帮助什么'
            onChange={this.onCanHelpChange}
            className={styles.EmailInput}
          />
          <p> 其他</p>
          <input
            value={extraInfo}
            placeholder='随便说点什么'
            onChange={this.onExtraInfoChange}
            className={styles.EmailInput}
          />
          <button
            disabled={shouldDisableSubmit}
            className={styles.SubmitBtn}
            onClick={this.onSubmit}
          > { '提交' } </button>
          <NotificationBar message={message} />
        </div>
      </div>
    )
  }
}

export default DetailComponent
