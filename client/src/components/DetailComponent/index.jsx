import React from 'react'

import styles from '../../styles.css'
import TitleBox from '../TitleBox'

class DetailComponent extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      canHelp: '',
      needHelp: '',
      extraInfo: ''
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

  onSubmit () {
    const { handleSubmit } = this.props
    const { canHelp, needHelp, extraInfo } = this.state
    handleSubmit({ canHelp, needHelp, extraInfo })
  }

  render () {
    return (
      <div className={styles.MainContainer}>
        <TitleBox title='更新信息' />
        <div className={styles.FormContainer}>
          <p> 你想从别人获得哪些帮助</p>
          <input
            placeholder='你需要什么帮助'
            className={styles.UserNameInput}
            onChange={this.onNeedHelpChange}
          />
          <p> 你可以帮助别人哪些</p>
          <input
            placeholder='你可以帮助什么'
            onChange={this.onCanHelpChange}
            className={styles.EmailInput}
          />
          <p> 其他</p>
          <input
            placeholder='随便说点什么'
            onChange={this.onExtraInfoChange}
            className={styles.EmailInput}
          />
          <button
            className={styles.SubmitBtn}
            onClick={this.onSubmit}
          > { this.state.isSubmitting ? '正在更新' : '提交' } </button>
        </div>
      </div>
    )
  }
}

export default DetailComponent
