import React from 'react'
import ReactDOM from 'react-dom'
import Home from './components/App'
import User from './components/User'
import NotFound from './components/NotFound'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

ReactDOM.render((
  <Router history={ hashHistory }>
    <Route path="/" component={ Home }>
      <IndexRoute component={ Home } />
    </Route>
    <Route path="users/:id" component={ User } />
    <Route path='*' component={ NotFound } />
  </Router>
), document.body)
