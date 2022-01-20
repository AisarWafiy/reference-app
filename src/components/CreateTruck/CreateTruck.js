import React, { useState } from 'react'
import { connect } from 'react-redux'
import { alertActions } from 'actions/alert.actions'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import Loader from 'react-loader-spinner'

import * as labels from 'constants/labels'
import * as regex from 'constants/regex'

const CreateTruck = props => {
  const { showAlertSuccess, showAlertError, showAlertWarn } = props
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const formik = useFormik({
    initialValues: {
      truckNo: '',
      model: '',
      manufacturer: '',
      year: '',
      make: '',
      remarks: '',
    },
    validationSchema: Yup.object({
      truckNo: Yup.string()
        .required('Please enter a truck number')
        .matches(regex.ALPHANUMERIC_NO_SC, 'Special characters are not accepted')
        // .min(5, 'Must be exactly 5 characters'),
        .max(10, 'Maximum 10 characters'),
      model: Yup.string()
        .matches(regex.ALPHANUMERIC_NO_SC, 'Special characters are not accepted')
        .nullable(),
      manufacturer: Yup.string()
        .matches(regex.ALPHANUMERIC_NO_SC, 'Special characters are not accepted')
        .nullable(),
      year: Yup.string()
        .matches(regex.NUMBER_NO_SC, 'Special characters are not accepted')
        .nullable(),
      make: Yup.string()
        .matches(regex.ALPHANUMERIC_NO_SC, 'Special characters are not accepted')
        .nullable(),
      remarks: Yup.string()
        .matches(regex.ALPHANUMERIC_NO_SC, 'Special characters are not accepted')
        .nullable(),
    }),
    onSubmit: values => {
      const postData = {
        truckNumber: values.truckNo,
        truckModel: values.model,
        truckManufacturer: values.manufacturer,
        truckYear: values.year ? parseInt(values.year, 10) : null,
        truckMake: values.make,
        truckRemarks: values.remarks,
      }
      setLoading(true)
      axios
        .post(process.env.REACT_APP_SERVER_URI + '/api/truck/createTruck', postData)
        .then(response => {
          setLoading(false)
          showAlertSuccess(response.data.message, 'Create Truck')
        })
        .catch(err => {
          setLoading(false)
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'Create Truck')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'Create Truck')
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, 'Create Truck')
          else showAlertError('Internal Server Error')
        })
    },
  })

  const handleNumeric = (event, maxLength = 10) => {
    formik.setFieldValue(
      event.target.name,
      event.target.value.replace(regex.EXCEPT_NUMBER, '').substring(0, maxLength),
    )
    formik.setSubmitting(false)
  }

  const handleAlphaNumeric = (event, maxLength = 30) => {
    formik.setFieldValue(
      event.target.name,
      event.target.value.replace(regex.EXCEPT_ALPHANUMERIC, '').substring(0, maxLength),
    )
    formik.setSubmitting(false)
  }

  const handleCancel = () => {
    formik.resetForm({
      truckNo: '',
      model: '',
      manufacturer: '',
      year: '',
      make: '',
      remarks: '',
    })
    formik.setSubmitting(false)
  }

  return (
    <>
      <div className='container bg-white'>
        {loading === true ? (
          <div style={{ textAlign: 'center' }} className='mt-5'>
            <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
          </div>
        ) : (
          <>
            <h1 className='mb-4 mt-5'>{t('Create_Truck_label')}</h1>
            <form onSubmit={formik.handleSubmit}>
              <div className='mb-3 row'>
                <div className='col-4'>
                  <label className='form-label'>
                    {t('Truck_Number_label')}
                    <span className='text-danger'> *</span>
                  </label>

                  <input
                    id='truckNo'
                    name='truckNo'
                    type='text'
                    placeholder={t('TEXT_TRUCK_NO_label')}
                    onChange={e => handleAlphaNumeric(e, 10)}
                    onBlur={formik.handleBlur}
                    value={formik.values.truckNo}
                    className='form-control'
                    disabled={formik.isSubmitting}
                  />
                  {formik.touched.truckNo && formik.errors.truckNo ? (
                    <span className='h5 text-danger'>{formik.errors.truckNo}</span>
                  ) : null}
                </div>
                <div className='col-4'>
                  <label className='form-label'>{t('Model_label')}</label>

                  <input
                    id='model'
                    name='model'
                    type='text'
                    placeholder={t('TEXT_MODEL_label')}
                    onChange={e => handleAlphaNumeric(e, 30)}
                    onBlur={formik.handleBlur}
                    value={formik.values.model}
                    className='form-control'
                    disabled={formik.isSubmitting}
                  />
                  {formik.touched.model && formik.errors.model ? (
                    <span className='h5 text-danger'>{formik.errors.model}</span>
                  ) : null}
                </div>
              </div>

              <div className='mb-3 mt-2 row'>
                <div className='col-4'>
                  <label className='form-label'>{t('Manufacturer_label')}</label>

                  <input
                    id='manufacturer'
                    name='manufacturer'
                    type='text'
                    placeholder={t('TEXT_MANUFACTURER_label')}
                    onChange={e => handleAlphaNumeric(e, 30)}
                    onBlur={formik.handleBlur}
                    value={formik.values.manufacturer}
                    className='form-control'
                    disabled={formik.isSubmitting}
                  />
                  {formik.touched.manufacturer && formik.errors.manufacturer ? (
                    <span className='h5 text-danger'>{formik.errors.manufacturer}</span>
                  ) : null}
                </div>
                <div className='col-4'>
                  <label className='form-label'>{t('Year_label')}</label>

                  <input
                    id='year'
                    name='year'
                    type='text'
                    placeholder={t('TEXT_YEAR_label')}
                    onChange={e => handleNumeric(e, 4)}
                    onBlur={formik.handleBlur}
                    value={formik.values.year}
                    className='form-control'
                    disabled={formik.isSubmitting}
                  />
                  {formik.touched.year && formik.errors.year ? (
                    <span className='h5 text-danger'>{formik.errors.year}</span>
                  ) : null}
                </div>
              </div>

              <div className='mb-3 mt-2 row'>
                <div className='col-4'>
                  <label className='form-label'>{t('Make_label')}</label>

                  <input
                    id='make'
                    name='make'
                    type='text'
                    placeholder={t('TEXT_MAKE_label')}
                    onChange={e => handleAlphaNumeric(e, 30)}
                    onBlur={formik.handleBlur}
                    value={formik.values.make}
                    className='form-control'
                    disabled={formik.isSubmitting}
                  />
                  {formik.touched.make && formik.errors.make ? (
                    <span className='h5 text-danger'>{formik.errors.make}</span>
                  ) : null}
                </div>
              </div>

              <div className='mb-3 mt-2 row'>
                <div className='col-8'>
                  <label className='form-label'>{t('Remarks_label')}</label>

                  <input
                    id='remarks'
                    name='remarks'
                    type='text'
                    placeholder={t('TEXT_ADD_REMARKS_label')}
                    onChange={e => handleAlphaNumeric(e, 30)}
                    onBlur={formik.handleBlur}
                    value={formik.values.remarks}
                    className='form-control'
                    disabled={formik.isSubmitting}
                  />
                  {formik.touched.remarks && formik.errors.remarks ? (
                    <span className='h5 text-danger'>{formik.errors.remarks}</span>
                  ) : null}
                </div>
              </div>

              <div className='mt-1 row'>
                <div className='mt-3 col-8 text-right'>
                  <button
                    type='submit'
                    className='btn btn-primary mr-3'
                    disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
                  >
                    {t('Save_label')}
                  </button>

                  <button
                    type='button'
                    onClick={handleCancel}
                    className=' btn btn-outline-secondary'
                  >
                    {t('Cancel_label')}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  )
}

const mapDispatchToProps = dispatch => ({
  showAlertSuccess: (message, status) => dispatch(alertActions.success(message, status)),
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
})

export default connect(null, mapDispatchToProps)(CreateTruck)
