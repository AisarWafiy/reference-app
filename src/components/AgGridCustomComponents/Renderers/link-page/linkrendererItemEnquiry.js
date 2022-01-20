import React from 'react'
import { Link, useHistory } from 'react-router-dom'

import { connect } from 'react-redux'
import { linkActions } from 'actions/link.actions'

const linkRenderer = props => {
  const history = useHistory()
  const cellValue = props.value && props.value !== null ? props.value : ''

  const buttonClicked = () => {
    props.link({ itemNumber: cellValue })
  }

  return (
    <span>
      <Link onClick={() => buttonClicked()} to='/bag-tracking/reports/item-enquiry'>
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
