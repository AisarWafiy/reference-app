import React from 'react'
import { useTranslation } from 'react-i18next'
import FlightIcon from 'assets/images/flights-icon.png'
import RefundIcon from 'assets/images/refund-icon.png'

// const iconStyle = {
//   height: '50px',
//   width: '50px',
//   backgroundColor: '#f8f8f8',
//   borderRadius: '50%',
//   display: 'inline-block',
// }

const linkStyle = {
  cursor: 'pointer',
}

const NotificationBar = props => {
  const { t } = useTranslation()
  return (
    <div className='row mt-3'>
      <div className='col-2'>
        {props.flightChange && <img src={FlightIcon} className='iconStyle' alt='Flights Icon' />}
        {props.refund && <img src={RefundIcon} className='iconStyle' alt='Refund Icon' />}
      </div>
      <div className='col-10 d-flex align-items-center justify-content-between'>
        <span>
          <span className='h3 text-info'>
            <strong>{props.count}</strong>&nbsp;
          </span>
          <span className='h3'>
            {props.flightChange && ' Flight Change Alerts'}
            {props.refund && ' Refund Alerts'}
          </span>
        </span>
      </div>
    </div>
  )
}

export default NotificationBar
