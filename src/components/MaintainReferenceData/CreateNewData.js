import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { connect } from 'react-redux'

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { useTranslation } from 'react-i18next'
import { alertActions } from 'actions/alert.actions'
import { useFormik } from 'formik'
import { maintainReferenceDataActions } from '../../actions/maintainReferenceData.actions'

import { EXCEPT_NUMBER } from 'constants/regex'

let initialValues = { Code: '', Value: '' }

function NewData(props) {
  const { changeRef, refId, Reference } = props

  let [isSave, setIsSave] = useState(false)

  const [disableSave, setDisableSave] = useState(true)
  const [tmError, setTmError] = useState('')
  const { t } = useTranslation()
  const [fromHours, setFromHours] = useState('')
  const [fromMin, setFromMin] = useState('')
  const [toHours, setToHours] = useState('')
  const [toMin, setToMin] = useState('')
  const [checked, setChecked] = useState(false)

  const onChangeFromHours = object => {
    const { value } = object.target
    setFromHours(value.replace(EXCEPT_NUMBER, '').substring(0, 2))
  }
  const onChangeFromMin = object => {
    const { value } = object.target

    setFromMin(value.replace(EXCEPT_NUMBER, '').substring(0, 2))
  }

  const onChangeToHours = object => {
    const { value } = object.target

    setToHours(value.replace(EXCEPT_NUMBER, '').substring(0, 2))
  }
  const onChangeToMin = object => {
    const { value } = object.target

    setToMin(value.replace(EXCEPT_NUMBER, '').substring(0, 2))
  }

  useEffect(() => {
    if (fromHours !== '' && fromHours > 23) {
      setFromHours('')
    }
    if (fromMin !== '' && fromMin > 59) {
      setFromMin('')
    }
  }, [fromMin, fromHours])

  useEffect(() => {
    if (toHours !== '' && toHours > 23) {
      setToHours('')
    }
    if (toMin !== '' && toMin > 59) {
      setToMin('')
    }
  }, [toMin, toHours])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
  })

  const saveNewData = () => {
    setIsSave(true)
    if (Reference === 'Airport') {
      let data = {}

      data.refId = refId

      data.refMaster = Reference

      data.refCode = formik.values.Code

      data.refValue = formik.values.Value
      data.naccsCode = null
      data.tmTo = null
      data.tmFrom = null
      data.refFlag = null

      changeRef(data)
    } else if (Reference === 'Location Type') {
      let data = {}

      data.refId = refId

      data.refMaster = Reference

      data.refCode = formik.values.Code

      data.refValue = formik.values.Value
      data.naccsCode = formik.values.NACCS
      data.tmTo = null
      data.tmFrom = null
      data.refFlag = checked ? 'Y' : 'N'

      changeRef(data)
    } else if (Reference === 'Nationality') {
      let data = {}

      data.refId = refId

      data.refMaster = Reference

      data.refCode = formik.values.Code

      data.refValue = formik.values.Value
      data.naccsCode = null
      data.tmTo = null
      data.tmFrom = null
      data.refFlag = null

      changeRef(data)
    } else if (Reference === 'Pick up Location') {
      let data = {}

      data.refId = refId

      data.refMaster = Reference

      data.refCode = formik.values.Code

      data.refValue = formik.values.Value
      data.naccsCode = null
      data.tmTo = null
      data.tmFrom = null
      data.refFlag = checked ? 'Y' : 'N'

      changeRef(data)
    } else if (Reference === 'Shift') {
      let data = {}

      data.refId = refId

      data.refMaster = Reference

      data.refCode = formik.values.Code

      data.refValue = formik.values.Value
      data.naccsCode = null
      data.tmTo = toHours + ':' + toMin

      data.tmFrom = fromHours + ':' + fromMin

      data.refFlag = null

      changeRef(data)
    } else if (Reference === 'Airline Code') {
      let data = {}

      data.refId = refId

      data.refMaster = Reference

      data.refCode = formik.values.Code

      data.refValue = formik.values.Value
      data.naccsCode = formik.values.NACCS
      data.tmTo = null
      data.tmFrom = null
      data.refFlag = null

      changeRef(data)
    } else if (Reference === 'Group') {
      let data = {}

      data.refId = refId

      data.refMaster = Reference

      data.refCode = formik.values.Code

      data.refValue = formik.values.Value
      data.naccsCode = null
      data.tmTo = null
      data.tmFrom = null
      data.refFlag = null

      changeRef(data)
    } else if (Reference === 'Purchase Type') {
      let data = {}

      data.refId = refId

      data.refMaster = Reference

      data.refCode = formik.values.Code

      data.refValue = formik.values.Value
      data.naccsCode = null
      data.tmTo = null
      data.tmFrom = null
      data.refFlag = null

      changeRef(data)
    } else if (Reference === 'Currencies') {
      let data = {}

      data.refId = refId

      data.refMaster = Reference

      data.refCode = formik.values.Code

      data.refValue = formik.values.Value
      data.naccsCode = null
      data.tmTo = null
      data.tmFrom = null
      data.refFlag = null

      changeRef(data)
    } else if (Reference === 'Promotion') {
      let data = {}

      data.refId = refId

      data.refMaster = Reference
      data.refCode = formik.values.Code

      data.refValue = formik.values.Value
      data.naccsCode = null
      data.tmTo = null
      data.tmFrom = null
      data.refFlag = null

      changeRef(data)
    } else if (Reference === 'DP Tracking') {
      let data = {}

      data.refId = refId

      data.refMaster = Reference
      data.refCode = formik.values.Code

      data.refValue = formik.values.Value
      data.naccsCode = null
      data.tmTo = null
      data.tmFrom = null
      data.refFlag = null

      changeRef(data)
    }
  }
  const cancelNewData = () => {
    window.location.reload()
  }

  useEffect(() => {
    if (Reference === 'Airport') {
      if (formik.values.Code && formik.values.Value) {
        {
          setDisableSave(false)
        }
      } else {
        setDisableSave(true)
      }
    }
    if (Reference === 'Nationality') {
      if (formik.values.Code && formik.values.Value) {
        {
          setDisableSave(false)
        }
      } else {
        setDisableSave(true)
      }
    }
    if (
      Reference === 'Group' ||
      Reference === 'Purchase Type' ||
      Reference === 'Currencies' ||
      Reference === 'Promotion' ||
      Reference === 'DP Tracking'
    ) {
      if (formik.values.Code && formik.values.Value) {
        {
          setDisableSave(false)
        }
      } else {
        setDisableSave(true)
      }
    }
    if (Reference === 'Pick up Location') {
      if (formik.values.Code && formik.values.Value) {
        {
          setDisableSave(false)
        }
      } else {
        setDisableSave(true)
      }
    }

    if (Reference === 'Shift') {
      if (
        formik.values.Code &&
        formik.values.Value &&
        fromHours !== '' &&
        fromMin !== '' &&
        toHours !== '' &&
        toMin !== ''
      ) {
        {
          setDisableSave(false)
        }
      } else {
        setDisableSave(true)
      }
    }
    if (Reference === 'Airline Code') {
      if (formik.values.Code && formik.values.Value && formik.values.NACCS) {
        {
          setDisableSave(false)
        }
      } else {
        setDisableSave(true)
      }
    }

    if (Reference === 'Location Type') {
      if (formik.values.Code && formik.values.Value) {
        {
          setDisableSave(false)
        }
      } else {
        setDisableSave(true)
      }
    }
  }, [
    formik.values.Value,
    formik.values.Code,
    formik.values.NACCS,
    formik.values.To,

    fromHours,
    fromMin,
    toHours,
    toMin,
  ])

  useEffect(() => {
    if (formik.values.To && formik.values.From) {
      if (
        Number(formik.values.To.slice(0, 2)) < Number(formik.values.From.slice(0, 2)) ||
        (Number(formik.values.To.slice(0, 2)) === Number(formik.values.From.slice(0, 2)) &&
          Number(formik.values.To.slice(3, 5)) < Number(formik.values.From.slice(3, 5)))
      ) {
        setTmError('To time should always be greater than from time')
      } else {
        setTmError('')
      }
    }
  }, [formik.values.To, formik.values.From])

  const handleCode = event => {
    formik.setFieldValue('Code', event.target.value.replace(/[^a-zA-Z0-9 ]/g, ''))
  }
  const handleValue = event => {
    formik.setFieldValue('Value', event.target.value.replace(/[^a-zA-Z0-9 ]/g, ''))
  }
  const handleNACCS = event => {
    formik.setFieldValue('NACCS', event.target.value.replace(/[^a-zA-Z0-9 ]/g, ''))
  }

  return (
    <div className='container bg-white'>
      <div>
        {' '}
        <div className='container bg-white'>
          <div className='mb-3 row'>
            <div className='col-4'>
              <label> {t('Code_label')}:</label>
              <span className='astrick'>*</span> <br />{' '}
              <input
                type='text'
                placeholder={t('Code_label')}
                onChange={handleCode}
                disabled={isSave}
                name='Code'
                maxLength={Reference === 'Nationality' ? 2 : 4}
                value={formik.values.Code}
                className='form-control'
              />
            </div>
          </div>

          <div className='row'>
            <div className='mb-3 col-4'>
              <label>{t('Value_label')}:</label>
              <span className='astrick'>*</span> <br />{' '}
              <input
                type='text'
                placeholder={t('Value_label')}
                onChange={handleValue}
                name='Value'
                maxLength={Reference === 'Airline Code' ? 2 : 15}
                disabled={isSave}
                value={formik.values.Value}
                className='form-control'
              />
            </div>
          </div>
          {Reference === 'Airline Code' && (
            <div className='row'>
              <div className='mb-3 col-4'>
                <label>{t('NACCS_label')}</label>
                <span className='astrick'>*</span> <br />
                <input
                  type='text'
                  placeholder={t('NACCS_label')}
                  onChange={handleNACCS}
                  name='NACCS'
                  maxLength={3}
                  disabled={isSave}
                  value={formik.values.NACCS}
                  className='form-control'
                />
              </div>
            </div>
          )}
          {(Reference === 'Location Type' || Reference === 'Pick up Location') && (
            <div className='row'>
              <div className='mb-3 col-4'>
                {Reference === 'Location Type' ? (
                  <label>{t('Store_label')}:</label>
                ) : (
                  <label>{t('International_label')}:</label>
                )}

                <input
                  className='ml-2'
                  type='checkbox'
                  onChange={() => setChecked(!checked)}
                  name='Flag'
                  disabled={isSave}
                ></input>
              </div>
            </div>
          )}
          {Reference === 'Shift' && (
            <div className='row'>
              <div className='mb-3 col'>
                <label>{t('From_label')}:</label>
                <span className='astrick'>*</span>
                <div className='row'>
                  <div className='mb-3 col-2'>
                    <input
                      type='text'
                      disabled={isSave}
                      placeholder={t('Hours_label')}
                      onChange={onChangeFromHours}
                      name='fromHours'
                      value={fromHours}
                      className='form-control'
                    />
                  </div>
                  <div className='mb-3 col-2'>
                    <input
                      type='text'
                      disabled={isSave}
                      placeholder={t('Minutes_label')}
                      onChange={onChangeFromMin}
                      name='fromMin'
                      value={fromMin}
                      className='form-control'
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {Reference === 'Shift' && (
            <div className='row'>
              <div className='mb-3 col'>
                <label>{t('To_label')}:</label>
                <span className='astrick'>*</span>
                <div className='row'>
                  <div className='mb-3 col-2'>
                    <input
                      type='text'
                      disabled={isSave}
                      placeholder={t('Hours_label')}
                      onChange={onChangeToHours}
                      name='toHours'
                      value={toHours}
                      className='form-control'
                    />
                  </div>
                  <div className='mb-3 col-2'>
                    <input
                      type='text'
                      disabled={isSave}
                      placeholder={t('Minutes_label')}
                      onChange={onChangeToMin}
                      name='toMin'
                      value={toMin}
                      className='form-control'
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className='mt-3 ml-1 row'>
          <div className='mt-5 col-8 text-left'>
            <button
              type='button'
              onClick={saveNewData}
              className='btn btn-primary mr-3'
              disabled={disableSave || isSave}
            >
              Save
            </button>

            <button type='button' onClick={cancelNewData} className=' btn btn-outline-secondary'>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
function mapState(state) {
  return {
    postRefData: state.postRef.getData,
  }
}

const actionCreators = {
  changeRef: maintainReferenceDataActions.postRef,

  valid: alertActions.error,
}

export default connect(mapState, actionCreators)(NewData)
