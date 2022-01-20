import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { AgGridReact } from '@ag-grid-community/react'
import Loader from 'react-loader-spinner'
import { AllModules } from '@ag-grid-enterprise/all-modules'
import { rowStyle } from 'assets/styles/ag-rowStyle'

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

import * as labels from 'constants/labels'
import * as regex from 'constants/regex'
import { locTypeOptions } from 'constants/types'

import { setInputOptions, setRowData, setLocationType } from 'actions/action-bin-location'
import { alertActions } from 'actions/alert.actions'

import { Dropdown } from 'components/UI/Input'
import { Modal } from 'react-bootstrap'
import {
  NumberEditor,
  YesNoSelectEditor,
  TextEditor,
} from 'components/AgGridCustomComponents/Editors'

const PickupLocEditor = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value)
  const [pickUpLoc, setPickUpLoc] = useState([])
  const refInput = useRef(null)

  useEffect(() => {
    // focus on the input
    setTimeout(() => refInput.current.focus())

    axios
      .get(process.env.REACT_APP_SERVER_URI + '/api/refdata/all')
      .then(response => {
        setPickUpLoc(response.data.result.filter(res => res.refMaster === 'Pick up Location'))
      })
      .catch(err => {})
  }, [])

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        // this simple editor doubles any value entered into the input
        return value
      },

      // Gets called once before editing starts, to give editor a chance to
      // cancel the editing before it even starts.
      isCancelBeforeStart() {
        return false
      },

      // Gets called once when editing is finished (eg if enter is pressed).
      // If you return true, then the result of the edit will be ignored.
    }
  })

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
      <select
        ref={refInput}
        value={value}
        style={{ width: '100%', outline: 'none', borderStyle: 'none' }}
        onChange={event => setValue(event.target.value)}
      >
        {pickUpLoc.map(val => (
          <option value={val.refValue} key={val.refValue}>
            {val.refValue}
          </option>
        ))}
      </select>
    </div>
  )
})

