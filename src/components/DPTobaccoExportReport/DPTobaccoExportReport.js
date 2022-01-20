import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Loader from 'react-loader-spinner'
import DatePicker from 'react-datepicker'
import { ToolTip } from 'components/AgGridCustomComponents/Editors'
import { useTranslation } from 'react-i18next'
import 'react-datepicker/dist/react-datepicker.css'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import { AgGridReact } from 'ag-grid-react'

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

import { dpTobaccoReportActions } from 'actions/dpTobaccoReport.actions'
import { AllModules } from '@ag-grid-enterprise/all-modules'
import Moment from 'moment'

function DPTobaccoExportReport(props) {
  const { NoTitle } = props
  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)
  const [loading, setLoading] = useState(false)
  // const [gridColumnApi1, setGridColumnApi1] = useState(null)
  const [rowData, setRowData] = useState([])
  const [rowData1, setRowData1] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [dateError, setDateError] = useState('')
  const [showData, setShowData] = useState(false)

  const [disableGo, setDisableGo] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    if (props.getDPTobaccoExportReportData && props.getDPTobaccoExportReportData.result) {
      setRowData(props.getDPTobaccoExportReportData.result)
      setLoading(false)
    } else if (props.getDPTobaccoExportReportData && !props.getDPTobaccoExportReportData.result) {
      setRowData([])
      setLoading(false)
    }
  }, [props.getDPTobaccoExportReportData])

  const columnDefs1 = [
    {
      headerName: t('Flight_Number_label'),
      field: 'flightNumber',
      sortable: true,
      filter: true,
      tooltipField: 'flightNumber',
      cellRenderer: 'agGroupCellRenderer',
      lockPosition: true,
      width: 120,
      editable: false,
    },
    {
      headerName: t('Date_of_Picked_up_by_Customer_label'),
      field: 'dateOfPickedByCustomer',
      sortable: true,
      filter: true,
      tooltipField: 'dateOfPickedByCustomer',
      cellRenderer: 'agGroupCellRenderer',
      lockPosition: true,
      width: 170,
      editable: false,
    },
    {
      headerName: t('Date_of_Refund_label'),
      field: 'dateOfRefund',
      sortable: true,
      filter: true,
      tooltipField: 'dateOfRefund',
      cellRenderer: 'agGroupCellRenderer',
      lockPosition: true,
      width: 150,
      editable: false,
    },

    {
      headerName: t('Bag_Count_label'),
      field: 'bagNumber',
      sortable: true,
      tooltipField: 'bagNumber',
      filter: true,
      lockPosition: true,
      width: 100,
      editable: false,
    },

    {
      headerName: t('SKU_label'),
      field: 'sku',
      sortable: true,
      tooltipField: 'sku',
      filter: true,
      lockPosition: true,
      width: 100,
      editable: false,
    },
    {
      headerName: t('Description_label'),
      field: 'desc',
      sortable: true,
      tooltipField: 'desc',
      filter: true,
      lockPosition: true,
      width: 180,
      editable: false,
    },
    {
      headerName: t('Quantity_label'),
      field: 'qty',
      sortable: true,
      tooltipField: 'qty',
      filter: true,
      lockPosition: true,
      width: 100,
      editable: false,
      cellStyle: { textAlign: 'right' },
    },
    {
      headerName: t('Amount_label'),
      field: 'amount',
      sortable: true,
      tooltipField: 'amount',
      filter: true,
      lockPosition: true,
      width: 100,
      editable: false,
      cellStyle: { textAlign: 'right' },
    },
  ]
  const defaultColDef = {
    sortable: true,
    wrapText: true,
    cellStyle: rowStyle,
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
    tooltipComponent: 'customTooltip',
  }
  useEffect(() => {
    if (rowData && rowData.length !== 0) {
      const newRowData = []

      rowData.forEach((getDataItem, index1) => {
        newRowData.push({
          flightNumber: getDataItem.flightNumber,
          dateOfPickedByCustomer: getDataItem.dateOfPickedByCustomer,
          dateOfRefund: getDataItem.dateOfRefund,
          bagNumber: getDataItem.bagDetails[0].bagNo,

          sku: getDataItem.bagDetails[0].skuDetails[0].skuNumber,
          desc: getDataItem.bagDetails[0].skuDetails[0].description,
          qty: getDataItem.bagDetails[0].skuDetails[0].qty,
          amount: getDataItem.bagDetails[0].skuDetails[0].amount,
        })
        getDataItem.bagDetails.forEach((transactionItem, index2) => {
          if (index2 > 0) {
            newRowData.push({
              bagNumber: transactionItem.bagNo,
              sku: transactionItem.skuDetails[0].skuNumber,
              desc: transactionItem.skuDetails[0].description,
              qty: transactionItem.skuDetails[0].qty,
              amount: transactionItem.skuDetails[0].amount,
            })
          }
          transactionItem.skuDetails.forEach((skuitem, index3) => {
            if (index3 > 0) {
              newRowData.push({
                sku: skuitem.skuNumber,
                desc: skuitem.description,
                qty: skuitem.qty,
                amount: skuitem.amount,
              })
            }
          })
        })
        newRowData.push({
          bagNumber: getDataItem.bagCount,
        })
      })

      setRowData1(newRowData)
    } else {
      setRowData1([])
    }
  }, [rowData])

  const formatDate = (dateOne, dateTwo) => {
    if (dateOne && dateTwo) {
      const strOne = Moment(dateOne).format('YYYY-MM-DD')

      const strTwo = Moment(dateTwo).format('YYYY-MM-DD')

      return strOne + ' - ' + strTwo
    }
    return null
  }
  const handleGo = object => {
    let data = {}
    data.dateFrom = Moment(startDate).format('YYYY-MM-DD')
    data.dateTo = Moment(endDate).format('YYYY-MM-DD')

    props.getDPTobaccoExportReport(data)
    setShowData(true)
    setLoading(true)
  }
  function onGridReady(params) {
    setGridApi(params.api)
  }

  useEffect(() => {
    if (startDate !== null && endDate !== null) {
      setDisableGo(false)
    } else {
      setDisableGo(true)
    }
  }, [startDate, endDate])
  useEffect(() => {
    if (startDate === null && endDate === null) {
      setShowData(false)
    }
  }, [startDate, endDate])
  const onBtExport = () => {
    var excelParams = {
      fileName: 'DP Tobacco Export Report.xlsx',
    }
    gridApi.exportDataAsExcel(excelParams)
  }

  const handleDate = dates => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }
  useEffect(() => {
    if (startDate !== null && endDate === null) {
      setDateError(t('Please_enter_Date_Range_label'))
    } else setDateError('')
  }, [startDate, endDate])
  return (
    <div className='container bg-white'>
      {NoTitle ? null : (
        <div>
          <h1 className='mb-4 mt-5'>{t('Duty_Paid_Tobacco_Export_Report_label')}</h1>
        </div>
      )}
      <div className='mt-3'>
        <Row>
          <Col xs='3'>
            <label className='form-label'> {t('Date_Range_label')}</label>
            <span className='astrick'>*</span>
            <br />

            <DatePicker
              id='startDate'
              name='startDate'
              className='form-control'
              autoComplete='off'
              placeholderText={t('TEXT_DATE_FORMAT_label')}
              selected={startDate}
              onChange={handleDate}
              dateFormat='yyyy-MM-dd'
              selectsRange
              startDate={startDate}
              endDate={endDate}
              shouldCloseOnSelect={false}
              value={formatDate(startDate, endDate)}
              // minDate={new Date()}
              // onSelect={handleDate} //when day is clicked
              disabledKeyboardNavigation
              // disabled={disabled}
            />
            {dateError !== '' ? (
              <span className='form-label' style={{ color: '#B13C27' }}>
                {dateError}
              </span>
            ) : null}
          </Col>

          <Col>
            <br />
            <button
              type='submit'
              onClick={handleGo}
              className='btn btn-primary mr-3 mt-1'
              disabled={disableGo}
            >
              {t('Go_label')}
            </button>
          </Col>
        </Row>
      </div>
      {showData ? (
        <div>
          <div>
            <div>
              <Row>
                <Col>
                  <h2 className='mt-4'>{t('Status_Totals_label')}</h2>
                </Col>

                <Col className='text-right mr-4'>
                  <br />{' '}
                  <button
                    onClick={() => onBtExport()}
                    className=' btn btn-outline-secondary '
                    disabled={!(rowData.length > 0)}
                  >
                    {t('Export_To_Excel_label')}
                  </button>
                </Col>
              </Row>
            </div>
            {loading === true ? (
              <div style={{ textAlign: 'center' }} className='mt-5'>
                <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
              </div>
            ) : (
              <div
                id='myGrid'
                className='ag-theme-alpine mt-3'
                style={{
                  width: '100%',
                  height: 500,
                }}
              >
                <AgGridReact
                  columnDefs={columnDefs1}
                  rowData={rowData1}
                  animateRows={true}
                  rowHeight={40}
                  headerHeight={50}
                  defaultColDef={defaultColDef}
                  context={props.context}
                  modules={AllModules}
                  frameworkComponents={{
                    customTooltip: ToolTip,
                  }}
                  onGridReady={onGridReady}
                  editType='fullRow'
                  suppressClickEdit={true}
                  undoRedoCellEditing={true}
                />
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function mapState(state) {
  return {
    getDPTobaccoExportReportData: state.getDPTobaccoExportReport.getData,
  }
}

const actionCreators = {
  getDPTobaccoExportReport: dpTobaccoReportActions.getDPTobaccoExportReport,
}

export default connect(mapState, actionCreators)(DPTobaccoExportReport)
