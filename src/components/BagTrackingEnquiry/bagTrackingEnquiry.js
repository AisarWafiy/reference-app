import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import { ToolTip } from 'components/AgGridCustomComponents/Editors'
import Loader from 'react-loader-spinner'
import { EXCEPT_NUMBER } from 'constants/regex'
import { useTranslation } from 'react-i18next'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { bagTrackingEnquiryActions } from 'actions/bagTrackingEnquiry.actions'
import {
  linkRenderer_bagTracking,
  linkRenderer_cartonTracking,
  linkRenderer_itemEnquiry,
  linkRenderer_cageTracking,
  linkRenderer_purchaseEnquiryByPax,
} from 'components/AgGridCustomComponents/Renderers/link-page'
import { AgGridReact } from '@ag-grid-community/react'
import { linkActions } from 'actions/link.actions'
import { AllModules } from '@ag-grid-enterprise/all-modules'

function bagTrackingEnquiry(props) {
  const history = useHistory()
  const { NoTitle } = props
  const [loading, setLoading] = useState(false)
  const [gridApi, setGridApi] = useState(null)
  // const [gridColumnApi, setGridColumnApi] = useState(null)
  const [gridApi1, setGridApi1] = useState(null)
  // const [gridColumnApi1, setGridColumnApi1] = useState(null)
  const [rowData, setRowData] = useState([])
  const [rowData1, setRowData1] = useState([])
  const [msg, setMsg] = useState('')
  const [bagNumber, setbagNumber] = useState('')
  const [showData, setShowData] = useState(false)
  const [disableGo, setDisableGo] = useState(true)
  const { t } = useTranslation()
  const componentRef = useRef()
  const excelStyles = [
    {
      id: 'cartonNumber',
      numberFormat: {
        format: '000000',
      },
    },
  ]
  const linkClicked = () => {
    let a = props.getBagTrackingEnquiryData ? props.getBagTrackingEnquiryData.result.paxNo : null
    props.link({ paxNumber: a })
  }

  const columnDefs = [
    {
      headerName: t('Status_label'),
      field: 'entityDisplayStatus',
      sortable: true,
      filter: true,
      tooltipField: 'entityDisplayStatus',
      lockPosition: true,

      width: 150,
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
      cellClass: 'cartonNumber',
      editable: false,
    },
    {
      headerName: t('WH_Bin_Location_label'),
      field: 'whBinLocId',
      sortable: true,
      tooltipField: 'whBinLocId',
      filter: true,
      lockPosition: true,

      width: 110,
      editable: false,
    },
    {
      headerName: t('Cage/Shelf_label'),
      field: 'cageNo&shelfNo',
      valueGetter: fullNameGetter,
      sortable: true,
      cellRenderer: 'DirectToCageTracking',
      filter: true,

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

      width: 95,
      editable: false,
    },
    {
      headerName: t('AP_Bin_Location_label'),
      field: 'apBinLocId',
      sortable: true,
      tooltipField: 'apBinLocId',
      filter: true,

      lockPosition: true,

      width: 110,
      editable: false,
    },
    {
      headerName: t('Status_Date/Time_label'),
      field: 'createdTm',
      sortable: true,
      cellRenderer: stringFormatter,
      filter: true,
      sort: 'desc',
      lockPosition: true,

      width: 165,
      editable: false,
    },
    {
      headerName: t('Terminal_label'),
      field: 'terminalNo',
      sortable: true,
      tooltipField: 'terminalNo',
      filter: true,

      lockPosition: true,

      width: 110,
      editable: false,
    },
    {
      headerName: t('Operator_label'),
      field: 'createdBy',
      sortable: true,
      tooltipField: 'createdBy',
      filter: true,

      lockPosition: true,

      width: 110,
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
      headerName: t('Item_Code_label'),
      field: 'itemCode',
      sortable: true,
      filter: true,
      cellRenderer: 'DirectToItemEnquiry',
      lockPosition: true,
      sort: 'asc',
      width: 250,
      editable: false,
    },
    {
      headerName: t('Quantity_label'),
      field: 'quantity',
      sortable: true,

      filter: true,
      lockPosition: true,

      width: 250,

      editable: false,
    },
    {
      headerName: t('Item_Description_label'),
      field: 'description',
      sortable: true,

      filter: true,
      lockPosition: true,

      width: 350,
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

  const onChangebagNumber = object => {
    const { value } = object.target

    setbagNumber(value.replace(EXCEPT_NUMBER, ''))
  }
  const handleGo = object => {
    let data = bagNumber

    props.getBagTrackingEnquiry(data)
    setShowData(true)
    setLoading(true)
  }
  function onGridReady(params) {
    setGridApi(params.api)
    // setGridColumnApi(params.columnApi)
  }
  function onGridReady1(params) {
    setGridApi1(params.api)
    // setGridColumnApi1(params.columnApi)
  }
  useEffect(() => {
    if (bagNumber.length !== 12 && bagNumber !== '') {
      setMsg(t('Bag_Number_Should_Be_A_12_Digit_Number'))
    } else {
      setMsg('')
    }
  }, [bagNumber])
  useEffect(() => {
    if (bagNumber !== null && bagNumber.length === 12) {
      setDisableGo(false)
    } else {
      setDisableGo(true)
    }
  }, [bagNumber])
  // useEffect(() => {
  //   if (bagNumber === null || bagNumber === '') {
  //     setShowData(false)
  //   }
  // }, [bagNumber])

  useEffect(() => {
    if (props.linkData && props.linkData.bagNumber) {
      setbagNumber(props.linkData.bagNumber)
      props.getBagTrackingEnquiry(props.linkData.bagNumber)
      props.link(null)
      setShowData(true)
      setLoading(true)
    }
  }, [props.linkData])

  useEffect(() => {
    if (props.getBagTrackingEnquiryData && props.getBagTrackingEnquiryData.result) {
      setbagNumber(props.getBagTrackingEnquiryData.result.bagNo)
      setShowData(true)
      if (props.getBagTrackingEnquiryData.result.statusHistories !== null) {
        setRowData(props.getBagTrackingEnquiryData.result.statusHistories)
      } else {
        setRowData([])
      }
      if (props.getBagTrackingEnquiryData.result.items !== null) {
        setRowData1(props.getBagTrackingEnquiryData.result.items)
      } else {
        setRowData1([])
      }
      setLoading(false)
    } else if (props.getBagTrackingEnquiryData && !props.getBagTrackingEnquiryData.result) {
      setRowData([])
      setRowData1([])
      setLoading(false)
    }
  }, [props.getBagTrackingEnquiryData])
  const onBtExport = () => {
    var excelParams = {
      fileName: 'Status History.xlsx',
    }
    gridApi.exportDataAsExcel(excelParams)
  }
  const onBtExport1 = () => {
    var excelParams = {
      fileName: 'Item Details.xlsx',
    }
    gridApi1.exportDataAsExcel(excelParams)
  }
  const time = time => {
    if (time !== null) {
      let a = time.split(':')
      return a[0] + ':' + a[1]
    } else {
      return ''
    }
  }
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })
  function setPrinterFriendly(api, api1) {
    const eGridDiv = document.querySelector('#myGrid1')
    eGridDiv.style.height = ''
    eGridDiv.style.width = ''
    const eGridDiv1 = document.querySelector('#myGrid2')
    eGridDiv1.style.height = ''
    eGridDiv1.style.width = ''
    api.setDomLayout('print')
    api1.setDomLayout('print')
  }
  function setNormal(api, api1) {
    const eGridDiv = document.querySelector('#myGrid1')
    eGridDiv.style.width = '100%'
    eGridDiv.style.height = '200px'
    const eGridDiv1 = document.querySelector('#myGrid2')
    eGridDiv1.style.width = '100%'
    eGridDiv1.style.height = '200px'
    api.setDomLayout(null)
    api1.setDomLayout(null)
  }
  const onBtPrint = () => {
    const api = gridApi
    const api1 = gridApi1
    setPrinterFriendly(api, api1)
    setTimeout(function () {
      handlePrint()
      setTimeout(function () {
        setNormal(api, api1)
      }, 2000)
    }, 2000)
  }
  return (
    <div className='ml-4 mt-4 bg-white' ref={componentRef}>
      {NoTitle ? null : (
        <div>
          <h1 className='mb-4 mt-5'>{t('Bag_Tracking_Enquiry_label')}</h1>
        </div>
      )}
      {/* <button onClick={getSelectedRowData} style={{ margin: 10 }}>
        Get Selected Nodes
      </button> */}

      <div className='mt-3'>
        <Row>
          <Col xs='4'>
            <label className='form-label'>{t('Bag_Number_label')}</label>
            <span className='astrick'>*</span>
            <br />

            <input
              name='bagNumber'
              value={bagNumber}
              type='text'
              maxLength={12}
              //   disabled={field}
              onChange={onChangebagNumber}
              placeholder={t('Bag_Number_label')}
              className='form-control'
            ></input>
            {msg !== '' ? (
              <span className='form-label' style={{ color: '#B13C27' }}>
                {msg}
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
        {loading === true && (
          <div style={{ textAlign: 'center' }} className='mt-5'>
            <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
          </div>
        )}

        {showData && loading !== true ? (
          <Row className=' mb-4 mt-3'>
            <Col className='box1 mr-4' style={{ borderRadius: '0', width: '100%' }}>
              <Row>
                <Col>
                  <label>{t('PAX_Number_label')} </label>
                  <br />
                  {props.getBagTrackingEnquiryData &&
                  props.getBagTrackingEnquiryData.result &&
                  props.getBagTrackingEnquiryData.result.paxNo ? (
                    <Link
                      onClick={() => linkClicked()}
                      to='/bag-tracking/reports/purchase-enquiry-by-pax'
                    >
                      {' '}
                      {props.getBagTrackingEnquiryData && props.getBagTrackingEnquiryData.result
                        ? props.getBagTrackingEnquiryData.result.paxNo
                        : '-'}
                    </Link>
                  ) : (
                    <div>-</div>
                  )}
                </Col>
                <Col>
                  <label>{t('Pax_Details_label')}</label>
                  <br />
                  {props.getBagTrackingEnquiryData && props.getBagTrackingEnquiryData.result
                    ? props.getBagTrackingEnquiryData.result.paxFirstName
                    : '-'}{' '}
                  {props.getBagTrackingEnquiryData && props.getBagTrackingEnquiryData.result
                    ? props.getBagTrackingEnquiryData.result.paxLastName
                    : '-'}
                  <br />
                  {props.getBagTrackingEnquiryData &&
                  props.getBagTrackingEnquiryData.result &&
                  props.getBagTrackingEnquiryData.result.paxAddress
                    ? props.getBagTrackingEnquiryData.result.paxAddress.addressLine1
                    : null}
                  <br />
                  {props.getBagTrackingEnquiryData &&
                  props.getBagTrackingEnquiryData.result &&
                  props.getBagTrackingEnquiryData.result.paxAddress
                    ? props.getBagTrackingEnquiryData.result.paxAddress.addressLine2
                    : null}{' '}
                  <br />
                  {props.getBagTrackingEnquiryData &&
                  props.getBagTrackingEnquiryData.result &&
                  props.getBagTrackingEnquiryData.result.paxAddress
                    ? props.getBagTrackingEnquiryData.result.paxAddress.addressCity
                    : '-'}
                  <br />
                  {props.getBagTrackingEnquiryData &&
                  props.getBagTrackingEnquiryData.result &&
                  props.getBagTrackingEnquiryData.result.paxAddress
                    ? props.getBagTrackingEnquiryData.result.paxAddress.country
                    : null}{' '}
                  <br />
                  {props.getBagTrackingEnquiryData &&
                  props.getBagTrackingEnquiryData.result &&
                  props.getBagTrackingEnquiryData.result.paxAddress
                    ? props.getBagTrackingEnquiryData.result.paxAddress.postCode
                    : null}
                </Col>
                <Col>
                  <label>{t('Departure_Flight_Number_label')}</label>
                  <br />
                  {props.getBagTrackingEnquiryData && props.getBagTrackingEnquiryData.result
                    ? props.getBagTrackingEnquiryData.result.carrierNumber
                    : '-'}
                </Col>
                <Col>
                  <label>{t('Departure_Date_label')} </label>
                  <br />{' '}
                  {props.getBagTrackingEnquiryData && props.getBagTrackingEnquiryData.result
                    ? props.getBagTrackingEnquiryData.result.carrierDepDate
                    : '-'}
                </Col>
                <Col>
                  <label>{t('Departure_Time_label')} </label>
                  <br />
                  {props.getBagTrackingEnquiryData && props.getBagTrackingEnquiryData.result
                    ? time(props.getBagTrackingEnquiryData.result.carrierDepTime)
                    : '-'}
                </Col>
              </Row>
            </Col>
          </Row>
        ) : null}
      </div>
      <div className='Print'>
        {showData && loading !== true ? (
          <div>
            <div>
              <div>
                <Row>
                  <Col>
                    {' '}
                    <h2 className='mt-4'>{t('Status_History_label')}</h2>
                  </Col>
                  {showData ? (
                    <div>
                      <div className='text-right mr-3'>
                        <br />
                        <button
                          type='submit'
                          onClick={onBtPrint}
                          className='btn btn-outline-secondary mr-3 mt-1'
                          disabled={
                            !(rowData !== null && rowData.length > 0) &&
                            !(rowData1 !== null && rowData1.length > 0)
                          }
                        >
                          {t('Print_label')}
                        </button>

                        <button
                          onClick={() => onBtExport()}
                          className=' btn btn-outline-secondary '
                          disabled={!(rowData !== null && rowData.length > 0)}
                        >
                          {t('Export_To_Excel_label')}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </Row>
              </div>
              <div
                id='myGrid1'
                className='ag-theme-alpine mt-3'
                style={{
                  width: '100%',
                  height: '200px',
                }}
              >
                <AgGridReact
                  columnDefs={columnDefs}
                  rowData={rowData}
                  animateRows={true}
                  rowHeight={40}
                  headerHeight={50}
                  defaultColDef={defaultColDef}
                  context={props.context}
                  modules={AllModules}
                  pagination={true}
                  paginationPageSize={35}
                  frameworkComponents={{
                    customTooltip: ToolTip,
                    DirectToBagTracking: linkRenderer_bagTracking,
                    DirectToCartonTracking: linkRenderer_cartonTracking,
                    DirectToCageTracking: linkRenderer_cageTracking,
                    DirectToPurchaseEnquiry: linkRenderer_purchaseEnquiryByPax,
                    DirectToItemEnquiry: linkRenderer_itemEnquiry,
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
                    <h2 className='mt-4'>{t('Item_Details_label')}</h2>
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
                id='myGrid2'
                className='ag-theme-alpine mt-3'
                style={{
                  width: '100%',
                  height: '200px',
                }}
              >
                <AgGridReact
                  columnDefs={columnDefs1}
                  rowData={rowData1}
                  animateRows={true}
                  rowHeight={40}
                  headerHeight={50}
                  defaultColDef={defaultColDef}
                  excelStyles={excelStyles}
                  context={props.context}
                  pagination={true}
                  paginationPageSize={35}
                  frameworkComponents={{
                    customTooltip: ToolTip,
                    DirectToBagTracking: linkRenderer_bagTracking,
                    DirectToCartonTracking: linkRenderer_cartonTracking,
                    DirectToCageTracking: linkRenderer_cageTracking,
                    DirectToPurchaseEnquiry: linkRenderer_purchaseEnquiryByPax,
                    DirectToItemEnquiry: linkRenderer_itemEnquiry,
                  }}
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
    </div>
  )
}
function mapState(state) {
  return {
    getBagTrackingEnquiryData: state.getBagTrackingEnquiry.getData,
    linkData: state.linksuccess,
  }
}

const actionCreators = {
  getBagTrackingEnquiry: bagTrackingEnquiryActions.getBagTrackingEnquiry,
  link: linkActions.linksuccess,
}

export default connect(mapState, actionCreators)(bagTrackingEnquiry)
