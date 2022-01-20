import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import * as labels from 'constants/labels'
import { DropdownSelectAll } from 'components/UI/Input'
import Loader from 'react-loader-spinner'
import { useTranslation } from 'react-i18next'
import * as regex from 'constants/regex'

import { setInputScreens } from 'actions/action-roles'
import { alertActions } from 'actions/alert.actions'

const CreateRole = props => {
  const { t } = useTranslation()
  const { setInputScreen, storedPagePer, showAlertSuccess, showAlertError, showAlertWarn } = props
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SERVER_URI + '/api/user/perlist')
      .then(response => {
        setInputScreen({
          pagePer: response.data.result,
        })
      })
      .catch(err => {
        if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, 'fetching screens list')
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, 'fetching screens list')
        else if (err.response.data.warning)
          showAlertWarn(err.response.data.warning, 'fetching screens list')
        else showAlertError('Internal Server Error')
      })
  }, [])

  const formik = useFormik({
    initialValues: {
      rName: '',
      pagePerInput: [],
    },
    validationSchema: Yup.object({
      rName: Yup.string()
        .max(45, 'Must be 45 characters or less')
        .matches(regex.ALPHA_NO_SC, 'Special characters are not accepted')
        .trim()
        .required(t('Please_enter_a_valid_name_label')),
      pagePerInput: Yup.array()
        .min(1, 'Pick at least 1 screen')
        .of(
          Yup.object().shape({
            permissionId: Yup.number().required(),
            permissionName: Yup.string().required(),
          }),
        ),
    }),
    onSubmit: values => {
      setLoading(true)
      const postData = {
        role: {
          roleName: values.rName,
        },
        pagePer: values.pagePerInput.map(screen => ({
          permissionId: screen.permissionId,
          permissionName: screen.permissionName,
        })),
      }

      axios
        .post(process.env.REACT_APP_SERVER_URI + '/api/user/saveRole', postData)
        .then(response => {
          showAlertSuccess(response.data.message, t('Create_Role_label'))
          setLoading(false)
        })
        .catch(err => {
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, t('Create_Role_label'))
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, t('Create_Role_label'))
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, t('Create_Role_label'))
          else showAlertError('Internal Server Error')
          setLoading(false)
        })
    },
  })

  const handleCancel = () => {
    formik.setFieldValue('rName', '', false)
    formik.setFieldValue('pagePerInput', [], false)
    formik.setSubmitting(false)
  }

  const handleSelect = selectedList => {
    formik.setFieldValue('pagePerInput', selectedList)
    formik.setSubmitting(false)
  }

  const handleText = event => {
    formik.setFieldValue('rName', event.target.value.replace(regex.EXCEPT_ALPHA, ''))
    formik.setSubmitting(false)
  }

  return (
    <div>
      {loading === true ? (
        <div style={{ textAlign: 'center' }} className='mt-5'>
          <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
        </div>
      ) : (
        <div className='container bg-white'>
          <h1 className='mb-4 mt-5'>{t('Create_Role_label')}</h1>
          <form onSubmit={formik.handleSubmit}>
            <div className='mb-3 row'>
              <div className='col-4'>
                <label className='form-label'>
                  {t('Role_Name_label')}
                  <span className='text-danger'> *</span>
                </label>

                <input
                  id='rName'
                  name='rName'
                  type='text'
                  placeholder={t('TEXT_ROLENAME_label')}
                  onChange={handleText}
                  onBlur={formik.handleBlur}
                  value={formik.values.rName}
                  className='form-control'
                  disabled={formik.isSubmitting}
                />
                {formik.touched.rName && formik.errors.rName ? (
                  <span className='h5 text-danger'>{formik.errors.rName}</span>
                ) : null}
              </div>
            </div>

            <div className='row'>
              <div className='col-8'>
                <label className='form-label'>
                  {t('Applicable_Screens_label')}
                  <span className='text-danger'> *</span>
                </label>

                <DropdownSelectAll
                  id='pagerPerInput'
                  name='pagePerInput'
                  allowSelectAll={true}
                  isMulti
                  value={formik.values.pagePerInput}
                  options={storedPagePer}
                  optionLabel='permissionName'
                  optionValue='permissionId'
                  onChange={handleSelect}
                  onBlur={formik.handleBlur}
                  placeholder={t('LABEL_SELECT_SCREEN_label')}
                  selectAllText='All Screens'
                  isDisabled={formik.isSubmitting}
                />
                {formik.touched.pagePerInput && formik.errors.pagePerInput ? (
                  <span className='h5 text-danger'>{formik.errors.pagePerInput}</span>
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
  createdRole: state.rolesReducer.newRole,
  storedRoles: state.rolesReducer.roles,
  storedPagePer: state.rolesReducer.pagePer,
})

const mapDispatchToProps = dispatch => ({
  setInputScreen: values => dispatch(setInputScreens(values)),

  showAlertSuccess: (message, status) => dispatch(alertActions.success(message, status)),
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
  showAlertWarn: (message, status) => dispatch(alertActions.warning(message, status)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateRole)