const MaintainBinLocation = props => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)

  const {
    setInputOptions,
    setRowData,
    setLocationType,
    rowData,
    storedPickupLocations,
    locationType,

    showAlertSuccess,
    showAlertError,
    showAlertWarn,
  } = props

  const [showModal, setShowModal] = useState(false)
  const [paramsToDelete, setParamsToDelete] = useState()

  function actionCellRenderer(params) {
    let divElement = document.createElement('div')

    let editingCells = params.api.getEditingCells()

    // checks if the rowIndex matches in at least one of the editing cells
    let isCurrentRowEditing = editingCells.some(cell => {
      return cell.rowIndex === params.node.rowIndex
    })

    if (isCurrentRowEditing) {
      divElement.innerHTML = `
  <button data-action="save"  class="save-option"> Save  </button>
  <button  data-action="cancel" class="cancel-option"> Cancel </button>
  `
    } else {
      divElement.innerHTML = `
  <button data-action="edit" class="edit-option"> Edit </button>
  <button data-action="delete" class="edit-option"> Delete </button>
  `
    }

    return divElement
  }

  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)

  const [whState, setWHState] = useState({
    columnDefs: [
      {
        headerName: t('Action_label'),
        field: 'action',
        lockPosition: true,
        cellRenderer: actionCellRenderer,
        editable: false,
        colId: 'action',
        width: 150,
      },
      {
        headerName: t('Type_label'),
        field: 'locationType',
        sortable: true,
        filter: true,

        editable: false,
        width: 150,
      },

      {
        headerName: t('Bin_Location_label'),
        field: 'binLocation',
        sortable: true,
        filter: true,
        sort: 'asc',
        editable: false,
        width: 150,
      },

      {
        headerName: t('Carton_Capacity_label'),
        field: 'cartonCapacity',
        sortable: true,
        cellEditor: 'numberEditor',
        filter: true,

        editable: true,
        width: 180,
      },

      {
        headerName: t('Remarks_label'),
        field: 'remarks',
        sortable: true,
        filter: true,

        cellEditor: 'textEditor',
        editable: true,
        width: 350,
      },
    ],
    defaultColDef: {
      width: 125,
      sortable: true,
      wrapText: true,
      resizable: true,
      cellStyle: rowStyle,
    },
    frameworkComponents: {
      numberEditor: NumberEditor,
      yesNoSelectEditor: YesNoSelectEditor,
      textEditor: TextEditor,
      pickupLocEditor: PickupLocEditor,
    },
  })

  const [apState, setAPState] = useState({
    columnDefs: [
      {
        headerName: t('Action_label'),
        field: 'action',
        lockPosition: true,
        cellRenderer: actionCellRenderer,
        editable: false,
        colId: 'action',
        width: 150,
      },

      {
        headerName: t('Type_label'),
        field: 'locationType',
        sortable: true,
        filter: true,
        lockPosition: true,
        editable: false,
        width: 150,
      },

      {
        headerName: t('Bin_Location_label'),
        field: 'binLocation',
        sortable: true,
        filter: true,
        sort: 'asc',
        lockPosition: true,
        editable: false,
        width: 150,
      },

      {
        headerName: t('Pickup_Location_label'),
        field: 'pickupLocation',
        sortable: true,
        filter: true,
        lockPosition: true,
        cellEditor: 'pickupLocEditor',
        editable: true,
        width: 160,
      },

      {
        headerName: t('Cage_Capacity_label'),
        field: 'cartonCapacity',
        sortable: true,
        filter: true,

        lockPosition: true,
        cellEditor: 'numberEditor',
        editable: true,
        width: 160,
      },

      {
        headerName: t('Holding_Location_label'),
        field: 'holdingLocation',
        sortable: true,
        cellEditor: 'yesNoSelectEditor',
        lockPosition: true,
        filter: true,
        editable: true,
        cellRenderer: params => {
          if (params.value === true) {
            return `<input type="checkbox" checked style="pointer-events: none" />`
          } else {
            return `<input type="checkbox" style="pointer-events: none"/>`
          }
        },
        width: 160,
      },
      {
        headerName: t('Remarks_label'),
        field: 'remarks',
        sortable: true,
        filter: true,

        cellEditor: 'textEditor',
        editable: true,
        width: 350,
      },
    ],
    defaultColDef: {
      width: 125,
      sortable: true,
      wrapText: true,
      resizable: true,
      cellStyle: rowStyle,
    },
    frameworkComponents: {
      numberEditor: NumberEditor,
      yesNoSelectEditor: YesNoSelectEditor,
      textEditor: TextEditor,
      pickupLocEditor: PickupLocEditor,
    },
  })

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SERVER_URI + '/api/refdata/all')
      .then(response => {
        const pickUpLoc = response.data.result.filter(res => res.refMaster === 'Pick up Location')
        setInputOptions({
          pickupLocations: pickUpLoc,
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

  const setRowValues = values => {
    let postData = {}

    if (locationType === locTypeOptions[0]) {
      postData = {
        locationType: locationType,
        cartonCapacity: values.cartonCap,
        remarks: values.whRemarks,
      }

      axios
        .get(process.env.REACT_APP_SERVER_URI + '/api/binLocation/locationType/Warehouse')
        .then(response => {
          if (postData.cartonCapacity || postData.remarks) {
            setRowData(
              response.data.result.filter(
                res =>
                  res.cartonCapacity == postData.cartonCapacity ||
                  (postData.remarks &&
                    res.remarks.toLowerCase().includes(postData.remarks.toLowerCase())),
              ),
            )
          } else {
            setRowData(response.data.result)
          }
          setLoading(false)
        })
        .catch(err => {
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'search')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'search')
          else if (err.response.data.warning) showAlertWarn(err.response.data.warning, 'search')
          else showAlertError('Internal Server Error')
          setRowData([])
          setLoading(false)
        })
    } else if (locationType === locTypeOptions[1]) {
      postData = {
        locationType: locationType,
        cartonCapacity: values.cageCap,
        pickupLocation: values.pickupLocation ? values.pickupLocation.refValue : '',
        remarks: values.apRemarks,
      }
      axios
        .get(process.env.REACT_APP_SERVER_URI + '/api/binLocation/locationType/Airport')
        .then(response => {
          if (postData.cartonCapacity || postData.pickupLocation || postData.remarks) {
            setRowData(
              response.data.result.filter(
                res =>
                  res.cartonCapacity == postData.cartonCapacity ||
                  (postData.pickupLocation && res.pickupLocation === postData.pickupLocation) ||
                  (postData.remarks &&
                    res.remarks.toLowerCase().includes(postData.remarks.toLowerCase())),
              ),
            )
          } else {
            setRowData(response.data.result)
          }
          setLoading(false)
        })
        .catch(err => {
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'search')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'search')
          else if (err.response.data.warning) showAlertWarn(err.response.data.warning, 'search')
          else showAlertError('Internal Server Error')
          setRowData([])
          setLoading(false)
        })
    }
  }

  const formik = useFormik({
    initialValues: {
      whRemarks: '',
      apRemarks: '',
    },
    validationSchema: Yup.object({
      cartonCap: Yup.string().max(4, t('Maximum_4_Digits_Validation_Msg_label')),
      cageCap: Yup.string().max(4, t('Maximum_4_Digits_Validation_Msg_label')),
      pickupLocation: Yup.object().nullable(),
      whRemarks: Yup.string().max(25, t('Cannot_Exceed_25_Characters_Validation_Msg_label')),
      apRemarks: Yup.string().max(25, t('Cannot_Exceed_25_Characters_Validation_Msg_label')),
    }),
    onSubmit: values => {
      setRowValues(values)
    },
  })
  const handleGo = values => {
    let postData = {}
    setLoading(true)
    if (locationType === locTypeOptions[0]) {
      postData = {
        locationType: locationType,
        cartonCapacity: formik.values.cartonCap,
        remarks: formik.values.whRemarks,
      }

      axios
        .get(process.env.REACT_APP_SERVER_URI + '/api/binLocation/locationType/Warehouse')
        .then(response => {
          if (postData.cartonCapacity || postData.remarks) {
            setRowData(
              response.data.result.filter(
                res =>
                  res.cartonCapacity == postData.cartonCapacity ||
                  (postData.remarks &&
                    res.remarks.toLowerCase().includes(postData.remarks.toLowerCase())),
              ),
            )
          } else {
            setRowData(response.data.result)
          }
          setLoading(false)
        })
        .catch(err => {
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'search')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'search')
          else if (err.response.data.warning) showAlertWarn(err.response.data.warning, 'search')
          else showAlertError('Internal Server Error')
          setRowData([])
          setLoading(false)
        })
    } else if (locationType === locTypeOptions[1]) {
      postData = {
        locationType: locationType,
        cartonCapacity: formik.values.cageCap,
        pickupLocation: formik.values.pickupLocation ? formik.values.pickupLocation.refValue : '',
        remarks: formik.values.apRemarks,
      }
      axios
        .get(process.env.REACT_APP_SERVER_URI + '/api/binLocation/locationType/Airport')
        .then(response => {
          if (postData.cartonCapacity || postData.pickupLocation || postData.remarks) {
            setRowData(
              response.data.result.filter(
                res =>
                  res.cartonCapacity == postData.cartonCapacity ||
                  (postData.pickupLocation && res.pickupLocation === postData.pickupLocation) ||
                  (postData.remarks &&
                    res.remarks.toLowerCase().includes(postData.remarks.toLowerCase())),
              ),
            )
          } else {
            setRowData(response.data.result)
          }
          setLoading(false)
        })
        .catch(err => {
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'search')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'search')
          else if (err.response.data.warning) showAlertWarn(err.response.data.warning, 'search')
          else showAlertError('Internal Server Error')
          setRowData([])
          setLoading(false)
        })
    }
  }
  useEffect(() => {
    setRowValues(formik.values)

    if (locationType === locTypeOptions[0]) {
      formik.setFieldValue('apRemarks', '', false)
      formik.setFieldValue('cageCap', '', false)
      formik.setFieldValue('pickupLocation', null, false)
    } else if (locationType === locTypeOptions[1]) {
      formik.setFieldValue('whRemarks', '', false)
      formik.setFieldValue('cartonCap', '', false)
    }
  }, [locationType])

  const applyDelete = () => {
    setShowModal(false)
    setLoading(true)
    const params = paramsToDelete

    const toBeDeleted = gridApi.getRowNode(params.node.rowIndex).data
    axios
      .get(process.env.REACT_APP_SERVER_URI + '/api/binLocation/delete/' + toBeDeleted.binLocation)
      .then(response => {
        showAlertSuccess(response.data.message, 'bin Location deletion')
        axios
          .get(process.env.REACT_APP_SERVER_URI + '/api/binLocation/locationType/' + locationType)
          .then(response => {
            setRowData(response.data.result)
            setLoading(false)
          })
          .catch(err => {
            setLoading(false)
          })
      })
      .catch(err => {
        if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, 'bin Location deletion')
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, 'bin Location deletion')
        else if (err.response.data.warning)
          showAlertWarn(err.response.data.warning, 'bin Location deletion')
        else showAlertError('Internal Server Error')
        // showAlertError(err.response.data.error, 'bin Location deletion')
        setLoading(false)
      })
  }

  const onCellClicked = params => {
    // Handle click event for action cells
    if (params.column.colId === 'action' && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action

      if (action === 'edit') {
        params.api.startEditingCell({
          rowIndex: params.node.rowIndex,
          // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId,
        })
      }
      if (action === 'delete') {
        setShowModal(true)
        setParamsToDelete(params)
      }

      if (action === 'save') {
        setLoading(true)
        params.api.stopEditing(false)
        let postData = {}
        postData.binLocation = params.data.binLocation
        postData.cartonCapacity = params.data.cartonCapacity
        postData.remarks = params.data.remarks
        postData.pickupLocation = params.data.pickupLocation
        postData.holdingLocation = params.data.holdingLocation
        postData.locationType = params.data.locationType

        //use formik to validate in future
        let canPostCartonCap = false
        let canPostRemarks = false

        if (locationType === locTypeOptions[0]) {
          if (params.node.data.cartonCapacity) {
            if (regex.NUMBER_NO_SC.test(params.node.data.cartonCapacity)) {
              canPostCartonCap = true
            } else {
              setLoading(false)
              showAlertError(
                'Carton capacity should not contain alphabets/special characters',
                'save',
              )
            }
          } else {
            setLoading(false)
            showAlertError('Carton capacity requires a value', 'save')
          }
          if (params.node.data.remarks) {
            if (!regex.ALPHANUMERIC_NO_SC.test(params.node.data.remarks)) {
              setLoading(false)
              showAlertError('Remarks should not contain special characters', 'save')
            } else if (params.node.data.remarks.length > 25) {
              setLoading(false)
              showAlertError('Remarks should not exceed 25 characters', 'save')
            } else {
              canPostRemarks = true
            }
          } else {
            canPostRemarks = true
          }
        } else if (locationType === locTypeOptions[1]) {
          if (params.node.data.cartonCapacity) {
            if (regex.NUMBER_NO_SC.test(params.node.data.cartonCapacity)) {
              canPostCartonCap = true
            } else {
              setLoading(false)
              showAlertError(
                'Cage capacity should not contain alphabets/special characters',
                'save',
              )
            }
          } else {
            showAlertError('Cage capacity requires a value', 'save')
          }

          if (params.node.data.remarks) {
            if (!regex.ALPHANUMERIC_NO_SC.test(params.node.data.remarks)) {
              setLoading(false)
              showAlertError('Remarks should not contain special characters', 'save')
            } else if (params.node.data.remarks.length > 25) {
              setLoading(false)
              showAlertError('Remarks should not exceed 25 characters', 'save')
            } else {
              canPostRemarks = true
            }
          } else {
            canPostRemarks = true
          }
        }

        if (canPostCartonCap && canPostRemarks) {
          axios
            .put(process.env.REACT_APP_SERVER_URI + '/api/binLocation/save', postData)
            .then(response => {
              showAlertSuccess(response.data.message, 'save')
              setRowValues(formik.values)
              setLoading(false)
            })
            .catch(err => {
              setLoading(false)
              if (err.response.data.error && !err.response.data.record)
                showAlertError(err.response.data.error, 'save')
              else if (err.response.data.error && err.response.data.record)
                showAlertError(err.response.data.record, 'save')
              else if (err.response.data.warning) showAlertWarn(err.response.data.warning, 'save')
              else showAlertError('Internal Server Error')

              // console.log(err)
              // showAlertError(err.response.data.message, 'save')
            })
        }

        // call api again to refresh
      }

      if (action === 'cancel') {
        params.api.stopEditing(true)
      }
    }
    // gridApi.refreshCells(params)
  }

  const onRowEditingStarted = params => {
    params.api.refreshCells({
      columns: ['action'],
      rowNodes: [params.node],
      force: true,
    })
  }
  const onRowEditingStopped = params => {
    gridApi.undoCellEditing()
    params.api.refreshCells({
      columns: ['action'],
      rowNodes: [params.node],
      force: true,
    })
    // gridApi.refreshCells(params)
  }

  const onGridReady = params => {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }

  const handleToggle = event => {
    setLocationType(event.target.value)
    formik.setSubmitting(false)
    setLoading(true)
  }

  const handleNo = event => {
    const maxLength = 4

    formik.setFieldValue(
      event.target.name,
      event.target.value.replace(regex.EXCEPT_NUMBER, '').substring(0, maxLength),
    )
    formik.setSubmitting(false)
  }

  const handleText = event => {
    formik.setFieldValue(
      event.target.name,
      event.target.value.replace(regex.EXCEPT_ALPHANUMERIC, ''),
    )
    formik.setSubmitting(false)
  }

  const handleClose = () => setShowModal(false)

  const handleExport = () => {
    var excelParams = {
      fileName: 'Bin Locations.xlsx',
      columnKeys: [
        'locationType',
        'binLocation',
        'pickupLocation',
        'cartonCapacity',
        'remarks',
        'holdingLocation',
      ],
      allColumns: false,
    }
    gridApi.exportDataAsExcel(excelParams)
  }

  let showSearch = (
    <React.Fragment>
      <div className='mb-3 row'>
        <div className='col-4'>
          <label className='form-label'>{t('Carton_Capacity_label')}</label>

          <input
            id='cartonCap'
            name='cartonCap'
            type='text'
            placeholder={t('TEXT_CARTON_CAPACITY_label')}
            // onChange={formik.handleChange}
            onChange={handleNo}
            onBlur={formik.handleBlur}
            value={formik.values.cartonCap}
            className='form-control'
          />
          {formik.touched.cartonCap && formik.errors.cartonCap ? (
            <span className='h5 text-danger'>{formik.errors.cartonCap}</span>
          ) : null}
        </div>
      </div>
      <div className='row'>
        <div className='col-7'>
          <label className='form-label'>{t('Remarks_label')}</label>
          <input
            id='whRemarks'
            name='whRemarks'
            type='text'
            placeholder={t('TEXT_SEARCH_REMARKS_label')}
            // onChange={event => formik.setFieldValue('remarks', event.target.value)}
            onChange={handleText}
            onBlur={formik.handleBlur}
            value={formik.values.whRemarks}
            className='form-control'
          />
        </div>
        <div className='col align-self-end'>
          <button onClick={handleGo} className='btn btn-primary mr-3' disabled={!formik.isValid}>
            {t('Go_label')}
          </button>
        </div>
      </div>
      {formik.errors.whRemarks ? (
        <span className='h5 text-danger'>{formik.errors.whRemarks}</span>
      ) : null}
    </React.Fragment>
  )

  let grid = (
    <AgGridReact
      columnDefs={whState.columnDefs}
      rowData={rowData}
      animateRows={true}
      rowHeight={40}
      headerHeight={40}
      paginationPageSize={10}
      defaultColDef={whState.defaultColDef}
      frameworkComponents={whState.frameworkComponents}
      pagination={true}
      context={props.context}
      modules={AllModules}
      onGridReady={onGridReady}
      onRowEditingStopped={onRowEditingStopped}
      onRowEditingStarted={onRowEditingStarted}
      onCellClicked={onCellClicked}
      editType='fullRow'
      suppressClickEdit={true}
      undoRedoCellEditing={true}
    />
  )

  if (locationType === locTypeOptions[1]) {
    showSearch = (
      <React.Fragment>
        <div className='mb-3 row'>
          <div className='col-4'>
            <label className='form-label'>{t('Pickup_Location_label')}</label>

            <Dropdown
              id='pickupLocation'
              name='pickupLocation'
              closeMenuOnSelect={true}
              value={formik.values.pickupLocation}
              onChange={selectedOption => formik.setFieldValue('pickupLocation', selectedOption)}
              onBlur={formik.handleBlur}
              options={storedPickupLocations}
              optionLabel='refValue'
              optionValue='refCode'
              placeholder={t('TEXT_PICKUP_LOCATION_label')}
              isClearable
            />
            {formik.touched.pickupLocation && formik.errors.pickupLocation ? (
              <span className='h5 text-danger'>{formik.errors.pickupLocation}</span>
            ) : null}
          </div>
          <div className='col-4'>
            <label className='form-label'>{t('Cage Capacity')}</label>

            <input
              id='cageCap'
              name='cageCap'
              type='text'
              placeholder={t('TEXT_CAGE_CAPACITY_label')}
              // onChange={formik.handleChange}
              onChange={handleNo}
              onBlur={formik.handleBlur}
              value={formik.values.cageCap}
              className='form-control'
            />
            {formik.touched.cageCap && formik.errors.cageCap ? (
              <span className='h5 text-danger'>{formik.errors.cageCap}</span>
            ) : null}
          </div>
        </div>
        <div className='row'>
          <div className='col-7'>
            <label className='form-label'>{t('Remarks_label')}</label>
            <input
              id='apRemarks'
              name='apRemarks'
              type='text'
              placeholder={t('TEXT_SEARCH_REMARKS_label')}
              // onChange={event => formik.setFieldValue('remarks', event.target.value)}
              onChange={handleText}
              onBlur={formik.handleBlur}
              value={formik.values.apRemarks}
              className='form-control'
            />
          </div>
          <div className='col align-self-end'>
            <button onClick={handleGo} className='btn btn-primary mr-3' disabled={!formik.isValid}>
              {t('Go_label')}
            </button>
          </div>
        </div>
        {formik.errors.apRemarks ? (
          <span className='h5 text-danger'>{formik.errors.apRemarks}</span>
        ) : null}
      </React.Fragment>
    )

    grid = (
      <AgGridReact
        columnDefs={apState.columnDefs}
        rowData={rowData}
        animateRows={true}
        rowHeight={40}
        headerHeight={40}
        defaultColDef={apState.defaultColDef}
        frameworkComponents={apState.frameworkComponents}
        pagination={true}
        paginationPageSize={10}
        modules={AllModules}
        context={props.context}
        onGridReady={onGridReady}
        onRowEditingStopped={onRowEditingStopped}
        onRowEditingStarted={onRowEditingStarted}
        onCellClicked={onCellClicked}
        editType='fullRow'
        suppressClickEdit={true}
        undoRedoCellEditing={true}
      />
    )
  }

  return (
    <div className='container bg-white'>
      <h1 className='mb-4 mt-5'>{t('Maintain_Bin_Location_label')}</h1>

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
                onChange={handleToggle}
                checked={locationType === locTypeOptions[0]}
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
                onChange={handleToggle}
                checked={locationType === locTypeOptions[1]}
              />
              <label className='custom-control-label radio-inline' htmlFor='customRadio2'>
                {t('Pickup_Counter_label')}
              </label>
            </div>
          </div>
        </div>
      </div>
      {showSearch}
      <div className='mt-3 mb-3 row'>
        <div className='col-12'>
          <div className='row mb-4'>
            <div className='col text-right'>
              <button
                type='submit'
                className='btn btn-outline-secondary ml-3'
                disabled={!(rowData && rowData !== null && rowData.length > 0)}
                onClick={() => handleExport()}
              >
                {t('Export_To_Excel_label')}
              </button>
            </div>
          </div>{' '}
          {loading === true ? (
            <div style={{ textAlign: 'center' }} className='mt-5'>
              <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
            </div>
          ) : (
            <div className='ag-theme-alpine' style={{ height: 400, width: '100%' }}>
              {grid}
            </div>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose} centered={true}>
        <Modal.Header closeButton>Delete Record</Modal.Header>
        <Modal.Body>Are you sure you want to delete?</Modal.Body>
        <Modal.Footer>
          <button type='button' className=' btn btn-outline-secondary' onClick={handleClose}>
            {t('Cancel_label')}
          </button>

          <button type='button' onClick={applyDelete} className='btn btn-primary mr-3'>
            {t('Delete_label')}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

const mapStateToProps = state => ({
  rowData: state.binLocationReducer.rowData,
  storedPickupLocations: state.binLocationReducer.pickupLocations,
  locationType: state.binLocationReducer.locationType,
})

const mapDispatchToProps = dispatch => ({
  setInputOptions: options => dispatch(setInputOptions(options)),
  setRowData: data => dispatch(setRowData(data)),
  setLocationType: data => dispatch(setLocationType(data)),
  showAlertWarn: (message, status) => dispatch(alertActions.warning(message, status)),
  showAlertSuccess: (message, status) => dispatch(alertActions.success(message, status)),
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MaintainBinLocation)
