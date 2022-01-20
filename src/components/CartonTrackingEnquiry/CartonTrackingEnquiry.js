import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Loader from 'react-loader-spinner'
import { ToolTip } from 'components/AgGridCustomComponents/Editors'
import { useTranslation } from 'react-i18next'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { Dropdown } from 'components/UI/Input'
import { cartonTrackingEnquiryActions } from 'actions/cartonTrackingEnquiry.actions'
import { linkActions } from 'actions/link.actions'
import { AgGridReact } from '@ag-grid-community/react'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import { useReactToPrint } from 'react-to-print'
import {
  linkRenderer_bagTracking,
  linkRenderer_cartonTracking,
  linkRenderer_cageTracking,
  linkRenderer_purchaseEnquiryByPax,
} from 'components/AgGridCustomComponents/Renderers/link-page'
import { AllModules } from '@ag-grid-enterprise/all-modules'

function cartonTrackingEnquiry(props) {
  const { NoTitle } = props
  const [gridApi, setGridApi] = useState(null)
  const [loading, setLoading] = useState(false)
  // const [gridColumnApi, setGridColumnApi] = useState(null)
  const [gridApi1, setGridApi1] = useState(null)
  // const [gridColumnApi1, setGridColumnApi1] = useState(null)
  const [rowData, setRowData] = useState([])
  const [rowData1, setRowData1] = useState([])
  const [disableGo, setDisableGo] = useState(true)
  const [cartonNumber, setcartonNumber] = useState(null)
  const [showData, setShowData] = useState(false)
  const [drop, setDrop] = useState([])
  const { t } = useTranslation()
  const componentRef = useRef()
  const excelStyles = [
    {
      id: 'cageNumber',
      numberFormat: {
        format: '000',
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
  const columnDefs = [
    {
      headerName: t('Bag_Number_label'),
      field: 'bagNo',
      sortable: true,
      cellRenderer: 'DirectToBagTracking',
      filter: true,
      lockPosition: true,
      tooltipField: 'bagNo',
      width: 150,
      cellClass: 'bagNumber',
      editable: false,
    },
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
      headerName: t('Pax_Number_label'),
      field: 'paxNo',
      sortable: true,
      cellRenderer: 'DirectToPurchaseEnquiry',
      filter: true,
      lockPosition: true,
      tooltipField: 'paxNo',
      width: 150,
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

      width: 150,
      editable: false,
    },
    {
      headerName: t('First_Name_label'),
      field: 'paxFirstName',
      sortable: true,
      tooltipField: 'paxFirstName',
      filter: true,

      lockPosition: true,

      width: 150,
      editable: false,
    },
    {
      headerName: t('Status_Date_label'),
      field: 'createdTm',
      sortable: true,
      tooltipField: 'createdTm',
      filter: true,
      sort: 'desc',
      lockPosition: true,

      width: 150,
      editable: false,
    },
  ]
  const columnDefs1 = [
    {
      headerName: t('Status_label'),
      field: 'entityDisplayStatus',
      sortable: true,
      filter: true,
      tooltipField: 'entityDisplayStatus',
      lockPosition: true,

      width: 140,
      editable: false,
    },
    {
      headerName: t('WH_Bin_Location_label'),
      field: 'whBinLocId',
      sortable: true,

      filter: true,
      lockPosition: true,
      tooltipField: 'whBinLocId',
      width: 130,
      editable: false,
    },

    {
      headerName: t('Cage#_label'),
      field: 'cageNo',
      sortable: true,
      tooltipField: 'cageNo',
      filter: true,
      cellRenderer: 'DirectToCageTracking',
      cellClass: 'cageNumber',
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

      width: 125,
      editable: false,
    },
    {
      headerName: t('Status_Date/Time_label'),
      field: 'createdTm',
      sortable: true,
      cellRenderer: stringFormatter,
      sort: 'desc',
      filter: true,

      lockPosition: true,

      width: 165,
      editable: false,
    },
    {
      headerName: t('Terminal_label'),
      field: 'terminalNo',
      sortable: true,

      filter: true,
      tooltipField: 'terminalNo',
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

  useEffect(() => {
    props.getCartonNumber()
  }, [props.getCartonNumber])

  useEffect(() => {
    if (props.getCartonNumberData) {
      const list = []

      props.getCartonNumberData.result.forEach(function (element) {
        list.push({ key: element, value: element })
      })
      setDrop(list)
    }
  }, [props.getCartonNumberData])

  const handleGo = object => {
    let data = cartonNumber.value
    // props.link(data)

    props.getCartonTrackingEnquiry(data)
    setShowData(true)
    setLoading(true)
  }
  useEffect(() => {
    if (props.getCartonTrackingEnquiryData && props.getCartonTrackingEnquiryData.result) {
      setcartonNumber({
        key: props.getCartonTrackingEnquiryData.result.cartonNumber,
        value: props.getCartonTrackingEnquiryData.result.cartonNumber,
      })
      setShowData(true)
      if (props.getCartonTrackingEnquiryData.result.cartonStatusList !== null) {
        setRowData(props.getCartonTrackingEnquiryData.result.cartonStatusList)
      } else {
        setRowData([])
      }
      if (props.getCartonTrackingEnquiryData.result.bagsInCartonList !== null) {
        setRowData1(props.getCartonTrackingEnquiryData.result.bagsInCartonList)
      } else {
        setRowData1([])
      }
      setLoading(false)
    } else if (props.getCartonTrackingEnquiryData && !props.getCartonTrackingEnquiryData.result) {
      setRowData([])
      setRowData1([])
      setLoading(false)
    }
  }, [props.getCartonTrackingEnquiryData])
  function onGridReady(params) {
    setGridApi(params.api)
    // setGridColumnApi(params.columnApi)
  }
  function onGridReady1(params) {
    setGridApi1(params.api)
    // setGridColumnApi1(params.columnApi)
  }

  const onChangeCarrier = selectedOption => {
    setcartonNumber(selectedOption)
  }
  useEffect(() => {
    if (cartonNumber !== null) {
      setDisableGo(false)
    } else {
      setDisableGo(true)
    }
  }, [cartonNumber])
  // useEffect(() => {
  //   if (cartonNumber === null) {
  //     setShowData(false)
  //   }
  // }, [cartonNumber])
  const onBtExport = () => {
    var excelParams = {
      fileName: 'Status History.xlsx',
    }
    gridApi.exportDataAsExcel(excelParams)
  }
  const onBtExport1 = () => {
    var excelParams = {
      fileName: 'Bags in the Carton.xlsx',
    }
    gridApi1.exportDataAsExcel(excelParams)
  }

  useEffect(() => {
    if (props.linkData && props.linkData.cartonNumber) {
      let a = { key: props.linkData.cartonNumber, value: props.linkData.cartonNumber }
      setcartonNumber(a)
      props.getCartonTrackingEnquiry(props.linkData.cartonNumber)
      props.link(null)
      setShowData(true)
      setLoading(true)
    }
  }, [props.linkData])

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })
  function setPrinterFriendly(api, api1) {
    const eGridDiv = document.querySelector('#myGrid1')
    eGridDiv.style.height = ''

    const eGridDiv1 = document.querySelector('#myGrid2')
    eGridDiv1.style.height = ''
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
    <div className='container bg-white' ref={componentRef}>
      {NoTitle ? null : (
        <div>
          <h1 className='mb-4 mt-5'>{t('Carton_Tracking_Enquiry_label')}</h1>
        </div>
      )}

      <div className='mt-3'>
        <Row>
          <Col xs='3'>
            <label className='form-label'>{t('Carton_Number_label')}</label>
            <span className='astrick'>*</span>
            <br />
            <Dropdown
              closeMenuOnSelect={true}
              className='form-control mb-4 '
              value={cartonNumber}
              onChange={onChangeCarrier}
              isClearable
              options={drop}
              optionLabel='value'
              optionValue='value'
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
          <Row className='mb-4 mt-3'>
            <div className='col box1 mr-4' style={{ borderRadius: '0', width: '100%' }}>
              <Row>
                <Col>
                  <label>{t('Pickup_Location_label')}</label>
                  <br />
                  {props.getCartonTrackingEnquiryData && props.getCartonTrackingEnquiryData.result
                    ? props.getCartonTrackingEnquiryData.result.pickupLocation
                    : '-'}
                </Col>
                <Col>
                  <label>{t('Departure_Date_label')} </label>
                  <br />{' '}
                  {props.getCartonTrackingEnquiryData && props.getCartonTrackingEnquiryData.result
                    ? props.getCartonTrackingEnquiryData.result.departureDate
                    : '-'}
                </Col>
                <Col>
                  <label>{t('Shift_label')} </label>
                  <br />{' '}
                  {props.getCartonTrackingEnquiryData && props.getCartonTrackingEnquiryData.result
                    ? props.getCartonTrackingEnquiryData.result.shift
                    : '-'}
                </Col>
                <Col>
                  <label> {t('Total_No._of_Bags_label')} </label>
                  <br />{' '}
                  {props.getCartonTrackingEnquiryData && props.getCartonTrackingEnquiryData.result
                    ? props.getCartonTrackingEnquiryData.result.noOfBags
                    : '-'}
                </Col>
              </Row>
            </div>
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
                    <Col className='text-right mr-4'>
                      <br />{' '}
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
                        disabled={!(rowData.length > 0)}
                      >
                        {t('Export_To_Excel_label')}
                      </button>
                    </Col>
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
                  columnDefs={columnDefs1}
                  rowData={rowData}
                  animateRows={true}
                  rowHeight={40}
                  headerHeight={50}
                  defaultColDef={defaultColDef}
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
                  pagination={true}
                  paginationPageSize={35}
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
                    <h2 className='mt-4'>{t('Bags_in_the_Carton_label')}</h2>
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
                  columnDefs={columnDefs}
                  rowData={rowData1}
                  animateRows={true}
                  rowHeight={40}
                  headerHeight={50}
                  defaultColDef={defaultColDef}
                  excelStyles={excelStyles}
                  context={props.context}
                  modules={AllModules}
                  pagination={true}
                  paginationPageSize={35}
                  onGridReady={onGridReady1}
                  editType='fullRow'
                  rowSelection={'multiple'}
                  suppressClickEdit={true}
                  frameworkComponents={{
                    customTooltip: ToolTip,
                    DirectToBagTracking: linkRenderer_bagTracking,
                    DirectToCartonTracking: linkRenderer_cartonTracking,
                    DirectToCageTracking: linkRenderer_cageTracking,
                    DirectToPurchaseEnquiry: linkRenderer_purchaseEnquiryByPax,
                  }}
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
    getCartonNumberData: state.getCartonNumber.getData,
    getCartonTrackingEnquiryData: state.getCartonTrackingEnquiry.getData,
    linkData: state.linksuccess,
  }
}

const actionCreators = {
  getCartonNumber: cartonTrackingEnquiryActions.getCartonNumber,
  getCartonTrackingEnquiry: cartonTrackingEnquiryActions.getCartonTrackingEnquiry,
  link: linkActions.linksuccess,
}

export default connect(mapState, actionCreators)(cartonTrackingEnquiry)
