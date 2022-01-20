import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Loader from 'react-loader-spinner'
import DatePicker from 'react-datepicker'
import { ToolTip } from 'components/AgGridCustomComponents/Editors'
import { useTranslation } from 'react-i18next'
import 'react-datepicker/dist/react-datepicker.css'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import {
  linkRenderer_bagTracking,
  linkRenderer_cartonTracking,
  linkRenderer_cageTracking,
  linkRenderer_purchaseEnquiryByPax,
} from 'components/AgGridCustomComponents/Renderers/link-page'
import { AgGridReact } from '@ag-grid-community/react'
import { bagStatusFlightActions } from 'actions/bagStatusFlight.actions'
import { AllModules } from '@ag-grid-enterprise/all-modules'
import Moment from 'moment'
import Select from 'react-select'

function bagStatusByFlight(props) {
  const { NoTitle } = props
  const [gridApi, setGridApi] = useState(null)
  // const [gridColumnApi, setGridColumnApi] = useState(null)
  const [gridApi1, setGridApi1] = useState(null)
  // const [gridColumnApi1, setGridColumnApi1] = useState(null)
  const [rowData, setRowData] = useState([])
  const [rowData1, setRowData1] = useState([])
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [dateError, setDateError] = useState('')
  const [carrierNumber, setCarrierNumber] = useState(null)
  const [showData, setShowData] = useState(false)
  const [drop, setDrop] = useState([])
  const [disableGo, setDisableGo] = useState(true)
  const { t } = useTranslation()
  const componentRef = useRef(null)
  const excelStyles = [
    {
      id: 'cartonNumber',
      numberFormat: {
        format: '000000',
      },
    },
    {
      id: 'bagNumber',
      numberFormat: {
        format: '000000000000',
      },
    },
    {
      id: 'paxNumber',
      numberFormat: {
        format: '0000000000',
      },
    },
  ]

  useEffect(() => {
    props.getCarrierCode()
  }, [props.getCarrierCode])
  useEffect(() => {
    if (props.getCarrierCodeData) {
      const list = []

      props.getCarrierCodeData.result.forEach(function (element) {
        list.push({ value: element, label: element })
      })
      setDrop(list)
    }
  }, [props.getCarrierCodeData])

  useEffect(() => {
    if (props.getBagStatusFlightData && props.getBagStatusFlightData.result) {
      setShowData(true)
      if (props.getBagStatusFlightData.result.bagStatusTotals !== null) {
        setRowData(props.getBagStatusFlightData.result.bagStatusTotals)
      } else {
        setRowData([])
      }
      if (props.getBagStatusFlightData.result.bagDetails !== null) {
        setRowData1(props.getBagStatusFlightData.result.bagDetails)
      } else {
        setRowData1([])
      }
      setLoading(false)
    } else if (props.getBagStatusFlightData && !props.getBagStatusFlightData.result) {
      setRowData([])
      setRowData1([])
      setLoading(false)
    }
  }, [props.getBagStatusFlightData])
  const columnDefs = [
    {
      headerName: t('Bag_Number_label'),
      field: 'bagNo',
      sortable: true,
      filter: true,
      cellRenderer: 'DirectToBagTracking',
      lockPosition: true,
      cellClass: 'bagNumber',
      tooltipField: 'bagNo',
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
      cellClass: 'paxNumber',
      editable: false,
    },
    {
      headerName: t('Last_Name_label'),
      field: 'paxLastName',
      sortable: true,
      tooltipField: 'paxLastName',
      filter: true,
      lockPosition: true,

      width: 90,
      editable: false,
    },
    {
      headerName: t('First_Name_label'),
      field: 'paxFirstName',
      sortable: true,
      tooltipField: 'paxFirstName',
      filter: true,

      lockPosition: true,

      width: 90,
      editable: false,
    },
    {
      headerName: t('Status_label'),
      field: 'entityDisplayStatus',
      sortable: true,

      filter: true,
      tooltipField: 'entityDisplayStatus',
      lockPosition: true,

      width: 90,
      editable: false,
    },
    {
      headerName: t('CARTON_label'),
      field: 'cartonNo',
      sortable: true,
      cellRenderer: 'DirectToCartonTracking',
      filter: true,
      tooltipField: 'cartonNo',
      lockPosition: true,
      cellClass: 'cartonNumber',
      width: 85,
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

      width: 90,
      editable: false,
    },
    {
      headerName: t('TRUCK_label'),
      field: 'truckNo',
      sortable: true,

      filter: true,
      tooltipField: 'truckNo',
      lockPosition: true,

      width: 80,
      editable: false,
    },
    {
      headerName: t('AP_Bin_Location_label'),
      field: 'apBinLocId',
      sortable: true,
      tooltipField: 'apBinLocId',
      filter: true,

      lockPosition: true,

      width: 100,
      editable: false,
    },
    {
      headerName: t('Status_Date/Time_label'),
      field: 'createdTm',
      sortable: true,
      sort: 'desc',
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
  function stringFormatter(params) {
    var date = params.value
    if (params.value) {
      var firstChar = date.slice(0, 10) + ' ' + date.slice(11, 16)
      return firstChar
    }
  }
  const columnDefs1 = [
    {
      headerName: t('Status_label'),
      field: 'entityDisplayStatus',
      sortable: true,
      filter: true,
      tooltipField: 'entityDisplayStatus',
      lockPosition: true,
      sort: 'asc',
      editable: false,
    },
    {
      headerName: t('Total_No._of_Bags_label'),
      field: 'bagCount',
      sortable: true,
      tooltipField: 'bagCount',
      filter: true,
      lockPosition: true,

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
      setCarrierNumber(props.formValueData.carrierNumber)
    }
  }, [props.formValueData])
  const handleGo = object => {
    let data = {}
    data.carrierDepStartDate = Moment(startDate).format('YYYY-MM-DD')
    data.carrierDepEndDate = Moment(endDate).format('YYYY-MM-DD')
    data.carrierCode = carrierNumber.value
    props.formValue({ startDate: startDate, endDate: endDate, carrierNumber: carrierNumber })
    props.getBagStatusFlight(data)
    setShowData(true)
    setLoading(true)
    componentRef.current.focus()
  }
  function onGridReady(params) {
    setGridApi(params.api)
    // setGridColumnApi(params.columnApi)
  }
  function onGridReady1(params) {
    setGridApi1(params.api)
    // setGridColumnApi1(params.columnApi)
  }
  const onChangeCarrier = selectedOption => {
    setCarrierNumber(selectedOption)
  }

  useEffect(() => {
    if (startDate !== null && endDate !== null && carrierNumber !== null) {
      setDisableGo(false)
    } else {
      setDisableGo(true)
    }
  }, [startDate, carrierNumber, endDate])
  // useEffect(() => {
  //   if (startDate === null && endDate === null && carrierNumber === null) {
  //     setShowData(false)
  //   }
  // }, [startDate, carrierNumber, endDate])
  const onBtExport = () => {
    var excelParams = {
      fileName: 'Status Totals.xlsx',
    }
    gridApi.exportDataAsExcel(excelParams)
  }
  const onBtExport1 = () => {
    var excelParams = {
      fileName: 'Bag Details.xlsx',
    }
    gridApi1.exportDataAsExcel(excelParams)
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
    <div className='ml-0 mt-4 bg-white'>
      {NoTitle ? null : (
        <div>
          <h1 className='mb-4 mt-5'>{t('Bag_Status_By_Flight_label')}</h1>
        </div>
      )}
      <div className='mt-3'>
        <Row>
          <Col xs='3'>
            <label className='form-label'>{t('Carrier_Code/Number_label')}</label>
            <span className='astrick'>*</span>
            <br />

            <Select
              closeMenuOnSelect={true}
              styles='form-control mb-4 '
              value={carrierNumber}
              onChange={onChangeCarrier}
              isClearable={true}
              options={drop}
              ref={componentRef}
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
      {loading === true ? (
        <div style={{ textAlign: 'center' }} className='mt-5'>
          <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
        </div>
      ) : (
        <div>
          {showData ? (
            <div>
              <div>
                <div>
                  <Row>
                    <Col>
                      <h2 className='mt-4'>{t('Status_Totals_label')}</h2>
                    </Col>
                    {showData ? (
                      <Col className='text-right mr-4'>
                        <br />{' '}
                        <button
                          onClick={() => onBtExport()}
                          className=' btn btn-outline-secondary '
                          disabled={!(rowData !== null && rowData.length > 0)}
                        >
                          {t('Export_To_Excel_label')}
                        </button>
                      </Col>
                    ) : null}
                  </Row>
                </div>
                <div
                  id='myGrid'
                  className='ag-theme-alpine mt-3'
                  style={{
                    width: '100%',
                    height: 180,
                  }}
                >
                  <AgGridReact
                    columnDefs={columnDefs1}
                    rowData={rowData}
                    animateRows={true}
                    rowHeight={40}
                    headerHeight={50}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={10}
                    context={props.context}
                    modules={AllModules}
                    frameworkComponents={{
                      customTooltip: ToolTip,
                      DirectToBagTracking: linkRenderer_bagTracking,
                      DirectToCartonTracking: linkRenderer_cartonTracking,
                      DirectToCageTracking: linkRenderer_cageTracking,
                      DirectToPurchaseEnquiry: linkRenderer_purchaseEnquiryByPax,
                    }}
                    excelStyles={excelStyles}
                    tooltipShowDelay={0}
                    onGridReady={onGridReady}
                    editType='fullRow'
                    suppressClickEdit={true}
                    undoRedoCellEditing={true}
                  />
                </div>
              </div>
              <div>
                <div>
                  <Row>
                    <Col>
                      {' '}
                      <h2 className='mt-4'>{t('Bag_Details_label')}</h2>
                    </Col>
                    {showData ? (
                      <Col className='text-right mr-4'>
                        <br />{' '}
                        <button
                          onClick={() => onBtExport1()}
                          className=' btn btn-outline-secondary '
                          disabled={!(rowData1 !== null && rowData1.length > 0)}
                        >
                          {t('Export_To_Excel_label')}
                        </button>
                      </Col>
                    ) : null}
                  </Row>
                </div>
                <div
                  id='myGrid'
                  className='ag-theme-alpine mt-3'
                  style={{
                    width: '100%',
                    height: 200,
                  }}
                >
                  <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData1}
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
                    excelStyles={excelStyles}
                    pagination={true}
                    paginationPageSize={10}
                    context={props.context}
                    modules={AllModules}
                    onGridReady={onGridReady1}
                    editType='fullRow'
                    suppressClickEdit={true}
                    undoRedoCellEditing={true}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

function mapState(state) {
  return {
    getCarrierCodeData: state.getCarrierCode.getData,
    getBagStatusFlightData: state.getBagStatusFlight.getData,
    formValueData: state.formValueBagStatusFlight,
  }
}

const actionCreators = {
  getCarrierCode: bagStatusFlightActions.getCarrierCode,
  getBagStatusFlight: bagStatusFlightActions.getBagStatusFlight,
  formValue: bagStatusFlightActions.formValueBagStatusFlight,
}

export default connect(mapState, actionCreators)(bagStatusByFlight)
