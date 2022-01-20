import { applyMiddleware, createStore } from 'redux'
// import { compose } from 'redux' it can be replaced with instead of composeWithDevTools
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import allReducers from 'reducers'

import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

export const history = createBrowserHistory()
const routeMiddleware = routerMiddleware(history)

const middlewares = [thunk, routeMiddleware]

const environment = process.env.NODE_ENV
console.log(environment)

if (environment === 'development') {
  middlewares.push(logger)
}

export default function configureStore(initialState) {
  const store = createStore(
    allReducers(history),
    initialState,
    composeWithDevTools(applyMiddleware(...middlewares)),
  )
  return store
}

