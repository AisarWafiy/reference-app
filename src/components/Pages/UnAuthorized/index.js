import React, { Component } from 'react'
import './index.css'
import { NavLink } from 'react-router-dom'
export default class index extends Component {
  render() {
    return (
      <>
        <div id='unAuthorize'>
          <div class='unAuthorize'>
            <div class='unAuthorize-404'></div>
            <h1>OOPS!</h1>
            <h2>{this.props.error ? this.props.error.toString() : 'Authorization Failed'}</h2>
            <p>
              Sorry, your access is refused. Please go back to the previous page to continue
              browsing.
            </p>
            <NavLink
              to='/login'
              className='nav-link'
              activeStyle={{
                color: 'blue',
              }}
            >
              Login
            </NavLink>
          </div>
        </div>
      </>
    )
  }
}
