import React from 'react'

class DetailComponent extends React.Component {
  constructor () {
    super()

    this.onCanHelpChange = this.onCanHelpChange.bind(this)
    this.onNeedHelpChange = this.onNeedHelpChange.bind(this)
    this.onExtraInfoChange = this.onExtraInfoChange.bind()
  }

  onCanHelpChange (evt) {
    const val = evt.target.value
    console.log(val)
  }

  onNeedHelpChange (evt) {
    const val = evt.target.value
    console.log(val)
  }

  onExtraInfoChange (evt) {
    const val = evt.target.value
    console.log(val)
  }

  render () {
    return (
      <div>
        <input placeholder='你可以帮助什么' />
        <input placeholder='你需要什么帮助' />
        <input placeholder='其他' />
      </div>
    )
  }
}

export default DetailComponent
