import React from 'react'

import styles from '../../styles.css'
import api from '../../api'
import TitleBox from '../TitleBox'
import SubmitButton from '../SubmitButton'
import { SubmitStatus } from '../../constants'
import LogoBox from '../../components/LogoBox'
import DetailComponent from '../../components/DetailComponent'
import AboutSection from '../../components/AboutSection'

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

export default class User extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {},
      submitStatus: SubmitStatus.Default
    }

    this.onCanHelpChange = this.onCanHelpChange.bind(this)
    this.onNeedHelpChange = this.onNeedHelpChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  async componentWillMount() {
    const { id } = this.props.params
    const user = api.query({ id })
    this.setState({ user })
  }

  onCanHelpChange (evt) {
    const val = evt.target.value
    this.setState({
      canHelp: val,
      submitStatus: SubmitStatus.Default
    })
  }

  onNeedHelpChange (evt) {
    const val = evt.target.value
    this.setState({
      needHelp: val,
      submitStatus: SubmitStatus.Default
    })
  }

  async onSubmit () {
    const { userId } = this.props
    const { canHelp, needHelp } = this.state
    this.setState({ submitStatus: SubmitStatus.Submitting })
    try {
      await api.updateInfo({ canHelp, needHelp, userId })
      this.setState({ submitStatus: SubmitStatus.Succeed })
    } catch (e) {
      this.setState({ submitStatus: SubmitStatus.Failed })
    }
  }

  render() {
    const { user, submitStatus } = this.state
    const { _id, canHelp, needHelp } = user

    let message = '提交'
    if (submitStatus === SubmitStatus.Submitting) {
      message = '正在更新'
    } else if (submitStatus === SubmitStatus.Succeed) {
      message = '更新成功'
    } else if (submitStatus === SubmitStatus.Failed) {
      message = '更新失败'
    }
    return (
        <div className={styles.MainContainer}>
          <LogoBox subTitle='注册完成！更新下列信息将帮助你更精确匹配好友' />
          <DetailComponent
            userId={_id}
            canHelp={canHelp}
            needHelp={needHelp}
          />
          <AboutSection />
        </div>
    )
  }
}

const { string, shape } = React.PropTypes

User.propTypes = {
  params: shape({
    id: string,
  }),
  id: string,
}
