import React from 'react'

const redirectRenderer = (params, onClick) => {
  if (params.value > 0) {
    // <Link onClick={onClick}>{params.value}</Link>
    return (
      <button className='btn btn-link p-0' style={{ fontSize: 'inherit' }} onClick={onClick}>
        {params.value}
      </button>
    )
  } else {
    return <span>{params.value}</span>
  }
}

export default redirectRenderer
