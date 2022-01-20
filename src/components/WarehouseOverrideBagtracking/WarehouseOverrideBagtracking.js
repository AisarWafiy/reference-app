import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useFormik } from 'formik'
import Loader from 'react-loader-spinner'
import { EXCEPT_NUMBER } from 'constants/regex'
import { truckNumberActions } from 'actions/truckNumber.actions'
import { overrideBagtrackingActions } from 'actions/overrideBagtracking.actions'
import { Dropdown, DropdownSelectAll } from 'components/UI/Input'
let initialValues = {}

function warehouseOverrideBagtracking(props) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [bagNumber, setbagNumber] = useState('')
  const [truckNumber, settruckNumber] = useState('')
  const [truckNumber1, settruckNumber1] = useState('')
  const [disable, setDisable] = useState(true)
  const [field, setField] = useState(false)
  const [checked, setChecked] = useState(true)
  const [departed, setDeparted] = useState(false)
  const [drop, setDrop] = useState(null)
  const [msg, setMsg] = useState('')
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
  })
  const onChangetruckNumber = selectedOption => {
    settruckNumber(selectedOption.truckNumber)
    settruckNumber1(selectedOption)
    // for showing the email confirmation text
  }
  const onChangebagNumber = object => {
    const { value } = object.target

    setbagNumber(value.replace(EXCEPT_NUMBER, ''))
    // for showing the email confirmation text
  }
  useEffect(() => {
    if (bagNumber !== '' && bagNumber.length === 12 && truckNumber !== '' && checked === false) {
      setDisable(false)
    } else {
      setDisable(true)
    }
  }, [bagNumber, truckNumber, checked])
  useEffect(() => {
    if (bagNumber !== '' && bagNumber.length === 12 && truckNumber !== '' && checked === true) {
      let data = {}
      data.truckNumber = truckNumber
      data.bagNumber = bagNumber
      data.truckDeparted = departed
      props.bagtrackWarehouse(data)
      setLoading(true)
    }
  }, [bagNumber, truckNumber, checked])

  useEffect(() => {
    if (props.bagtrackWarehouseData && checked === true) {
      setbagNumber('')
    }
  }, [props.bagtrackWarehouseData])

  useEffect(() => {
    if (props.bagtrackWarehouseData && props.bagtrackWarehouseData.result) {
      setLoading(false)
    } else if (props.bagtrackWarehouseData && !props.bagtrackWarehouseData.result) {
      setLoading(false)
    }
  }, [props.bagtrackWarehouseData])
  useEffect(() => {
    props.getTruck()
  }, [props.getTruck])
  useEffect(() => {
    if (props.getTruckNumber) {
      setDrop(props.getTruckNumber.result)
    }
  }, [props.getTruckNumber])
  const assign = () => {
    let data = {}
    data.truckNumber = truckNumber
    data.bagNumber = bagNumber
    data.truckDeparted = departed
    props.bagtrackWarehouse(data)
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
            <h1 className='mb-5 mt-5'>{t('Warehouse_Override_Bagtracking_label')}</h1>
          </div>
          <div>
            <Row>
              <Col xs='3'>
                <label className='form-label'>{t('Truck_Number_label')}</label>
                <span className='astrick'>*</span>
                <br />
                <Dropdown
                  closeMenuOnSelect={true}
                  className='form-control mb-4 '
                  value={truckNumber1}
                  onChange={onChangetruckNumber}
                  placeholder={t('TEXT_SELECT_label')}
                  options={drop}
                  isDisabled={field}
                  optionLabel='truckNumber'
                  optionValue='truckNumber'
                />
              </Col>
              <Col xs='3'>
                <label className='form-label'>{t('Bag_Number_label')}</label>
                <span className='astrick'>*</span>
                <br />

                <input
                  name='bagNumber'
                  value={bagNumber}
                  disabled={field}
                  type='text'
                  maxLength={12}
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
              <Col xs='3'>
                <br />

                <div className='mt-4'>
                  <input
                    type='checkbox'
                    defaultChecked={departed}
                    disabled={field}
                    onChange={() => setDeparted(!departed)}
                  />
                  <label className='ml-2'>{t('Truck_Departed_label')}</label>
                </div>
              </Col>
              <Col xs='3'>
                <br />

                <div className='mt-4'>
                  <input
                    type='checkbox'
                    defaultChecked={checked}
                    disabled={field}
                    onChange={() => setChecked(!checked)}
                  />
                  <label className='ml-2'>{t('Scanning_label')}</label>
                </div>
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
    getTruckNumber: state.getTruckNumber.getData,
    bagtrackWarehouseData: state.bagtrackWarehouse.getData,
  }
}

const actionCreators = {
  getTruck: truckNumberActions.getTruckNumber,
  bagtrackWarehouse: overrideBagtrackingActions.bagtrackWarehouse,
}

export default connect(mapState, actionCreators)(warehouseOverrideBagtracking)
