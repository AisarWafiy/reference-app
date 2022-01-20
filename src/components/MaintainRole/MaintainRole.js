import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import * as regex from 'constants/regex'
import * as labels from 'constants/labels'
import Loader from 'react-loader-spinner'
import { Dropdown, DropdownSelectAll } from 'components/UI/Input'

import {
  setInputRoles,
  setInputScreens,
  editRoleName,
  editRoleScreen,
  setMaintainedRole,
} from 'actions/action-roles'

import { alertActions } from 'actions/alert.actions'

const MaintainRole = props => {
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const {
    setInputRoles,
    setInputScreens,
    setRoleName,
    setRolePagePer,
    setRole,
    selectedRole,
    storedRoles,
    storedPagePer,
    showAlertSuccess,
    showAlertError,
    showAlertWarn,
  } = props

  // const [currentRoleId, setCurrentRoleId] = useState()

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SERVER_URI + '/api/user/roles')
      .then(response => {
        setInputRoles({
          roles: response.data.result,
        })

        setRole(null)

        // setRole(response.data.result[0])
        // setCurrentRoleId(response.data.result[0].role.roleId)
        // formik.setFieldValue('rName', response.data.result[0].role.roleName, true)
        // formik.setFieldValue('pagePerInput', response.data.result[0].pagePer, true)
      })
      .catch(err => {
        if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, 'fetching roles')
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, 'fetching roles')
        else if (err.response.data.warning)
          showAlertWarn(err.response.data.warning, 'fetching roles')
        else showAlertError('Internal Server Error')
      })

    axios
      .get(process.env.REACT_APP_SERVER_URI + '/api/user/perlist')
      .then(response => {
        setInputScreens({
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
        .min(1, 'Please enter a valid name')
        .max(45, 'Must be 45 characters or less')
        .matches(regex.ALPHA_NO_SC, 'Special characters are not accepted')
        .trim()
        .required('Please enter a valid name'),
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
      const postData = {
        role: {
          roleName: selectedRole.role.roleName,
          roleId: selectedRole.role.roleId,
        },
        pagePer: selectedRole.pagePer.map(screen => ({
          permissionId: screen.permissionId,
          permissionName: screen.permissionName,
        })),
      }
      setLoading(true)
      axios
        .post(process.env.REACT_APP_SERVER_URI + '/api/user/editRole', postData)
        .then(response => {
          showAlertSuccess(response.data.message, t('Maintain_Role_label'))
          setLoading(false)
        })
        .catch(err => {
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, t('Maintain_Role_label'))
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, t('Maintain_Role_label'))
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, t('Maintain_Role_label'))
          else showAlertError('Internal Server Error')
          setLoading(false)
        })
    },
  })

  const handleText = event => {
    setRoleName(event.target.value.replace(regex.EXCEPT_ALPHA, ''))
    formik.setFieldValue('rName', event.target.value.replace(regex.EXCEPT_ALPHA, ''), false)
    formik.setSubmitting(false)
  }

  const handleRoleChosen = selectedOption => {
    const newRole = Object.assign(
      ...storedRoles.filter(rl => {
        return rl.role.roleId === selectedOption.roleId
      }),
    )

    setRole(newRole)

    formik.setFieldValue('pagePerInput', newRole.pagePer, true)
    formik.setSubmitting(false)
  }

  const handleCancel = () => {
    setRole(null)
    formik.setFieldValue('rName', '', false)
    formik.setFieldValue('pagePerInput', [], false)

    formik.resetForm()
    formik.setSubmitting(false)

    axios
      .get(process.env.REACT_APP_SERVER_URI + '/api/user/roles')
      .then(response => {
        setInputRoles({
          roles: response.data.result,
        })
      })
      .catch(err => {
        if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, t('Maintain_Role_label'))
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, t('Maintain_Role_label'))
        else if (err.response.data.warning) showAlertWarn(err.response.data.warning)
        else showAlertError('Internal Server Error')
      })
  }

  const handleSelect = selectedList => {
    setRolePagePer(selectedList)
    formik.setFieldValue('pagePerInput', selectedList, false)
    formik.setSubmitting(false)
  }

  useEffect(() => {
    if (selectedRole) {
      formik.setFieldValue('rName', selectedRole.role.roleName)
    }
  }, [selectedRole, formik.values.pagePerInput])

  return (
    <div>
      {loading === true ? (
        <div style={{ textAlign: 'center' }} className='mt-5'>
          <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
        </div>
      ) : (
        <div className='container bg-white'>
          <h1 className='mb-4 mt-5'>{t('Maintain_Role_label')}</h1>

          <form onSubmit={formik.handleSubmit}>
            <div className='mb-3 row'>
              <div className='col-4'>
                <label className='form-label'>
                  {t('Role_Name_label')}
                  <span className='text-danger'> *</span>
                </label>
                <Dropdown
                  closeMenuOnSelect={true}
                  value={selectedRole && selectedRole.role}
                  onChange={handleRoleChosen}
                  onBlur={formik.handleBlur}
                  // options={storedRoles.map(rl => rl.role)}
                  options={storedRoles.map(rl => rl.role)}
                  optionLabel='roleName'
                  optionValue='roleId'
                  isDisabled={formik.isSubmitting}
                />
              </div>
            </div>

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
                  disabled={formik.isSubmitting || !selectedRole}
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
                  id='pagePerInput'
                  name='pagePerInput'
                  isMulti
                  value={formik.values.pagePerInput}
                  options={storedPagePer}
                  optionLabel='permissionName'
                  optionValue='permissionId'
                  onChange={handleSelect}
                  onBlur={formik.handleBlur}
                  placeholder={t('LABEL_SELECT_SCREEN_label')}
                  selectAllText='All Screens'
                  menuIsOpen
                  isDisabled={formik.isSubmitting || !selectedRole}
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
  selectedRole: state.rolesReducer.maintainedRole,
  storedRoles: state.rolesReducer.roles,
  storedPagePer: state.rolesReducer.pagePer,
})

const mapDispatchToProps = dispatch => ({
  setInputScreens: options => dispatch(setInputScreens(options)),
  setInputRoles: options => dispatch(setInputRoles(options)),
  setRoleName: name => dispatch(editRoleName(name)),
  setRolePagePer: screen => dispatch(editRoleScreen(screen)),
  setRole: role => dispatch(setMaintainedRole(role)),
  showAlertWarn: (message, status) => dispatch(alertActions.warning(message, status)),
  showAlertSuccess: (message, status) => dispatch(alertActions.success(message, status)),
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MaintainRole)
