import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import Moment from 'moment'
import { useTranslation } from 'react-i18next'
import * as labels from 'constants/labels'
import DatePicker from 'react-datepicker'
import { SearchDropdown } from 'components/UI/Input'
import Loader from 'react-loader-spinner'
import 'react-datepicker/dist/react-datepicker.css'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'assets/styles/customDatePickerWidth.css'

import { alertActions } from 'actions/alert.actions'
import { AgGridReact } from '@ag-grid-community/react'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import { AllModules } from '@ag-grid-enterprise/all-modules'

const NACCSFileSummaryEnquiry = props => {
  const [loading, setLoading] = useState(false)
  const { showAlertSuccess, showAlertError, showAlertWarn } = props
  const { t } = useTranslation()
  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)
  const [rowData, setRowData] = useState([])
  const [searchData, setSearchData] = useState([])
  const [searchValue, setSearchValue] = useState()

  const columnDefs = [
    {
      headerName: t('S.No_label'),
      field: 'serialNo',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 85,
      editable: false,
      valueGetter: 'node.rowIndex + 1',
    },
    {
      headerName: t('Flight_Number_label'),
      field: 'carrierNumber',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 140,
      editable: false,
    },
    {
      headerName: t('FLIGHT_DEPARTURE_DATETIME_label'),
      field: 'carrierDepartureTm',
      sortable: true,
      filter: true,
      lockPosition: true,
      sort: 'asc',
      width: 180,
      editable: false,
    },
    {
      headerName: t('No._of_Files_Generated_label'),
      field: 'fileGenerated',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 160,
      editable: false,
    },
    {
      headerName: t('No._of_Files_Submitted_label'),
      field: 'fileSubmitted',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 205,
      editable: false,
    },
    {
      headerName: t('No._of_Files_Acknowledged_label'),
      field: 'fileAcknowledged',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 230,
      editable: false,
    },
  ]
  const defaultColDef = {
    width: 125,
    sortable: true,
    wrapText: true,
    resizable: true,
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
  }
  const autoGroupColumnDef = {
    width: 300,
    cellStyle: rowStyle,
  }
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nonReconciled: false,
    },
    validationSchema: Yup.object({
      startDate: Yup.date().required('Please enter a date range'),
      endDate: Yup.date()
        .required('Please enter a date range')
        .typeError('Please enter a date range'),
      nonReconciled: Yup.bool(),
    }),
    onSubmit: values => {
      setSearchValue(null)
      const dateFrom = Moment(values.startDate).format('YYYY-MM-DD')
      const dateTo = Moment(values.endDate).format('YYYY-MM-DD')
      setLoading(true)
      axios
        .get(
          process.env.REACT_APP_SERVER_URI +
            '/api/naccs/fileSummaryEnquiry?nonReconciled=' +
            (values.nonReconciled ? 'true' : 'false') +
            '&dateFrom=' +
            dateFrom +
            '&dateTo=' +
            dateTo,
        )
        .then(response => {
          showAlertSuccess(response.data.message, 'fetching records')
          const getData = response.data.result
          const searchOptions = []

          getData.forEach((getDataItem, index) => {
            searchOptions.push({
              value: getDataItem.carrierNumber,
              label: getDataItem.carrierNumber,
            })
          })

          setSearchData(searchOptions)
          setRowData(getData)
          setLoading(false)
        })
        .catch(err => {
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'fetching records')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'fetching records')
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, 'fetching records')
          else showAlertError('Internal Server Error')
          setLoading(false)
          setRowData([])
        })
    },
  })

  useEffect(() => {
    if (rowData.length > 0 && formik.isValid && formik.dirty) {
      const dateFrom = Moment(formik.values.startDate).format('YYYY-MM-DD')
      const dateTo = Moment(formik.values.endDate).format('YYYY-MM-DD')
      setLoading(true)
      axios
        .get(
          process.env.REACT_APP_SERVER_URI +
            '/api/naccs/fileSummaryEnquiry?nonReconciled=' +
            (formik.values.nonReconciled ? 'true' : 'false') +
            '&dateFrom=' +
            dateFrom +
            '&dateTo=' +
            dateTo,
        )
        .then(response => {
          const getData = response.data.result

          if (searchValue) {
            const filteredArray = [...getData].filter(
              arr => arr.carrierNumber === searchValue.value,
            )
            setRowData(filteredArray)
          } else {
            setRowData(getData)
          }
          setLoading(false)
        })
        .catch(err => {
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'fetching records')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'fetching records')
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, 'fetching records')
          else showAlertError('Internal Server Error')
          setLoading(false)
          setRowData([])
        })
    }
  }, [searchValue])

  function onGridReady(params) {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }

  const handleExport = () => {
    var excelParams = {
      fileName: 'NACCS File Summary Enquiry.xlsx',
    }
    gridApi.exportDataAsExcel(excelParams)
  }

  const handleDate = dates => {
    const [start, end] = dates
    formik.setFieldValue('startDate', start, true)
    formik.setFieldValue('endDate', end, true)

    formik.setSubmitting(false)
  }

  const handleCancel = () => {
    setSearchValue(null)
    formik.setFieldValue('startDate', null, false)
    formik.setFieldValue('endDate', null, false)
    formik.setFieldValue('nonReconciled', false, true)
    setRowData([])
    formik.resetForm()
  }

  const formatDate = (dateOne, dateTwo) => {
    if (dateOne && dateTwo) {
      const strOne =
        dateOne.getFullYear() +
        '-' +
        (dateOne.getMonth() + 1 < 10 ? '0' + (dateOne.getMonth() + 1) : dateOne.getMonth() + 1) +
        '-' +
        (dateOne.getDate() < 10 ? '0' + dateOne.getDate() : dateOne.getDate())

      const strTwo =
        dateTwo.getFullYear() +
        '-' +
        (dateTwo.getMonth() + 1 < 10 ? '0' + (dateTwo.getMonth() + 1) : dateTwo.getMonth() + 1) +
        '-' +
        (dateTwo.getDate() < 10 ? '0' + dateTwo.getDate() : dateTwo.getDate())

      return strOne + ' - ' + strTwo
    }
    return null
  }

  return (
    <div className='container bg-white'>
      <div>
        <h1 className='mb-4 mt-5'>{t('NACCS_File_Summary_Enquiry_label')}</h1>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className='row'>
          <div className='col'>
            <label className='form-label'>
              {t('LABEL_DEPARTURE_DATE_RANGE_label')}
              <span className='text-danger'> *</span>
            </label>
          </div>
        </div>
        <div className='row mb-2'>
          <div className='col-4'>
            <div className='customDatePickerWidth'>
              <DatePicker
                id='endDate'
                name='endDate'
                onBlur={formik.handleBlur}
                className='form-control'
                autoComplete='off'
                placeholderText={labels.TEXT_DATE_FORMAT}
                selected={formik.values.startDate}
                onChange={handleDate}
                value={formatDate(formik.values.startDate, formik.values.endDate)}
                dateFormat='yyyy-MM-dd'
                selectsRange
                startDate={formik.values.startDate}
                endDate={formik.values.endDate}
                shouldCloseOnSelect={false}
                // minDate={new Date()}
                // onSelect={handleDate} //when day is clicked
                disabledKeyboardNavigation
                // disabled={disabled}
              />
              {formik.errors.endDate ? (
                <span className='h5 text-danger'>{formik.errors.endDate}</span>
              ) : null}
            </div>
          </div>
          <div className='col-3'>
            <div className='form-group mt-2'>
              <div className='custom-control custom-checkbox'>
                <input
                  type='checkbox'
                  className='custom-control-input'
                  id='nonReconciled'
                  name='nonReconciled'
                  checked={formik.values.nonReconciled}
                  onChange={event => formik.setFieldValue('nonReconciled', event.target.checked)}
                />
                <label className='custom-control-label' htmlFor='nonReconciled'>
                  {t('NON_RECONCILED_label')}
                </label>
              </div>
            </div>
          </div>

          <div className='col' />
          <div className='col-4 text-right'>
            <span className='text-left'>
              <SearchDropdown
                searchOptions={searchData}
                disabled={!(rowData.length > 0)}
                setSearchValue={setSearchValue}
                searchValue={searchValue}
              />
            </span>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={!(formik.isValid && formik.dirty)}
              // disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
            >
              {t('Go_label')}
            </button>
            <button
              type='button'
              className='btn btn-outline-secondary ml-3'
              onClick={handleCancel}
              // disabled={!(formik.isValid && formik.dirty)}
              // disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
            >
              {t('Cancel_label')}
            </button>
          </div>
        </div>
      </form>

      <div className='mt-5'>
        <div className='row mt-4'>
          <div className='col text-right'>
            <button
              type='submit'
              className='btn btn-outline-secondary ml-3'
              disabled={!(rowData.length > 0)}
              onClick={() => handleExport()}
            >
              {t('Export_To_Excel_label')}
            </button>
          </div>
        </div>

        <label className='form-label'>{t('Results_label')}</label>
        {loading === true ? (
          <div style={{ textAlign: 'center' }} className='mt-5'>
            <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
          </div>
        ) : (
          <div
            id='myGrid'
            className='ag-theme-alpine'
            style={{
              width: '100%',
              height: 400,
            }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              animateRows={true}
              rowHeight={30}
              headerHeight={40}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={10}
              context={props.context}
              modules={AllModules}
              onGridReady={onGridReady}
              rowSelection={'multiple'}
              editType='fullRow'
              suppressClickEdit={true}
              undoRedoCellEditing={true}
              groupMultiAutoColumn={true}
              groupDefaultExpanded={1}
              autoGroupColumnDef={autoGroupColumnDef}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// const mapStateToProps = state => ({
// terminalNo: state.deliveryManifestReducer.terminalNo,
// })

const mapDispatchToProps = dispatch => ({
  showAlertSuccess: (message, status) => dispatch(alertActions.success(message, status)),
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
  showAlertWarn: (message, status) => dispatch(alertActions.warning(message, status)),
})

export default connect(null, mapDispatchToProps)(NACCSFileSummaryEnquiry)
