import React from 'react'

import styles from './styles.css'
import { SubmitStatus } from '../../constants'

const SubmitButton = ({ status, message, handleSubmit, disabled }) => {
  const classNames = {}
  classNames[SubmitStatus.Disabled] = 'btn btn-secondary btn-sm'
  classNames[SubmitStatus.Default] = 'btn btn-primary btn-sm'
  classNames[SubmitStatus.Submitting] = 'btn btn-info btn-sm'
  classNames[SubmitStatus.Failed] = 'btn btn-warning btn-sm'
  classNames[SubmitStatus.Succeed] = 'btn btn-success btn-sm'

  let className = classNames[status]
  if (disabled) {
    className = classNames[SubmitStatus.Disabled]
  }
  return (
    <div className={styles.SubmitContainer}>
      <button
        type='button'
        className={className}
        disabled={disabled}
        onClick={handleSubmit}
      >
        { message }
      </button>
    </div>
  )
}

SubmitButton.propTypes = {
  status: React.PropTypes.string,
  message: React.PropTypes.string,
  handleSubmit: React.PropTypes.func,
  disabled: React.PropTypes.boolean
}

export default SubmitButton
