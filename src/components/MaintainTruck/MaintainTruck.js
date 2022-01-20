import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { ToolTip } from 'components/AgGridCustomComponents/Editors'
import * as labels from 'constants/labels'
import * as regex from 'constants/regex'
import Loader from 'react-loader-spinner'
import { AgGridReact } from '@ag-grid-community/react'
import { AllModules } from '@ag-grid-enterprise/all-modules'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

import { alertActions } from 'actions/alert.actions'
import { columnEdit, setAllTruck } from 'actions/action-truck'

import { TextEditor, TextEditor30, NumberEditor } from 'components/AgGridCustomComponents/Editors'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import { Modal } from 'react-bootstrap'

const actionCellRenderer = params => {
  let divElement = document.createElement('div')

  let editingCells = params.api.getEditingCells()

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
const MaintainTruck = props => {
  const { showAlertSuccess, showAlertError, showAlertWarn, setAllTruck, allTruck } = props
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [paramsToDelete, setParamsToDelete] = useState()
  const { t } = useTranslation()
  useEffect(() => {
    setLoading(true)
    axios
      .get(process.env.REACT_APP_SERVER_URI + '/api/truck/getAllTruck')
      .then(response => {
        setAllTruck(response.data.result)
        setLoading(false)
      })
      .catch(err => {
        setAllTruck([])
        setLoading(false)
        if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, 'getting truck info')
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, 'getting truck info')
        else if (err.response.data.warning)
          showAlertWarn(err.response.data.warning, 'getting truck info')
        else showAlertError('Internal Server Error')
      })
  }, [])

  const applyDelete = () => {
    setShowModal(false)
    const params = paramsToDelete
    const toBeDeleted = gridApi.getRowNode(params.node.rowIndex)?.data
    setLoading(true)

    // call API to delete
    axios
      .post(process.env.REACT_APP_SERVER_URI + '/api/truck/deleteTruck/' + toBeDeleted?.truckNumber)
      .then(response => {
        // setLoading(false)

        showAlertSuccess(response.data.message, 'truck deletion')
        // call API to refresh allTruck data
        axios
          .get(process.env.REACT_APP_SERVER_URI + '/api/truck/getAllTruck')
          .then(response => {
            setAllTruck(response.data.result)
            setLoading(false)
          })
          .catch(err => {
            setLoading(false)
            setAllTruck([])
          })

        //soft delete to remove once getAllTruck api is updated to
        params.api.updateRowData({ remove: [gridApi.getRowNode(params.node.rowIndex)?.data] })
      })
      .catch(err => {
        setLoading(false)
        if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, 'truck deletion')
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, 'truck deletion')
        else if (err.response.data.warning)
          showAlertWarn(err.response.data.warning, 'truck deletion')
        else showAlertError('Internal Server Error')
      })
  }

  const formik = useFormik({
    initialValues: {
      searchQuery: '',
    },
    validationSchema: Yup.object({
      searchQuery: Yup.string()
        // .required('Please enter a search query')
        .matches(regex.ALPHANUMERIC_NO_SC, 'Special characters are not accepted')
        .nullable(),

      // .trim(),
    }),
    onSubmit: values => {
      if (formik.values.searchQuery !== '') {
        const postData = encodeURIComponent(values.searchQuery.trim())

        setLoading(true)
        axios
          .get(process.env.REACT_APP_SERVER_URI + '/api/truck/getsearchTruck/' + postData)
          .then(response => {
            setAllTruck(response.data.result)
            setLoading(false)
          })
          .catch(err => {
            setAllTruck([])
            setLoading(false)
            if (err.response.data.error && !err.response.data.record)
              showAlertError(err.response.data.error, 'truck search')
            else if (err.response.data.error && err.response.data.record)
              showAlertError(err.response.data.record, 'truck search')
            else if (err.response.data.warning)
              showAlertWarn(err.response.data.warning, 'truck search')
            else showAlertError('Internal Server Error')
          })
      } else {
        setLoading(true)
        axios
          .get(process.env.REACT_APP_SERVER_URI + '/api/truck/getAllTruck')
          .then(response => {
            setAllTruck(response.data.result)
            setLoading(false)
          })
          .catch(err => {
            setAllTruck([])
            setLoading(false)
            if (err.response.data.error && !err.response.data.record)
              showAlertError(err.response.data.error, 'getting truck info')
            else if (err.response.data.error && err.response.data.record)
              showAlertError(err.response.data.record, 'getting truck info')
            else if (err.response.data.warning)
              showAlertWarn(err.response.data.warning, 'getting truck info')
            else showAlertError('Internal Server Error')
          })
      }
    },
  })

  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)

  const columnDefs = [
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
      headerName: t('Truck_Number_label'),
      field: 'truckNumber',
      sortable: true,
      sort: 'asc',
      filter: true,
      tooltipField: 'truckNumber',
      lockPosition: true,
      editable: false,
      width: 120,
    },

    {
      headerName: t('Model_label'),
      field: 'truckModel',
      sortable: true,
      filter: true,
      lockPosition: true,
      tooltipField: 'truckModel',
      editable: true,
      cellEditor: 'textEditor30',
      width: 140,
    },

    {
      headerName: t('Manufacturer_label'),
      field: 'truckManufacturer',
      sortable: true,
      filter: true,
      lockPosition: true,
      tooltipField: 'truckManufacturer',
      editable: true,
      cellEditor: 'textEditor30',
      width: 140,
    },

    {
      headerName: t('Year_label'),
      field: 'truckYear',
      sortable: true,
      filter: true,
      tooltipField: 'truckYear',
      lockPosition: true,
      editable: true,
      cellEditor: 'numberEditor',
      width: 100,
    },

    {
      headerName: t('Make_label'),
      field: 'truckMake',
      sortable: true,
      filter: true,
      tooltipField: 'truckMake',
      lockPosition: true,
      editable: true,
      cellEditor: 'textEditor30',
      width: 130,
    },

    {
      headerName: t('Status_label'),
      field: 'entityStatus.entityDisplayStatus',
      sortable: true,
      filter: true,
      lockPosition: true,
      editable: false,
      tooltipField: 'entityStatus.entityDisplayStatus',
      width: 180,
    },

    {
      headerName: t('Remarks_label'),
      field: 'truckRemarks',
      sortable: true,
      filter: true,
      lockPosition: true,
      editable: true,
      tooltipField: 'truckRemarks',
      cellEditor: 'textEditor30',
      width: 180,
    },
  ]

  const defaultColDef = {
    width: 150,
    resizable: true,
    filter: true,
    wrapText: true,
    cellStyle: rowStyle,
    headerComponentParams: {
      template:
        '<div class="ag-cell-label-container" role="presentation">' +
        '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
        '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
        '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>' +
        '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
        '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
        '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>' +
        '    <span ref="eText" class="ag-header-cell-text" role="columnheader" style="white-space: normal;"></span>' +
        '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
        '  </div>' +
        '</div>',
    },
    borders: true,
    tooltipComponent: 'customTooltip',
    field: 'value',
  }
  const frameworkComponents = {
    customTooltip: ToolTip,
    numberEditor: NumberEditor,
    textEditor: TextEditor,
    textEditor30: TextEditor30,
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

        // setLoading(true)
      }

      if (action === 'save') {
        params.api.stopEditing(false)
        let postData = params.data
        setLoading(true)
        axios
          .post(process.env.REACT_APP_SERVER_URI + '/api/truck/updateTruck', postData)
          .then(response => {
            showAlertSuccess(response.data.message, 'update truck')
            axios
              .get(process.env.REACT_APP_SERVER_URI + '/api/truck/getAllTruck')
              .then(response => {
                setAllTruck(response.data.result)
                setLoading(false)
              })
              .catch(err => {
                setLoading(false)
                setAllTruck([])
              })
          })
          .catch(err => {
            setLoading(false)
            if (err.response.data.error && !err.response.data.record)
              showAlertError(err.response.data.error, 'update truck')
            else if (err.response.data.error && err.response.data.record)
              showAlertError(err.response.data.record, 'update truck')
            else if (err.response.data.warning)
              showAlertWarn(err.response.data.warning, 'update truck')
            else showAlertError('Internal Server Error')
          })

        // call api again to refresh
        setRowData(null)
      }

      if (action === 'cancel') {
        params.api.stopEditing(true)
      }
    }
  }

  const setRowData = values => {
    if (!values) {
      axios
        .get(process.env.REACT_APP_SERVER_URI + '/api/truck/getAllTruck')
        .then(response => {
          setAllTruck(response.data.result)
        })
        .catch(err => {
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'getting truck info')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'getting truck info')
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, 'getting truck info')
          else showAlertError('Internal Server Error')
        })
    }
  }

  const handleAlphaNumeric = (event, maxLength = 15) => {
    formik.setFieldValue(
      event.target.name,
      event.target.value.replace(regex.EXCEPT_ALPHANUMERIC, '').substring(0, maxLength),
    )
    formik.setSubmitting(false)
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
    setRowData(null)
  }
  const handleClose = () => setShowModal(false)

  const onGridReady = params => {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }
  const onBtExport = () => {
    var excelParams = {
      fileName: 'trucks.xlsx',
      columnKeys: [
        'truckNumber',
        'truckModel',
        'truckManufacturer',
        'truckYear',
        'truckMake',
        'entityStatus.entityDisplayStatus',
        'truckRemarks',
      ],
      allColumns: false,
    }
    gridApi.exportDataAsExcel(excelParams)
  }
  return (
    <div className='ml-3 mr-2 bg-white'>
      <h1 className='mb-4 mt-5'>{t('Maintain_Truck_label')}</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className='mb-2 row'>
          <div className='col-8'>
            <input
              id='searchQuery'
              name='searchQuery'
              type='text'
              placeholder={t('TEXT_MAINTAIN_TRUCK_SEACH_label')}
              onChange={e => handleAlphaNumeric(e, 30)}
              onBlur={formik.handleBlur}
              value={formik.values.searchQuery}
              className='form-control'
            />
          </div>
          <button
            type='submit'
            className='btn btn-primary'
            //   disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
            disabled={!formik.isValid}
          >
            {t('BUTTON_SEARCH_label')}
          </button>
        </div>
        <div className='row'>
          <div className=' col text-right mr-4'>
            <br />{' '}
            <button
              onClick={() => onBtExport()}
              className=' btn btn-outline-secondary '
              // disabled={!(a.length > 0)}
            >
              {t('Export_To_Excel_label')}
            </button>
          </div>
        </div>
        <div className='row'>
          <div className='col-8'>
            {formik.touched.searchQuery && formik.errors.searchQuery ? (
              <span className='h5 text-danger'>{formik.errors.searchQuery}</span>
            ) : null}
          </div>
        </div>
      </form>
      <div className='mb-2 mt-2 row'>
        <div className='col-12'>{t('Results_label')}</div>
      </div>
      <div className='mb-2 row' style={{ height: '350px' }}>
        <div className='col-12'>
          {loading === true ? (
            <div style={{ textAlign: 'center' }} className='mt-5'>
              <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
            </div>
          ) : (
            <div className='ag-theme-alpine' style={{ height: 400, width: '100%' }}>
              <AgGridReact
                columnDefs={columnDefs}
                rowData={allTruck}
                rowHeight={40}
                headerHeight={40}
                animateRows={true}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={10}
                tooltipShowDelay={0}
                context={props.context}
                modules={AllModules}
                onGridReady={onGridReady}
                onRowEditingStopped={onRowEditingStopped}
                onRowEditingStarted={onRowEditingStarted}
                onCellClicked={onCellClicked}
                frameworkComponents={frameworkComponents}
                editType='fullRow'
                suppressClickEdit={true}
                undoRedoCellEditing={true}
              />
            </div>
          )}
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
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  allTruck: state.truckReducer.allTruck,
})

const mapDispatchToProps = dispatch => ({
  showAlertSuccess: (message, status) => dispatch(alertActions.success(message, status)),
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
  showAlertWarn: (message, status) => dispatch(alertActions.warning(message, status)),
  columnEdit: data => dispatch(columnEdit(data)),
  setAllTruck: data => dispatch(setAllTruck(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MaintainTruck)
