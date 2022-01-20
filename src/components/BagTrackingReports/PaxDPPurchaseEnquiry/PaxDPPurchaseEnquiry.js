import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import * as regex from 'constants/regex'

import 'react-datepicker/dist/react-datepicker.css'
import Loader from 'react-loader-spinner'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'assets/styles/customDatePickerWidth.css'

import { alertActions } from 'actions/alert.actions'
import { AgGridReact } from '@ag-grid-community/react'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import { AllModules } from '@ag-grid-enterprise/all-modules'
import { paxDPPurchaseEnqiryActions } from 'actions/paxDPPurchaseEnquiry.actions'

const PaxDFPurchaseEnquiry = props => {
  const { showAlertSuccess, showAlertError, showAlertWarn, paxDPPurchaseEnquiry } = props
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
      width: 240,
      editable: false,
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
    },
    {
      headerName: t('PURCHASE_AMOUNT_label'),
      field: 'totalSalesAMT',
      sortable: true,
      filter: true,
      // lockPosition: true,
      width: 140,
      editable: false,
    },
    {
      headerName: t('Item_Code_label'),
      field: 'itemCode',
      sortable: true,
      filter: true,
      // lockPosition: true,
      width: 140,
      editable: false,
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
    },
    {
      headerName: t('Quantity_label'),
      field: 'quantity',
      sortable: true,
      filter: true,
      // lockPosition: true,
      width: 110,
      editable: false,
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
        paxPurchaseType: 'DutyPaid',
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
          paxDPPurchaseEnquiry({
            rowData: newRowData,
            enquiryData: getData,
            paxNumber: values.paxNumber,
          })
        })
        .catch(err => {
          setLoading(false)
          setRowData([])
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'generating PAX information')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'generating PAX information')
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, 'generating PAX information')
          else showAlertError('Internal Server Error')
          paxDPPurchaseEnquiry({ rowData: [], paxNumber: values.paxNumber })

          // showAlertError(err.response.data.description, 'generating PAX information')
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
      fileName: 'Pax DP Purchase Enquiry.xlsx',
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
    if (props.paxDPPurchaseEnqiryData && props.paxDPPurchaseEnqiryData !== null) {
      setRowData(props.paxDPPurchaseEnqiryData.rowData)
      formik.setFieldValue('paxNumber', props.paxDPPurchaseEnqiryData.paxNumber)
    } else {
      setRowData([])
      formik.setFieldValue('paxNumber', '')
    }
  }, [props.paxDPPurchaseEnqiryData])

  const handleApproveReject = approve => {
    const postData = {
      paxNumber: formik.values.paxNumber,
      approvalAction: approve ? 'Approve' : 'Reject',
    }

    axios
      .post(process.env.REACT_APP_SERVER_URI + '/api/report/paxApproval', postData)
      .then(response => {
        showAlertSuccess(response.data.message, approve ? 'Approval' : 'Rejection')
        setShowApproveReject(false)
      })
      .catch(err => {
        if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, approve ? 'Approval' : 'Rejection')
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, approve ? 'Approval' : 'Rejection')
        else if (err.response.data.warning)
          showAlertWarn(err.response.data.warning, approve ? 'Approval' : 'Rejection')
        else showAlertError('Internal Server Error')
        // showAlertError(err.response.data.errors, approve ? 'Approval' : 'Rejection')
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
    <>
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
              groupMultiAutoColumn={true}
              groupDefaultExpanded={1}
              cellRendererParams={{
                suppressCount: true,
                suppressDoubleClickExpand: true,
                suppressEnterExpand: true,
              }}
              autoGroupColumnDef={autoGroupColumnDef}
            />
          </div>
        )}
      </div>
    </>
  )
}

// const mapStateToProps = state => ({
// terminalNo: state.deliveryManifestReducer.terminalNo,
// })
function mapState(state) {
  return {
    paxDPPurchaseEnqiryData: state.paxDPPurchaseEnqirySuccess,
  }
}
const mapDispatchToProps = dispatch => ({
  showAlertSuccess: (message, status) => dispatch(alertActions.success(message, status)),
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
  showAlertWarn: (message, status) => dispatch(alertActions.warning(message, status)),
  paxDPPurchaseEnquiry: data =>
    dispatch(paxDPPurchaseEnqiryActions.paxDPPurchaseEnqirySuccess(data)),
})

export default connect(mapState, mapDispatchToProps)(PaxDFPurchaseEnquiry)
