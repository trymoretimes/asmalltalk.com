import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import User from './components/User'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

ReactDOM.render((
  <Router history={ hashHistory }>
    <Route path="/" component={ App }>
      <IndexRoute component={ App } />
      <Route path="users/:id" component={ User } />
    </Route>
  </Router>
), document.body)
