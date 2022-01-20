import React, { Component } from 'react'
import './index.css'
export default class index extends Component {
  render() {
    return (
      <div className='maintenance'>
        <article>
          <h1 id='h1'>Site is temporarily unavailable.</h1>
          <br />
          <p id='p'>Scheduled maintenance is currently in progress. Please check back soon.</p>
          <p id='p2'>We apologize for any inconvenience.</p>
        </article>
      </div>
    )
  }
}
