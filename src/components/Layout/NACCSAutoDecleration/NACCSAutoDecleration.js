import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { connect, useDispatch, useSelector } from 'react-redux'
import Switch from 'react-switch'
import axios from 'axios'
import { alertActions } from '../../../actions/alert.actions'
import { naccsAutoGenStatusRequest } from 'actions/action-dashboard'
import { Modal } from 'react-bootstrap'

const NACCSAutoDecleration = props => {
  const { t, i18n } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [checked, setchecked] = useState(false)

  const dispatch = useDispatch()

  let naccsAutoGenStatus = useSelector(state => state?.dashboardReducer?.naccsAutoGenStatus)

  const handleCancel = () => {
    setShowModal(false)
  }

  const handleOk = () => {
    setShowModal(false)
    axios
      .put(process.env.REACT_APP_SERVER_URI + '/api/naccs/enableAutoGen?enableFlag=' + checked)
      .then(response => {
        dispatch(alertActions.success(response.data.message, ''))
        dispatch(naccsAutoGenStatusRequest(checked))
      })
      .catch(err => {
        if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, 'Failed to Update Naccs auto generation status')
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, 'Failed to Update Naccs auto generation status')
        else if (err.response.data.warning)
          dispatch(
            alertActions.warning(
              err.response.data.warning,
              'Failed to Update Naccs auto generation status',
            ),
          )
        else dispatch(alertActions.error('Internal Server Error'))
      })
  }

  let masterModal = (
    <Modal show={showModal} top='true'>
      <Modal.Body>
        {naccsAutoGenStatus
          ? t('NACCS_Auto_Declaration_will_be_Turned_Off_Do_you_want_to_proceed_label')
          : t('NACCS_Auto_Declaration_will_be_Turned_On_Do_you_want_to_proceed_label')}
      </Modal.Body>
      <Modal.Footer>
        <button type='button' className=' btn btn-outline-secondary' onClick={handleOk}>
          {t('Yes_label')}
        </button>
        <button type='button' className=' btn btn-outline-secondary' onClick={handleCancel}>
          {t('No_label')}
        </button>
      </Modal.Footer>
    </Modal>
  )

  const handleChange = checked => {
    setShowModal(true)
    setchecked(checked)
  }

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SERVER_URI + '/api/naccs/autogenStatus')
      .then(response => {
        const autogenStatus = response?.data?.result
        dispatch(naccsAutoGenStatusRequest(autogenStatus))
      })
      .catch(err => {
        if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, 'Failed retrieving Naccs auto generation status')
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, 'Failed retrieving Naccs auto generation status')
        else if (err.response.data.warning)
          dispatch(
            alertActions.warning(
              err.response.data.warning,
              'Failed retrieving Naccs auto generation status',
            ),
          )
        else dispatch(alertActions.error('Internal Server Error'))
      })
  })

  return (
    <>
      <div>
        {showModal && masterModal}
        <div className='header-title'>{t('NACCS_Auto_Declaration_label')}</div>
      </div>
      <Switch onChange={handleChange} checked={naccsAutoGenStatus} />
    </>
  )
}

export default connect(null, null)(NACCSAutoDecleration)
