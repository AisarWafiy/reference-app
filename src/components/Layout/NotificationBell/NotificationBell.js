import React from 'react'
import Badge from '@material-ui/core/Badge'
import { RiNotification3Line } from 'react-icons/ri'

const NotificationBell = props => {
  return (
    <Badge
      badgeContent={props.count}
      max={999}
      color='error'
      style={{ cursor: 'pointer' }}
      {...props}
    >
      <RiNotification3Line />
    </Badge>
  )
}

export default NotificationBell
