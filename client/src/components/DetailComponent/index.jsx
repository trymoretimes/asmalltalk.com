import React from 'react'

import styles from '../../styles.css'
import api from '../../api'
import TitleBox from '../TitleBox'

const InputBox = ({label, value, placeholder, onChange}) => (
  <div className='form-group'>
    <label for='exampleFormControlTextarea1'>{label}</label>
    <textarea
      className='form-control'
      placeholder={placeholder}
      id='exampleFormControlTextarea1'
      rows='3'
      value={value}
      onChange={onChange}
     />
  </div>
)

class DetailComponent extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      canHelp: props.canHelp,
      needHelp: props.needHelp,

      updating: false,
      updated: null
    }

    this.onCanHelpChange = this.onCanHelpChange.bind(this)
    this.onNeedHelpChange = this.onNeedHelpChange.bind(this)
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

  async onSubmit () {
    const { userId } = this.props
    const { canHelp, needHelp } = this.state
    this.setState({ updating: true }, async () => {
      const updated = await api.updateInfo({ canHelp, needHelp, userId })
      this.setState({ updating: false, updated }, () => {
        setTimeout(() => {
          this.setState({ updating: false, updated: null })
        }, 2000)
      })
    })
  }

  render () {
    const {
      canHelp,
      needHelp,
      updating,
      updated
    } = this.state
    let message = '提交'
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
          <InputBox placeholder='最近想开始入门区块链, 不知道如何开始呢' value={needHelp} label='我想获取这些帮助' onChange={this.onNeedHelpChange} />
          <InputBox placeholder='我精通Go语言编程,偶尔写写 Vue' value={canHelp} label='我可以提供这些帮助' onChange={this.onCanHelpChange} />
          <div className={styles.SubmitContainer}>
            <button
              disabled={shouldDisableSubmit}
              className='btn btn-primary btn-sm'
              onClick={this.onSubmit}
            > {message} </button>
          </div>
        </div>
      </div>
    )
  }
}

export default DetailComponent
