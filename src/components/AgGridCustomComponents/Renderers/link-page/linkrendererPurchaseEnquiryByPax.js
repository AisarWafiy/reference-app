import React from 'react'
import { Link, useHistory } from 'react-router-dom'

import { connect } from 'react-redux'
import { linkActions } from 'actions/link.actions'
const linkRenderer = props => {
  const history = useHistory()
  const cellValue = props.value && props.value !== null ? props.value : ''

  const buttonClicked = () => {
    props.link({ paxNumber: cellValue })
  }

  return (
    <span>
      {/* <span>{cellValue}</span>&nbsp; */}
      <Link onClick={() => buttonClicked()} to='/bag-tracking/reports/purchase-enquiry-by-pax'>
        {cellValue}
      </Link>
    </span>
  )
}

function mapState(state) {
  return {}
}

const actionCreators = {
  link: linkActions.linksuccess,
}
export default connect(mapState, actionCreators)(linkRenderer)
