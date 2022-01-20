import React, { Component } from 'react'
import './ErrorPage.css'
export default class ErrorPage extends Component {
  render() {
    return (
      <>
        <div id='notfound'>
          <div className='notfound'>
            <div className='notfound-404'></div>
            <h1>Error</h1>
            <h2>Something went wrong</h2>
            <p>Sorry the page you're looking for can't be found. Please login again.</p>
            {/* <NavLink
              to='/logout'
              className='nav-link'
              activeStyle={{
                color: "blue",
              }}
            >
              Login
            </NavLink> */}
          </div>
        </div>
      </>
    )
  }
}
