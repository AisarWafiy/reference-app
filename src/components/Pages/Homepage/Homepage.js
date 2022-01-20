import React from 'react'
import { Modal } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useOktaAuth } from '@okta/okta-react'
import { loginResponse } from 'services/login.service'

const Homepage = () => {
  const { oktaAuth, authState } = useOktaAuth()
  const dispatch = useDispatch()

  let alertModalStatus = useSelector((state) => state?.alertModalReducer?.alertModalStatus)
  let alertModalMessage = useSelector((state) => state?.alertModalReducer?.alertModalMsg)

  const handleOk = () => {
    oktaAuth.signOut()
  }


  let userId = localStorage.getItem('user')
  if (userId) {
    loginResponse(userId, dispatch, oktaAuth)
  }


  let alertModal = (showAlertModal, alertModalMessage) => {
    return <><Modal show={showAlertModal} top="true">
      <Modal.Body>{alertModalMessage}</Modal.Body>
      <Modal.Footer>
        <button type='button' className=' btn btn-outline-secondary' onClick={handleOk} >
          Ok
        </button>
      </Modal.Footer>
    </Modal>
    </>

  }
  return (
    <div className='container'>
      <div className='mt-5 row'>
        {alertModalStatus && alertModal(alertModalStatus, alertModalMessage)}
        <h1>Welcome to BC Connect</h1>
      </div>
    </div>
  )
}

export default Homepage
