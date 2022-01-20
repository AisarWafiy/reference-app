import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import Loader from 'react-loader-spinner'
import * as labels from 'constants/labels'
import * as regex from 'constants/regex'
import { locTypeOptions } from 'constants/types'

import { Dropdown } from 'components/UI/Input'

import { setInputOptions } from 'actions/action-bin-location'
import { alertActions } from 'actions/alert.actions'

const CreateBinLocation = props => {
  const {
    setInputOptions,
    storedPickupLocations,
    showAlertSuccess,
    showAlertError,
    showAlertWarn,
  } = props
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SERVER_URI + '/api/refdata/all')
      .then(response => {
        setInputOptions({
          pickupLocations: response.data.result.filter(res => res.refMaster === 'Pick up Location'),
        })
      })
      .catch(err => {
        if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, 'fetching pickup locations')
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, 'fetching pickup locations')
        else if (err.response.data.warning)
          showAlertWarn(err.response.data.warning, 'fetching pickup locations')
        else showAlertError('Internal Server Error')
      })
  }, [])

  const formik = useFormik({
    initialValues: {
      locationType: locTypeOptions[0],
      whBinLoc: '',
      apBinLoc: '',
      cartonCap: '',
      cageCap: '',
      whRemarks: '',
      apRemarks: '',
      holdingLoc: false,
      pickupLocation: null,
    },
    validationSchema: Yup.object({
      whBinLoc: Yup.string().when('locationType', {
        is: locationType => locationType === locTypeOptions[0],
        then: Yup.string()
          .matches(regex.A11A1, t('Must_Be_In_The_Format_A23L3_Validation_Msg_label'))
          .min(5, t('Must_Be_5_Characters_Validation_Msg_label'))
          .max(5, t('Must_Be_5_Characters_Validation_Msg_label'))
          .required(t('Must_Be_In_The_Format_A23L3_Validation_Msg_label')),
      }),
      apBinLoc: Yup.string().when('locationType', {
        is: locationType => locationType === locTypeOptions[1],
        then: Yup.string()
          .matches(regex.AA11, t('Must_Be_In_The_Format_AL93_Validation_Msg_label'))
          .min(4, t('Must_Be_4_Characters_Validation_Msg_label'))
          .max(4, t('Must_Be_4_Characters_Validation_Msg_label'))
          .required(t('Must_Be_In_The_Format_AL93_Validation_Msg_label')),
      }),
      cartonCap: Yup.string().when('locationType', {
        is: locationType => locationType === locTypeOptions[0],
        then: Yup.string().required(t('Please_Enter_A_Numeric_Value_Validation_Msg_label')),
      }),
      cageCap: Yup.string().when('locationType', {
        is: locationType => locationType === locTypeOptions[1],
        then: Yup.string().required(t('Please_Enter_A_Numeric_Value_Validation_Msg_label')),
      }),
      pickupLocation: Yup.object()
        .nullable()
        .when('locationType', {
          is: locationType => locationType === locTypeOptions[1],
          then: Yup.object().shape({
            refValue: Yup.string().required(t('Pick_Atleast_1_location_Validation_Msg_label')),
          }),
        }),
      whRemarks: Yup.string().when('locationType', {
        is: locationType => locationType === locTypeOptions[0],
        then: Yup.string().max(25, t('Cannot_Exceed_25_Characters_Validation_Msg_label')),
      }),
      apRemarks: Yup.string().when('locationType', {
        is: locationType => locationType === locTypeOptions[1],
        then: Yup.string().max(25, t('Cannot_Exceed_25_Characters_Validation_Msg_label')),
      }),
      holdingLoc: Yup.bool(),
    }),
    onSubmit: values => {
      let postData

      if (values.locationType === locTypeOptions[0]) {
        postData = {
          locationType: values.locationType,
          binLocation: values.whBinLoc,
          cartonCapacity: values.cartonCap,
          remarks: values.whRemarks,
        }
      } else if (values.locationType === locTypeOptions[1]) {
        postData = {
          locationType: values.locationType,
          // locationType: 'Airport',
          binLocation: values.apBinLoc,
          cartonCapacity: values.cageCap,
          pickupLocation: values.pickupLocation.refValue,
          holdingLocation: values.holdingLoc,
          remarks: values.apRemarks,
        }
      }

      setLoading(true)

      axios
        .post(process.env.REACT_APP_SERVER_URI + '/api/binLocation/save', postData)
        .then(response => {
          showAlertSuccess(response.data.message, 'save')
          setLoading(false)
        })
        .catch(err => {
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'save')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'save')
          else if (err.response.data.warning) showAlertWarn(err.response.data.warning, 'save')
          else showAlertError('Internal Server Error')
          setLoading(false)
        })
    },
  })

  const handleText = (event, maxChar) => {
    formik.setFieldValue(
      event.target.name,
      event.target.value.replace(regex.EXCEPT_ALPHANUMERIC, '').substring(0, maxChar),
    )

    formik.setSubmitting(false)
  }

  const handleNo = event => {
    const maxLength = 4

    formik.setFieldValue(
      event.target.name,
      event.target.value.replace(regex.EXCEPT_NUMBER, '').substring(0, maxLength),
    )
    formik.setSubmitting(false)
  }

  const handleSelect = selectedOption => {
    formik.setFieldValue('pickupLocation', selectedOption)
    formik.setSubmitting(false)
  }

  const handleCheck = event => {
    formik.setFieldValue(event.target.name, event.target.checked)
    formik.setSubmitting(false)
  }

  const handleCancel = () => {
    if (formik.values.locationType === locTypeOptions[0]) {
      formik.resetForm()
      formik.setFieldValue('whBinLoc', '', false)
      formik.setFieldValue('cartonCap', '', false)
      formik.setFieldValue('whRemarks', '', false)
      formik.setFieldValue('locationType', locTypeOptions[0])
    } else if (formik.values.locationType === locTypeOptions[1]) {
      formik.resetForm()
      formik.setFieldValue('apBinLoc', '', false)
      formik.setFieldValue('cageCap', '', false)
      formik.setFieldValue('apRemarks', '', false)
      formik.setFieldValue('holdingLoc', false, false)
      formik.setFieldValue('pickupLocation', null, false)
      formik.setFieldValue('locationType', locTypeOptions[1])
    }
    // formik.resetForm()
    formik.setSubmitting(false)
  }

  let showForms = (
    <React.Fragment>
      <div className='mb-3 row'>
        <div className='col-4'>
          <label className='form-label'>
            {t('TEXT_BIN_LOCATION_label')}
            <span className='text-danger'> *</span>
          </label>
          <input
            id='whBinLoc'
            name='whBinLoc'
            type='text'
            placeholder={labels.TEXT_BIN_LOCATION}
            onChange={e => handleText(e, 5)}
            onBlur={formik.handleBlur}
            value={formik.values.whBinLoc}
            className='form-control'
            disabled={formik.isSubmitting}
          />
          {formik.touched.whBinLoc && formik.errors.whBinLoc ? (
            <span className='h5 text-danger'>{formik.errors.whBinLoc}</span>
          ) : null}
        </div>
        <div className='col-4'>
          <label className='form-label'>
            {t('Carton_Capacity_label')}
            <span className='text-danger'> *</span>
          </label>
          <input
            id='cartonCap'
            name='cartonCap'
            type='text'
            placeholder={t('TEXT_CARTON_CAPACITY_label')}
            onChange={handleNo}
            onBlur={formik.handleBlur}
            value={formik.values.cartonCap}
            className='form-control'
            disabled={formik.isSubmitting}
          />
          {formik.touched.cartonCap && formik.errors.cartonCap ? (
            <span className='h5 text-danger'>{formik.errors.cartonCap}</span>
          ) : null}
        </div>
      </div>
      <div className='mb-3 row'>
        <div className='col-8'>
          <label className='form-label'>{t('Remarks_label')}</label>
          <input
            id='whRemarks'
            name='whRemarks'
            type='text'
            placeholder={t('TEXT_ADD_REMARKS_label')}
            onChange={e => handleText(e, 25)}
            onBlur={formik.handleBlur}
            value={formik.values.whRemarks}
            className='form-control'
            disabled={formik.isSubmitting}
          />
          {formik.touched.whRemarks && formik.errors.whRemarks ? (
            <span className='h5 text-danger'>{formik.errors.whRemarks}</span>
          ) : null}
        </div>
      </div>
    </React.Fragment>
  )

  if (formik.values.locationType === locTypeOptions[1]) {
    showForms = (
      <React.Fragment>
        <div className='mb-3 row'>
          <div className='col-4'>
            <label className='form-label'>
              {t('TEXT_BIN_LOCATION_label')}
              <span className='text-danger'> *</span>
            </label>
            <input
              id='apBinLoc'
              name='apBinLoc'
              type='text'
              placeholder={t('TEXT_BIN_LOCATION_label')}
              onChange={e => handleText(e, 4)}
              onBlur={formik.handleBlur}
              value={formik.values.apBinLoc}
              className='form-control'
              disabled={formik.isSubmitting}
            />
            {formik.touched.apBinLoc && formik.errors.apBinLoc ? (
              <span className='h5 text-danger'>{formik.errors.apBinLoc}</span>
            ) : null}
          </div>
          <div className='col-4'>
            <label className='form-label'>
              {t('Cage_Capacity_label')}
              <span className='text-danger'> *</span>
            </label>
            <input
              id='cageCap'
              name='cageCap'
              type='text'
              placeholder={t('TEXT_CAGE_CAPACITY_label')}
              onChange={handleNo}
              onBlur={formik.handleBlur}
              value={formik.values.cageCap}
              className='form-control'
              disabled={formik.isSubmitting}
            />
            {formik.touched.cageCap && formik.errors.cageCap ? (
              <span className='h5 text-danger'>{formik.errors.cageCap}</span>
            ) : null}
          </div>
        </div>
        <div className='mb-3 row'>
          <div className='col-4'>
            <label className='form-label'>
              {t('Pickup_Location_label')} <span className='text-danger'> *</span>
            </label>
            <Dropdown
              id='pickupLocation'
              name='pickupLocation'
              closeMenuOnSelect={true}
              value={formik.values.pickupLocation}
              isClearable
              onChange={handleSelect}
              onBlur={formik.handleBlur}
              options={storedPickupLocations}
              optionLabel='refValue'
              optionValue='refCode'
              placeholder={t('TEXT_PICKUP_LOCATION_label')}
              isDisabled={formik.isSubmitting}
            />
            {formik.touched.pickupLocation && formik.errors.pickupLocation ? (
              <span className='h5 text-danger'>{formik.errors.pickupLocation}</span>
            ) : null}
          </div>
        </div>

        <div className='mb-3 row'>
          <div className='col-8'>
            <label className='form-label'>{t('Remarks_label')}</label>
            <input
              id='apRemarks'
              name='apRemarks'
              type='text'
              placeholder={t('TEXT_ADD_REMARKS_label')}
              onChange={e => handleText(e, 25)}
              onBlur={formik.handleBlur}
              value={formik.values.apRemarks}
              className='form-control'
              disabled={formik.isSubmitting}
            />
            {formik.touched.apRemarks && formik.errors.apRemarks ? (
              <span className='h5 text-danger'>{formik.errors.apRemarks}</span>
            ) : null}
          </div>
        </div>

        <div className='mb-3 row'>
          <div className='col-8 form-group'>
            <div className='custom-control custom-checkbox'>
              <input
                type='checkbox'
                className='custom-control-input'
                id='customCheck'
                name='holdingLoc'
                checked={formik.values.holdingLoc}
                onChange={handleCheck}
                disabled={formik.isSubmitting}
              />
              <label className='custom-control-label' htmlFor='customCheck'>
                {t('TEXT_HOLDING_LOCATION_label')}
              </label>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

  return (
    <div>
      {loading === true ? (
        <div style={{ textAlign: 'center' }} className='mt-5'>
          <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
        </div>
      ) : (
        <div className='container bg-white'>
          <h1 className='mb-4 mt-5'>{t('Create_Bin_Location_label')}</h1>
          <form onSubmit={formik.handleSubmit}>
            <div className='mb-3 row'>
              <div className='col-6'>
                <label className='form-label'>{t('Location_Type_label')}</label>
                <div>
                  <div className='custom-control custom-radio custom-control-inline'>
                    <input
                      type='radio'
                      value={locTypeOptions[0]}
                      id='customRadio1'
                      name='locationType'
                      className='custom-control-input'
                      onChange={event => formik.setFieldValue('locationType', event.target.value)}
                      checked={formik.values.locationType === locTypeOptions[0]}
                      disabled={formik.isSubmitting}
                    />

                    <label className='custom-control-label radio-inline' htmlFor='customRadio1'>
                      {t('Warehouse_label')}
                    </label>
                  </div>
                  <div className='custom-control custom-radio custom-control-inline'>
                    <input
                      type='radio'
                      value={locTypeOptions[1]}
                      id='customRadio2'
                      name='locationType'
                      className='custom-control-input'
                      onChange={event => formik.setFieldValue('locationType', event.target.value)}
                      checked={formik.values.locationType === locTypeOptions[1]}
                      disabled={formik.isSubmitting}
                    />
                    <label className='custom-control-label radio-inline' htmlFor='customRadio2'>
                      {t('Pickup_Counter_label')}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {showForms}

            <div className='mt-1 row'>
              <div className='mt-3 col-8 text-right'>
                <button
                  type='submit'
                  className='btn btn-primary mr-3'
                  disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
                >
                  {t('Save_label')}
                </button>

                <button type='button' onClick={handleCancel} className=' btn btn-outline-secondary'>
                  {t('Cancel_label')}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

const mapStateToProps = state => ({
  storedPickupLocations: state.binLocationReducer.pickupLocations,
})

const mapDispatchToProps = dispatch => ({
  setInputOptions: options => dispatch(setInputOptions(options)),

  showAlertSuccess: (message, status) => dispatch(alertActions.success(message, status)),
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
  showAlertWarn: (message, status) => dispatch(alertActions.warning(message, status)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateBinLocation)
