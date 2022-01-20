import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import Loader from 'react-loader-spinner'
import * as labels from 'constants/labels'
import * as regex from 'constants/regex'
import {
  linkRenderer_bagTracking,
  linkRenderer_cartonTracking,
  linkRenderer_cageTracking,
  linkRenderer_purchaseEnquiryByPax,
} from 'components/AgGridCustomComponents/Renderers/link-page'
import 'react-datepicker/dist/react-datepicker.css'
import { linkActions } from 'actions/link.actions'
import { itemEnquiryActions } from 'actions/itemEnquiry.actions'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'assets/styles/customDatePickerWidth.css'

import { alertActions } from 'actions/alert.actions'
import { AgGridReact } from '@ag-grid-community/react'

import { AllModules } from '@ag-grid-enterprise/all-modules'
import { rowStyle } from 'assets/styles/ag-rowStyle'

const ItemEnquiry = props => {
  const { showAlertSuccess, showAlertError, showAlertWarn, NoTitle, link, itemEnquiry } = props
  const [loading, setLoading] = useState(false)

  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)
  const [rowData, setRowData] = useState([])
  const { t } = useTranslation()
  const columnDefs = [
    {
      headerName: t('Status_label'),
      field: 'status',
      sortable: true,
      filter: true,
      width: 120,
      editable: false,
      rowGroup: true,
      hide: true,
      showRowGroup: true,
    },
    {
      headerName: t('Bag_Number_label'),
      field: 'bagNo',
      cellRenderer: 'DirectToBagTracking',
      sortable: true,
      filter: true,
      width: 120,
      editable: false,
    },
    {
      headerName: t('Pax_Number_label'),
      field: 'paxNo',
      sortable: true,
      cellRenderer: 'DirectToPurchaseEnquiry',
      filter: true,
      width: 110,
      editable: false,
    },
    {
      headerName: t('Last_Name_label'),
      field: 'paxLastName',
      sortable: true,
      filter: true,
      width: 130,
      editable: false,
    },
    {
      headerName: t('First_Name_label'),
      field: 'paxFirstName',
      sortable: true,
      filter: true,
      width: 130,
      editable: false,
    },
    {
      headerName: t('CARTON_label'),
      field: 'cartonNumber',
      sortable: true,
      filter: true,
      cellRenderer: 'DirectToCartonTracking',
      width: 100,
      editable: false,
    },
    {
      headerName: t('WH_Bin_Location_label'),
      field: 'whBinLocId',
      sortable: true,
      filter: true,
      width: 100,
      editable: false,
    },
    {
      headerName: t('Cage_label'),
      field: 'cageNumber',
      sortable: true,
      cellRenderer: 'DirectToCageTracking',
      filter: true,
      width: 100,
      editable: false,
    },
    {
      headerName: t('Shelf_label'),
      field: 'shelfNumber',
      sortable: true,
      filter: true,
      width: 100,
      editable: false,
    },
    {
      headerName: t('TRUCK_label'),
      field: 'truckNumber',
      sortable: true,
      filter: true,
      width: 100,
      editable: false,
    },
    {
      headerName: t('AP_Bin_Location_label'),
      field: 'apBinLocId',
      sortable: true,
      filter: true,
      width: 100,
      editable: false,
    },
    {
      headerName: t('Status_Date/Time_label'),
      field: 'updatedTm',
      sortable: true,
      filter: true,
      width: 130,
      sort: 'desc',
      editable: false,
      cellRenderer: params => {
        if (params.value) {
          const str = params.value.split('T')
          const t = str[1].split(':')
          return str[0] + ' ' + t[0] + ':' + t[1]
        }
      },
    },
    {
      headerName: t('Terminal_label'),
      field: 'terminalNumber',
      sortable: true,
      filter: true,
      width: 100,
      editable: false,
    },
    {
      headerName: t('Operator_label'),
      field: 'updatedBy',
      sortable: true,
      filter: true,
      width: 100,
      editable: false,
    },
  ]
  const defaultColDef = {
    sortable: true,
    wrapText: true,
    resizable: true,
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
    cellStyle: rowStyle,
  }
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { itemNumber: '' },
    validationSchema: Yup.object({
      itemNumber: Yup.string().required(t('Please_Enter_An_Item_Number_label')),
    }),
    onSubmit: values => {
      setLoading(true)
      axios
        .get(
          process.env.REACT_APP_SERVER_URI +
            '/api/report/itemEnquiry?itemNumber=' +
            values.itemNumber,
        )
        .then(response => {
          showAlertSuccess(response.data.message, 'fetching records')
          const getData = response.data.result
          setRowData(getData)
          setLoading(false)
          itemEnquiry({ rowData: response.data.result, itemNumber: values.itemNumber })
        })
        .catch(err => {
          setLoading(false)
          setRowData([])
          itemEnquiry({ rowData: [], itemNumber: values.itemNumber })
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'generating Item Enquiry')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'generating Item Enquiry')
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, 'generating Item Enquiry')
          else showAlertError('Internal Server Error')

          // showAlertError(err.response.data.errors, 'generating Item Enquiry')
        })
    },
  })

  function onGridReady(params) {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }

  const handleNumeric = (event, maxLength = 10) => {
    formik.setFieldValue(
      event.target.name,
      event.target.value.replace(regex.EXCEPT_NUMBER, '').substring(0, maxLength),
    )

    formik.setSubmitting(false)
  }

  const handleExport = () => {
    var excelParams = {
      fileName: 'Item Enquiry.xlsx',
    }
    gridApi.exportDataAsExcel(excelParams)
  }

  const handleCancel = () => {
    formik.resetForm()
    formik.setFieldValue('itemNumber', '', false)
    setRowData([])
  }
  useEffect(() => {
    if (props.itemEnquiryData && props.itemEnquiryData !== null) {
      setRowData(props.itemEnquiryData.rowData)
      formik.setFieldValue('itemNumber', props.itemEnquiryData.itemNumber)
    } else {
      setRowData([])
      formik.setFieldValue('itemNumber', '')
    }
  }, [props.itemEnquiryData])
  useEffect(() => {
    if (props.linkData && props.linkData.itemNumber) {
      formik.setFieldValue('itemNumber', props.linkData.itemNumber)

      axios
        .get(
          process.env.REACT_APP_SERVER_URI +
            '/api/report/itemEnquiry?itemNumber=' +
            props.linkData.itemNumber,
        )
        .then(response => {
          showAlertSuccess(response.data.message, 'fetching records')
          const getData = response.data.result
          setRowData(getData)
          itemEnquiry({ rowData: response.data.result, itemNumber: props.linkData.itemNumber })
        })
        .catch(err => {
          itemEnquiry({ rowData: [], itemNumber: values.itemNumber })
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'generating Item Enquiry')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'generating Item Enquiry')
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, 'generating Item Enquiry')
          else showAlertError('Internal Server Error')
          // showAlertError(err.response.data.errors, 'generating Item Enquiry')
        })
      link(null)
    }
  }, [props.linkData])

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        {NoTitle ? null : (
          <div>
            <h1 className='mb-4 mt-5'>{t('Item_Enquiry_label')}</h1>
          </div>
        )}
        <div className='row'>
          <div className='col'>
            <label className='form-label'>
              {t('Item_Number_label')} <span className='text-danger'> *</span>
            </label>
          </div>
        </div>
        <div className='row mb-4'>
          <div className='col-8'>
            <div className='row'>
              <div className='col-6'>
                <input
                  id='itemNumber'
                  name='itemNumber'
                  type='text'
                  placeholder={t('Item_Number_label')}
                  onChange={e => handleNumeric(e, 25)}
                  onBlur={formik.handleBlur}
                  value={formik.values.itemNumber}
                  className='form-control'
                  disabled={formik.isSubmitting}
                />
              </div>

              <div className='col'>
                <button
                  type='submit'
                  className='btn btn-primary mr-3'
                  disabled={!(formik.isValid && formik.dirty)}
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
            </div>
            {formik.touched.itemNumber && formik.errors.itemNumber ? (
              <span className='h5 text-danger'>{formik.errors.itemNumber}</span>
            ) : null}
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
              rowHeight={40}
              headerHeight={40}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={10}
              context={props.context}
              modules={AllModules}
              onGridReady={onGridReady}
              frameworkComponents={{
                DirectToBagTracking: linkRenderer_bagTracking,
                DirectToCartonTracking: linkRenderer_cartonTracking,
                DirectToCageTracking: linkRenderer_cageTracking,
                DirectToPurchaseEnquiry: linkRenderer_purchaseEnquiryByPax,
              }}
              rowSelection={'multiple'}
              editType='fullRow'
              suppressClickEdit={true}
              undoRedoCellEditing={true}
              groupMultiAutoColumn={true}
              groupDefaultExpanded={1}
            />
          </div>
        )}
      </div>
    </>
  )
}

function mapState(state) {
  return {
    linkData: state.linksuccess,
    itemEnquiryData: state.itemEnquirySuccess,
  }
}

const mapDispatchToProps = dispatch => ({
  showAlertSuccess: (message, status) => dispatch(alertActions.success(message, status)),
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
  showAlertWarn: (message, status) => dispatch(alertActions.warning(message, status)),
  link: data => dispatch(linkActions.linksuccess(data)),
  itemEnquiry: data => dispatch(itemEnquiryActions.itemEnquirySuccess(data)),
})

export default connect(mapState, mapDispatchToProps)(ItemEnquiry)
