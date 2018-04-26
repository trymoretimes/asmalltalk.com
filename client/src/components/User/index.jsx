import React from 'react'

import api from '../../api'

export default class User extends React.Component {
  constructor(props) {
    super(props)

    this.state = { user: {} }
  }

  async componentWillMount() {
    const { id } = this.props.params
    const user = api.query({ id })
    this.setState({ user })
  }

  render() {
    return (
      <div> id </div>
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
