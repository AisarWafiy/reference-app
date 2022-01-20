import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { truckNumberActions } from 'actions/truckNumber.actions'
import { assignSeaBinActions } from 'actions/assignSeaBin.actions'
import { EXCEPT_ALPHANUMERIC, AA11 } from 'constants/regex'
import { Dropdown } from 'components/UI/Input'
import { useTranslation } from 'react-i18next'
import Loader from 'react-loader-spinner'

function assignSeaBin(props) {
  const { t } = useTranslation()
  const [truckNumber, settruckNumber] = useState('')
  const [truckNumber1, settruckNumber1] = useState('')
  const [seaBin, setSeaBin] = useState('')
  const [disable, setDisable] = useState(true)
  const [msg1, setMsg1] = useState('')
  const [drop, setDrop] = useState(null)
  const [field, setField] = useState(false)
  const [loading, setLoading] = useState(false)
  const onChangeSeaBin = object => {
    const { value } = object.target

    setSeaBin(value.replace(EXCEPT_ALPHANUMERIC, ''))
    // for showing the email confirmation text
  }
  const onChangetruckNumber = selectedOption => {
    settruckNumber(selectedOption.value)
    settruckNumber1(selectedOption)

    // for showing the email confirmation text
  }
  useEffect(() => {
    if (truckNumber !== '' && seaBin !== '' && AA11.test(seaBin)) {
      setDisable(false)
    } else {
      setDisable(true)
    }
  }, [truckNumber, seaBin])
  useEffect(() => {
    props.getTruck()
  }, [props.getTruck])

  useEffect(() => {
    if (props.getTruckNumber) {
      const list = []

      props.getTruckNumber.result.forEach(function (element) {
        list.push({ key: element, value: element })
      })
      setDrop(list)
    }
  }, [props.getTruckNumber])
  const assign = () => {
    let data = {}
    data.truckNumber = truckNumber
    data.seaBin = seaBin

    props.assignSeaBin(data)
    setField(true)
    setLoading(true)
  }
  const cancel = () => {
    window.location.reload()
  }
  useEffect(() => {
    if (AA11.test(seaBin) === false && seaBin !== '') {
      setMsg1(t('Must_be_in_format_AA11_label'))
    } else {
      setMsg1('')
    }
  }, [seaBin])
  useEffect(() => {
    if (props.getStatus && props.getStatus.result) {
      setLoading(false)
    } else if (props.getStatus && !props.getStatus.result) {
      setLoading(false)
    }
  }, [props.getStatus])
  return (
    <div>
      {loading === true ? (
        <div style={{ textAlign: 'center' }} className='mt-5'>
          <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
        </div>
      ) : (
        <div className='container bg-white'>
          <div>
            <h1 className='mb-5 mt-5'>{t('Assign_Sea_Bin_label')}</h1>
          </div>
          <div>
            <Row>
              <Col xs='4'>
                <label className='form-label'>{t('Truck_Number_label')}</label>
                <span className='astrick'>*</span>
                <br />
                <Dropdown
                  placeholder={t('TEXT_SELECT_label')}
                  closeMenuOnSelect={true}
                  className='form-control mb-4 '
                  value={truckNumber1}
                  isDisabled={field}
                  onChange={onChangetruckNumber}
                  options={drop}
                  optionLabel='value'
                  optionValue='value'
                />
              </Col>
              <Col xs='4'>
                <label className='form-label'>{t('Sea_Bin_label')}</label>
                <span className='astrick'>*</span>
                <br />
                <input
                  type='text'
                  name='seaBin'
                  value={seaBin}
                  disabled={field}
                  maxLength={4}
                  onChange={onChangeSeaBin}
                  placeholder={t('Sea_Bin_label')}
                  className='form-control'
                ></input>{' '}
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
    getTruckNumber: state.getSeaBinTruck.getData,
    getStatus: state.assignSeaBin.getData,
  }
}

const actionCreators = {
  getTruck: truckNumberActions.getSeaBinTruck,
  assignSeaBin: assignSeaBinActions.assignSeaBin,
}

export default connect(mapState, actionCreators)(assignSeaBin)
