import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import * as regex from 'constants/regex'

import 'react-datepicker/dist/react-datepicker.css'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import Loader from 'react-loader-spinner'
import { useTranslation } from 'react-i18next'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'assets/styles/customDatePickerWidth.css'

import { alertActions } from 'actions/alert.actions'
import { AgGridReact } from '@ag-grid-community/react'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import { AllModules } from '@ag-grid-enterprise/all-modules'
import { paxDFPurchaseEnqiryActions } from 'actions/paxDFPurchaseEnquiry.actions'

const PaxDFPurchaseEnquiry = props => {
  const { showAlertSuccess, showAlertError, showAlertWarn, paxDFPurchaseEnquiry } = props
  const [loading, setLoading] = useState(false)
  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)
  const [rowData, setRowData] = useState([])
  const [enquiryData, setEnquiryData] = useState()

  const [showApproveReject, setShowApproveReject] = useState(false)
  const { t } = useTranslation()

  const columnDefs = [
    {
      headerName: t('DEPARTMENT_label'),
      field: 'deptDescription',
      sortable: true,
      filter: true,
      // lockPosition: true,
      sort: 'asc',
      editable: false,
      autoHeight: true,
      rowGroup: true,
      hide: true,
      showRowGroup: true,
    },
    {
      headerName: t('TOTAL_QUANTITY_label'),
      field: 'totalSalesQTY',
      sortable: true,
      filter: true,
      // lockPosition: true,
      width: 140,
      editable: false,
      autoHeight: true,
    },
    {
      headerName: t('PURCHASE_AMOUNT_label'),
      field: 'totalSalesAMT',
      sortable: true,
      filter: true,
      // lockPosition: true,
      width: 140,
      editable: false,
      autoHeight: true,
    },
    {
      headerName: t('Item_Code_label'),
      field: 'itemCode',
      sortable: true,
      filter: true,
      // lockPosition: true,
      width: 140,
      editable: false,
      autoHeight: true,
      // cellRenderer: params => {
      //   console.log(params.value)
      //   if (params.value) {
      //     params.value.map(val => `<span>${val.itemCode} </span>`)
      //   }
      // },
    },
    {
      headerName: t('Item_Description_label'),
      field: 'description',
      sortable: true,
      filter: true,
      // lockPosition: true,
      width: 180,
      editable: false,
      autoHeight: true,
    },
    {
      headerName: t('Quantity_label'),
      field: 'quantity',
      sortable: true,
      filter: true,
      // lockPosition: true,
      width: 110,
      editable: false,
      autoHeight: true,
    },
  ]
  const autoGroupColumnDef = {
    width: 300,
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
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      paxNumber: '',
    },
    validationSchema: Yup.object({
      paxNumber: Yup.string()
        .required(t('Please_Enter_A_PAX_Number_label'))
        .min(10, 'Pax Number should be 10 digits')
        .max(10, 'Pax Number should be 10 digits'),
    }),
    onSubmit: values => {
      const postData = {
        paxNumber: values.paxNumber,
        paxPurchaseType: 'DutyFree',
      }
      setLoading(true)
      axios
        .post(process.env.REACT_APP_SERVER_URI + '/api/report/paxPurchaseEnquiry', postData)
        .then(response => {
          showAlertSuccess(response.data.message, 'fetching records')
          const getData = response.data.result
          setEnquiryData(getData)

          const newRowData = []

          const dtoList = response.data.result.salesDTOList
          const salesItemList = dtoList.map(val => val.salesItemList)

          dtoList.forEach(function (dtoItem, index) {
            const salesList = dtoItem.salesItemList

            if (getData.totalAmtExceeds || dtoItem.amtLimitExceeds || dtoItem.qtyLimitExceeds) {
              setShowApproveReject(true)
            }

            salesList.forEach(function (salesItem, index) {
              newRowData.push({
                deptDescription: dtoItem.deptDescription,
                totalSalesQTY: dtoItem.totalSalesQTY,
                totalSalesAMT: dtoItem.totalSalesAMT,
                itemCode: salesItem.itemCode,
                description: salesItem.description,
                quantity: salesItem.quantity,
              })
            })
          })

          setRowData(newRowData)
          setLoading(false)
          paxDFPurchaseEnquiry({
            rowData: newRowData,
            enquiryData: getData,
            paxNumber: values.paxNumber,
          })
        })
        .catch(err => {
          setLoading(false)
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'Pax DF Purchase')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'Pax DF Purchase')
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, 'Pax DF Purchase')
          else showAlertError('Internal Server Error')
          setEnquiryData({})
          setRowData([])
          paxDFPurchaseEnquiry({ rowData: [], paxNumber: values.paxNumber })
        })
      // console.log(enquiryData)
    },
  })

  function onGridReady(params) {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }

  const handleExport = () => {
    var excelParams = {
      fileName: 'Pax DF Purchase Enquiry.xlsx',
    }
    gridApi.exportDataAsExcel(excelParams)
  }

  const handleText = (event, maxChar) => {
    formik.setFieldValue(
      event.target.name,
      event.target.value.replace(regex.EXCEPT_ALPHANUMERIC, '').substring(0, maxChar),
    )

    formik.setSubmitting(false)
  }

  const handleCancel = () => {
    formik.setFieldValue('paxNumber', '', false)
    formik.setSubmitting(false)
    setShowApproveReject(false)
    setEnquiryData({})
    setRowData([])
  }

  useEffect(() => {
    if (props.paxDFPurchaseEnqiryData && props.paxDFPurchaseEnqiryData !== null) {
      setRowData(props.paxDFPurchaseEnqiryData.rowData)
      formik.setFieldValue('paxNumber', props.paxDFPurchaseEnqiryData.paxNumber)
      setEnquiryData(props.paxDFPurchaseEnqiryData.enquiryData)
    } else {
      setRowData([])
      formik.setFieldValue('paxNumber', '')
      setEnquiryData({})
    }
  }, [props.paxDFPurchaseEnqiryData])

  const handleApproveReject = approve => {
    const postData = {
      paxNumber: formik.values.paxNumber,
      approvalAction: approve ? 'Approve' : 'Reject',
    }

    axios
      .post(process.env.REACT_APP_SERVER_URI + '/api/report/paxApproval', postData)
      .then(response => {
        showAlertSuccess(response.data.message, 'Pax DF Purchase')
        setShowApproveReject(false)
      })
      .catch(err => {
        if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, 'Pax DF Purchase')
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, 'Pax DF Purchase')
        else if (err.response.data.warning)
          showAlertWarn(err.response.data.warning, 'Pax DF Purchase')
        else showAlertError('Internal Server Error')
      })
  }

  let approveRejectButton = null

  if (showApproveReject) {
    approveRejectButton = (
      <div className='col text-right'>
        <button
          type='button'
          className='btn btn-primary mr-3'
          onClick={() => handleApproveReject(true)}
        >
          {t('BUTTON_APPROVE_label')}
        </button>

        <button
          type='button'
          className='btn btn-outline-secondary'
          onClick={() => handleApproveReject(false)}
        >
          {t('BUTTON_REJECT_label')}
        </button>
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className='mb-5'>
        <div className='row'>
          <div className='col-4'>
            <label className='form-label'>
              {t('PAX_Number_label')} <span className='text-danger'> *</span>
            </label>
          </div>
        </div>
        <div className='row'>
          <div className='col-4'>
            <input
              id='paxNumber'
              name='paxNumber'
              type='text'
              placeholder={t('PAX_Number_label')}
              onChange={e => handleText(e, 25)}
              onBlur={formik.handleBlur}
              value={formik.values.paxNumber}
              className='form-control'
              // disabled={formik.isSubmitting}
            />
          </div>

          <div className='col'>
            <button
              type='submit'
              className='btn btn-primary mr-3'
              disabled={!formik.values.paxNumber}
              // disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
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

          {approveRejectButton}
        </div>
        {formik.touched.paxNumber && formik.errors.paxNumber ? (
          <span className='h5 text-danger'>{formik.errors.paxNumber}</span>
        ) : null}
      </form>
      {loading !== true && (
        <div className='row'>
          <div className='box1 mr-3' style={{ borderRadius: '0', width: '100%' }}>
            <div className='row ml-2 mr-2'>
              <div className='col-sm-2'>
                <div className='form-group'>
                  <label htmlFor='originAirport'>{t('Departure_Flight_No_label')}</label>
                  <div className='h4'>
                    {enquiryData
                      ? enquiryData.carrierNumber && enquiryData.carrierRefCodeValue
                        ? `${enquiryData.carrierRefCodeValue} ${enquiryData.carrierNumber}`
                        : '-'
                      : '-'}
                  </div>
                </div>
              </div>
              <div className='col-sm-2'>
                <div className='form-group'>
                  <label htmlFor='destinationAirport'>{t('FLIGHT_DATE_label')}</label>
                  <div className='h4'>
                    {enquiryData
                      ? enquiryData.carrierDepDate
                        ? enquiryData.carrierDepDate
                        : '-'
                      : '-'}
                  </div>
                </div>
              </div>
              <div className='col-sm-2'>
                <div className='form-group'>
                  <label htmlFor='pickupLocation'>{t('FLIGHT_TIME_label')}</label>
                  <div className='h4'>
                    {enquiryData
                      ? enquiryData.carrierDepTime
                        ? enquiryData.carrierDepTime
                        : '-'
                      : '-'}
                  </div>
                </div>
              </div>
              <div className='col-sm-2'>
                <div className='form-group'>
                  <label htmlFor='originAirport'>{t('PURCHASE_AMOUNT_label')}</label>
                  <div className='h4'>
                    {enquiryData
                      ? enquiryData.totalAmt !== null
                        ? enquiryData.totalAmt
                        : '-'
                      : '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {loading === true ? (
        <div style={{ textAlign: 'center' }} className='mt-5'>
          <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
        </div>
      ) : (
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
              autoGroupColumnDef={autoGroupColumnDef}
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
              cellRendererParams={{
                suppressCount: true,
                suppressDoubleClickExpand: true,
                suppressEnterExpand: true,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// const mapStateToProps = state => ({
// terminalNo: state.deliveryManifestReducer.terminalNo,
// })

function mapState(state) {
  return {
    paxDFPurchaseEnqiryData: state.paxDFPurchaseEnqirySuccess,
  }
}
const mapDispatchToProps = dispatch => ({
  showAlertSuccess: (message, status) => dispatch(alertActions.success(message, status)),
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
  showAlertWarn: (message, status) => dispatch(alertActions.warning(message, status)),
  paxDFPurchaseEnquiry: data =>
    dispatch(paxDFPurchaseEnqiryActions.paxDFPurchaseEnqirySuccess(data)),
})

export default connect(mapState, mapDispatchToProps)(PaxDFPurchaseEnquiry)
