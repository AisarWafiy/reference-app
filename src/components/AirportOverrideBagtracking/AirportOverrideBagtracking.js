import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useTranslation } from 'react-i18next'
import { EXCEPT_ALPHANUMERIC, EXCEPT_NUMBER, AA11 } from 'constants/regex'
import { overrideBagtrackingActions } from 'actions/overrideBagtracking.actions'
import Loader from 'react-loader-spinner'

function airportOverrideBagtracking(props) {
  const [loading, setLoading] = useState(false)
  const [bagNumber, setbagNumber] = useState('')
  const [binLocation, setbinLocation] = useState('')
  const [disable, setDisable] = useState(true)
  const [msg, setMsg] = useState('')
  const [msg1, setMsg1] = useState('')
  const [field, setField] = useState(false)
  const { t } = useTranslation()

  const onChangebinLocation = object => {
    const { value } = object.target
    setbinLocation(value.replace(EXCEPT_ALPHANUMERIC, ''))
  }

  const onChangebagNumber = object => {
    const { value } = object.target
    setbagNumber(value.replace(EXCEPT_NUMBER, ''))
  }
  useEffect(() => {
    if (
      bagNumber !== '' &&
      binLocation !== '' &&
      bagNumber.length === 12 &&
      AA11.test(binLocation)
    ) {
      setDisable(false)
    } else {
      setDisable(true)
    }
  }, [bagNumber, binLocation])
  const assign = () => {
    let data = {}
    data.bagNumber = bagNumber
    data.binLocation = binLocation

    props.bagtrackAirport(data)
    setField(true)
    setLoading(true)
  }
  useEffect(() => {
    if (bagNumber.length !== 12 && bagNumber !== '') {
      setMsg(t('Bag_Number_should_be_a_12_digit_number_label'))
    } else {
      setMsg('')
    }
  }, [bagNumber])
  useEffect(() => {
    if (props.bagtrackAirportStatus && props.bagtrackAirportStatus.result) {
      setLoading(false)
    } else if (props.bagtrackAirportStatus && !props.bagtrackAirportStatus.result) {
      setLoading(false)
    }
  }, [props.bagtrackAirportStatus])
  useEffect(() => {
    if (AA11.test(binLocation) === false && binLocation !== '') {
      setMsg1(t('Must_be_in_format_AA11_label'))
    } else {
      setMsg1('')
    }
  }, [binLocation])
  const cancel = () => {
    window.location.reload()
  }
  return (
    <div>
      {loading === true ? (
        <div style={{ textAlign: 'center' }} className='mt-5'>
          <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
        </div>
      ) : (
        <div className='container bg-white'>
          <div>
            <h1 className='mb-5 mt-5'>{t('Override_Bagtracking_Airport_label')}</h1>
          </div>
          <div>
            <Row>
              <Col xs='4'>
                <label className='form-label'>{t('Bag_Number_label')}</label>
                <span className='astrick'>*</span>
                <br />

                <input
                  name='bagNumber'
                  value={bagNumber}
                  type='text'
                  maxLength={12}
                  disabled={field}
                  onChange={onChangebagNumber}
                  placeholder={t('Bag_Number_label')}
                  className='form-control'
                ></input>
                {msg !== '' ? (
                  <span className='form-label' style={{ color: '#B13C27' }}>
                    {msg}
                  </span>
                ) : null}
              </Col>
              <Col xs='4'>
                <label className='form-label'>{t('AP_Bin_Location_label')}</label>
                <span className='astrick'>*</span>
                <br />
                <input
                  type='text'
                  name='binLocation'
                  value={binLocation}
                  maxLength={4}
                  disabled={field}
                  onChange={onChangebinLocation}
                  placeholder={t('AP_Bin_Location_label')}
                  className='form-control'
                ></input>
                {msg1 !== '' ? (
                  <span className='form-label' style={{ color: '#B13C27' }}>
                    {msg1}
                  </span>
                ) : null}
              </Col>
            </Row>
          </div>
          <div className='mt-5 row'>
            <div className='mt-5 col-8 text-right'>
              <button
                type='button'
                className='btn btn-primary mr-3'
                onClick={assign}
                disabled={disable || field}
              >
                {t('Assign_label')}
              </button>

              <button type='button' className=' btn btn-outline-secondary' onClick={cancel}>
                {t('Cancel_label')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
function mapState(state) {
  return {
    bagtrackAirportStatus: state.bagtrackAirport.getData,
  }
}

const actionCreators = {
  bagtrackAirport: overrideBagtrackingActions.bagtrackAirport,
}

export default connect(mapState, actionCreators)(airportOverrideBagtracking)
