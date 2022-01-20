import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import * as labels from 'constants/labels'
import * as regex from 'constants/regex'
import DatePicker from 'react-datepicker'
import { Dropdown } from 'components/UI/Input'
import { useTranslation } from 'react-i18next'
import 'react-datepicker/dist/react-datepicker.css'
import Loader from 'react-loader-spinner'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Moment from 'moment'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'assets/styles/customDatePickerWidth.css'

import { alertActions } from 'actions/alert.actions'
import { AgGridReact } from '@ag-grid-community/react'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import { AllModules } from '@ag-grid-enterprise/all-modules'

const NACCSDailyGenListReport = props => {
  const { showAlertSuccess, showAlertError, showAlertWarn } = props
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)
  const [carrierCodeList, setCarrierCodeList] = useState([])
  const [rowData, setRowData] = useState([])

  const columnDefs = [
    // {
    //   headerName: 'S.No',
    //   field: 'serialNo',
    //   sortable: true,
    //   filter: true,
    //   lockPosition: true,
    //   width: 90,
    //   editable: false,
    //   border: true,
    // },
    {
      headerName: t('Flight_Number_label'),
      field: 'carrierNumber',
      sortable: true,
      filter: true,
      width: 130,
      editable: false,
      rowGroup: true,
      hide: true,
      showRowGroup: true,
    },
    {
      headerName: t('Pax_File_Name_label'),
      field: 'paxFileName',
      sortable: true,
      filter: true,
      width: 200,
      editable: false,
    },
    {
      headerName: t('Generated_Date/Time_label'),
      field: 'naccsGenerateTm',
      sortable: true,
      filter: true,
      sort: 'asc',
      width: 160,
      cellRenderer: stringFormatter,
      editable: false,
    },
    {
      headerName: t('Submitted_Date/Time_label'),
      field: 'submittedTm',
      sortable: true,
      filter: true,
      width: 160,
      cellRenderer: stringFormatter,
      editable: false,
    },
    {
      headerName: t('Acknowledged_Date/Time_label'),
      field: 'acknowledgedTm',
      sortable: true,
      filter: true,
      width: 160,
      cellRenderer: stringFormatter,
      editable: false,
    },
    {
      headerName: t('Transactions_label'),
      field: 'transactions',
      sortable: true,
      filter: true,
      width: 140,
      editable: false,
    },
    {
      headerName: t('SKU_Count_label'),
      field: 'skuCount',
      sortable: true,
      filter: true,
      width: 110,
      editable: false,
    },
  ]
  function stringFormatter(params) {
    var date = params.value
    if (params.value && params.value !== null) {
      var spl = params.value.split(':')
      var firstChar = spl[0] + ':' + spl[1]
      return firstChar
    }
  }
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
    width: 130,
    cellStyle: rowStyle,
  }
  const frameworkComponents = {}

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { nonAcknowledged: false },
    validationSchema: Yup.object({
      startDate: Yup.date().required('Please enter a date range'),
      endDate: Yup.date()
        .required('Please enter a date range')
        .typeError('Please enter a date range'),
      flightNumber: Yup.object()
        .shape({
          key: Yup.string().required(),
          value: Yup.string().required(),
        })
        .required('Please select a flight number')
        .typeError('Please select a flight number'),
      nonAcknowledged: Yup.bool(),
    }),
    onSubmit: values => {
      const dateFrom = Moment(values.startDate).format('YYYY-MM-DD')
      const dateTo = Moment(values.endDate).format('YYYY-MM-DD')
      setLoading(true)
      axios
        .get(
          process.env.REACT_APP_SERVER_URI +
            '/api/naccs/dailyNaccsList?nonAcknowledged=' +
            (values.nonAcknowledged ? 'true' : 'false') +
            '&dateFrom=' +
            dateFrom +
            '&dateTo=' +
            dateTo +
            '&carrierCodeNumber=' +
            values.flightNumber.value.replace(/\s/g, ''),
        )
        .then(response => {
          showAlertSuccess(response.data.message, 'fetching records')
          const getData = response.data.result.naccsFileStatusResponse

          const newRowData = []

          getData.forEach((getDataItem, index) => {
            getDataItem.transactions.forEach((transactionItem, index) => {
              newRowData.push({
                acknowledgedTm: getDataItem.acknowledgedTm,
                carrierDepatureTm: getDataItem.carrierDepatureTm,
                carrierNumber: getDataItem.carrierNumber,
                naccsGenerateTm: getDataItem.naccsGenerateTm,
                paxFileName: getDataItem.paxFileName,
                submittedTm: getDataItem.submittedTm,
                transactions: transactionItem,
                skuCount: getDataItem.skuCount,
              })
            })
          })

          setRowData(newRowData)
          setLoading(false)
        })
        .catch(err => {
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'generating NACCS Information')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'generating NACCS Information')
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, 'generating NACCS Information')
          else showAlertError('Internal Server Error')
          setLoading(false)
          setRowData([])
        })
    },
  })

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SERVER_URI + '/api/carrier/carriercode')
      .then(response => {
        const dropdownList = []

        response.data.result.forEach(function (element) {
          dropdownList.push({ key: element, value: element })
        })
        setCarrierCodeList(dropdownList)
      })
      .catch(err => {
        if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, 'fetching carrier codes')
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, 'fetching carrier codes')
        else if (err.response.data.warning)
          showAlertWarn(err.response.data.warning, 'fetching carrier codes')
        else showAlertError('Internal Server Error')
      })
  }, [])

  function onGridReady(params) {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }

  const handleDate = dates => {
    const [start, end] = dates
    formik.setFieldValue('startDate', start, true)
    formik.setFieldValue('endDate', end, true)

    formik.setSubmitting(false)
  }

  const handleExport = () => {
    var excelParams = {
      fileName: 'Daily NACCS Generation List Report.xlsx',
    }
    gridApi.exportDataAsExcel(excelParams)
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

  const handleCancel = () => {
    formik.resetForm()
    formik.setFieldValue('startDate', null, false)
    formik.setFieldValue('endDate', null, false)
    formik.setFieldValue('flightNumber', null, true)
    formik.setFieldValue('nonAcknowledged', false, true)

    setRowData([])
  }

  return (
    <div className='container bg-white'>
      <div>
        <h1 className='mb-4 mt-5'>{t('Daily_NACCS_Generation_List_Report_label')}</h1>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className='row'>
          <div className='col'>
            <div className='row'>
              <div className='col-3'>
                <label className='form-label'>
                  {t('Flight_Number_label')}
                  <span className='text-danger'> *</span>
                </label>
              </div>
              <div className='col-4'>
                <label className='form-label'>
                  {t('LABEL_DEPARTURE_DATE_RANGE_label')}
                  <span className='text-danger'> *</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className='row mb-2'>
          <div className='col-3'>
            <Dropdown
              id='flightNumber'
              name='flightNumber'
              isClearable
              closeMenuOnSelect={true}
              value={formik.values.flightNumber}
              onChange={selectedOption => formik.setFieldValue('flightNumber', selectedOption)}
              onBlur={formik.handleBlur}
              options={carrierCodeList}
              optionLabel='key'
              optionValue='value'
              placeholder={labels.TEXT_SELECT}
            />
            {formik.touched.flightNumber && formik.errors.flightNumber ? (
              <span className='h5 text-danger'>{formik.errors.flightNumber}</span>
            ) : null}
          </div>
          <div className='col-4'>
            <div className='customDatePickerWidth'>
              <DatePicker
                id='startDate'
                name='startDate'
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
              {(formik.touched.startDate || formik.values.startDate) && formik.errors.endDate ? (
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
                  id='nonAcknowledged'
                  name='nonAcknowledged'
                  checked={formik.values.nonAcknowledged}
                  onChange={event => formik.setFieldValue('nonAcknowledged', event.target.checked)}
                />
                <label className='custom-control-label' htmlFor='nonAcknowledged'>
                  {t('Non-Acknowledged_label')}
                </label>
              </div>
            </div>
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
              height: 500,
            }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              animateRows={true}
              rowHeight={40}
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
              frameworkComponents={frameworkComponents}
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

export default connect(null, mapDispatchToProps)(NACCSDailyGenListReport)
