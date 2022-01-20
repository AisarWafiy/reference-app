import React, { useEffect, useState } from 'react'
import DateRangePicker from 'react-bootstrap-daterangepicker'
import 'bootstrap-daterangepicker/daterangepicker.css'
import { MdDateRange } from 'react-icons/md'
import { calcDate } from 'constants/dateTime'
import { Dropdown } from 'components/UI/Input'
import { useTranslation } from 'react-i18next'
import DatePicker from 'react-datepicker'
import { carrierActions } from 'actions/carrier.actions'
import '../../assets/styles/CreateCarrier.css'
import { connect } from 'react-redux'
import Loader from 'react-loader-spinner'
import Moment from 'moment'
import { maintainReferenceDataActions } from '../../actions/maintainReferenceData.actions'
import { EXCEPT_NUMBER } from 'constants/regex'
import 'react-datepicker/dist/react-datepicker.css'
import { FaPlus } from 'react-icons/fa'
import { FaTrashAlt } from 'react-icons/fa'

const transportTypeOptions = ['Vessel', 'Flight']
const carrierFlagOptions = ['Arrival', 'Departure']
const travelTypeOptions = ['Domestic', 'International']

function CreateCarrier(props) {
  const [formValues, setFormValues] = useState([
    { hours: '', mins: '', startDate: '', endDate: '' },
  ])
  const { postNewcarrier } = props
  const [loading, setLoading] = useState(false)
  const [departureDate, setDepartureDate] = useState('')
  const [carrierType, setCarrierType] = useState('')
  const [carrierFlag, setCarrierFlag] = useState('Departure')
  const [air, setAir] = useState('')
  const [pick, setPick] = useState('')
  const [code, setCode] = useState('')
  const { t } = useTranslation()
  const [carrierCode, setCarrierCode] = useState('')
  const [carrierCode1, setCarrierCode1] = useState('')

  const [travelType, setTravelType] = useState('')
  const [carrierNumber, setCarrierNumber] = useState('')
  const [vesselDescription, setVesselDescription] = useState('')
  const [originAirport, setOriginAirport] = useState('')
  const [destinationAirport, setDestinationAirport] = useState('')
  const [originAirport1, setOriginAirport1] = useState('')
  const [destinationAirport1, setDestinationAirport1] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [pickupLocation1, setPickupLocation1] = useState('')
  const [cutOffHours, setCutOffHours] = useState('')
  const [cutOffMin, setCutOffMin] = useState('')
  const [departureHours, setDepartureHours] = useState('')
  const [departureMin, setDepartureMin] = useState('')
  const [depStart, setDepStart] = useState('')
  const [disable, setDisable] = useState(true)
  const [depEnd, setDepEnd] = useState('')
  const [isRight, setIsRight] = useState(true)
  const [isRight3, setIsRight3] = useState(true)
  const [isRight1, setIsRight1] = useState(true)
  const [isRight2, setIsRight2] = useState(true)

  const [carError, setCarError] = useState('')
  const [save, setSave] = useState(false)
  const [oAError, setoAError] = useState('')
  const [daError, setDaError] = useState('')

  const [descError, setDescError] = useState('')
  useEffect(() => {
    props.takeRef()
  }, [props.takeRef])

  useEffect(() => {
    if (carrierType === 'Vessel' && code.length > 0) {
      let init = code.filter(code => code.refValue === 'SP')
      if (init.length !== 0) {
        setCarrierCode1(init)
        setCarrierCode(init[0].refValue)
      }
    }
  }, [carrierType])

  let handleChange = (i, e) => {
    let newFormValues = [...formValues]
    let a = e.target.value
    if (a !== '' && a > 23) {
      a = ''
    }
    if (a === '') {
      setIsRight1(true)
    } else {
      setIsRight1(false)
    }
    newFormValues[i][e.target.name] = a
    setFormValues(newFormValues)
  }
  let handleChange1 = (i, e) => {
    let newFormValues = [...formValues]
    let a = e.target.value
    if (a !== '' && a > 59) {
      a = ''
    }
    if (a === '') {
      setIsRight2(true)
    } else {
      setIsRight2(false)
    }

    newFormValues[i][e.target.name] = a
    setFormValues(newFormValues)
  }

  let handleChange2 = (i, dates) => {
    let newFormValues = [...formValues]
    const [start, end] = dates
    if (start !== null && end === null) {
      newFormValues[i].dateError = t('Please_enter_Date_Range_label')
      setIsRight3(true)
    } else {
      newFormValues[i].dateError = ''
      setIsRight3(false)
    }
    newFormValues[i].startDate = start
    newFormValues[i].endDate = end
    setFormValues(newFormValues)
  }
  useEffect(() => {
    if (isRight1 || isRight2 || isRight3) {
      setIsRight(true)
    } else {
      setIsRight(false)
    }
  }, [isRight1, isRight2, isRight3])

  let addFormFields = () => {
    setFormValues([...formValues, { hours: '', mins: '', startDate: '', endDate: '' }])
    setIsRight(true)
  }
  let removeFormFields = i => {
    let newFormValues = [...formValues]
    newFormValues.splice(i, 1)
    setFormValues(newFormValues)
    if (formValues.length === i + 1) {
      setIsRight(false)
    }
  }
  let handleSubmit = event => {
    event.preventDefault()
  }

  useEffect(() => {
    if (cutOffHours !== '' && cutOffHours > 23) {
      setCutOffHours('')
    }
    if (cutOffMin !== '' && cutOffMin > 59) {
      setCutOffMin('')
    }
  }, [cutOffMin, cutOffHours])

  const onChangeCarrierType = object => {
    const { value } = object.target

    setCarrierType(value)
  }
  const onChangeCarrierFlag = object => {
    const { value } = object.target

    setCarrierFlag(value)
  }

  const onChangeTravelType = object => {
    const { value } = object.target

    setTravelType(value)
  }

  const onChangeCarrierCode = selectedOption => {
    setCarrierCode(selectedOption.refValue)
    setCarrierCode1(selectedOption)
  }

  const onChangeCarrierNumber = object => {
    const { value } = object.target

    setCarrierNumber(value.replace(EXCEPT_NUMBER, '').substring(0, 5))
  }

  const onChangeVesselDecription = object => {
    const { value } = object.target

    setVesselDescription(value.replace(/[^a-zA-Z0-9 ]/g, ''))
  }

  const onChangeOriginAirport = selectedOption => {
    setOriginAirport(selectedOption.refValue)
    setOriginAirport1(selectedOption)
  }
  const onChangeDestinationAirport = selectedOption => {
    setDestinationAirport(selectedOption.refValue)
    setDestinationAirport1(selectedOption)
  }
  const onChangePickupLocation = selectedOption => {
    setPickupLocation(selectedOption.refValue)
    setPickupLocation1(selectedOption)
  }

  const onChangeCutOffHours = object => {
    const { value } = object.target

    setCutOffHours(value)
  }
  const onChangeCutOffMin = object => {
    const { value } = object.target

    setCutOffMin(value)
  }

  const onSave = () => {
    let data = {}

    data.carrierType = carrierType
    data.carrierFlag = carrierFlag
    data.travelType = travelType
    let b = props.getRefdata && props.getRefdata.result
    let c = b.filter(b => b.refValue === originAirport)
    let q = b.filter(b => b.refValue === carrierCode)
    data.carrierRefMaster = 'Airline Code'
    data.carrierRefCode = q[0].refCode
    data.carrierNumber = carrierNumber
    data.vesselName = vesselDescription
    data.originAirportRefMaster = 'Airport'

    data.originAirportRefCode = c[0].refCode
    let d = b.filter(b => b.refValue === destinationAirport)
    data.destAirportRefMaster = 'Airport'
    data.destAirportRefCode = d[0].refCode
    data.pickupLocationRefMaster = 'Pick up Location'
    let w = b.filter(b => b.refValue === pickupLocation)
    data.pickupLocationRefCode = w[0].refCode

    data.sellingCutoffTm =
      String(cutOffHours).padStart(2, '0') + ':' + String(cutOffMin).padStart(2, '0')

    let dateTime = formValues.map(item => {
      let a = {
        departureFromTm:
          Moment(item.startDate).format('YYYY-MM-DD') +
          ' ' +
          String(item.hours).padStart(2, '0') +
          ':' +
          String(item.mins).padStart(2, '0'),
        departureToTm:
          Moment(item.endDate).format('YYYY-MM-DD') +
          ' ' +
          String(item.hours).padStart(2, '0') +
          ':' +
          String(item.mins).padStart(2, '0'),
      }
      return a
    })
    data.scheduleTimes = dateTime

    postNewcarrier(data)
    setSave(true)
    setLoading(true)
  }

  const onCancel = () => {
    window.location.reload()
  }

  useEffect(() => {
    if (
      carrierType === '' ||
      carrierFlag === '' ||
      carrierCode === '' ||
      travelType === '' ||
      carrierNumber === '' ||
      originAirport === '' ||
      destinationAirport === '' ||
      pickupLocation === '' ||
      cutOffHours === '' ||
      cutOffMin === '' ||
      descError !== '' ||
      oAError !== '' ||
      daError !== '' ||
      carError !== ''
    ) {
      setDisable(true)
    } else {
      setDisable(false)
    }
  }, [
    carrierType,
    carrierFlag,
    carrierCode,
    travelType,
    carrierNumber,
    vesselDescription,
    originAirport,
    destinationAirport,
    pickupLocation,
    cutOffHours,
    cutOffMin,

    descError,
    oAError,

    daError,
    carError,
  ])
  useEffect(() => {
    if (originAirport !== '' && destinationAirport !== '' && originAirport === destinationAirport) {
      setoAError('*' + t('Origin_and_Destination_cannot_be_same_label'))
    } else {
      setoAError('')
    }
  }, [originAirport, destinationAirport])

  useEffect(() => {
    if (carrierType === 'Vessel' && vesselDescription === '') {
      setDescError('*' + t('Vessel_Description_cannot_be_empty_label'))
    } else {
      setDescError('')
    }
  }, [carrierType, vesselDescription])

  useEffect(() => {
    if ((carrierNumber && carrierNumber.length < 3) || carrierNumber > 99999) {
      setCarError('*' + t('Carrier_Number_should_be_between_3_to_5_digit_number_label'))
    } else {
      setCarError('')
    }
  }, [carrierNumber])
  useEffect(() => {
    if (props.getRefdata) {
      let a = props.getRefdata.result.map(val => {
        return val
      })
      setAir(a.filter(a => a.refMaster === 'Airport'))
      setCode(a.filter(a => a.refMaster === 'Airline Code'))
      setPick(a.filter(a => a.refMaster === 'Pick up Location'))
    }
  }, [props.getRefdata])
  useEffect(() => {
    if (props.postCarrierSuccess && props.postCarrierSuccess.result) {
      setLoading(false)
    } else if (props.postCarrierSuccess && !props.postCarrierSuccess.result) {
      setLoading(false)
      setSave(false)
    }
  }, [props.postCarrierSuccess])
  const formatDate = (dateOne, dateTwo) => {
    if (dateOne && dateTwo) {
      const strOne = Moment(dateOne).format('YYYY-MM-DD')

      const strTwo = Moment(dateTwo).format('YYYY-MM-DD')

      return strOne + ' - ' + strTwo
    }
    return null
  }
  return (
    <div>
      {loading === true ? (
        <div style={{ textAlign: 'center' }} className='mt-5'>
          <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
        </div>
      ) : (
        <div className='container '>
          <div className='row'>
            <div className='col-sm'>
              <h1 className='mb-2 mt-5 main-heading'>{t('Create_Carrier_label')}</h1>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm'>
              <h2 className='mb-3 mt-3 heading'>1. {t('Carrier_Details_label')}</h2>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-8 box1'>
              <div className='row'>
                <div className='col-sm-6'>
                  <div className='form-group'>
                    <label htmlFor='carrierType'>
                      {t('Transport_Type_label')}
                      <span className='astrick'>*</span>
                    </label>

                    <select
                      className='form-control '
                      value={carrierType}
                      disabled={save}
                      onChange={onChangeCarrierType}
                      name='carrierType'
                    >
                      <option value=''>{t('TEXT_SELECT_label')}</option>
                      {transportTypeOptions.map((val, key) => {
                        return (
                          <option key={key} value={val}>
                            {val}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </div>
                <div className='col-sm-6'>
                  <div className='form-group'>
                    <label htmlFor='carrierFlag'>
                      {t('Arrival/Departure_label')}
                      <span className='astrick'>*</span>
                    </label>
                    <select
                      className='form-control '
                      value={carrierFlag}
                      disabled={save}
                      onChange={onChangeCarrierFlag}
                      name='carrierFlag'
                    >
                      <option value=''>{t('TEXT_SELECT_label')}</option>
                      {carrierFlagOptions.map((val, key) => {
                        return (
                          <option key={key} value={val}>
                            {val}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </div>
              </div>

              <div className='row'>
                <div className='col-sm-6'>
                  <div className='form-group'>
                    <label htmlFor='travelType'>
                      {t('Domestic/International_label')}
                      <span className='astrick'>*</span>
                    </label>
                    <select
                      className='form-control '
                      value={travelType}
                      onChange={onChangeTravelType}
                      disabled={save}
                      name='travelType'
                    >
                      <option value=''>{t('TEXT_SELECT_label')}</option>
                      {travelTypeOptions.map((val, key) => {
                        return (
                          <option key={key} value={val}>
                            {val}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </div>
              </div>

              <div className='row'>
                <div className='col-sm-6'>
                  <div className='form-group'>
                    <label htmlFor='carrierCode'>
                      {t('Code_label')}
                      <span className='astrick'>*</span>
                    </label>
                    <Dropdown
                      closeMenuOnSelect={true}
                      className='form-control mb-4 '
                      placeholder={t('TEXT_SELECT_label')}
                      value={carrierCode1}
                      isDisabled={save}
                      onChange={onChangeCarrierCode}
                      options={code}
                      optionLabel='refValue'
                      optionValue='refValue'
                    />
                  </div>
                </div>
                <div className='col-sm-6'>
                  <div className='form-group'>
                    <label htmlFor='carrierNumber'>
                      {t('Number_label')}
                      <span className='astrick'>*</span>
                    </label>{' '}
                    <br />
                    {carError !== '' ? (
                      <span className='form-label' style={{ color: '#B13C27' }}>
                        {carError}
                      </span>
                    ) : null}
                    <input
                      type='text'
                      placeholder={t('Number_label')}
                      disabled={save}
                      className='form-control'
                      id='carrierNumber'
                      name='carrierNumber'
                      value={carrierNumber}
                      onChange={onChangeCarrierNumber}
                    />
                  </div>
                </div>
              </div>

              <div className='row'>
                <div className='col-sm-12'>
                  <div className='form-group'>
                    <label htmlFor='vesselDescription'>{t('Vessel_Description_label')}</label>
                    {descError !== '' ? (
                      <span className='form-label' style={{ color: '#B13C27' }}>
                        {descError}
                      </span>
                    ) : null}
                    <input
                      type='text'
                      placeholder={t('Vessel_Description_label')}
                      className='form-control'
                      id='vesselDescription'
                      disabled={save}
                      maxLength={50}
                      name='vesselDescription'
                      value={vesselDescription}
                      onChange={onChangeVesselDecription}
                    />
                  </div>
                </div>
              </div>
              <div className='row'>
                {' '}
                <div className='col-sm-2'>
                  {' '}
                  <label htmlFor='hours'>
                    {t('Hours_label')} <span className='astrick'>*</span>
                  </label>
                </div>{' '}
                <div className='col-sm-2'>
                  {' '}
                  <label htmlFor='minutes'>
                    {t('Minutes_label')} <span className='astrick'>*</span>
                  </label>
                </div>{' '}
                <div className='col-sm-2'>
                  <label htmlFor='date'>
                    {t('Date_label')}
                    <span className='astrick'>*</span>
                  </label>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                {formValues.map((element, index) => (
                  <div className='row' key={index}>
                    <div className='col-sm-2'>
                      <div className='form-group'>
                        <input
                          type='number'
                          name='hours'
                          className='form-control'
                          placeholder='HH'
                          disabled={
                            formValues.length > 0 && index < formValues.length - 1 ? true : save
                          }
                          min={0}
                          max={23}
                          value={element.hours || ''}
                          onChange={e => handleChange(index, e)}
                        />
                      </div>
                    </div>
                    <div className='col-sm-2'>
                      <div className='form-group'>
                        <input
                          type='number'
                          className='form-control'
                          placeholder='MM'
                          disabled={
                            formValues.length > 0 && index < formValues.length - 1 ? true : save
                          }
                          name='mins'
                          min={0}
                          max={59}
                          value={element.mins || ''}
                          onChange={e => handleChange1(index, e)}
                        />
                      </div>
                    </div>
                    <div className='col-sm-4'>
                      <div className='form-group'>
                        <DatePicker
                          id='startDate'
                          name='startDate'
                          className='form-control'
                          minDate={calcDate()}
                          autoComplete='off'
                          placeholderText={t('TEXT_DATE_FORMAT_label')}
                          selected={element.startDate}
                          onChange={e => handleChange2(index, e)}
                          dateFormat='yyyy-MM-dd'
                          selectsRange
                          startDate={element.startDate}
                          endDate={element.endDate}
                          shouldCloseOnSelect={false}
                          value={formatDate(element.startDate, element.endDate)}
                          // minDate={new Date()}
                          // onSelect={handleDate} //when day is clicked
                          disabledKeyboardNavigation
                          disabled={
                            formValues.length > 0 && index < formValues.length - 1 ? true : save
                          }
                        />
                        {element.dateError !== '' ? (
                          <span className='form-label' style={{ color: '#B13C27' }}>
                            {element.dateError}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    {formValues.length - 1 === index && (
                      <div className='col-sm-1 '>
                        <button
                          className='btn'
                          type='button'
                          disabled={index > 9 || isRight || save}
                          onClick={() => addFormFields()}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    )}
                    {index || formValues.length > 1 ? (
                      <div className='col-sm-2 '>
                        <button
                          type='button'
                          className='btn '
                          onClick={() => removeFormFields(index)}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </form>
              {/* <div className='row'>
                <div className='col-sm-2'>
                  <div className='form-group'>
                    <label htmlFor='hours'>
                      {t('Hours_label')} <span className='astrick'>*</span>
                    </label>{' '}
                    <br />
                    <input
                      value={departureHours}
                      name='departureHours'
                      type='number'
                      disabled={save}
                      className='form-control'
                      id='hours'
                      placeholder='HH'
                      min={0}
                      max={24}
                      onChange={onChangeDepartureHours}
                    />
                  </div>
                </div>
                <div className='col-sm-2'>
                  <div className='form-group'>
                    <label htmlFor='hours'>
                      {t('Minutes_label')} <span className='astrick'>*</span>
                    </label>{' '}
                    <br />
                    <input
                      value={departureMin}
                      name='departurMin'
                      type='number'
                      disabled={save}
                      className='form-control'
                      id='hours'
                      placeholder='MM'
                      min={0}
                      max={59}
                      onChange={onChangeDepartureMin}
                    />
                  </div>
                </div>

                <div className='col-sm-6'>
                  <div className='form-group'>
                    <label htmlFor='date'>
                      {t('Date_label')}
                      <span className='astrick'>*</span>
                    </label>{' '}
                    {daError !== '' ? (
                      <span className='form-label' style={{ color: '#B13C27' }}>
                        {daError}
                      </span>
                    ) : null}
                    <DateRangePicker
                      //   ref={this.calenderRef}
                      initialSettings={{ 'drops': 'up', 'showDropdowns': true }}
                      style={{ width: '100%' }}
                      onEvent={handleEvent}
                      onCallback={handleCallback}
                      disabled={save}
                    >
                      <div className='input-group'>
                        <input
                          type='text'
                          className='form-control'
                          value={departureDate}
                          placeholder='YYYY-MM-DD - YYYY-MM-DD'
                          disabled
                        />
                        <div className='input-group-append'>
                          <div
                            className='input-group-text'
                            style={{
                              borderRadius: '0.25rem',
                              backgroundColor: '#ffffff',
                              border: '1px solid #C3E1FF',
                            }}
                          >
                            <MdDateRange color={'black'} />
                          </div>
                        </div>
                      </div>
                    </DateRangePicker>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          <div className='row'>
            <div className='col-sm'>
              <h2 className='mb-3 mt-5 heading'>2. {t('Origin_and_Destination_label')}</h2>
            </div>
          </div>

          <div className='row'>
            <div className='col-sm-8 box1'>
              <div className='row'>
                <div className='col-sm-6'>
                  <div className='form-group'>
                    <label htmlFor='originAirport'>
                      {t('Origin_label')} <span className='astrick'>*</span>
                    </label>{' '}
                    {oAError !== '' ? (
                      <span className='form-label' style={{ color: '#B13C27' }}>
                        {oAError}
                      </span>
                    ) : null}
                    <Dropdown
                      closeMenuOnSelect={true}
                      className='form-control mb-4 '
                      value={originAirport1}
                      placeholder={t('TEXT_SELECT_label')}
                      isDisabled={save}
                      onChange={onChangeOriginAirport}
                      options={air}
                      optionLabel='refValue'
                      optionValue='refValue'
                    />
                  </div>
                </div>
                <div className='col-sm-6'>
                  <div className='form-group'>
                    <label htmlFor='destinationAirport'>
                      {t('Destination_label')} <span className='astrick'>*</span>
                    </label>{' '}
                    {oAError !== '' ? (
                      <span className='form-label' style={{ color: '#B13C27' }}>
                        {oAError}
                      </span>
                    ) : null}
                    <Dropdown
                      closeMenuOnSelect={true}
                      className='form-control mb-4 '
                      value={destinationAirport1}
                      placeholder={t('TEXT_SELECT_label')}
                      isDisabled={save}
                      onChange={onChangeDestinationAirport}
                      options={air}
                      optionLabel='refValue'
                      optionValue='refValue'
                    />
                  </div>
                </div>
              </div>

              <div className='row'>
                <div className='col-sm-6'>
                  <div className='form-group'>
                    <label htmlFor='pickupLocation'>
                      {t('Pickup_Location_label')}
                      <span className='astrick'>*</span>
                    </label>
                    <Dropdown
                      closeMenuOnSelect={true}
                      className='form-control mb-4 '
                      value={pickupLocation1}
                      isDisabled={save}
                      placeholder={t('TEXT_SELECT_label')}
                      onChange={onChangePickupLocation}
                      options={pick}
                      optionLabel='refValue'
                      optionValue='refValue'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-sm'>
              <h2 className='mb-4 mt-5 heading'>3. {t('Selling_Cut-Off_Time_label')}</h2>
            </div>
          </div>

          <div className='row'>
            <div className='col-sm-8 box1'>
              <div className='row'>
                <div className='col-sm-2'>
                  <div className='form-group'>
                    <label htmlFor='hours'>
                      {t('Hours_label')} <span className='astrick'>*</span>
                    </label>
                    <input
                      value={cutOffHours}
                      name='cutOffHours'
                      type='number'
                      disabled={save}
                      className='form-control'
                      id='hours'
                      placeholder='HH'
                      onChange={onChangeCutOffHours}
                      min={0}
                      max={23}
                    />
                  </div>
                </div>
                <div className='col-sm-2'>
                  <div className='form-group'>
                    <label htmlFor='hours'>
                      {t('Minutes_label')} <span className='astrick'>*</span>
                    </label>
                    <input
                      value={cutOffMin}
                      name='cutOffMin'
                      disabled={save}
                      type='number'
                      className='form-control'
                      id='hours'
                      placeholder='MM'
                      onChange={onChangeCutOffMin}
                      min={0}
                      max={59}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-sm-4'></div>
            <div className='col-sm-4 mt-5 mb-4'>
              <button
                type='submit'
                onClick={onSave}
                className='btn btn-primary mr-3'
                disabled={disable || save || isRight}
              >
                {t('Save_label')}
              </button>

              <button type='button' onClick={onCancel} className=' btn btn-outline-secondary'>
                {t('Cancel_label')}
              </button>
            </div>
            <div className='col-sm-4'></div>
          </div>
        </div>
      )}
    </div>
  )
}

function mapState(state) {
  return {
    getRefdata: state.getRefAll.getData,
    postCarrierSuccess: state.postCarrier.getData,
  }
}

const actionCreators = {
  takeRef: maintainReferenceDataActions.getRefAll,
  postNewcarrier: carrierActions.postCarrier,
}

export default connect(mapState, actionCreators)(CreateCarrier)
