import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { ToolTip } from 'components/AgGridCustomComponents/Editors'
import DatePicker from 'react-datepicker'
import { useTranslation } from 'react-i18next'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import Loader from 'react-loader-spinner'
import 'react-datepicker/dist/react-datepicker.css'
import {
  linkRenderer_bagTracking,
  linkRenderer_cartonTracking,
  linkRenderer_cageTracking,
  linkRenderer_purchaseEnquiryByPax,
} from 'components/AgGridCustomComponents/Renderers/link-page'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { Dropdown } from 'components/UI/Input'
import { bagByBagStatusReportActions } from 'actions/bagByBagStatusReport.actions'
import Moment from 'moment'
import { AgGridReact } from '@ag-grid-community/react'

import { AllModules } from '@ag-grid-enterprise/all-modules'

function bagByBagStatusReport(props) {
  const [gridApi, setGridApi] = useState(null)
  const [loading, setLoading] = useState(false)
  // const [gridColumnApi, setGridColumnApi] = useState(null)
  const [rowData, setRowData] = useState([])
  const [disableGo, setDisableGo] = useState(true)
  const [dateError, setDateError] = useState('')
  const { NoTitle } = props
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [bagStatus, setbagStatus] = useState(null)
  const [showData, setShowData] = useState(false)
  const [drop, setDrop] = useState([])
  const { t } = useTranslation()

  useEffect(() => {
    props.getBagStatus()
  }, [props.getBagStauts])
  useEffect(() => {
    if (startDate !== null && endDate === null) {
      setDateError(t('Please_enter_Date_Range_label'))
    } else setDateError('')
  }, [startDate, endDate])

  const handleDate = dates => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }
  useEffect(() => {
    if (props.getBagByBagStatusReportData && props.getBagByBagStatusReportData.result) {
      setShowData(true)
      setRowData(props.getBagByBagStatusReportData.result)
      setLoading(false)
    } else if (props.getBagByBagStatusReportData && !props.getBagByBagStatusReportData.result) {
      setRowData([])
      setLoading(false)
    }
  }, [props.getBagByBagStatusReportData])
  const columnDefs = [
    {
      headerName: t('Bag_Number_label'),
      field: 'bagNo',
      sortable: true,
      cellRenderer: 'DirectToBagTracking',
      filter: true,
      tooltipField: 'bagNo',
      lockPosition: true,

      width: 110,
      editable: false,
    },
    {
      headerName: t('Pax_Number_label'),
      field: 'paxNo',
      sortable: true,
      cellRenderer: 'DirectToPurchaseEnquiry',
      filter: true,
      lockPosition: true,
      tooltipField: 'paxNo',
      width: 100,

      editable: false,
    },
    {
      headerName: t('Flight_Number_label'),
      field: 'carrierNumber',
      sortable: true,

      filter: true,
      tooltipField: 'carrierNumber',
      lockPosition: true,

      width: 100,
      editable: false,
    },
    {
      headerName: t('FLIGHT_DEPARTURE_DATETIME_label'),
      field: 'departureTm',
      sortable: true,

      filter: true,
      tooltipField: 'departureTm',
      lockPosition: true,

      width: 150,
      editable: false,
    },
    {
      headerName: t('Last_Name_label'),
      field: 'paxLastName',
      sortable: true,
      tooltipField: 'paxLastName',
      filter: true,
      lockPosition: true,

      width: 100,
      editable: false,
    },
    {
      headerName: t('First_Name_label'),
      field: 'paxFirstName',
      sortable: true,
      tooltipField: 'paxFirstName',
      filter: true,

      lockPosition: true,

      width: 100,
      editable: false,
    },

    {
      headerName: t('CARTON_label'),
      field: 'cartonNo',
      sortable: true,
      cellRenderer: 'DirectToCartonTracking',
      filter: true,

      lockPosition: true,
      tooltipField: 'cartonNo',
      width: 100,
      editable: false,
    },
    {
      headerName: t('WH_Bin_Location_label'),
      field: 'whBinLocId',
      sortable: true,
      tooltipField: 'whBinLocId',
      filter: true,

      lockPosition: true,

      width: 100,
      editable: false,
    },
    {
      headerName: t('Cage/Shelf_label'),
      field: 'cageNo&shelfNo',
      valueGetter: fullNameGetter,
      sortable: true,

      filter: true,
      cellRenderer: 'DirectToCageTracking',
      lockPosition: true,

      width: 100,
      editable: false,
    },
    {
      headerName: t('TRUCK_label'),
      field: 'truckNo',
      sortable: true,
      tooltipField: 'truckNo',
      filter: true,

      lockPosition: true,

      width: 100,
      editable: false,
    },
    {
      headerName: t('AP_Bin_Location_label'),
      field: 'apBinLocId',
      sortable: true,

      filter: true,
      tooltipField: 'apBinLocId',
      lockPosition: true,

      width: 100,
      editable: false,
    },

    {
      headerName: t('Status_Date/Time_label'),
      field: 'createdTm',
      sortable: true,
      sort: 'Desc',
      filter: true,
      cellRenderer: stringFormatter,
      lockPosition: true,

      width: 130,
      editable: false,
    },
    {
      headerName: t('Terminal_label'),
      field: 'terminalNo',
      sortable: true,
      tooltipField: 'terminalNo',
      filter: true,

      lockPosition: true,

      width: 100,
      editable: false,
    },
    {
      headerName: t('Operator_label'),
      field: 'createdBy',
      sortable: true,
      tooltipField: 'createdBy',
      filter: true,

      lockPosition: true,

      width: 100,
      editable: false,
    },
  ]
  function stringFormatter(params) {
    var date = params.value
    if (params.value) {
      var firstChar = date.slice(0, 10) + ' ' + date.slice(11, 16)
      return firstChar
    }
  }
  function fullNameGetter(params) {
    if (
      params.data.cageNo &&
      params.data.shelfNo &&
      params.data.cageNo !== null &&
      params.data.shelfNo !== null
    ) {
      return params.data.cageNo + '-' + params.data.shelfNo
    } else if (params.data.cageNo !== null && params.data.shelfNo === null) {
      return params.data.cageNo
    } else if (params.data.cageNo === null && params.data.shelfNo !== null) {
      return params.data.cageNo + '-' + params.data.shelfNo
    } else {
      return ''
    }
  }
  const defaultColDef = {
    sortable: true,
    resizable: true,
    cellStyle: rowStyle,
    wrapText: true,
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
  const formatDate = (dateOne, dateTwo) => {
    if (dateOne && dateTwo) {
      const strOne = Moment(dateOne).format('YYYY-MM-DD')

      const strTwo = Moment(dateTwo).format('YYYY-MM-DD')

      return strOne + ' - ' + strTwo
    }
    return null
  }
  useEffect(() => {
    if (props.formValueData && props.formValueData !== null) {
      setStartDate(props.formValueData.startDate)
      setEndDate(props.formValueData.endDate)
      setbagStatus(props.formValueData.bagStatus)
    }
  }, [props.formValueData])
  const handleGo = object => {
    let data = {}
    data.startDate = Moment(startDate).format('YYYY-MM-DD')
    data.endDate = Moment(endDate).format('YYYY-MM-DD')
    data.bagStatus = bagStatus.bagStatus
    props.formValue({ startDate: startDate, endDate: endDate, bagStatus: bagStatus })
    props.getBagByBagStatusReport(data)
    setShowData(true)
    setLoading(true)
  }
  function onGridReady(params) {
    setGridApi(params.api)
    // setGridColumnApi(params.columnApi)
  }

  const onChangeBagStatus = selectedOption => {
    setbagStatus(selectedOption)
  }
  useEffect(() => {
    if (props.getBagStatusData) {
      setDrop(props.getBagStatusData.result)
    }
  }, [props.getBagStatusData])

  useEffect(() => {
    if (startDate !== null && endDate !== null && bagStatus !== null) {
      setDisableGo(false)
    } else {
      setDisableGo(true)
    }
  }, [startDate, endDate, bagStatus])

  // useEffect(() => {
  //   if (startDate === null && endDate === null && bagStatus === null) {
  //     setShowData(false)
  //   }
  // }, [startDate, endDate, bagStatus])
  const onBtExport = () => {
    var excelParams = {
      fileName: 'Bag By Bag Status Report.xlsx',
    }
    gridApi.exportDataAsExcel(excelParams)
  }
  return (
    <div className='ml-2 mt-4 bg-white'>
      {NoTitle ? null : (
        <div>
          <h1 className='mb-4 mt-5'>{t('Bag_By_Bag_Status_Report_label')}</h1>
        </div>
      )}
      <div className='mt-3'>
        <Row>
          <Col xs='4'>
            <label className='form-label'>{t('Bag_Status_label')}</label>
            <span className='astrick'>*</span>
            <br />
            <Dropdown
              closeMenuOnSelect={true}
              className='form-control mb-4 '
              value={bagStatus}
              onChange={onChangeBagStatus}
              isClearable
              options={drop}
              optionLabel='bagStatus'
              optionValue='bagStatus'
            />
          </Col>
          <Col xs='3' className='ml-4'>
            <label className='form-label'> {t('LABEL_DEPARTURE_DATE_RANGE_label')}</label>
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
            <br />
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
        <div className='row mb-4 mt-3'>
          <div className='col box1 mr-4' style={{ borderRadius: '0', width: '100%' }}>
            <div className='row'>
              <div className='col-sm-2'>
                <label>
                  {' '}
                  {t('Total_No._of_Bags_label')} : {rowData !== null ? rowData.length : 0}
                </label>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {showData ? (
        <div>
          <div className='text-right'>
            <br />{' '}
            <button
              onClick={() => onBtExport()}
              className=' btn btn-outline-secondary '
              disabled={!(rowData !== null && rowData.length > 0)}
            >
              {t('Export_To_Excel_label')}
            </button>
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
                height: 300,
              }}
            >
              <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData}
                animateRows={true}
                rowHeight={40}
                headerHeight={50}
                defaultColDef={defaultColDef}
                frameworkComponents={{
                  customTooltip: ToolTip,
                  DirectToBagTracking: linkRenderer_bagTracking,
                  DirectToCartonTracking: linkRenderer_cartonTracking,
                  DirectToCageTracking: linkRenderer_cageTracking,
                  DirectToPurchaseEnquiry: linkRenderer_purchaseEnquiryByPax,
                }}
                pagination={true}
                paginationPageSize={10}
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
      ) : null}
    </div>
  )
}

function mapState(state) {
  return {
    getBagByBagStatusReportData: state.getBagByBagStatusReport.getData,
    getBagStatusData: state.getBagStatus.getData,
    formValueData: state.bagByBagStatusReportFormValue,
  }
}

const actionCreators = {
  getBagByBagStatusReport: bagByBagStatusReportActions.getBagByBagStatusReport,
  getBagStatus: bagByBagStatusReportActions.getBagStatus,
  formValue: bagByBagStatusReportActions.bagByBagStatusReportFormValue,
}

export default connect(mapState, actionCreators)(bagByBagStatusReport)
