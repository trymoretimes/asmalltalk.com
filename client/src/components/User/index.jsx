import React from 'react'

import styles from './styles.css'
import api from '../../api'
import TitleBox from '../TitleBox'
import SubmitButton from '../SubmitButton'
import { SubmitStatus } from '../../constants'
import LogoBox from '../../components/LogoBox'
import AboutSection from '../../components/AboutSection'

const InputBox = ({label, value, placeholder, onChange}) => (
  <div className='form-group'>
    <label for='exampleFormControlTextarea1'>{label}</label>
    <textarea
      className={ 'form-control ' + styles.StoryTextarea }
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

    this.onStoryChange = this.onStoryChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  async componentWillMount() {
    const { id } = this.props.params
    const user = await api.query(id)
    this.setState({ user })
  }

  onStoryChange (evt) {
    const val = evt.target.value
    this.setState({
      story: val,
      submitStatus: SubmitStatus.Default
    })
  }

  async onSubmit () {
    const { id } = this.props.params
    const { story } = this.state
    this.setState({ submitStatus: SubmitStatus.Submitting })
    try {
      await api.updateInfo({ story, id })
      this.setState({ submitStatus: SubmitStatus.Succeed })
    } catch (e) {
      this.setState({ submitStatus: SubmitStatus.Failed })
    }
  }

  render() {
    const { user, submitStatus } = this.state
    const { id, story } = user

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
          <LogoBox subTitle='说点啥吧' />
          <div className={styles.MainContainer}>
            <div className={styles.FormContainer}>
              <InputBox
                placeholder='我是一个全沾工程师，目前任职于Udacity的Global Growth Engineering Team, 和又酷又好玩的工程师们做朋友是一件令人十分激动的事情，所以小对话就是为了这个目标而诞生的'
                value={story}
                label=''
                onChange={this.onStoryChange}
              />
              <SubmitButton
                status={submitStatus}
                message={message}
                handleSubmit={this.onSubmit}
              />
            </div>
          </div>
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
