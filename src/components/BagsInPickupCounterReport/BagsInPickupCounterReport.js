import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import DatePicker from 'react-datepicker'
import { ToolTip } from 'components/AgGridCustomComponents/Editors'
import 'react-datepicker/dist/react-datepicker.css'
import Loader from 'react-loader-spinner'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import {
  linkRenderer_bagTracking,
  linkRenderer_cartonTracking,
  linkRenderer_cageTracking,
  linkRenderer_purchaseEnquiryByPax,
} from 'components/AgGridCustomComponents/Renderers/link-page'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { Dropdown } from 'components/UI/Input'
import Moment from 'moment'
import { AgGridReact } from '@ag-grid-community/react'
import { bagsInPickupCounterReportActions } from 'actions/bagsInPickupCounterReport.actions'
import { AllModules } from '@ag-grid-enterprise/all-modules'

function bagsInPickupCounterReport(props) {
  const [gridApi, setGridApi] = useState(null)
  const [loading, setLoading] = useState(false)
  // const [gridColumnApi, setGridColumnApi] = useState(null)
  const [gridApi1, setGridApi1] = useState(null)
  // const [gridColumnApi1, setGridColumnApi1] = useState(null)
  const [rowData, setRowData] = useState([])
  const [rowData1, setRowData1] = useState([])
  const [showData, setShowData] = useState(false)
  const [disableGo, setDisableGo] = useState(true)
  const [startDate, setStartDate] = useState(null)
  const [location, setlocation] = useState('')
  const { t } = useTranslation()
  const [drop, setDrop] = useState([])

  useEffect(() => {
    props.getLocation()
  }, [props.getLocation])

  useEffect(() => {
    if (props.getLocationData) {
      setDrop(props.getLocationData.result)
    }
  }, [props.getLocationData])
  useEffect(() => {
    if (props.getBagsInPickupCounterReportData && props.getBagsInPickupCounterReportData.result) {
      setLoading(false)
      if (props.getBagsInPickupCounterReportData.result.bagStatusTotals !== null) {
        setRowData(props.getBagsInPickupCounterReportData.result.bagStatusTotals)
      } else {
        setRowData([])
      }
      if (props.getBagsInPickupCounterReportData.result.bagDetails !== null) {
        setRowData1(props.getBagsInPickupCounterReportData.result.bagDetails)
      } else {
        setRowData1([])
      }
    } else if (
      props.getBagsInPickupCounterReportData &&
      !props.getBagsInPickupCounterReportData.result
    ) {
      setRowData([])
      setRowData1([])
      setLoading(false)
    }
  }, [props.getBagsInPickupCounterReportData])

  const columnDefs = [
    {
      headerName: t('Bag_Number_label'),
      field: 'bagNo',
      sortable: true,
      filter: true,
      tooltipField: 'bagNo',
      cellRenderer: 'DirectToBagTracking',
      lockPosition: true,

      width: 110,
      editable: false,
    },
    {
      headerName: t('Pax_Number_label'),
      field: 'paxNo',
      sortable: true,
      tooltipField: 'paxNo',
      filter: true,
      lockPosition: true,
      cellRenderer: 'DirectToPurchaseEnquiry',
      width: 100,

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
      headerName: t('Status_label'),
      field: 'entityDisplayStatus',
      sortable: true,
      tooltipField: 'entityDisplayStatus',
      filter: true,

      lockPosition: true,

      width: 90,
      editable: false,
    },
    {
      headerName: t('Cartons_label'),
      field: 'cartonNo',
      sortable: true,
      tooltipField: 'cartonNo',
      filter: true,
      cellRenderer: 'DirectToCartonTracking',
      lockPosition: true,

      width: 90,
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
      cellRenderer: 'DirectToCageTracking',
      filter: true,
      tooltipField: 'cageNo',
      lockPosition: true,

      width: 100,
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
      tooltipField: 'createdTm',
      filter: true,
      cellRenderer: stringFormatter,
      lockPosition: true,
      sort: 'desc',
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
  const columnDefs1 = [
    {
      headerName: t('Status_label'),
      field: 'entityDisplayStatus',
      sortable: true,
      filter: true,
      sort: 'asc',
      lockPosition: true,

      editable: false,
    },
    {
      headerName: t('Total_No._of_Bags_label'),
      field: 'bagCount',
      sortable: true,

      filter: true,
      lockPosition: true,

      editable: false,
    },
  ]
  const defaultColDef = {
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
    tooltipComponent: 'customTooltip',
  }
  function stringFormatter(params) {
    var date = params.value
    if (params.value) {
      var firstChar = date.slice(0, 10) + ' ' + date.slice(11, 16)
      return firstChar
    }
  }

  const handleGo = object => {
    let data = {}
    data.flightDate = Moment(startDate).format('YYYY-MM-DD')

    data.locationId = location.code

    props.getBagsInPickupCounterReport(data)
    setLoading(true)
    setShowData(true)
  }
  function onGridReady(params) {
    setGridApi(params.api)
    // setGridColumnApi(params.columnApi)
  }
  function onGridReady1(params) {
    setGridApi1(params.api)
    // setGridColumnApi1(params.columnApi)
  }
  const onChangeLocation = selectedOption => {
    setlocation(selectedOption)
  }
  useEffect(() => {
    if (startDate !== null && location !== null) {
      setDisableGo(false)
    } else {
      setDisableGo(true)
    }
  }, [startDate, location])
  useEffect(() => {
    if (startDate === null && location === null) {
      setShowData(false)
    }
  }, [startDate, location])
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
  return (
    <div className='ml-4 mt-4 bg-white'>
      <div>
        <h1 className='mb-4 mt-5'>{t('Bags_in_Pick_up_Counter_Report_label')}</h1>
      </div>

      <div className='mt-3'>
        <Row>
          <Col xs='3'>
            <label className='form-label'>{t('Location_label')}</label>
            <span className='astrick'>*</span>
            <br />
            <Dropdown
              closeMenuOnSelect={true}
              className='form-control mb-4 '
              value={location}
              placeholder={t('TEXT_SELECT_label')}
              onChange={onChangeLocation}
              isClearable
              options={drop}
              optionLabel='description'
              optionValue='code'
            />
          </Col>
          <Col xs='3' className='ml-4'>
            <label className='form-label'>{t('Departure_Date_label')}</label>
            <span className='astrick'>*</span>
            <br />
            <DatePicker
              dateFormat='yyyy-MM-dd'
              placeholderText='YYYY-MM-DD'
              className='form-control'
              selected={startDate}
              onChange={date => setStartDate(date)}
            />
          </Col>

          <Col>
            <br />
            <button
              type='submit'
              onClick={handleGo}
              className='btn btn-primary mr-3 mt-1'
              disabled={disableGo}
            >
              {t('BUTTON_SEARCH_label')}
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
                    height: 300,
                  }}
                >
                  <AgGridReact
                    columnDefs={columnDefs1}
                    rowData={rowData}
                    animateRows={true}
                    rowHeight={40}
                    headerHeight={40}
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
                      <h2 className='mt-4'>{t('Bag_Details_label')}</h2>
                    </Col>
                    {showData ? (
                      <Col className='text-right mr-4'>
                        <br />
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
                    height: 300,
                  }}
                >
                  <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData1}
                    animateRows={true}
                    rowHeight={40}
                    headerHeight={40}
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
    getBagsInPickupCounterReportData: state.getBagsInPickupCounterReport.getData,
    getLocationData: state.getLocation.getData,
  }
}

const actionCreators = {
  getBagsInPickupCounterReport: bagsInPickupCounterReportActions.getBagsInPickupCounterReport,
  getLocation: bagsInPickupCounterReportActions.getLocation,
}

export default connect(mapState, actionCreators)(bagsInPickupCounterReport)
