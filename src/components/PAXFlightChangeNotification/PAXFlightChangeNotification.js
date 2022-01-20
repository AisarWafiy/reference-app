import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Moment from 'moment'
import _ from 'lodash'
import axios from 'axios'
import Loader from 'react-loader-spinner'
import { useTranslation } from 'react-i18next'
import { alertActions } from 'actions/alert.actions'
import DatePicker from 'react-datepicker'
import * as labels from 'constants/labels'
import { AgGridReact } from '@ag-grid-community/react'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import { AllModules } from '@ag-grid-enterprise/all-modules'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

const PAXFlightChangeNotification = props => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const { showAlertSuccess, showAlertError, showAlertWarn } = props
  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)
  const [rowData, setRowData] = useState([])

  const flightColumnDefs = [
    {
      headerName: t('Pax_Number_label'),
      field: 'paxNumber',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 150,
    },

    {
      headerName: t('Bag_Number_label'),
      field: 'bagNumber',
      sortable: true,
      lockPosition: true,
      filter: true,
      width: 150,
    },
    {
      headerName: t('BAG_STATUS_POSITION_label'),
      field: 'bagStatusPos',

      sortable: true,
      filter: true,
      width: 400,
      lockPosition: true,
    },
    {
      headerName: t('Flight_Number/From_Date_label'),
      field: 'flightNoFromDate',
      sortable: true,
      filter: true,
      width: 190,
      lockPosition: true,
    },
    {
      headerName: t('Flight_Number/To_Date_label'),
      field: 'flightNoToDate',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 190,
    },
  ]

  const defaultColDef = {
    width: 125,
    sortable: true,
    wrapText: true,
    resizable: true,
    cellStyle: rowStyle,
  }
  const frameworkComponents = {}

  const handleExport = () => {
    var excelParams = {
      fileName: 'PAX Flight Change Notification.xlsx',
      columnKeys: ['paxNumber', 'bagNumber', 'bagStatusPos', 'flightNoFromDate', 'flightNoToDate'],
      allColumns: false,
    }
    gridApi.exportDataAsExcel(excelParams)
  }

  const onGridReady = params => {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }

  const formik = useFormik({
    initialValues: { flightChangeAction: null, startDate: '', endDate: '' },
    validationSchema: Yup.object({
      startDate: Yup.date().required('Please enter a date range'),
      endDate: Yup.date()
        .required('Please enter a date range')
        .typeError('Please enter a date range'),
    }),
    onSubmit: values => {
      setRowData([])
      let postData
      postData = {
        flightChangeAction: null,
        from: values.startDate && Moment(values.startDate).format('YYYY-MM-DD'),
        to: values.endDate && Moment(values.endDate).format('YYYY-MM-DD'),
      }
      setLoading(true)
      axios
        .post(process.env.REACT_APP_SERVER_URI + '/api/flightChangeAlerts', postData)
        .then(response => {
          showAlertSuccess(response.data.message, 'fetching Flight Change Alerts')
          const getData = response.data.result

          const newRowData = []
          getData.forEach((getDataItem, index) => {
            newRowData.push({
              flightChangeSeqId: getDataItem.flightChangeSeqId,
              flightNoFromDate:
                getDataItem.fromDepAirlineRefValue +
                ' ' +
                getDataItem.fromDepCarrierNumber +
                ' ' +
                dateEdit(getDataItem.fromDepartureTm),
              flightNoToDate:
                getDataItem.toDepAirlineRefValue +
                ' ' +
                getDataItem.toDepCarrierNumber +
                ' ' +
                dateEdit(getDataItem.toDepartureTm),
              actionTaken: getDataItem.flightChangeAction,
              actionBy: getDataItem.actionBy && getDataItem.actionBy,
              paxNumber: getDataItem.paxNo,
              bagNumber: getDataItem.bagNo,
              bagStatusPos:
                (getDataItem.bagStatus !== null ? 'Status: ' + getDataItem.bagStatus : '') +
                ' ' +
                (getDataItem.cartonNumber !== null
                  ? ', Carton No: ' + getDataItem.cartonNumber
                  : '') +
                (getDataItem.whBinLocId !== null ? ', WH Bin No: ' + getDataItem.whBinLocId : '') +
                (getDataItem.cageNo !== null ? ', Cage No: ' + getDataItem.cageNo : '') +
                (getDataItem.truckNo !== null ? ', Truck No: ' + getDataItem.truckNo : '') +
                (getDataItem.apBinLocId !== null ? ', AP Bin No: ' + getDataItem.apBinLocId : ''),
            })
          })
          setRowData(newRowData)
          setLoading(false)
        })
        .catch(err => {
          setLoading(false)
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'fetching Flight Change Alerts')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'fetching Flight Change Alerts')
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, 'fetching Flight Change Alerts')
          else showAlertError('Internal Server Error')
        })
    },
  })

  const handleDate = dates => {
    const [start, end] = dates
    formik.setFieldValue('startDate', start, true)
    formik.setFieldValue('endDate', end, true)
    formik.setSubmitting(false)
  }

  const handleCancel = () => {
    formik.resetForm()
    formik.setFieldValue('startDate', null, false)
    formik.setFieldValue('endDate', null, false)
    setRowData([])
  }
  const dateEdit = value => {
    let a = value.split(' ')
    return a[0]
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
        <h1 className='mb-4 mt-5'>{t('PAX_Flight_Change_Notification_label')}</h1>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className='row'>
          <div className='col'>
            <div className='row'>
              <div className='col-3'>
                <label className='form-label'>
                  {t('LABEL_DEPARTURE_DATE_RANGE_label')}
                  <span className='text-danger'> *</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className='row mb-4'>
          <div className='col'>
            <div className='row'>
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
                    disabledKeyboardNavigation
                  />
                  {(formik.touched.startDate || formik.values.startDate) &&
                  formik.errors.endDate ? (
                    <span className='h5 text-danger'>{formik.errors.endDate}</span>
                  ) : null}
                </div>
              </div>

              <div className='col'>
                <button
                  type='submit'
                  className='btn btn-primary'
                  // disabled={!(formik.isValid && formik.dirty)}
                  disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
                >
                  {labels.BUTTON_GO}
                </button>

                <button
                  type='button'
                  className='btn btn-outline-secondary ml-3'
                  onClick={handleCancel}
                >
                  {t('Cancel_label')}
                </button>
              </div>
            </div>
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
              columnDefs={flightColumnDefs}
              rowData={rowData}
              animateRows={true}
              rowHeight={40}
              headerHeight={40}
              paginationPageSize={10}
              defaultColDef={defaultColDef}
              frameworkComponents={frameworkComponents}
              pagination={true}
              context={props.context}
              modules={AllModules}
              onGridReady={onGridReady}
              editType='fullRow'
              suppressClickEdit={true}
              undoRedoCellEditing={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  showAlertSuccess: (message, status) => dispatch(alertActions.success(message, status)),
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
  showAlertWarn: (message, status) => dispatch(alertActions.warning(message, status)),
})

export default connect(null, mapDispatchToProps)(PAXFlightChangeNotification)
