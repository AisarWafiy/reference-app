import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import configureStore, { history } from './store'
import AppWithRouterAccess from './router/AppWithRouterAccess'
import 'assets/styles/bootstrap.css'
import 'assets/styles/ag-grid.css'

const store = configureStore()

class MainApp extends React.Component {

  render() {
    return (
      <div className='App'>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            {/* <Switch> */}
            <AppWithRouterAccess />

            {/* <Route path='/create-role' component={CreateRole} />
            <Route path='/maintain-role' component={MaintainRole} />
            <Route path='/maintain-ref' component={MaintainReferenceData} /> */}
            {/* <Route path='/' component={MainPage} />
            </Switch> */}
          </ConnectedRouter>
        </Provider>
      </div>
    )
  }
}

export default MainApp
