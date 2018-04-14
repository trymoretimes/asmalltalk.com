import React from 'react'

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
      <div>
        <input placeholder='你可以帮助什么' onChange={this.onCanHelpChange} />
        <input placeholder='你需要什么帮助' onChange={this.onNeedHelpChange} />
        <input placeholder='其他' onChange={this.onExtraInfoChange} />
        <button onClick={this.onSubmit} />
      </div>
    )
  }
}

export default DetailComponent
