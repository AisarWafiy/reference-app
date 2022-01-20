import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Dropdown } from 'components/UI/Input'

import 'react-datepicker/dist/react-datepicker.css'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'assets/styles/customDatePickerWidth.css'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import Loader from 'react-loader-spinner'
import { alertActions } from 'actions/alert.actions'
import { AgGridReact } from '@ag-grid-community/react'

import { AllModules } from '@ag-grid-enterprise/all-modules'
import { linkRenderer_cartonTracking } from 'components/AgGridCustomComponents/Renderers/link-page'
import { binLocTrackingEnqiryActions } from 'actions/BinLocationTrackingEnquiry.actions'

const BinLocationTrackingEnquiry = props => {
  const { showAlertSuccess, showAlertError, showAlertWarn, binLocTrackingEnquiry } = props
  const [loading, setLoading] = useState(false)

  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)

  const [idList, setIdList] = useState([])
  const [rowData, setRowData] = useState([])

  const { t } = useTranslation()

  const columnDefs = [
    {
      headerName: t('Pickup_Location_label'),
      field: 'pickUpLocationValue',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 160,
      editable: false,
      border: true,
    },
    {
      headerName: t('WH_Bin_Location_label'),
      field: 'whBinLocation',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 160,
      editable: false,
      border: true,
    },
    {
      headerName: t('AP_Bin_Location_label'),
      field: 'apBinLocation',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 160,
      editable: false,
      border: true,
    },
    {
      headerName: t('Carton_Number_label'),
      field: 'cartonNumber',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 140,
      editable: false,
      border: true,
      cellRenderer: 'DirectToCartonTracking',
    },
    {
      headerName: t('Total_No._of_Bags_label'),
      field: 'totalNumberOfBags',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 130,
      editable: false,
      border: true,
    },
    {
      headerName: t('Delivery_Date_label'),
      field: 'deliveryDate',
      sortable: true,
      filter: true,
      sort: 'desc',
      lockPosition: true,
      width: 130,
      editable: false,
      border: true,
    },
    {
      headerName: t('Shift_label'),
      field: 'shift',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 130,
      editable: false,
      border: true,
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
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      binLocType: 'wh',
      searchFromTo: null,
    },
    validationSchema: Yup.object({
      binLocType: Yup.string().required(),
      searchFromTo: Yup.array().min(1, 'Please select at least one').required(),
    }),
    onSubmit: values => {
      let strArr = []

      values.searchFromTo.forEach(element => {
        strArr.push(`${element.value}`)
      })
      console.log(strArr)

      const postData = `?locationType=${values.binLocType === 'wh' ? 'Warehouse' : 'Airport'}`

      setLoading(true)
      axios
        .post(
          process.env.REACT_APP_SERVER_URI + '/api/report/getBinLocEnquiryReport' + postData,
          strArr,
        )
        .then(response => {
          showAlertSuccess(response.data.message, 'fetching records')
          setRowData(response.data.result)
          setLoading(false)
          binLocTrackingEnquiry({
            rowData: response.data.result,
            binLocType: values.binLocType,
            searchFromTo: values.searchFromTo,
          })
        })
        .catch(err => {
          setLoading(false)
          setRowData([])
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'generating search results')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'generating search results')
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, 'generating search results')
          else showAlertError('Internal Server Error')
          binLocTrackingEnquiry({
            rowData: [],
            binLocType: values.binLocType,
            searchFromTo: values.searchFromTo,
          })

          // showAlertError(err.response.data.errors, 'generating search results')
        })
    },
  })

  useEffect(() => {
    if (props.binLocTrackingEnquiryData && props.binLocTrackingEnquiryData !== null) {
      setRowData(props.binLocTrackingEnquiryData.rowData)
      formik.setFieldValue('searchFromTo', props.binLocTrackingEnquiryData.searchFromTo)
      formik.setFieldValue('binLocType', props.binLocTrackingEnquiryData.binLocType)
    } else {
      setRowData([])
      formik.setFieldValue('searchFromTo', null)
      formik.setFieldValue('binLocType', 'wh')
    }
  }, [props.binLocTrackingEnquiryData])

  useEffect(() => {
    if (props.binLocTrackingEnquiryData === null) formik.setFieldValue('searchFromTo', null, false)

    if (formik.values.binLocType === 'wh') {
      axios
        .get(process.env.REACT_APP_SERVER_URI + '/api/report/locationType/Warehouse')
        .then(response => {
          const listArr = []
          response.data.result.forEach((name, index) => listArr.push({ id: name, value: name }))

          setIdList(listArr)
        })
        .catch(err => {
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'fetching bin location IDs')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'fetching bin location IDs')
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, 'fetching bin location IDs')
          else showAlertError('Internal Server Error')
          // showAlertError(err.response.data.errors, 'fetching bin location IDs')
        })
    } else if (formik.values.binLocType === 'ap') {
      axios
        .get(process.env.REACT_APP_SERVER_URI + '/api/report/locationType/Airport')
        .then(response => {
          const listArr = []
          response.data.result.forEach((name, index) => listArr.push({ id: name, value: name }))

          setIdList(listArr)
        })
        .catch(err => {
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'fetching bin location IDs')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'fetching bin location IDs')
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, 'fetching bin location IDs')
          else showAlertError('Internal Server Error')
        })
    }
  }, [formik.values.binLocType])

  function onGridReady(params) {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }

  const handleExport = () => {
    var excelParams = {
      fileName: 'Bin Location Tracking Enquiry.xlsx',
    }
    gridApi.exportDataAsExcel(excelParams)
  }

  const handleCancel = () => {
    formik.setFieldValue('searchFromTo', null, false)
    formik.setSubmitting(false)
    setRowData([])
  }

  const loctypeChange = event => {
    setRowData([])
    formik.setFieldValue('searchFromTo', null, false)
    formik.setFieldValue('binLocType', event.target.value)
  }
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className='row'>
          <div className='col-2'>
            <label className='form-label'>
              {t('BIN_LOCATION_TYPE_label')} <span className='text-danger'> *</span>
            </label>
          </div>
          <div className='col-5'>
            <label className='form-label'>
              {t('TEXT_SELECT_label')} <span className='text-danger'> *</span>
            </label>
          </div>
        </div>
        <div className='row mb-4'>
          <div className='col-2'>
            <div className='custom-control custom-radio custom-control-inline'>
              <input
                type='radio'
                value='wh'
                id='customRadio1'
                name='binLocType'
                className='custom-control-input'
                onChange={event => loctypeChange(event)}
                checked={formik.values.binLocType === 'wh'}
                disabled={formik.isSubmitting}
              />

              <label className='custom-control-label radio-inline' htmlFor='customRadio1'>
                {t('WH_label')}
              </label>
            </div>
            <div className='custom-control custom-radio custom-control-inline'>
              <input
                type='radio'
                value='ap'
                id='customRadio2'
                name='binLocType'
                className='custom-control-input'
                onChange={event => loctypeChange(event)}
                checked={formik.values.binLocType === 'ap'}
                disabled={formik.isSubmitting}
              />
              <label className='custom-control-label radio-inline' htmlFor='customRadio2'>
                {t('AP_label')}
              </label>
            </div>
          </div>
          <div className='col-5'>
            <Dropdown
              id='searchFromTo'
              name='searchFromTo'
              // closeMenuOnSelect={true}
              value={formik.values.searchFromTo}
              isClearable
              onChange={selectedItem => formik.setFieldValue('searchFromTo', selectedItem, true)}
              onBlur={formik.handleBlur}
              options={idList}
              optionLabel='value'
              optionValue='id'
              placeholder={t('TEXT_SELECT_label')}
              isDisabled={formik.isSubmitting}
              // allowSelectAll={true}
              // selectAllText='Select All'
              isMulti
            />
          </div>
          <div className='col'>
            <button
              type='submit'
              className='btn btn-primary mr-3'
              // disabled={!formik.isValid}
              disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
            >
              {t('Go_label')}
            </button>

            <button
              type='button'
              className='btn btn-outline-secondary'
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
        <label className='form-label'>
          {t('Results_label')}
          {/* <span className='text-danger'> *</span> */}
        </label>
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
              frameworkComponents={{
                DirectToCartonTracking: linkRenderer_cartonTracking,
              }}
            />
          </div>
        )}
      </div>
    </>
  )
}

function mapState(state) {
  return {
    binLocTrackingEnquiryData: state.binLocTrackingEnqirySuccess,
  }
}
const mapDispatchToProps = dispatch => ({
  showAlertSuccess: (message, status) => dispatch(alertActions.success(message, status)),
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
  showAlertWarn: (message, status) => dispatch(alertActions.warning(message, status)),
  binLocTrackingEnquiry: data =>
    dispatch(binLocTrackingEnqiryActions.binLocTrackingEnqirySuccess(data)),
})

export default connect(mapState, mapDispatchToProps)(BinLocationTrackingEnquiry)
