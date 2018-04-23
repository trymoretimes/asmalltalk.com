import React from 'react'

import { SubmitStatus } from '../../constants'
import styles from './styles.css'

class InputRow extends React.Component {
  constructor (props) {
    super(props)

    this.state = { value: '', submitStatus: SubmitStatus.Default }
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  async onSubmit () {
    const { onSubmit } = this.props
    const { value } = this.state
    this.setState({ submitStatus: SubmitStatus.Submitting })
    const ok = await onSubmit(value)
    if (ok) {
      this.setState({ submitStatus: SubmitStatus.Succeed })
    } else {
      this.setState({ submitStatus: SubmitStatus.Failed })
    }
  }

  onChange (evt) {
    const value = evt.target.value
    this.setState({ value, submitStatus: SubmitStatus.Default })
  }

  render () {
    const { disabled, placeholder, type, label } = this.props
    const { submitStatus } = this.state
    let message = '↓'
    let buttonStyle = ''
    if (submitStatus === SubmitStatus.Submitting) {
      message = '...'
    } else if (submitStatus === SubmitStatus.Succeed) {
      message = '√'
      buttonStyle = styles.Succeed
    } else if (submitStatus === SubmitStatus.Failed) {
      message = 'X'
      buttonStyle = styles.Failed
    }

    return (
      <div>
        <p>{ label }</p>
        <div className='input-group mb-3'>
          <input
            disabled={disabled}
            type={type}
            className='form-control'
            placeholder={placeholder}
            aria-label={placeholder}
            aria-describedby={placeholder}
            onChange={this.onChange}
          />
          <div className='input-group-append'>
            <button
              className={'btn btn-secondary ' + buttonStyle}
              type='button'
              disabled={disabled}
              onClick={this.onSubmit}
            >
              { message }
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default InputRow
